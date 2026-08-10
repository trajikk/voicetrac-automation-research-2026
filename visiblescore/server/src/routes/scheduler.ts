import { Router } from "express";
import { runScheduledReports } from "../services/scheduler.js";

export const schedulerRouter = Router();

// Manually kicks the same due-check the hourly scheduler runs — useful for demoing
// auto-reports without waiting, or forcing a catch-up run.
schedulerRouter.post("/run-now", async (_req, res) => {
  try {
    const summary = await runScheduledReports();
    res.json(summary);
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "scheduler run failed" });
  }
});
