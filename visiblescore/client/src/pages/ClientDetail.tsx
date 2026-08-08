import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api, type ClientDetail as ClientDetailType, type Report } from "../lib/api.ts";

export function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<ClientDetailType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [newKeyword, setNewKeyword] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [credsJson, setCredsJson] = useState("");

  const [generating, setGenerating] = useState(false);
  const [latestPreview, setLatestPreview] = useState<Report | null>(null);

  const load = useCallback(() => {
    if (!id) return;
    api.getClient(id).then((c) => {
      setClient(c);
      setPropertyId(c.ga4Source?.property_id ?? "");
    }).catch((e) => setError(e.message));
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

  async function saveGa4(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    try {
      await api.setGa4Source(id, { property_id: propertyId, service_account_json: credsJson || undefined });
      setNotice("GA4 source saved.");
      setCredsJson("");
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function generateReport() {
    if (!id) return;
    setGenerating(true);
    setError(null);
    setNotice(null);
    try {
      const report = await api.generateReport(id);
      setLatestPreview(report);
      setNotice(`Report generated — visibility score ${report.overall_score}%.`);
      load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  }

  async function emailReport(reportId: string) {
    setError(null);
    setNotice(null);
    try {
      const result = await api.emailReport(reportId);
      setNotice(result.sent ? "Report emailed to client." : `Not sent: ${result.reason}`);
    } catch (e: any) {
      setError(e.message);
    }
  }

  if (error && !client) return <div className="container banner error">{error}</div>;
  if (!client) return <div className="container muted">Loading…</div>;

  return (
    <div className="container">
      <h1>{client.name}</h1>
      <div className="muted">{client.brand_domain} · reports go to {client.contact_email}</div>

      {notice && <div className="banner success">{notice}</div>}
      {error && <div className="banner error">{error}</div>}

      <div className="section card">
        <h2>Tracked Search Terms</h2>
        <div className="muted" style={{ marginBottom: 12 }}>
          Each term is checked against ChatGPT, Perplexity, and Google AI Overviews on every report run.
        </div>
        <div>
          {client.keywords.length === 0 && <div className="muted">No terms yet — add at least one below.</div>}
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
        <h2>Generate Report</h2>
        <div className="muted" style={{ marginBottom: 12 }}>
          Runs a fresh scan across all tracked terms and pulls the latest GA4 traffic, then builds a client-ready PDF.
        </div>
        <button className="btn" onClick={generateReport} disabled={generating || client.keywords.length === 0}>
          {generating ? "Generating…" : "Generate Report"}
        </button>
        {client.keywords.length === 0 && <div className="muted" style={{ marginTop: 8 }}>Add at least one search term first.</div>}

        {latestPreview && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <a className="btn secondary" href={api.reportPdfUrl(latestPreview.id)} target="_blank" rel="noreferrer">
                Open PDF
              </a>
              <button className="btn secondary" onClick={() => emailReport(latestPreview.id)}>Email to Client</button>
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
              <a className="btn secondary" href={api.reportPdfUrl(r.id)} target="_blank" rel="noreferrer">View PDF</a>
              <button className="btn secondary" onClick={() => emailReport(r.id)}>Email</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
