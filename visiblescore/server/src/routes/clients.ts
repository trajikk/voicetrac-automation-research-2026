import { Router } from "express";
import { Clients, Ga4Sources, Keywords, Reports } from "../db/index.js";

export const clientsRouter = Router();

clientsRouter.get("/", (_req, res) => {
  res.json(Clients.list());
});

clientsRouter.post("/", (req, res) => {
  const { name, contact_email, brand_domain, brand_names } = req.body ?? {};
  if (!name || !contact_email || !brand_domain) {
    return res.status(400).json({ error: "name, contact_email, and brand_domain are required" });
  }
  const client = Clients.create({
    name,
    contact_email,
    brand_domain: brand_domain.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    brand_names: Array.isArray(brand_names) && brand_names.length ? brand_names : [name],
  });
  res.status(201).json(client);
});

clientsRouter.get("/:id", (req, res) => {
  const client = Clients.get(req.params.id);
  if (!client) return res.status(404).json({ error: "not found" });
  res.json({
    ...client,
    keywords: Keywords.listByClient(client.id),
    ga4Source: Ga4Sources.getByClient(client.id) ? { ...Ga4Sources.getByClient(client.id), service_account_json: undefined, hasCredentials: !!Ga4Sources.getByClient(client.id)?.service_account_json } : null,
    reports: Reports.listByClient(client.id),
  });
});

clientsRouter.post("/:id/keywords", (req, res) => {
  const client = Clients.get(req.params.id);
  if (!client) return res.status(404).json({ error: "not found" });
  const { phrase } = req.body ?? {};
  if (!phrase || typeof phrase !== "string") return res.status(400).json({ error: "phrase is required" });
  res.status(201).json(Keywords.add(client.id, phrase.trim()));
});

clientsRouter.delete("/keywords/:keywordId", (req, res) => {
  Keywords.remove(req.params.keywordId);
  res.status(204).end();
});

clientsRouter.put("/:id/ga4-source", (req, res) => {
  const client = Clients.get(req.params.id);
  if (!client) return res.status(404).json({ error: "not found" });
  const { property_id, service_account_json } = req.body ?? {};
  if (!property_id) return res.status(400).json({ error: "property_id is required" });

  if (service_account_json) {
    try {
      JSON.parse(service_account_json);
    } catch {
      return res.status(400).json({ error: "service_account_json must be valid JSON" });
    }
  }

  const row = Ga4Sources.upsert({ client_id: client.id, property_id, service_account_json: service_account_json ?? null });
  res.json({ ...row, service_account_json: undefined, hasCredentials: !!row.service_account_json });
});
