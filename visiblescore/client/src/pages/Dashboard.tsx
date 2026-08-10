import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type ClientListItem } from "../lib/api.ts";
import { ScoreRing } from "../components/ScoreRing.tsx";
import { TrendChart } from "../components/TrendChart.tsx";
import { Modal } from "../components/Modal.tsx";
import { PlusIcon } from "../components/icons.tsx";
import { useToast } from "../components/Toast.tsx";

export function Dashboard() {
  const toast = useToast();
  const [clients, setClients] = useState<ClientListItem[] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function load() {
    api.listClients().then(setClients).catch((e) => toast.push(e.message, "error"));
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createClient({ name, contact_email: email, brand_domain: domain, brand_names: [name] });
      setShowModal(false);
      setName("");
      setEmail("");
      setDomain("");
      toast.push(`${name} added.`, "success");
      load();
    } catch (e: any) {
      toast.push(e.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <h1>Clients</h1>
          <div className="muted">AI search visibility &amp; GA4 traffic reports</div>
        </div>
        <button className="btn" onClick={() => setShowModal(true)}><PlusIcon /> Add Client</button>
      </div>

      {showModal && (
        <Modal title="New Client" onClose={() => setShowModal(false)}>
          <form onSubmit={handleAdd}>
            <div className="form-row">
              <label>Client / business name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Acme Roofing" autoFocus />
            </div>
            <div className="form-row">
              <label>Contact email (report recipient)</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="owner@acmeroofing.com" />
            </div>
            <div className="form-row">
              <label>Website domain</label>
              <input value={domain} onChange={(e) => setDomain(e.target.value)} required placeholder="acmeroofing.com" />
            </div>
            <button className="btn" type="submit" disabled={submitting} style={{ width: "100%", justifyContent: "center" }}>
              {submitting ? "Saving…" : "Create client"}
            </button>
          </form>
        </Modal>
      )}

      {!clients ? (
        <div className="muted section">Loading…</div>
      ) : clients.length === 0 ? (
        <div className="card empty-state section">
          <div className="big-icon">📊</div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>No clients yet</div>
          <div>Add your first client to start tracking AI search visibility.</div>
        </div>
      ) : (
        <div className="grid-clients">
          {clients.map((c) => (
            <Link key={c.id} to={`/clients/${c.id}`} className="client-card">
              <div className="client-card-top">
                <div>
                  <div className="name">{c.name}</div>
                  <div className="domain">{c.brand_domain}</div>
                </div>
                <ScoreRing score={c.latestScore} size={56} strokeWidth={6} />
              </div>
              {c.scoreHistory.length > 1 ? (
                <div style={{ marginTop: 14 }}>
                  <TrendChart points={c.scoreHistory} variant="mini" height={36} />
                </div>
              ) : (
                <div className="no-score">{c.scoreHistory.length === 0 ? "No reports yet" : "Generate another report to see trend"}</div>
              )}
              <div className="meta">
                {c.scoreHistory.length} report{c.scoreHistory.length === 1 ? "" : "s"}
                {c.auto_report_frequency !== "off" && ` · auto-report ${c.auto_report_frequency}`}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
