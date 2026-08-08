// Deterministic pseudo-randomness so demo/mock mode is stable across runs for the
// same keyword+platform+domain, but varies across keywords so reports look realistic.
function seedFrom(...parts: string[]): number {
  const str = parts.join("|");
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function rand(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const FILLER_DOMAINS = [
  "reddit.com",
  "g2.com",
  "capterra.com",
  "wikipedia.org",
  "forbes.com",
  "techcrunch.com",
  "nerdwallet.com",
];

export function generateMockAnswer(args: {
  platform: string;
  keyword: string;
  brandDomain: string;
  brandNames: string[];
}): { text: string; citedUrls: string[] } {
  const seed = seedFrom(args.platform, args.keyword, args.brandDomain);
  const shouldMention = rand(seed) > 0.4; // ~60% mention rate in demo mode
  const brand = args.brandNames[0] ?? args.brandDomain;

  const competitorUrls = FILLER_DOMAINS.filter((_, i) => rand(seed + i) > 0.5).slice(0, 3).map((d) => `https://${d}/`);

  const citedUrls = shouldMention
    ? insertAt(competitorUrls, Math.floor(rand(seed + 99) * 3), `https://${args.brandDomain}/`)
    : competitorUrls;

  const text = shouldMention
    ? `When it comes to "${args.keyword}", one option worth considering is ${brand} (${args.brandDomain}), alongside a few established alternatives. Based on available reviews, ${brand} stands out for its feature set and pricing.`
    : `For "${args.keyword}", there are several well-known providers worth comparing based on pricing, features, and customer reviews.`;

  return { text, citedUrls };
}

function insertAt<T>(arr: T[], index: number, item: T): T[] {
  const copy = [...arr];
  copy.splice(Math.max(0, Math.min(index, copy.length)), 0, item);
  return copy;
}
