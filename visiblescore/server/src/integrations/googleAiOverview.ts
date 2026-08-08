import { detectMention } from "./mentionDetect.js";
import { generateMockAnswer } from "./mockContent.js";
import type { Platform } from "../types.js";
import type { PlatformCheckInput, PlatformCheckResult } from "./perplexity.js";

// Google has no official API for AI Overviews. This uses SerpAPI (a third-party,
// ToS-compliant SERP scraping service) which exposes an `ai_overview` field when
// Google renders one for a query. Requires SERPAPI_KEY.
// Docs: https://serpapi.com/google-ai-overview-api
export async function checkGoogleAiOverview(input: PlatformCheckInput): Promise<PlatformCheckResult> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    const mock = generateMockAnswer({ platform: "google_ai_overview", ...input });
    const m = detectMention({ text: mock.text, citedUrls: mock.citedUrls, brandDomain: input.brandDomain, brandNames: input.brandNames });
    return { platform: "google_ai_overview", ...m, source_urls: mock.citedUrls, raw_excerpt: mock.text, mocked: true };
  }

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google");
  url.searchParams.set("q", input.keyword);
  url.searchParams.set("api_key", apiKey);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`SerpAPI error ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as any;

  let overview = data.ai_overview;
  // SerpAPI sometimes returns a page_token that requires a follow-up request to
  // fetch the fully rendered overview.
  if (overview?.page_token && !overview.text_blocks) {
    const followUp = new URL("https://serpapi.com/search.json");
    followUp.searchParams.set("engine", "google_ai_overview");
    followUp.searchParams.set("page_token", overview.page_token);
    followUp.searchParams.set("api_key", apiKey);
    const followUpRes = await fetch(followUp);
    if (followUpRes.ok) overview = await followUpRes.json();
  }

  if (!overview) {
    return { platform: "google_ai_overview", mentioned: false, position: null, snippet: null, source_urls: [], raw_excerpt: null, mocked: false };
  }

  const text: string = flattenTextBlocks(overview.text_blocks);
  const citedUrls: string[] = (overview.references ?? []).map((r: any) => r.link).filter(Boolean);
  const m = detectMention({ text, citedUrls, brandDomain: input.brandDomain, brandNames: input.brandNames });
  return { platform: "google_ai_overview" as Platform, ...m, source_urls: citedUrls, raw_excerpt: text.slice(0, 500), mocked: false };
}

function flattenTextBlocks(blocks: any[] | undefined): string {
  if (!blocks) return "";
  return blocks
    .map((b) => b.snippet ?? (b.list ? b.list.map((l: any) => l.snippet).join(" ") : ""))
    .filter(Boolean)
    .join(" ");
}
