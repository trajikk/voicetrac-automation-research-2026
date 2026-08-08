import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Client } from "../lib/api.ts";

export function Dashboard() {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.listClients().then(setClients).catch((e) => setError(e.message));
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const client = await api.createClient({ name, contact_email: email, brand_domain: domain, brand_names: [name] });
      setClients((prev) => [client, ...(prev ?? [])]);
      setShowForm(false);
      setName("");
      setEmail("");
      setDomain("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Clients</h1>
          <div className="muted">AI search visibility &amp; GA4 traffic reports</div>
        </div>
        <button className="btn" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "+ Add Client"}
        </button>
      </div>

      {showForm && (
        <div className="card section">
          <h2>New Client</h2>
          <form onSubmit={handleAdd}>
            <div className="form-row">
              <label>Client / business name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Acme Roofing" />
            </div>
            <div className="form-row">
              <label>Contact email (report recipient)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="owner@acmeroofing.com"
              />
            </div>
            <div className="form-row">
              <label>Website domain</label>
              <input value={domain} onChange={(e) => setDomain(e.target.value)} required placeholder="acmeroofing.com" />
            </div>
            {error && <div className="banner error">{error}</div>}
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Create client"}
            </button>
          </form>
        </div>
      )}

      {!clients ? (
        <div className="muted section">Loading…</div>
      ) : clients.length === 0 ? (
        <div className="muted section">No clients yet. Add one to generate your first report.</div>
      ) : (
        <div className="grid-clients">
          {clients.map((c) => (
            <Link key={c.id} to={`/clients/${c.id}`} className="client-card">
              <div className="name">{c.name}</div>
              <div className="domain">{c.brand_domain}</div>
              <div className="score-pill">Open report dashboard →</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
