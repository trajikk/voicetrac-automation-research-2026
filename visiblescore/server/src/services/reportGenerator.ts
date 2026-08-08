import Handlebars from "handlebars";
import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildDualLineSvg } from "./sparkline.js";
import type { Client, Competitor, Ga4Summary, Keyword, Platform } from "../types.js";
import type { ScanSummary } from "./visibilityScanner.js";
import type { ContentGap } from "./contentGap.js";

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

const SENTIMENT_ICON: Record<string, string> = { positive: "😊", neutral: "😐", negative: "☹️" };

export interface ReportInputs {
  client: Client;
  competitors: Competitor[];
  keywords: Keyword[];
  scanSummary: ScanSummary;
  gaps: ContentGap[];
  ga4: Ga4Summary;
  previousScore: number | null;
  reportId: string;
}

export async function renderReportHtml(inputs: ReportInputs): Promise<string> {
  const { client, keywords, scanSummary, gaps, ga4, previousScore } = inputs;

  const byPlatform = (Object.keys(PLATFORM_LABELS) as Platform[]).map((platform) => {
    const bucket = scanSummary.byPlatform[platform] ?? { mentioned: 0, total: 0, mentionRate: 0 };
    return { label: PLATFORM_LABELS[platform], percent: Math.round(bucket.mentionRate * 100), mentioned: bucket.mentioned, total: bucket.total };
  });

  const clientResults = scanSummary.entityResults.filter((r) => r.entity_type === "client");
  const cellFor = (keywordId: string, platform: Platform) => {
    const r = clientResults.find((res) => res.platform === platform && res.keyword_id === keywordId);
    if (!r) return `<span class="mention-no">—</span>`;
    if (!r.mentioned) return `<span class="mention-no">Not found</span>`;
    const icon = r.sentiment ? ` ${SENTIMENT_ICON[r.sentiment] ?? ""}` : "";
    return `<span class="mention-yes">Mentioned</span>${r.position ? ` <span class="pos">(#${r.position})</span>` : ""}${icon}`;
  };

  const keywordRows = keywords.map((k) => ({
    phrase: k.phrase,
    chatgpt: cellFor(k.id, "chatgpt"),
    perplexity: cellFor(k.id, "perplexity"),
    google_ai_overview: cellFor(k.id, "google_ai_overview"),
  }));

  const maxRate = Math.max(...scanSummary.leaderboard.map((l) => l.mentionRate), 0.01);
  const leaderboard = scanSummary.leaderboard.map((l) => ({
    label: l.label,
    isClient: l.entity_type === "client",
    percent: Math.round(l.mentionRate * 100),
    barWidth: Math.round((l.mentionRate / maxRate) * 100),
    mentioned: l.mentioned,
    total: l.total,
  }));

  const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
  for (const r of clientResults) {
    if (r.mentioned && r.sentiment) sentimentCounts[r.sentiment] += 1;
  }
  const sentimentTotal = sentimentCounts.positive + sentimentCounts.neutral + sentimentCounts.negative;
  const sentiment = {
    total: sentimentTotal,
    positive: sentimentCounts.positive,
    neutral: sentimentCounts.neutral,
    negative: sentimentCounts.negative,
    positivePct: sentimentTotal ? Math.round((sentimentCounts.positive / sentimentTotal) * 100) : 0,
    neutralPct: sentimentTotal ? Math.round((sentimentCounts.neutral / sentimentTotal) * 100) : 0,
    negativePct: sentimentTotal ? Math.round((sentimentCounts.negative / sentimentTotal) * 100) : 0,
  };

  const deltaClass =
    previousScore === null ? "flat" : scanSummary.overallScore > previousScore ? "up" : scanSummary.overallScore < previousScore ? "down" : "flat";
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
    leaderboard,
    hasCompetitors: inputs.competitors.length > 0,
    sentiment,
    gaps,
    hasGaps: gaps.length > 0,
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
