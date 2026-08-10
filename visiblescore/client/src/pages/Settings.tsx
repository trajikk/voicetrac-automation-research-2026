import { useEffect, useState } from "react";
import { api } from "../lib/api.ts";
import { useAgency } from "../lib/AgencyContext.tsx";
import { useToast } from "../components/Toast.tsx";

export function Settings() {
  const { settings, refresh } = useAgency();
  const toast = useToast();

  const [agencyName, setAgencyName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#6d5ff5");
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setAgencyName(settings.agency_name);
      setPrimaryColor(settings.primary_color);
      setLogoDataUrl(settings.logo_data_url);
    }
  }, [settings]);

  function onLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.push("Logo must be under 2MB.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.saveSettings({ agency_name: agencyName.trim(), logo_data_url: logoDataUrl, primary_color: primaryColor });
      refresh();
      toast.push("Branding saved.", "success");
    } catch (err: any) {
      toast.push(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  const initials = (agencyName || "VS").slice(0, 2).toUpperCase();

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <h1>Branding</h1>
          <div className="muted">Shown in the dashboard sidebar, on every PDF report, and in report emails.</div>
        </div>
      </div>

      <div className="section card" style={{ maxWidth: 560 }}>
        <h2>Agency Identity</h2>
        <form onSubmit={save}>
          <div className="form-row" style={{ marginTop: 14 }}>
            <label>Agency / company name</label>
            <input value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="Your Agency" required />
          </div>

          <div className="form-row">
            <label>Logo</label>
            <div className="logo-upload">
              <input type="file" accept="image/*" onChange={onLogoFile} />
              {logoDataUrl && (
                <button type="button" className="btn ghost sm" onClick={() => setLogoDataUrl(null)}>Remove</button>
              )}
            </div>
          </div>

          <div className="form-row">
            <label>Primary color</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="color" className="color-swatch" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
              <span className="muted">{primaryColor}</span>
            </div>
          </div>

          <button className="btn" type="submit" disabled={saving}>{saving ? "Saving…" : "Save branding"}</button>
        </form>
      </div>

      <div className="section">
        <h2 style={{ marginBottom: 10 }}>Preview</h2>
        <div className="brand-preview">
          {logoDataUrl ? (
            <img src={logoDataUrl} alt="" />
          ) : (
            <span className="mark" style={{ background: primaryColor }}>{initials}</span>
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{agencyName || "Your Agency"}</div>
            <div className="muted">This is how your brand appears on client reports and emails.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
