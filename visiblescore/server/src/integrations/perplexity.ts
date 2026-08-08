import { detectMention } from "./mentionDetect.js";
import { generateMockAnswer } from "./mockContent.js";
import type { Platform } from "../types.js";

export interface PlatformCheckInput {
  keyword: string;
  brandDomain: string;
  brandNames: string[];
}

export interface PlatformCheckResult {
  platform: Platform;
  mentioned: boolean;
  position: number | null;
  snippet: string | null;
  source_urls: string[];
  raw_excerpt: string | null;
  mocked: boolean;
}

// Perplexity's API runs a live web search and returns citations, so this is a direct,
// accurate check (not an approximation) once PERPLEXITY_API_KEY is set.
// Docs: https://docs.perplexity.ai/
export async function checkPerplexity(input: PlatformCheckInput): Promise<PlatformCheckResult> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    const mock = generateMockAnswer({ platform: "perplexity", ...input });
    const m = detectMention({ text: mock.text, citedUrls: mock.citedUrls, brandDomain: input.brandDomain, brandNames: input.brandNames });
    return { platform: "perplexity", ...m, source_urls: mock.citedUrls, raw_excerpt: mock.text, mocked: true };
  }

  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "sonar",
      messages: [{ role: "user", content: input.keyword }],
    }),
  });
  if (!res.ok) {
    throw new Error(`Perplexity API error ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as any;
  const text: string = data.choices?.[0]?.message?.content ?? "";
  const citedUrls: string[] = data.citations ?? [];
  const m = detectMention({ text, citedUrls, brandDomain: input.brandDomain, brandNames: input.brandNames });
  return { platform: "perplexity", ...m, source_urls: citedUrls, raw_excerpt: text.slice(0, 500), mocked: false };
}
