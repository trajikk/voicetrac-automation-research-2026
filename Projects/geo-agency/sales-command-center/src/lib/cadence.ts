import type { Lead } from "./types";
import { addDaysISODate, todayISODate } from "./format";

export const MAX_CALL_ATTEMPTS = 4;

export type CallOutcome = "no-answer" | "voicemail" | "answered";

/**
 * Applies a call outcome to a lead: logs a note, and drives the cadence —
 * no answer / voicemail queue another attempt for tomorrow (or burn the
 * lead to Closed Lost once MAX_CALL_ATTEMPTS is hit), while an answered
 * call resets the streak. A fresh "New" lead advances to "Contacted" the
 * moment it's actually worked, regardless of outcome.
 */
export function applyCallOutcome(lead: Lead, outcome: CallOutcome): Lead {
  const now = new Date().toISOString();
  const today = todayISODate();
  const advancedStatus = lead.status === "New" ? "Contacted" : lead.status;

  if (outcome === "answered") {
    return {
      ...lead,
      callAttempts: 0,
      nextCallDate: undefined,
      lastContact: today,
      status: advancedStatus,
      notes: [
        { id: `nt-${Date.now()}`, body: "Answered the call.", createdAt: now },
        ...lead.notes,
      ],
    };
  }

  const attempts = lead.callAttempts + 1;
  const burned = attempts >= MAX_CALL_ATTEMPTS;
  const label = outcome === "voicemail" ? "Left a voicemail" : "No answer";

  return {
    ...lead,
    callAttempts: attempts,
    lastContact: today,
    status: burned ? "Closed Lost" : advancedStatus,
    nextCallDate: burned ? undefined : addDaysISODate(1),
    notes: [
      {
        id: `nt-${Date.now()}`,
        body: burned
          ? `${label} — touch ${attempts} of ${MAX_CALL_ATTEMPTS}. Marked Closed Lost after ${MAX_CALL_ATTEMPTS} unanswered attempts.`
          : `${label} — touch ${attempts} of ${MAX_CALL_ATTEMPTS}. Queued for another call tomorrow.`,
        createdAt: now,
      },
      ...lead.notes,
    ],
  };
}

/** Whether a lead belongs in today's call queue. */
export function isDueToday(lead: Lead): boolean {
  if (lead.status === "Closed Won" || lead.status === "Closed Lost") return false;
  if (lead.nextCallDate) return lead.nextCallDate <= todayISODate();
  return lead.status === "New" && lead.callAttempts === 0;
}

/** Short human label for why a lead is showing up in the call queue. */
export function callQueueReason(lead: Lead): string {
  if (lead.nextCallDate) {
    const nextTouch = lead.callAttempts + 1;
    if (lead.nextCallDate < todayISODate()) {
      return `Overdue — touch ${nextTouch} of ${MAX_CALL_ATTEMPTS}`;
    }
    return `Touch ${nextTouch} of ${MAX_CALL_ATTEMPTS} — due today`;
  }
  return "New lead — first call";
}
