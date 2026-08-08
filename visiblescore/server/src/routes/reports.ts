import { Router } from "express";
import { Clients, Ga4Sources, Keywords, Reports } from "../db/index.js";
import { runVisibilityScan } from "../services/visibilityScanner.js";
import { fetchGa4Summary } from "../integrations/ga4.js";
import { renderReportHtml, renderReportPdf } from "../services/reportGenerator.js";
import { sendReportEmail } from "../services/emailer.js";

export const reportsRouter = Router();

reportsRouter.post("/clients/:id/reports", async (req, res) => {
  const client = Clients.get(req.params.id);
  if (!client) return res.status(404).json({ error: "not found" });

  try {
    const keywords = Keywords.listByClient(client.id);
    const ga4Source = Ga4Sources.getByClient(client.id);

    const [scanSummary, ga4] = await Promise.all([
      runVisibilityScan(client),
      fetchGa4Summary({
        propertyId: ga4Source?.property_id ?? "",
        serviceAccountJson: ga4Source?.service_account_json ?? null,
      }),
    ]);

    const previous = Reports.previousBefore(client.id, new Date().toISOString());

    const draftId = crypto.randomUUID().slice(0, 10);
    const html = await renderReportHtml({
      client,
      keywords,
      scanSummary,
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

    res.status(201).json({ ...report, html });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message ?? "failed to generate report" });
  }
});

reportsRouter.get("/reports/:id", (req, res) => {
  const report = Reports.get(req.params.id);
  if (!report) return res.status(404).json({ error: "not found" });
  res.json(report);
});

reportsRouter.get("/reports/:id/pdf", (req, res) => {
  const report = Reports.get(req.params.id);
  if (!report || !report.pdf_path) return res.status(404).json({ error: "not found" });
  res.sendFile(report.pdf_path);
});

reportsRouter.post("/reports/:id/email", async (req, res) => {
  const report = Reports.get(req.params.id);
  if (!report || !report.pdf_path) return res.status(404).json({ error: "not found" });
  const client = Clients.get(report.client_id);
  if (!client) return res.status(404).json({ error: "client not found" });

  const result = await sendReportEmail({
    to: client.contact_email,
    clientName: client.name,
    overallScore: report.overall_score,
    pdfPath: report.pdf_path,
  });

  if (result.sent) Reports.markEmailed(report.id);
  res.json(result);
});
