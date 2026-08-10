import { Router } from "express";
import { Clients, Reports } from "../db/index.js";
import { sendReportEmail } from "../services/emailer.js";
import { buildExportRows, rowsToCsv } from "../services/exportReport.js";
import { generateReportForClient } from "../services/generateReport.js";

export const reportsRouter = Router();

reportsRouter.post("/clients/:id/reports", async (req, res) => {
  const client = Clients.get(req.params.id);
  if (!client) return res.status(404).json({ error: "not found" });

  try {
    const report = await generateReportForClient(client);
    res.status(201).json(report);
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

reportsRouter.get("/reports/:id/export", (req, res) => {
  const report = Reports.get(req.params.id);
  if (!report) return res.status(404).json({ error: "not found" });

  const format = req.query.format === "csv" ? "csv" : "json";
  const rows = buildExportRows(report);

  if (format === "csv") {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="report-${report.id}.csv"`);
    return res.send(rowsToCsv(rows));
  }

  res.setHeader("Content-Disposition", `attachment; filename="report-${report.id}.json"`);
  res.json({ report, rows });
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
