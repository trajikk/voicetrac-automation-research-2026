import type { Sentiment } from "../types.js";

const POSITIVE_WORDS = [
  "best",
  "top",
  "excellent",
  "recommended",
  "trusted",
  "leading",
  "great",
  "reliable",
  "quality",
  "praised",
  "outstanding",
  "positive",
  "responsive",
];
const NEGATIVE_WORDS = [
  "complaint",
  "poor",
  "worst",
  "avoid",
  "issue",
  "issues",
  "lawsuit",
  "inconsistent",
  "negative",
  "unreliable",
  "delay",
  "delays",
  "concern",
  "concerns",
];

export interface SentimentResult {
  sentiment: Sentiment;
  rationale: string;
}

// Classifies the tone of a mention's surrounding context. Uses an OpenAI classification
// call when OPENAI_API_KEY is set (also reused for the ChatGPT visibility check), falls
// back to a lexicon heuristic otherwise so sentiment always populates in demo mode.
export async function classifySentiment(snippet: string): Promise<SentimentResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      return await classifyWithOpenAi(snippet, apiKey);
    } catch {
      // fall through to heuristic on API failure so a report never blocks on this
    }
  }
  return classifyWithLexicon(snippet);
}

async function classifyWithOpenAi(snippet: string, apiKey: string): Promise<SentimentResult> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'Classify the sentiment toward the mentioned brand in this snippet as exactly one of "positive", "neutral", or "negative". Respond with JSON: {"sentiment": "...", "rationale": "one short clause"}.',
        },
        { role: "user", content: snippet },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI sentiment error ${res.status}`);
  const data = (await res.json()) as any;
  const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}");
  const sentiment: Sentiment = ["positive", "neutral", "negative"].includes(parsed.sentiment) ? parsed.sentiment : "neutral";
  return { sentiment, rationale: parsed.rationale ?? "" };
}

function classifyWithLexicon(snippet: string): SentimentResult {
  const lower = snippet.toLowerCase();
  const posHits = POSITIVE_WORDS.filter((w) => lower.includes(w));
  const negHits = NEGATIVE_WORDS.filter((w) => lower.includes(w));
  if (negHits.length > posHits.length) return { sentiment: "negative", rationale: `mentions: ${negHits.join(", ")}` };
  if (posHits.length > 0) return { sentiment: "positive", rationale: `mentions: ${posHits.join(", ")}` };
  return { sentiment: "neutral", rationale: "no strong positive or negative language detected" };
}
