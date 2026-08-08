import { Router } from "express";
import { Settings } from "../db/index.js";

export const settingsRouter = Router();

settingsRouter.get("/", (_req, res) => {
  res.json(Settings.get());
});

settingsRouter.put("/", (req, res) => {
  const { agency_name, logo_data_url, primary_color } = req.body ?? {};
  if (!agency_name || typeof agency_name !== "string") {
    return res.status(400).json({ error: "agency_name is required" });
  }
  const row = Settings.upsert({
    agency_name: agency_name.trim(),
    logo_data_url: typeof logo_data_url === "string" && logo_data_url ? logo_data_url : null,
    primary_color: typeof primary_color === "string" && primary_color ? primary_color : "#6d5ff5",
  });
  res.json(row);
});
