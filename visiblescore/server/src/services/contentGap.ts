import type { Keyword } from "../types.js";
import type { ScannedEntityResult } from "./visibilityScanner.js";

export interface ContentGap {
  keyword_id: string;
  phrase: string;
  winningCompetitors: string[];
  platforms: string[];
  recommendation: string;
}

// A "gap" is a tracked term where the client never gets mentioned but at least one
// competitor does, across any platform in the scan — i.e. a query where competitors
// are capturing AI-search visibility the client currently isn't.
export async function detectContentGaps(keywords: Keyword[], entityResults: ScannedEntityResult[]): Promise<ContentGap[]> {
  const gaps: ContentGap[] = [];

  for (const keyword of keywords) {
    const rowsForKeyword = entityResults.filter((r) => r.keyword_id === keyword.id);
    const clientMentioned = rowsForKeyword.some((r) => r.entity_type === "client" && r.mentioned);
    if (clientMentioned) continue;

    const winning = rowsForKeyword.filter((r) => r.entity_type === "competitor" && r.mentioned);
    if (winning.length === 0) continue;

    const winningCompetitors = [...new Set(winning.map((r) => r.entity_label))];
    const platforms = [...new Set(winning.map((r) => r.platform))];

    gaps.push({
      keyword_id: keyword.id,
      phrase: keyword.phrase,
      winningCompetitors,
      platforms,
      recommendation: await buildRecommendation(keyword.phrase, winningCompetitors, platforms),
    });
  }

  return gaps;
}

async function buildRecommendation(phrase: string, competitors: string[], platforms: string[]): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const platformLabel = platforms.map(formatPlatform).join(", ");
  if (!apiKey) {
    return `Create or strengthen content that directly answers "${phrase}" — ${competitors.join(", ")} ${
      competitors.length > 1 ? "are" : "is"
    } currently capturing this query on ${platformLabel}.`;
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "In one short sentence, give a concrete content recommendation for a business to start winning AI-search visibility for a query where competitors currently get cited and they don't. Be specific and actionable, not generic.",
          },
          {
            role: "user",
            content: `Query: "${phrase}"\nCompetitors currently cited: ${competitors.join(", ")}\nPlatforms: ${platformLabel}`,
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as any;
    const text = data.choices?.[0]?.message?.content?.trim();
    if (text) return text;
  } catch {
    // fall through to template below
  }

  return `Create or strengthen content that directly answers "${phrase}" — ${competitors.join(", ")} ${
    competitors.length > 1 ? "are" : "is"
  } currently capturing this query on ${platformLabel}.`;
}

function formatPlatform(p: string): string {
  return p === "google_ai_overview" ? "Google AI Overview" : p === "chatgpt" ? "ChatGPT" : "Perplexity";
}
