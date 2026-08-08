export type Platform = "chatgpt" | "perplexity" | "google_ai_overview";

export const PLATFORMS: Platform[] = ["chatgpt", "perplexity", "google_ai_overview"];

export interface Client {
  id: string;
  name: string;
  contact_email: string;
  brand_domain: string;
  brand_names: string[];
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

export interface ScanResult {
  id: string;
  scan_id: string;
  keyword_id: string;
  platform: Platform;
  mentioned: boolean;
  position: number | null;
  snippet: string | null;
  source_urls: string[];
  raw_excerpt: string | null;
}

export interface Scan {
  id: string;
  client_id: string;
  created_at: string;
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
