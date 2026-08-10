import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api, type AutoReportFrequency, type ClientDetail as ClientDetailType, type Report } from "../lib/api.ts";
import { ScoreRing } from "../components/ScoreRing.tsx";
import { TrendChart } from "../components/TrendChart.tsx";
import { useToast } from "../components/Toast.tsx";

const FREQUENCIES: Array<{ value: AutoReportFrequency; label: string }> = [
  { value: "off", label: "Off" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const [client, setClient] = useState<ClientDetailType | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [newKeyword, setNewKeyword] = useState("");
  const [competitorName, setCompetitorName] = useState("");
  const [competitorDomain, setCompetitorDomain] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [credsJson, setCredsJson] = useState("");

  const [generating, setGenerating] = useState(false);
  const [latestPreview, setLatestPreview] = useState<Report | null>(null);

  const [suggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [suggestionsMocked, setSuggestionsMocked] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const load = useCallback(() => {
    if (!id) return;
    api.getClient(id).then((c) => {
      setClient(c);
      setPropertyId(c.ga4Source?.property_id ?? "");
    }).catch((e) => setLoadError(e.message));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function addKeyword(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !newKeyword.trim()) return;
    await api.addKeyword(id, newKeyword.trim());
    setNewKeyword("");
    load();
  }

  async function removeKeyword(keywordId: string) {
    await api.removeKeyword(keywordId);
    load();
  }

  async function suggestKeywords() {
    if (!id) return;
    setSuggesting(true);
    try {
      const result = await api.suggestKeywords(id);
      setSuggestions(result.suggestions);
      setSuggestionsMocked(result.mocked);
      setSelected(new Set(result.suggestions));
    } catch (e: any) {
      toast.push(e.message, "error");
    } finally {
      setSuggesting(false);
    }
  }

  function toggleSuggestion(s: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  async function addSelectedSuggestions() {
    if (!id) return;
    await Promise.all([...selected].map((phrase) => api.addKeyword(id, phrase)));
    setSuggestions(null);
    setSelected(new Set());
    load();
  }

  async function addCompetitor(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !competitorName.trim() || !competitorDomain.trim()) return;
    await api.addCompetitor(id, { name: competitorName.trim(), domain: competitorDomain.trim() });
    setCompetitorName("");
    setCompetitorDomain("");
    load();
  }

  async function removeCompetitor(competitorId: string) {
    await api.removeCompetitor(competitorId);
    load();
  }

  async function saveGa4(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    try {
      await api.setGa4Source(id, { property_id: propertyId, service_account_json: credsJson || undefined });
      toast.push("GA4 source saved.", "success");
      setCredsJson("");
      load();
    } catch (e: any) {
      toast.push(e.message, "error");
    }
  }

  async function setAutoReport(frequency: AutoReportFrequency) {
    if (!id) return;
    try {
      await api.setAutoReportFrequency(id, frequency);
      toast.push(frequency === "off" ? "Auto-reports turned off." : `Auto-reports set to ${frequency}.`, "success");
      load();
    } catch (e: any) {
      toast.push(e.message, "error");
    }
  }

  async function generateReport() {
    if (!id) return;
    setGenerating(true);
    try {
      const report = await api.generateReport(id);
      setLatestPreview(report);
      toast.push(`Report generated — visibility score ${report.overall_score}%.`, "success");
      load();
    } catch (e: any) {
      toast.push(e.message, "error");
    } finally {
      setGenerating(false);
    }
  }

  async function emailReport(reportId: string) {
    try {
      const result = await api.emailReport(reportId);
      toast.push(result.sent ? "Report emailed to client." : `Not sent: ${result.reason}`, result.sent ? "success" : "error");
    } catch (e: any) {
      toast.push(e.message, "error");
    }
  }

  if (loadError && !client) return <div className="container banner error">{loadError}</div>;
  if (!client) return <div className="container muted">Loading…</div>;

  const trendPoints = [...client.reports].reverse().map((r) => ({ date: r.created_at, score: r.overall_score }));

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <h1>{client.name}</h1>
          <div className="muted">{client.brand_domain} · reports go to {client.contact_email}</div>
        </div>
        <ScoreRing score={client.reports[0]?.overall_score ?? null} size={64} strokeWidth={7} />
      </div>

      <div className="section card">
        <div className="section-head">
          <h2>Visibility Score Trend</h2>
        </div>
        <TrendChart points={trendPoints} variant="full" height={160} />
      </div>

      <div className="section card">
        <h2>Tracked Search Terms</h2>
        <div className="muted" style={{ marginBottom: 12 }}>
          Each term is checked against ChatGPT, Perplexity, and Google AI Overviews on every report run.
        </div>
        <div>
          {client.keywords.length === 0 && <div className="muted">No terms yet — add one below or generate suggestions.</div>}
          {client.keywords.map((k) => (
            <span key={k.id} className="keyword-chip">
              {k.phrase}
              <button onClick={() => removeKeyword(k.id)} aria-label="remove">×</button>
            </span>
          ))}
        </div>
        <form className="inline-form" style={{ marginTop: 12 }} onSubmit={addKeyword}>
          <div className="form-row">
            <label>Add a search term to track</label>
            <input value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} placeholder="best roofing company near me" />
          </div>
          <button className="btn secondary" type="submit">Add</button>
        </form>

        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
          <button className="btn secondary" onClick={suggestKeywords} disabled={suggesting}>
            {suggesting ? "Analyzing website…" : "Suggest search terms from website"}
          </button>
          {suggestions && (
            <div style={{ marginTop: 12 }}>
              {suggestionsMocked && (
                <div className="banner" style={{ marginTop: 0, marginBottom: 10 }}>
                  Demo suggestions — set OPENAI_API_KEY on the server for suggestions tailored to the actual homepage content.
                </div>
              )}
              {suggestions.map((s) => (
                <label key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, padding: "4px 0" }}>
                  <input type="checkbox" checked={selected.has(s)} onChange={() => toggleSuggestion(s)} />
                  {s}
                </label>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button className="btn" onClick={addSelectedSuggestions} disabled={selected.size === 0}>
                  Add {selected.size} selected term{selected.size === 1 ? "" : "s"}
                </button>
                <button className="btn secondary" onClick={() => setSuggestions(null)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="section card">
        <h2>Competitors</h2>
        <div className="muted" style={{ marginBottom: 12 }}>
          Tracked alongside {client.name} in every scan so reports show who wins each AI-search query.
        </div>
        <div>
          {client.competitors.length === 0 && <div className="muted">No competitors added yet.</div>}
          {client.competitors.map((c) => (
            <span key={c.id} className="keyword-chip">
              {c.name} <span className="muted">({c.domain})</span>
              <button onClick={() => removeCompetitor(c.id)} aria-label="remove">×</button>
            </span>
          ))}
        </div>
        <form className="inline-form" style={{ marginTop: 12 }} onSubmit={addCompetitor}>
          <div className="form-row">
            <label>Competitor name</label>
            <input value={competitorName} onChange={(e) => setCompetitorName(e.target.value)} placeholder="RoofPro" />
          </div>
          <div className="form-row">
            <label>Competitor domain</label>
            <input value={competitorDomain} onChange={(e) => setCompetitorDomain(e.target.value)} placeholder="roofpro.com" />
          </div>
          <button className="btn secondary" type="submit">Add</button>
        </form>
      </div>

      <div className="section card">
        <h2>Google Analytics 4 Source</h2>
        <div className="muted" style={{ marginBottom: 12 }}>
          Grant the service account "Viewer" access on this client's GA4 property (Admin → Property Access Management),
          then paste its JSON key below. Leave blank to use demo traffic data.
        </div>
        <form onSubmit={saveGa4}>
          <div className="form-row">
            <label>GA4 Property ID</label>
            <input value={propertyId} onChange={(e) => setPropertyId(e.target.value)} placeholder="properties/123456789 → 123456789" />
          </div>
          <div className="form-row">
            <label>Service account JSON key {client.ga4Source?.hasCredentials && <span className="muted">(currently set — paste to replace)</span>}</label>
            <textarea rows={4} value={credsJson} onChange={(e) => setCredsJson(e.target.value)} placeholder='{"type": "service_account", ...}' />
          </div>
          <button className="btn secondary" type="submit">Save GA4 source</button>
        </form>
      </div>

      <div className="section card">
        <div className="section-head">
          <h2>Generate Report</h2>
        </div>
        <div className="muted" style={{ marginBottom: 14 }}>
          Runs a fresh scan across all tracked terms (and competitors) and pulls the latest GA4 traffic, then builds a client-ready PDF.
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 }}>
            Auto-report cadence
          </label>
          <div className="pill-group">
            {FREQUENCIES.map((f) => (
              <button
                key={f.value}
                className={client.auto_report_frequency === f.value ? "active" : ""}
                onClick={() => setAutoReport(f.value)}
                type="button"
              >
                {f.label}
              </button>
            ))}
          </div>
          {client.auto_report_frequency !== "off" && (
            <div className="muted" style={{ marginTop: 6 }}>
              A report will be generated and emailed to {client.contact_email} automatically — no manual clicks needed.
            </div>
          )}
        </div>

        <button className="btn" onClick={generateReport} disabled={generating || client.keywords.length === 0}>
          {generating ? "Generating…" : "Generate Report Now"}
        </button>
        {client.keywords.length === 0 && <div className="muted" style={{ marginTop: 8 }}>Add at least one search term first.</div>}

        {latestPreview && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              <a className="btn secondary" href={api.reportPdfUrl(latestPreview.id)} target="_blank" rel="noreferrer">Open PDF</a>
              <button className="btn secondary" onClick={() => emailReport(latestPreview.id)}>Email to Client</button>
              <a className="btn secondary" href={api.reportExportUrl(latestPreview.id, "csv")}>Export CSV</a>
              <a className="btn secondary" href={api.reportExportUrl(latestPreview.id, "json")}>Export JSON</a>
            </div>
            <iframe
              title="report-preview"
              srcDoc={latestPreview.html}
              style={{ width: "100%", height: 640, border: "1px solid var(--border)", borderRadius: 12 }}
            />
          </div>
        )}
      </div>

      <div className="section card">
        <h2>Report History</h2>
        {client.reports.length === 0 && <div className="muted">No reports generated yet.</div>}
        {client.reports.map((r) => (
          <div className="report-row" key={r.id}>
            <div>
              <span className="score-tag">{r.overall_score}%</span>{" "}
              <span className="muted">{new Date(r.created_at).toLocaleString()}</span>
              {r.emailed_at && <span className="muted"> · emailed {new Date(r.emailed_at).toLocaleDateString()}</span>}
            </div>
            <div className="report-actions">
              <a className="btn secondary sm" href={api.reportPdfUrl(r.id)} target="_blank" rel="noreferrer">View PDF</a>
              <a className="btn secondary sm" href={api.reportExportUrl(r.id, "csv")}>CSV</a>
              <button className="btn secondary sm" onClick={() => emailReport(r.id)}>Email</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
