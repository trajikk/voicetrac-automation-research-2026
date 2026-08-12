import type { Lead } from "./types";
import { leads as seedLeads } from "./mock-data";

/**
 * Bump the version suffix whenever the Lead shape changes in a way that
 * would make previously-stored data invalid — this discards stale
 * localStorage instead of trying to migrate it.
 */
const LEADS_STORAGE_KEY = "scc-leads-v1";

export function loadLeads(): Lead[] {
  if (typeof window === "undefined") return seedLeads;

  try {
    const raw = window.localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) return seedLeads;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seedLeads;
    return parsed as Lead[];
  } catch {
    return seedLeads;
  }
}

export function saveLeads(leads: Lead[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — fail silently,
    // the in-memory state still works for the rest of the session.
  }
}
