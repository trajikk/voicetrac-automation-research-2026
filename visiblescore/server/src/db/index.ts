import Database from "better-sqlite3";
import { nanoid } from "nanoid";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import type {
  AgencySettings,
  Client,
  Competitor,
  Ga4Source,
  Keyword,
  Scan,
  PlatformResponse,
  EntityMention,
  Report,
} from "../types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "..", "data");
fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(path.join(dataDir, "visiblescore.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  brand_domain TEXT NOT NULL,
  brand_names TEXT NOT NULL DEFAULT '[]',
  auto_report_frequency TEXT NOT NULL DEFAULT 'off',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS agency_settings (
  id TEXT PRIMARY KEY,
  agency_name TEXT NOT NULL,
  logo_data_url TEXT,
  primary_color TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS competitors (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ga4_sources (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  property_id TEXT NOT NULL,
  service_account_json TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS keywords (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  phrase TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scans (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL
);

-- One raw AI answer per (scan, keyword, platform).
CREATE TABLE IF NOT EXISTS platform_responses (
  id TEXT PRIMARY KEY,
  scan_id TEXT NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
  keyword_id TEXT NOT NULL REFERENCES keywords(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  raw_text TEXT NOT NULL,
  source_urls TEXT NOT NULL DEFAULT '[]',
  mocked INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

-- One row per entity (client or a tracked competitor) checked against a response.
CREATE TABLE IF NOT EXISTS entity_mentions (
  id TEXT PRIMARY KEY,
  response_id TEXT NOT NULL REFERENCES platform_responses(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  entity_label TEXT NOT NULL,
  mentioned INTEGER NOT NULL,
  position INTEGER,
  snippet TEXT,
  sentiment TEXT,
  sentiment_rationale TEXT
);

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  scan_id TEXT NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
  ga4_summary_json TEXT,
  overall_score REAL NOT NULL,
  pdf_path TEXT,
  emailed_at TEXT,
  created_at TEXT NOT NULL
);
`);

const now = () => new Date().toISOString();

export const Clients = {
  create(input: { name: string; contact_email: string; brand_domain: string; brand_names: string[] }): Client {
    const row: Client = { id: nanoid(10), created_at: now(), auto_report_frequency: "off", ...input };
    db.prepare(
      `INSERT INTO clients (id, name, contact_email, brand_domain, brand_names, auto_report_frequency, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(row.id, row.name, row.contact_email, row.brand_domain, JSON.stringify(row.brand_names), row.auto_report_frequency, row.created_at);
    return row;
  },
  list(): Client[] {
    return (db.prepare(`SELECT * FROM clients ORDER BY created_at DESC`).all() as any[]).map(deserializeClient);
  },
  get(id: string): Client | undefined {
    const row = db.prepare(`SELECT * FROM clients WHERE id = ?`).get(id) as any;
    return row ? deserializeClient(row) : undefined;
  },
  setAutoReportFrequency(id: string, frequency: string) {
    db.prepare(`UPDATE clients SET auto_report_frequency = ? WHERE id = ?`).run(frequency, id);
  },
};

function deserializeClient(row: any): Client {
  return { ...row, brand_names: JSON.parse(row.brand_names) };
}

export const Competitors = {
  add(client_id: string, name: string, domain: string): Competitor {
    const row: Competitor = {
      id: nanoid(10),
      client_id,
      name,
      domain: domain.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      created_at: now(),
    };
    db.prepare(`INSERT INTO competitors (id, client_id, name, domain, created_at) VALUES (?, ?, ?, ?, ?)`).run(
      row.id,
      row.client_id,
      row.name,
      row.domain,
      row.created_at
    );
    return row;
  },
  listByClient(client_id: string): Competitor[] {
    return db.prepare(`SELECT * FROM competitors WHERE client_id = ? ORDER BY created_at ASC`).all(client_id) as Competitor[];
  },
  remove(id: string) {
    db.prepare(`DELETE FROM competitors WHERE id = ?`).run(id);
  },
};

export const Ga4Sources = {
  upsert(input: { client_id: string; property_id: string; service_account_json: string | null }): Ga4Source {
    const existing = db
      .prepare(`SELECT * FROM ga4_sources WHERE client_id = ?`)
      .get(input.client_id) as Ga4Source | undefined;
    if (existing) {
      db.prepare(`UPDATE ga4_sources SET property_id = ?, service_account_json = ? WHERE id = ?`).run(
        input.property_id,
        input.service_account_json,
        existing.id
      );
      return { ...existing, ...input };
    }
    const row: Ga4Source = { id: nanoid(10), created_at: now(), ...input };
    db.prepare(
      `INSERT INTO ga4_sources (id, client_id, property_id, service_account_json, created_at) VALUES (?, ?, ?, ?, ?)`
    ).run(row.id, row.client_id, row.property_id, row.service_account_json, row.created_at);
    return row;
  },
  getByClient(client_id: string): Ga4Source | undefined {
    return db.prepare(`SELECT * FROM ga4_sources WHERE client_id = ?`).get(client_id) as Ga4Source | undefined;
  },
};

export const Keywords = {
  add(client_id: string, phrase: string): Keyword {
    const row: Keyword = { id: nanoid(10), client_id, phrase, created_at: now() };
    db.prepare(`INSERT INTO keywords (id, client_id, phrase, created_at) VALUES (?, ?, ?, ?)`).run(
      row.id,
      row.client_id,
      row.phrase,
      row.created_at
    );
    return row;
  },
  listByClient(client_id: string): Keyword[] {
    return db.prepare(`SELECT * FROM keywords WHERE client_id = ? ORDER BY created_at ASC`).all(client_id) as Keyword[];
  },
  remove(id: string) {
    db.prepare(`DELETE FROM keywords WHERE id = ?`).run(id);
  },
};

export const Scans = {
  create(client_id: string): Scan {
    const row: Scan = { id: nanoid(10), client_id, created_at: now() };
    db.prepare(`INSERT INTO scans (id, client_id, created_at) VALUES (?, ?, ?)`).run(row.id, row.client_id, row.created_at);
    return row;
  },
  get(id: string): Scan | undefined {
    return db.prepare(`SELECT * FROM scans WHERE id = ?`).get(id) as Scan | undefined;
  },
  listByClient(client_id: string): Scan[] {
    return db.prepare(`SELECT * FROM scans WHERE client_id = ? ORDER BY created_at DESC`).all(client_id) as Scan[];
  },
};

export const PlatformResponses = {
  create(input: {
    scan_id: string;
    keyword_id: string;
    platform: string;
    raw_text: string;
    source_urls: string[];
    mocked: boolean;
  }): PlatformResponse {
    const row: PlatformResponse = { id: nanoid(10), created_at: now(), ...input } as PlatformResponse;
    db.prepare(
      `INSERT INTO platform_responses (id, scan_id, keyword_id, platform, raw_text, source_urls, mocked, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(row.id, row.scan_id, row.keyword_id, row.platform, row.raw_text, JSON.stringify(row.source_urls), row.mocked ? 1 : 0, row.created_at);
    return row;
  },
  listByScan(scan_id: string): PlatformResponse[] {
    return (db.prepare(`SELECT * FROM platform_responses WHERE scan_id = ?`).all(scan_id) as any[]).map((row) => ({
      ...row,
      mocked: !!row.mocked,
      source_urls: JSON.parse(row.source_urls),
    }));
  },
};

export const EntityMentions = {
  bulkInsert(rows: Array<Omit<EntityMention, "id">>) {
    const stmt = db.prepare(
      `INSERT INTO entity_mentions (id, response_id, entity_type, entity_id, entity_label, mentioned, position, snippet, sentiment, sentiment_rationale)
       VALUES (@id, @response_id, @entity_type, @entity_id, @entity_label, @mentioned, @position, @snippet, @sentiment, @sentiment_rationale)`
    );
    const tx = db.transaction((items: EntityMention[]) => {
      for (const r of items) stmt.run(r);
    });
    tx(rows.map((r) => ({ id: nanoid(10), ...r, mentioned: r.mentioned ? 1 : 0 })) as any);
  },
  listByScan(scan_id: string): EntityMention[] {
    return (
      db
        .prepare(
          `SELECT em.* FROM entity_mentions em
           JOIN platform_responses pr ON pr.id = em.response_id
           WHERE pr.scan_id = ?`
        )
        .all(scan_id) as any[]
    ).map((row) => ({ ...row, mentioned: !!row.mentioned }));
  },
};

export const Reports = {
  create(input: {
    client_id: string;
    scan_id: string;
    ga4_summary_json: string | null;
    overall_score: number;
    pdf_path: string | null;
  }): Report {
    const row: Report = { id: nanoid(10), created_at: now(), emailed_at: null, ...input };
    db.prepare(
      `INSERT INTO reports (id, client_id, scan_id, ga4_summary_json, overall_score, pdf_path, emailed_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(row.id, row.client_id, row.scan_id, row.ga4_summary_json, row.overall_score, row.pdf_path, row.emailed_at, row.created_at);
    return row;
  },
  get(id: string): Report | undefined {
    return db.prepare(`SELECT * FROM reports WHERE id = ?`).get(id) as Report | undefined;
  },
  listByClient(client_id: string): Report[] {
    return db.prepare(`SELECT * FROM reports WHERE client_id = ? ORDER BY created_at DESC`).all(client_id) as Report[];
  },
  markEmailed(id: string) {
    db.prepare(`UPDATE reports SET emailed_at = ? WHERE id = ?`).run(now(), id);
  },
  previousBefore(client_id: string, created_at: string): Report | undefined {
    return db
      .prepare(`SELECT * FROM reports WHERE client_id = ? AND created_at < ? ORDER BY created_at DESC LIMIT 1`)
      .get(client_id, created_at) as Report | undefined;
  },
  latestForClient(client_id: string): Report | undefined {
    return db.prepare(`SELECT * FROM reports WHERE client_id = ? ORDER BY created_at DESC LIMIT 1`).get(client_id) as Report | undefined;
  },
};

const DEFAULT_AGENCY_SETTINGS: AgencySettings = {
  id: "default",
  agency_name: "VisibleScore",
  logo_data_url: null,
  primary_color: "#6d5ff5",
  updated_at: now(),
};

export const Settings = {
  get(): AgencySettings {
    const row = db.prepare(`SELECT * FROM agency_settings WHERE id = 'default'`).get() as AgencySettings | undefined;
    return row ?? DEFAULT_AGENCY_SETTINGS;
  },
  upsert(input: { agency_name: string; logo_data_url: string | null; primary_color: string }): AgencySettings {
    const row: AgencySettings = { id: "default", updated_at: now(), ...input };
    db.prepare(
      `INSERT INTO agency_settings (id, agency_name, logo_data_url, primary_color, updated_at) VALUES ('default', ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET agency_name = excluded.agency_name, logo_data_url = excluded.logo_data_url,
         primary_color = excluded.primary_color, updated_at = excluded.updated_at`
    ).run(row.agency_name, row.logo_data_url, row.primary_color, row.updated_at);
    return row;
  },
};
