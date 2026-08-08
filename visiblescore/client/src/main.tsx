import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { AppShell } from "./components/AppShell.tsx";
import { ToastProvider } from "./components/Toast.tsx";
import { AgencyProvider } from "./lib/AgencyContext.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";
import { ClientDetail } from "./pages/ClientDetail.tsx";
import { Settings } from "./pages/Settings.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastProvider>
      <AgencyProvider>
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients/:id" element={<ClientDetail />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </AgencyProvider>
    </ToastProvider>
  </React.StrictMode>
);
