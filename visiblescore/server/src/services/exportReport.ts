import { EntityMentions, PlatformResponses } from "../db/index.js";
import type { Report } from "../types.js";

export interface ExportRow {
  platform: string;
  keyword_id: string;
  entity_type: string;
  entity_label: string;
  mentioned: boolean;
  position: number | null;
  sentiment: string | null;
  snippet: string | null;
  response_excerpt: string;
  source_urls: string;
}

export function buildExportRows(report: Report): ExportRow[] {
  const responses = PlatformResponses.listByScan(report.scan_id);
  const mentions = EntityMentions.listByScan(report.scan_id);
  const responseById = new Map(responses.map((r) => [r.id, r]));

  return mentions.map((m) => {
    const response = responseById.get(m.response_id);
    return {
      platform: response?.platform ?? "",
      keyword_id: response?.keyword_id ?? "",
      entity_type: m.entity_type,
      entity_label: m.entity_label,
      mentioned: m.mentioned,
      position: m.position,
      sentiment: m.sentiment,
      snippet: m.snippet,
      response_excerpt: response?.raw_text ?? "",
      source_urls: (response?.source_urls ?? []).join("; "),
    };
  });
}

export function rowsToCsv(rows: ExportRow[]): string {
  const headers = ["platform", "keyword_id", "entity_type", "entity_label", "mentioned", "position", "sentiment", "snippet", "response_excerpt", "source_urls"];
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape((row as any)[h])).join(","));
  }
  return lines.join("\n");
}
