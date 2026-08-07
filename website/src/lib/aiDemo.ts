export type Trade =
  | "Fencing Contractor"
  | "Concrete Contractor"
  | "General Contractor"
  | "Roofing Contractor";

export const trades: Trade[] = [
  "Fencing Contractor",
  "Concrete Contractor",
  "General Contractor",
  "Roofing Contractor",
];

const exampleNames: Record<Trade, [string, string]> = {
  "Fencing Contractor": ["Summit Fence & Rail", "Bedrock Fencing Co."],
  "Concrete Contractor": ["Ironline Concrete", "Bedrock Concrete & Design"],
  "General Contractor": ["Northbend Builders", "Craftline General Contracting"],
  "Roofing Contractor": ["Highline Roofing Co.", "Anchor Point Roofing"],
};

const queryVerbs: Record<Trade, string> = {
  "Fencing Contractor": "install a privacy fence",
  "Concrete Contractor": "pour a new driveway",
  "General Contractor": "handle a full kitchen remodel",
  "Roofing Contractor": "replace an aging roof",
};

export function buildQuery(trade: Trade, city: string) {
  return `Who's a reliable ${trade.toLowerCase()} in ${city} to ${queryVerbs[trade]}?`;
}

export function buildAnswerLines(trade: Trade, city: string, businessName: string) {
  const [nameA, nameB] = exampleNames[trade];
  return [
    `Based on reviews, site content, and recent mentions, a few ${trade.toLowerCase().replace("contractor", "contractors")} come up for ${city}:`,
    `1. ${nameA} — established local reviews, clear service pages for your area.`,
    `2. ${nameB} — frequently cited for pricing transparency and turnaround time.`,
    `3. ${businessName ? businessName : "— no third name surfaced."}`,
  ];
}
