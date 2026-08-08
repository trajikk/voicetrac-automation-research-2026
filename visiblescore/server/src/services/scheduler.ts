import { Clients, Reports } from "../db/index.js";
import { generateReportForClient } from "./generateReport.js";
import { sendReportEmail } from "./emailer.js";
import type { AutoReportFrequency, Client } from "../types.js";

const FREQUENCY_MS: Record<Exclude<AutoReportFrequency, "off">, number> = {
  weekly: 7 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
};

const CHECK_INTERVAL_MS = 60 * 60 * 1000; // check hourly; cheap since it's just a due-date comparison

function isDue(client: Client): boolean {
  if (client.auto_report_frequency === "off") return false;
  const latest = Reports.latestForClient(client.id);
  if (!latest) return true;
  const elapsed = Date.now() - new Date(latest.created_at).getTime();
  return elapsed >= FREQUENCY_MS[client.auto_report_frequency];
}

export interface SchedulerRunSummary {
  checked: number;
  due: number;
  generated: string[];
  failed: Array<{ clientId: string; error: string }>;
}

export async function runScheduledReports(): Promise<SchedulerRunSummary> {
  const clients = Clients.list();
  const dueClients = clients.filter(isDue);
  const summary: SchedulerRunSummary = { checked: clients.length, due: dueClients.length, generated: [], failed: [] };

  for (const client of dueClients) {
    try {
      const report = await generateReportForClient(client);
      if (report.pdf_path) {
        const result = await sendReportEmail({
          to: client.contact_email,
          clientName: client.name,
          overallScore: report.overall_score,
          pdfPath: report.pdf_path,
        });
        if (result.sent) Reports.markEmailed(report.id);
      }
      summary.generated.push(client.id);
    } catch (err: any) {
      console.error(`[scheduler] failed to auto-generate report for client ${client.id}:`, err);
      summary.failed.push({ clientId: client.id, error: err.message ?? String(err) });
    }
  }

  return summary;
}

export function startAutoReportScheduler() {
  // Run shortly after boot so newly-due clients don't wait a full interval, then on a
  // steady hourly cadence — cheap since most checks resolve to "not due yet."
  setTimeout(() => {
    runScheduledReports().catch((err) => console.error("[scheduler] initial run failed:", err));
  }, 30_000);

  setInterval(() => {
    runScheduledReports().catch((err) => console.error("[scheduler] scheduled run failed:", err));
  }, CHECK_INTERVAL_MS);

  console.log("[scheduler] auto-report scheduler started (hourly check)");
}
