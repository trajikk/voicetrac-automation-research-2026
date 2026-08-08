import { Competitors, EntityMentions, Keywords, PlatformResponses, Scans } from "../db/index.js";
import { fetchChatGpt } from "../integrations/chatgpt.js";
import { fetchPerplexity } from "../integrations/perplexity.js";
import { fetchGoogleAiOverview } from "../integrations/googleAiOverview.js";
import { detectMention } from "../integrations/mentionDetect.js";
import { classifySentiment } from "./sentimentAnalyzer.js";
import type { MockEntity } from "../integrations/mockContent.js";
import type { PlatformQuery, RawPlatformResponse } from "../integrations/perplexity.js";
import type { Client, EntityType, Platform, Scan } from "../types.js";

const FETCHERS: Array<(q: PlatformQuery) => Promise<RawPlatformResponse>> = [fetchChatGpt, fetchPerplexity, fetchGoogleAiOverview];

export interface ScannedEntityResult {
  response_id: string;
  keyword_id: string;
  platform: Platform;
  entity_type: EntityType;
  entity_id: string;
  entity_label: string;
  mentioned: boolean;
  position: number | null;
  snippet: string | null;
  sentiment: "positive" | "neutral" | "negative" | null;
}

export interface ScanSummary {
  scan: Scan;
  entityResults: ScannedEntityResult[];
  overallScore: number; // client mention rate across all checks
  byPlatform: Record<string, { mentionRate: number; mentioned: number; total: number }>;
  leaderboard: Array<{ entity_type: EntityType; entity_id: string; label: string; mentioned: number; total: number; mentionRate: number }>;
  anyMocked: boolean;
}

export async function runVisibilityScan(client: Client): Promise<ScanSummary> {
  const keywords = Keywords.listByClient(client.id);
  if (keywords.length === 0) throw new Error("Client has no keywords configured to scan.");

  const competitors = Competitors.listByClient(client.id);
  const entities: MockEntity[] = [
    { type: "client", id: client.id, label: client.name, domain: client.brand_domain },
    ...competitors.map((c) => ({ type: "competitor" as const, id: c.id, label: c.name, domain: c.domain })),
  ];

  const scan = Scans.create(client.id);
  const entityResults: ScannedEntityResult[] = [];
  let anyMocked = false;

  for (const keyword of keywords) {
    const raws = await Promise.all(FETCHERS.map((fetcher) => fetcher({ keyword: keyword.phrase, entities })));

    for (const raw of raws) {
      anyMocked = anyMocked || raw.mocked;
      const response = PlatformResponses.create({
        scan_id: scan.id,
        keyword_id: keyword.id,
        platform: raw.platform,
        raw_text: raw.text,
        source_urls: raw.citedUrls,
        mocked: raw.mocked,
      });

      const mentionRows = entities.map((entity) => {
        const brandNames = entity.type === "client" ? client.brand_names : [entity.label];
        const check = detectMention({ text: raw.text, citedUrls: raw.citedUrls, brandDomain: entity.domain, brandNames });
        return { entity, check };
      });

      const sentiments = await Promise.all(
        mentionRows.map(async ({ check }) => (check.mentioned && check.snippet ? classifySentiment(check.snippet) : null))
      );

      EntityMentions.bulkInsert(
        mentionRows.map(({ entity, check }, i) => ({
          response_id: response.id,
          entity_type: entity.type,
          entity_id: entity.id,
          entity_label: entity.label,
          mentioned: check.mentioned,
          position: check.position,
          snippet: check.snippet,
          sentiment: sentiments[i]?.sentiment ?? null,
          sentiment_rationale: sentiments[i]?.rationale ?? null,
        }))
      );

      mentionRows.forEach(({ entity, check }, i) => {
        entityResults.push({
          response_id: response.id,
          keyword_id: keyword.id,
          platform: raw.platform,
          entity_type: entity.type,
          entity_id: entity.id,
          entity_label: entity.label,
          mentioned: check.mentioned,
          position: check.position,
          snippet: check.snippet,
          sentiment: sentiments[i]?.sentiment ?? null,
        });
      });
    }
  }

  const clientResults = entityResults.filter((r) => r.entity_type === "client");
  const byPlatform: ScanSummary["byPlatform"] = {};
  for (const r of clientResults) {
    const bucket = (byPlatform[r.platform] ??= { mentionRate: 0, mentioned: 0, total: 0 });
    bucket.total += 1;
    if (r.mentioned) bucket.mentioned += 1;
  }
  for (const bucket of Object.values(byPlatform)) bucket.mentionRate = bucket.total > 0 ? bucket.mentioned / bucket.total : 0;

  const clientMentioned = clientResults.filter((r) => r.mentioned).length;
  const overallScore = clientResults.length > 0 ? Math.round((clientMentioned / clientResults.length) * 100) : 0;

  const leaderboardMap = new Map<string, { entity_type: EntityType; entity_id: string; label: string; mentioned: number; total: number }>();
  for (const entity of entities) {
    leaderboardMap.set(entity.id, { entity_type: entity.type, entity_id: entity.id, label: entity.label, mentioned: 0, total: 0 });
  }
  for (const r of entityResults) {
    const bucket = leaderboardMap.get(r.entity_id)!;
    bucket.total += 1;
    if (r.mentioned) bucket.mentioned += 1;
  }
  const leaderboard = [...leaderboardMap.values()]
    .map((b) => ({ ...b, mentionRate: b.total > 0 ? b.mentioned / b.total : 0 }))
    .sort((a, b) => b.mentionRate - a.mentionRate);

  return { scan, entityResults, overallScore, byPlatform, leaderboard, anyMocked };
}
