const STOPWORDS = new Set(
  `the a an and or of to in for on with your our we you is are be as at by from this that it its us home about contact page welcome learn more get started sign up log call today services service company business new site website all their they them can will not have has how what why who where when`
    .split(/\s+/)
);

async function fetchHomepageText(domain: string): Promise<{ title: string; text: string } | null> {
  try {
    const res = await fetch(`https://${domain}`, { redirect: "follow" });
    if (!res.ok) return null;
    const html = await res.text();
    const title = /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1]?.trim() ?? "";
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 6000);
    return { title, text };
  } catch {
    return null;
  }
}

export interface QuerySuggestionResult {
  suggestions: string[];
  mocked: boolean;
}

export async function generateQuerySuggestions(args: { businessName: string; domain: string }): Promise<QuerySuggestionResult> {
  const page = await fetchHomepageText(args.domain);
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && page) {
    try {
      const suggestions = await suggestWithOpenAi(args.businessName, page, apiKey);
      if (suggestions.length > 0) return { suggestions, mocked: false };
    } catch {
      // fall through to heuristic
    }
  }

  return { suggestions: heuristicSuggestions(args.businessName, page), mocked: true };
}

async function suggestWithOpenAi(businessName: string, page: { title: string; text: string }, apiKey: string): Promise<string[]> {
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
            'Given a business homepage, propose 8 realistic natural-language search queries a potential customer might type into ChatGPT, Perplexity, or Google when looking for this kind of business (not the business name itself, unless a comparison/review query). Mix category discovery ("best ... near me"), comparison, pricing, and review-style queries. Respond with JSON: {"queries": ["...", ...]}.',
        },
        { role: "user", content: `Business name: ${businessName}\nPage title: ${page.title}\nHomepage text: ${page.text.slice(0, 3000)}` },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI query-suggestion error ${res.status}`);
  const data = (await res.json()) as any;
  const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}");
  return Array.isArray(parsed.queries) ? parsed.queries.filter((q: unknown) => typeof q === "string").slice(0, 10) : [];
}

function heuristicSuggestions(businessName: string, page: { title: string; text: string } | null): string[] {
  const topic = guessTopic(businessName, page);
  return [
    `best ${topic} near me`,
    `top rated ${topic} companies`,
    `${businessName} reviews`,
    `how much does ${topic} cost`,
    `${businessName} vs competitors`,
    `is ${businessName} any good`,
    `affordable ${topic} services`,
    `${topic} recommendations`,
  ];
}

function guessTopic(businessName: string, page: { title: string; text: string } | null): string {
  const source = `${page?.title ?? ""} ${page?.text ?? ""}`.toLowerCase();
  const nameWords = new Set(businessName.toLowerCase().split(/\s+/));
  const freq = new Map<string, number>();

  for (const raw of source.split(/[^a-z]+/)) {
    const w = raw.trim();
    if (w.length < 4 || STOPWORDS.has(w) || nameWords.has(w)) continue;
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }

  const ranked = [...freq.entries()].sort((a, b) => b[1] - a[1]);
  if (ranked.length === 0) return "service provider";
  return ranked.slice(0, 2).map(([w]) => w).join(" ");
}
