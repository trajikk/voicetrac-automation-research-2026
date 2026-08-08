export interface Client {
  id: string;
  name: string;
  contact_email: string;
  brand_domain: string;
  brand_names: string[];
  created_at: string;
}

export interface Keyword {
  id: string;
  client_id: string;
  phrase: string;
  created_at: string;
}

export interface Competitor {
  id: string;
  client_id: string;
  name: string;
  domain: string;
  created_at: string;
}

export interface Report {
  id: string;
  client_id: string;
  scan_id: string;
  overall_score: number;
  pdf_path: string | null;
  emailed_at: string | null;
  created_at: string;
  html?: string;
}

export interface ClientDetail extends Client {
  keywords: Keyword[];
  competitors: Competitor[];
  ga4Source: { property_id: string; hasCredentials: boolean } | null;
  reports: Report[];
}

export interface SuggestionResult {
  suggestions: string[];
  mocked: boolean;
}

const BASE = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  listClients: () => request<Client[]>("/clients"),
  createClient: (input: { name: string; contact_email: string; brand_domain: string; brand_names: string[] }) =>
    request<Client>("/clients", { method: "POST", body: JSON.stringify(input) }),
  getClient: (id: string) => request<ClientDetail>(`/clients/${id}`),

  addKeyword: (clientId: string, phrase: string) =>
    request<Keyword>(`/clients/${clientId}/keywords`, { method: "POST", body: JSON.stringify({ phrase }) }),
  removeKeyword: (keywordId: string) => request<void>(`/clients/keywords/${keywordId}`, { method: "DELETE" }),
  suggestKeywords: (clientId: string) => request<SuggestionResult>(`/clients/${clientId}/suggest-keywords`, { method: "POST" }),

  addCompetitor: (clientId: string, input: { name: string; domain: string }) =>
    request<Competitor>(`/clients/${clientId}/competitors`, { method: "POST", body: JSON.stringify(input) }),
  removeCompetitor: (competitorId: string) => request<void>(`/clients/competitors/${competitorId}`, { method: "DELETE" }),

  setGa4Source: (clientId: string, input: { property_id: string; service_account_json?: string }) =>
    request(`/clients/${clientId}/ga4-source`, { method: "PUT", body: JSON.stringify(input) }),

  generateReport: (clientId: string) => request<Report>(`/clients/${clientId}/reports`, { method: "POST" }),
  emailReport: (reportId: string) =>
    request<{ sent: boolean; reason?: string }>(`/reports/${reportId}/email`, { method: "POST" }),
  reportPdfUrl: (reportId: string) => `${BASE}/reports/${reportId}/pdf`,
  reportExportUrl: (reportId: string, format: "json" | "csv") => `${BASE}/reports/${reportId}/export?format=${format}`,
};
