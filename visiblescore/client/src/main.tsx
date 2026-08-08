import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { AppShell } from "./components/AppShell.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";
import { ClientDetail } from "./pages/ClientDetail.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients/:id" element={<ClientDetail />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  </React.StrictMode>
);
