export interface MentionCheck {
  mentioned: boolean;
  position: number | null;
  snippet: string | null;
}

/**
 * Looks for the brand domain or any brand name inside response text and a list of
 * cited/source URLs. `position` is the 1-based rank among citedUrls when the domain
 * appears there (closer to how AI Overviews / Perplexity citations are ranked),
 * otherwise null if the mention is text-only.
 */
export function detectMention(args: {
  text: string;
  citedUrls: string[];
  brandDomain: string;
  brandNames: string[];
}): MentionCheck {
  const { text, citedUrls, brandDomain, brandNames } = args;
  const domainHost = brandDomain.replace(/^https?:\/\//, "").replace(/^www\./, "").toLowerCase();

  const urlIndex = citedUrls.findIndex((u) => u.toLowerCase().includes(domainHost));
  if (urlIndex !== -1) {
    return { mentioned: true, position: urlIndex + 1, snippet: extractSnippet(text, domainHost) ?? citedUrls[urlIndex] };
  }

  const lowerText = text.toLowerCase();
  const needle = [domainHost, ...brandNames.map((n) => n.toLowerCase())].find((n) => n && lowerText.includes(n));
  if (needle) {
    return { mentioned: true, position: null, snippet: extractSnippet(text, needle) };
  }

  return { mentioned: false, position: null, snippet: null };
}

function extractSnippet(text: string, needle: string): string | null {
  const idx = text.toLowerCase().indexOf(needle.toLowerCase());
  if (idx === -1) return null;
  const start = Math.max(0, idx - 80);
  const end = Math.min(text.length, idx + needle.length + 80);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}
