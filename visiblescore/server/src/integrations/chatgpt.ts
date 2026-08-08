import { generateMockAnswer } from "./mockContent.js";
import type { Platform } from "../types.js";
import type { PlatformQuery, RawPlatformResponse } from "./perplexity.js";

// IMPORTANT CAVEAT: OpenAI has no API that reproduces the exact consumer ChatGPT app
// (which blends browsing, memory, and a proprietary retrieval stack). This uses the
// web-search-enabled model via the Chat Completions API as the closest available
// approximation of "would ChatGPT's browsing surface this brand." Treat results as
// directional, not a literal transcript of what a ChatGPT user would see.
// Docs: https://platform.openai.com/docs/guides/tools-web-search
export async function fetchChatGpt(input: PlatformQuery): Promise<RawPlatformResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const mock = generateMockAnswer({ platform: "chatgpt", keyword: input.keyword, entities: input.entities });
    return { platform: "chatgpt", text: mock.text, citedUrls: mock.citedUrls, mocked: true };
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-search-preview",
      web_search_options: {},
      messages: [{ role: "user", content: input.keyword }],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI API error ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as any;
  const message = data.choices?.[0]?.message;
  const text: string = message?.content ?? "";
  const citedUrls: string[] = (message?.annotations ?? [])
    .filter((a: any) => a.type === "url_citation")
    .map((a: any) => a.url_citation?.url)
    .filter(Boolean);
  return { platform: "chatgpt" as Platform, text, citedUrls, mocked: false };
}
