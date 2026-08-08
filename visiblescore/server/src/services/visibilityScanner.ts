import { Keywords, ScanResults, Scans } from "../db/index.js";
import { checkChatGpt } from "../integrations/chatgpt.js";
import { checkPerplexity } from "../integrations/perplexity.js";
import { checkGoogleAiOverview } from "../integrations/googleAiOverview.js";
import type { Client, Scan } from "../types.js";
import type { PlatformCheckResult } from "../integrations/perplexity.js";

const CHECKERS = [checkChatGpt, checkPerplexity, checkGoogleAiOverview];

export type ScanResultWithKeyword = PlatformCheckResult & { keyword_id: string };

export interface ScanSummary {
  scan: Scan;
  results: ScanResultWithKeyword[];
  overallScore: number;
  byPlatform: Record<string, { mentionRate: number; mentioned: number; total: number }>;
  anyMocked: boolean;
}

export async function runVisibilityScan(client: Client): Promise<ScanSummary> {
  const keywords = Keywords.listByClient(client.id);
  if (keywords.length === 0) {
    throw new Error("Client has no keywords configured to scan.");
  }

  const scan = Scans.create(client.id);
  const allResults: ScanResultWithKeyword[] = [];

  for (const keyword of keywords) {
    const checks = await Promise.all(
      CHECKERS.map((checker) =>
        checker({ keyword: keyword.phrase, brandDomain: client.brand_domain, brandNames: client.brand_names })
      )
    );
    allResults.push(...checks.map((c) => ({ ...c, keyword_id: keyword.id })));

    ScanResults.bulkInsert(
      checks.map((c) => ({
        scan_id: scan.id,
        keyword_id: keyword.id,
        platform: c.platform,
        mentioned: c.mentioned,
        position: c.position,
        snippet: c.snippet,
        source_urls: c.source_urls,
        raw_excerpt: c.raw_excerpt,
      }))
    );
  }

  const byPlatform: ScanSummary["byPlatform"] = {};
  for (const r of allResults) {
    const bucket = (byPlatform[r.platform] ??= { mentionRate: 0, mentioned: 0, total: 0 });
    bucket.total += 1;
    if (r.mentioned) bucket.mentioned += 1;
  }
  for (const bucket of Object.values(byPlatform)) {
    bucket.mentionRate = bucket.total > 0 ? bucket.mentioned / bucket.total : 0;
  }

  const totalMentioned = allResults.filter((r) => r.mentioned).length;
  const overallScore = allResults.length > 0 ? Math.round((totalMentioned / allResults.length) * 100) : 0;

  return { scan, results: allResults, overallScore, byPlatform, anyMocked: allResults.some((r) => r.mocked) };
}
