import { Router } from "express";
import { Clients, Competitors, Ga4Sources, Keywords, Reports } from "../db/index.js";
import { generateQuerySuggestions } from "../services/queryGenerator.js";

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
  const ga4Source = Ga4Sources.getByClient(client.id);
  res.json({
    ...client,
    keywords: Keywords.listByClient(client.id),
    competitors: Competitors.listByClient(client.id),
    ga4Source: ga4Source ? { property_id: ga4Source.property_id, hasCredentials: !!ga4Source.service_account_json } : null,
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

clientsRouter.post("/:id/competitors", (req, res) => {
  const client = Clients.get(req.params.id);
  if (!client) return res.status(404).json({ error: "not found" });
  const { name, domain } = req.body ?? {};
  if (!name || !domain) return res.status(400).json({ error: "name and domain are required" });
  res.status(201).json(Competitors.add(client.id, name.trim(), domain.trim()));
});

clientsRouter.delete("/competitors/:competitorId", (req, res) => {
  Competitors.remove(req.params.competitorId);
  res.status(204).end();
});

clientsRouter.post("/:id/suggest-keywords", async (req, res) => {
  const client = Clients.get(req.params.id);
  if (!client) return res.status(404).json({ error: "not found" });
  try {
    const result = await generateQuerySuggestions({ businessName: client.name, domain: client.brand_domain });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "failed to generate suggestions" });
  }
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
  res.json({ property_id: row.property_id, hasCredentials: !!row.service_account_json });
});
