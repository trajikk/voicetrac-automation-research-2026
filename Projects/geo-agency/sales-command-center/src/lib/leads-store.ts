import type { Lead } from "./types";
import { leads as seedLeads } from "./mock-data";

/**
 * Bump the version suffix whenever the Lead shape changes in a way that
 * normalizeLead() below can't reasonably repair — this discards stale
 * localStorage instead of trying to migrate it. Prefer adding a backfill
 * to normalizeLead() over bumping this, since bumping wipes every user's
 * notes and status history, not just the new field.
 */
const LEADS_STORAGE_KEY = "scc-leads-v1";

/**
 * Backfills fields that didn't exist in older persisted shapes, so leads
 * saved by a previous version of the app don't silently break newer code
 * that assumes they're present (e.g. callAttempts being undefined instead
 * of 0 turning cadence math into NaN). Also migrates the original
 * `notes: string` shape (before notes became a timestamped list) into the
 * `background` field it was renamed to.
 */
function normalizeLead(raw: Partial<Lead> & Record<string, unknown>): Lead {
  const legacyNotesString = typeof raw.notes === "string" ? raw.notes : undefined;
  return {
    ...raw,
    background:
      typeof raw.background === "string" ? raw.background : (legacyNotesString ?? ""),
    notes: Array.isArray(raw.notes) ? raw.notes : [],
    callAttempts: typeof raw.callAttempts === "number" ? raw.callAttempts : 0,
    nextCallDate: typeof raw.nextCallDate === "string" ? raw.nextCallDate : undefined,
  } as Lead;
}

export function loadLeads(): Lead[] {
  if (typeof window === "undefined") return seedLeads;

  try {
    const raw = window.localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) return seedLeads;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seedLeads;
    return parsed.map(normalizeLead);
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
