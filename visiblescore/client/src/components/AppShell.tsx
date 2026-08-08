import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <div className="topbar">
        <Link to="/" className="logo" style={{ textDecoration: "none", color: "white" }}>
          VisibleScore
        </Link>
      </div>
      {children}
    </div>
  );
}
