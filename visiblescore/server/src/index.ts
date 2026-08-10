import "dotenv/config";
import express from "express";
import cors from "cors";
import { clientsRouter } from "./routes/clients.js";
import { reportsRouter } from "./routes/reports.js";
import { settingsRouter } from "./routes/settings.js";
import { schedulerRouter } from "./routes/scheduler.js";
import { startAutoReportScheduler } from "./services/scheduler.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/clients", clientsRouter);
app.use("/api", reportsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/scheduler", schedulerRouter);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message ?? "internal error" });
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`VisibleScore server listening on http://localhost:${port}`);
  startAutoReportScheduler();
});
