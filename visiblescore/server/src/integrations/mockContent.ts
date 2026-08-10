// Deterministic pseudo-randomness so demo/mock mode is stable across runs for the
// same keyword+platform, but varies across keywords so reports look realistic.
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

const FILLER_DOMAINS = ["reddit.com", "g2.com", "capterra.com", "wikipedia.org", "forbes.com"];

const POSITIVE_FRAMES = [
  (label: string, kw: string) =>
    `For "${kw}", ${label} is frequently recommended for its strong reputation, competitive pricing, and consistently positive customer reviews.`,
  (label: string, kw: string) =>
    `${label} stands out as a top choice for "${kw}", with reviewers praising its responsiveness and quality of work.`,
];
const NEUTRAL_FRAMES = [
  (label: string, kw: string) => `${label} is one of several options worth comparing for "${kw}", alongside a few established alternatives.`,
];
const NEGATIVE_FRAMES = [
  (label: string, kw: string) => `Some reviewers have raised concerns about ${label} regarding "${kw}", citing inconsistent response times.`,
];

export interface MockEntity {
  type: "client" | "competitor";
  id: string;
  label: string;
  domain: string;
}

export interface MockAnswer {
  text: string;
  citedUrls: string[];
}

export function generateMockAnswer(args: { platform: string; keyword: string; entities: MockEntity[] }): MockAnswer {
  const seed = seedFrom(args.platform, args.keyword);
  const sentences: string[] = [];
  const citedUrls: string[] = [];

  const intro = `When researching "${args.keyword}", here's what stands out:`;
  sentences.push(intro);

  args.entities.forEach((entity, i) => {
    const entitySeed = seedFrom(args.platform, args.keyword, entity.id);
    const appears = rand(entitySeed) > 0.35 - i * 0.03; // client (i=0) slightly favored in mock data
    if (!appears) return;

    const toneRoll = rand(entitySeed + 7);
    const frames = toneRoll > 0.75 ? NEGATIVE_FRAMES : toneRoll > 0.55 ? NEUTRAL_FRAMES : POSITIVE_FRAMES;
    const frame = frames[Math.floor(rand(entitySeed + 13) * frames.length) % frames.length];
    sentences.push(frame(entity.label, args.keyword));

    if (rand(entitySeed + 21) > 0.3) citedUrls.push(`https://${entity.domain}/`);
  });

  for (let i = 0; i < FILLER_DOMAINS.length; i++) {
    if (rand(seed + i * 3) > 0.6) citedUrls.push(`https://${FILLER_DOMAINS[i]}/`);
  }

  return { text: sentences.join(" "), citedUrls: shuffle(citedUrls, seed) };
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand(seed + i * 17) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
