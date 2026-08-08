import { Competitors, Ga4Sources, Keywords, Reports } from "../db/index.js";
import { runVisibilityScan } from "./visibilityScanner.js";
import { fetchGa4Summary } from "../integrations/ga4.js";
import { renderReportHtml, renderReportPdf } from "./reportGenerator.js";
import { detectContentGaps } from "./contentGap.js";
import type { Client, Report } from "../types.js";

export async function generateReportForClient(client: Client): Promise<Report & { html: string }> {
  const keywords = Keywords.listByClient(client.id);
  const competitors = Competitors.listByClient(client.id);
  const ga4Source = Ga4Sources.getByClient(client.id);

  const [scanSummary, ga4] = await Promise.all([
    runVisibilityScan(client),
    fetchGa4Summary({
      propertyId: ga4Source?.property_id ?? "",
      serviceAccountJson: ga4Source?.service_account_json ?? null,
    }),
  ]);

  const gaps = await detectContentGaps(keywords, scanSummary.entityResults);
  const previous = Reports.previousBefore(client.id, new Date().toISOString());

  const draftId = crypto.randomUUID().slice(0, 10);
  const html = await renderReportHtml({
    client,
    competitors,
    keywords,
    scanSummary,
    gaps,
    ga4,
    previousScore: previous?.overall_score ?? null,
    reportId: draftId,
  });
  const pdfPath = await renderReportPdf(draftId, html);

  const report = Reports.create({
    client_id: client.id,
    scan_id: scanSummary.scan.id,
    ga4_summary_json: JSON.stringify(ga4),
    overall_score: scanSummary.overallScore,
    pdf_path: pdfPath,
  });

  return { ...report, html };
}
