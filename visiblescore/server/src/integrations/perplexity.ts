import { generateMockAnswer, type MockEntity } from "./mockContent.js";
import type { Platform } from "../types.js";

export interface PlatformQuery {
  keyword: string;
  entities: MockEntity[]; // used only for mock-mode content generation
}

export interface RawPlatformResponse {
  platform: Platform;
  text: string;
  citedUrls: string[];
  mocked: boolean;
}

// Perplexity's API runs a live web search and returns citations, so checking this
// response for brand/competitor mentions is a direct, accurate read — not an
// approximation — once PERPLEXITY_API_KEY is set. Docs: https://docs.perplexity.ai/
export async function fetchPerplexity(input: PlatformQuery): Promise<RawPlatformResponse> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    const mock = generateMockAnswer({ platform: "perplexity", keyword: input.keyword, entities: input.entities });
    return { platform: "perplexity", text: mock.text, citedUrls: mock.citedUrls, mocked: true };
  }

  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "sonar", messages: [{ role: "user", content: input.keyword }] }),
  });
  if (!res.ok) throw new Error(`Perplexity API error ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as any;
  const text: string = data.choices?.[0]?.message?.content ?? "";
  const citedUrls: string[] = data.citations ?? [];
  return { platform: "perplexity", text, citedUrls, mocked: false };
}
