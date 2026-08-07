export type Service = {
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  description: string;
  deliverables: string[];
};

export const services: Service[] = [
  {
    slug: "ai-search-geo",
    name: "AI Search / GEO Visibility",
    shortName: "AI Search & GEO",
    summary:
      "Get cited, quoted, and recommended by ChatGPT, Perplexity, Google AI Overviews, and the answer engines your buyers use first.",
    description:
      "Generative Engine Optimization (GEO) is how you show up inside AI-generated answers, not just on a results page. We structure your content, entities, and authority signals so language models can find, trust, and cite your business by name.",
    deliverables: [
      "AI visibility audit across ChatGPT, Perplexity, Copilot, and Google AI Overviews",
      "Entity and structured-data optimization so models understand who you are",
      "Answer-ready content architecture built around real buyer questions",
      "Citation and mention tracking to see where you're being surfaced",
      "Ongoing prompt-based monitoring as models and answers change",
    ],
  },
  {
    slug: "website-rebuilds",
    name: "Complete Website Rebuilds",
    shortName: "Website Rebuilds",
    summary:
      "A full rebuild, not a reskin: fast, crawlable, and engineered from the foundation up for both search engines and AI answer engines.",
    description:
      "Most sites are built for humans and, at best, for Google. We rebuild the site itself — architecture, markup, speed, and content — so it performs for every audience reading it: visitors, crawlers, and language models alike.",
    deliverables: [
      "Full information architecture and content audit",
      "Modern, fast front end built for Core Web Vitals",
      "Clean semantic HTML and structured data throughout",
      "Conversion-focused page design and copy",
      "Launch plan with redirects, so you keep the rankings you've already earned",
    ],
  },
  {
    slug: "traditional-seo",
    name: "Traditional SEO",
    shortName: "Traditional SEO",
    summary:
      "The fundamentals, done properly: technical health, on-page optimization, and authority building for Google and Bing rankings.",
    description:
      "GEO doesn't replace SEO — it's built on top of it. We handle the technical and on-page foundation that both traditional search engines and AI crawlers rely on to find, index, and rank your site.",
    deliverables: [
      "Technical SEO audit: crawlability, indexation, site speed, mobile health",
      "Keyword and topic research tied to real purchase intent",
      "On-page optimization across titles, headers, and internal linking",
      "Local and organic ranking tracking",
      "Authoritative link-building and digital PR",
    ],
  },
  {
    slug: "content-strategy",
    name: "Content & Strategy",
    shortName: "Content & Strategy",
    summary:
      "A content system built around the questions your buyers actually ask AI and search engines — and the topical authority to back it up.",
    description:
      "Visibility compounds when your content answers real questions better than anyone else's. We build a content strategy and production system around your buyers' journey, from first question to final decision.",
    deliverables: [
      "Content strategy mapped to buyer questions and search + AI demand",
      "Topical authority planning and content calendar",
      "SEO- and GEO-optimized writing, edited for accuracy and clarity",
      "Performance reporting tied to visibility, not just traffic",
      "Quarterly strategy reviews as the AI search landscape shifts",
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
