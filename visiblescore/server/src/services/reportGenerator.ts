import Handlebars from "handlebars";
import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildDualLineSvg } from "./sparkline.js";
import type { Client, Ga4Summary, Platform } from "../types.js";
import type { ScanSummary } from "./visibilityScanner.js";
import type { Keyword } from "../types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.join(__dirname, "..", "templates", "report.hbs");
const template = Handlebars.compile(fs.readFileSync(templatePath, "utf-8"));

const reportsDir = path.join(__dirname, "..", "..", "data", "reports");
fs.mkdirSync(reportsDir, { recursive: true });

const PLATFORM_LABELS: Record<Platform, string> = {
  chatgpt: "ChatGPT",
  perplexity: "Perplexity",
  google_ai_overview: "Google AI Overview",
};

export interface ReportInputs {
  client: Client;
  keywords: Keyword[];
  scanSummary: ScanSummary;
  ga4: Ga4Summary;
  previousScore: number | null;
  reportId: string;
}

export async function renderReportHtml(inputs: ReportInputs): Promise<string> {
  const { client, keywords, scanSummary, ga4, previousScore } = inputs;

  const byPlatform = (Object.keys(PLATFORM_LABELS) as Platform[]).map((platform) => {
    const bucket = scanSummary.byPlatform[platform] ?? { mentioned: 0, total: 0, mentionRate: 0 };
    return {
      label: PLATFORM_LABELS[platform],
      percent: Math.round(bucket.mentionRate * 100),
      mentioned: bucket.mentioned,
      total: bucket.total,
    };
  });

  const cellFor = (keywordId: string, platform: Platform) => {
    const r = scanSummary.results.find((res) => res.platform === platform && res.keyword_id === keywordId);
    if (!r) return `<span class="mention-no">—</span>`;
    return r.mentioned
      ? `<span class="mention-yes">Mentioned</span>${r.position ? ` <span class="pos">(#${r.position})</span>` : ""}`
      : `<span class="mention-no">Not found</span>`;
  };

  const keywordRows = keywords.map((k) => ({
    phrase: k.phrase,
    chatgpt: cellFor(k.id, "chatgpt"),
    perplexity: cellFor(k.id, "perplexity"),
    google_ai_overview: cellFor(k.id, "google_ai_overview"),
  }));

  const deltaClass = previousScore === null ? "flat" : scanSummary.overallScore > previousScore ? "up" : scanSummary.overallScore < previousScore ? "down" : "flat";
  const deltaLabel =
    previousScore === null
      ? ""
      : `${scanSummary.overallScore > previousScore ? "▲" : scanSummary.overallScore < previousScore ? "▼" : "–"} ${Math.abs(
          scanSummary.overallScore - previousScore
        )} pts vs last report`;

  return template({
    client,
    dateRange: { start: ga4.rangeStart, end: ga4.rangeEnd },
    overallScore: scanSummary.overallScore,
    hasPrevious: previousScore !== null,
    deltaClass,
    deltaLabel,
    anyMocked: scanSummary.anyMocked || ga4.mocked,
    byPlatform,
    ga4,
    sparklineSvg: buildDualLineSvg(ga4.sessionsBySourceDaily),
    keywordRows,
    generatedAt: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
  });
}

export async function renderReportPdf(reportId: string, html: string): Promise<string> {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfPath = path.join(reportsDir, `${reportId}.pdf`);
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true, margin: { top: "0", bottom: "0" } });
    return pdfPath;
  } finally {
    await browser.close();
  }
}
