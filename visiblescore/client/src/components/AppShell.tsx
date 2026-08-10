import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useAgency } from "../lib/AgencyContext.tsx";
import { DashboardIcon, SettingsIcon } from "./icons.tsx";

export function AppShell({ children }: { children: ReactNode }) {
  const { settings } = useAgency();
  const agencyName = settings?.agency_name || "VisibleScore";
  const initials = agencyName.slice(0, 2).toUpperCase();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/" className="sidebar-logo">
          {settings?.logo_data_url ? <img src={settings.logo_data_url} alt="" /> : <span className="mark">{initials}</span>}
          {agencyName}
        </NavLink>
        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
            <DashboardIcon /> Clients
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
            <SettingsIcon /> Branding
          </NavLink>
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-foot">AI search visibility &amp; GA4 reporting</div>
      </aside>
      <div className="main-area">{children}</div>
    </div>
  );
}
