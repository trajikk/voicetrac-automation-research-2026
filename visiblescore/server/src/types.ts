export type Platform = "chatgpt" | "perplexity" | "google_ai_overview";

export const PLATFORMS: Platform[] = ["chatgpt", "perplexity", "google_ai_overview"];

export type Sentiment = "positive" | "neutral" | "negative";

export type EntityType = "client" | "competitor";

export interface Client {
  id: string;
  name: string;
  contact_email: string;
  brand_domain: string;
  brand_names: string[];
  created_at: string;
}

export interface Competitor {
  id: string;
  client_id: string;
  name: string;
  domain: string;
  created_at: string;
}

export interface Ga4Source {
  id: string;
  client_id: string;
  property_id: string;
  service_account_json: string | null;
  created_at: string;
}

export interface Keyword {
  id: string;
  client_id: string;
  phrase: string;
  created_at: string;
}

export interface Scan {
  id: string;
  client_id: string;
  created_at: string;
}

// One raw AI answer per (scan, keyword, platform) — fetched once and then checked
// for every tracked entity (the client + each competitor), rather than re-querying
// the platform once per entity.
export interface PlatformResponse {
  id: string;
  scan_id: string;
  keyword_id: string;
  platform: Platform;
  raw_text: string;
  source_urls: string[];
  mocked: boolean;
  created_at: string;
}

export interface EntityMention {
  id: string;
  response_id: string;
  entity_type: EntityType;
  entity_id: string;
  entity_label: string;
  mentioned: boolean;
  position: number | null;
  snippet: string | null;
  sentiment: Sentiment | null;
  sentiment_rationale: string | null;
}

export interface Report {
  id: string;
  client_id: string;
  scan_id: string;
  ga4_summary_json: string | null;
  overall_score: number;
  pdf_path: string | null;
  emailed_at: string | null;
  created_at: string;
}

export interface Ga4Summary {
  propertyId: string;
  rangeStart: string;
  rangeEnd: string;
  totalSessions: number;
  totalUsers: number;
  conversions: number;
  aiReferralSessions: number;
  aiReferralBySource: Record<string, number>;
  sessionsBySourceDaily: Array<{ date: string; sessions: number; aiSessions: number }>;
  mocked: boolean;
}
