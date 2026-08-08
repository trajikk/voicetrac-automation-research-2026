import { google } from "googleapis";
import type { Ga4Summary } from "../types.js";

const AI_REFERRAL_HOSTS = [
  "chatgpt.com",
  "chat.openai.com",
  "perplexity.ai",
  "gemini.google.com",
  "copilot.microsoft.com",
  "claude.ai",
];

// Uses the GA4 Data API (https://developers.google.com/analytics/devguides/reporting/data/v1)
// via a per-client service account JSON that has "Viewer" access granted on the
// client's GA4 property (Admin > Property Access Management in GA4).
export async function fetchGa4Summary(args: {
  propertyId: string;
  serviceAccountJson: string | null;
  days?: number;
}): Promise<Ga4Summary> {
  const days = args.days ?? 28;
  const rangeEnd = new Date();
  const rangeStart = new Date(rangeEnd.getTime() - days * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  if (!args.serviceAccountJson) {
    return mockGa4Summary(args.propertyId, fmt(rangeStart), fmt(rangeEnd), days);
  }

  const credentials = JSON.parse(args.serviceAccountJson);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
  });
  const analyticsData = google.analyticsdata({ version: "v1beta", auth });

  const [totalsResp, sourceResp, dailyResp] = await Promise.all([
    analyticsData.properties.runReport({
      property: `properties/${args.propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: fmt(rangeStart), endDate: fmt(rangeEnd) }],
        metrics: [{ name: "sessions" }, { name: "totalUsers" }, { name: "conversions" }],
      },
    }),
    analyticsData.properties.runReport({
      property: `properties/${args.propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: fmt(rangeStart), endDate: fmt(rangeEnd) }],
        dimensions: [{ name: "sessionSource" }],
        metrics: [{ name: "sessions" }],
        limit: "50",
      },
    }),
    analyticsData.properties.runReport({
      property: `properties/${args.propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: fmt(rangeStart), endDate: fmt(rangeEnd) }],
        dimensions: [{ name: "date" }, { name: "sessionSource" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
        limit: "10000",
      },
    }),
  ]);

  const totalsRow = totalsResp.data.rows?.[0]?.metricValues ?? [];
  const totalSessions = Number(totalsRow[0]?.value ?? 0);
  const totalUsers = Number(totalsRow[1]?.value ?? 0);
  const conversions = Number(totalsRow[2]?.value ?? 0);

  const aiReferralBySource: Record<string, number> = {};
  for (const row of sourceResp.data.rows ?? []) {
    const source = row.dimensionValues?.[0]?.value ?? "";
    const sessions = Number(row.metricValues?.[0]?.value ?? 0);
    if (AI_REFERRAL_HOSTS.some((host) => source.toLowerCase().includes(host))) {
      aiReferralBySource[source] = (aiReferralBySource[source] ?? 0) + sessions;
    }
  }
  const aiReferralSessions = Object.values(aiReferralBySource).reduce((a, b) => a + b, 0);

  const byDate = new Map<string, { sessions: number; aiSessions: number }>();
  for (const row of dailyResp.data.rows ?? []) {
    const rawDate = row.dimensionValues?.[0]?.value ?? "";
    const date = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
    const source = row.dimensionValues?.[1]?.value ?? "";
    const sessions = Number(row.metricValues?.[0]?.value ?? 0);
    const entry = byDate.get(date) ?? { sessions: 0, aiSessions: 0 };
    entry.sessions += sessions;
    if (AI_REFERRAL_HOSTS.some((host) => source.toLowerCase().includes(host))) entry.aiSessions += sessions;
    byDate.set(date, entry);
  }
  const sessionsBySourceDaily = [...byDate.entries()]
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    propertyId: args.propertyId,
    rangeStart: fmt(rangeStart),
    rangeEnd: fmt(rangeEnd),
    totalSessions,
    totalUsers,
    conversions,
    aiReferralSessions,
    aiReferralBySource,
    sessionsBySourceDaily,
    mocked: false,
  };
}

function mockGa4Summary(propertyId: string, rangeStart: string, rangeEnd: string, days: number): Ga4Summary {
  const sessionsBySourceDaily: Ga4Summary["sessionsBySourceDaily"] = [];
  let base = 220;
  for (let i = 0; i < days; i++) {
    const date = new Date(Date.parse(rangeStart) + i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    base += Math.round((Math.sin(i / 3) + 1) * 15 - 10 + i * 0.8);
    const sessions = Math.max(40, base);
    const aiSessions = Math.max(0, Math.round(sessions * (0.04 + i * 0.003)));
    sessionsBySourceDaily.push({ date, sessions, aiSessions });
  }
  const totalSessions = sessionsBySourceDaily.reduce((a, b) => a + b.sessions, 0);
  const aiReferralSessions = sessionsBySourceDaily.reduce((a, b) => a + b.aiSessions, 0);
  return {
    propertyId: propertyId || "(demo property)",
    rangeStart,
    rangeEnd,
    totalSessions,
    totalUsers: Math.round(totalSessions * 0.82),
    conversions: Math.round(totalSessions * 0.031),
    aiReferralSessions,
    aiReferralBySource: {
      "chatgpt.com / referral": Math.round(aiReferralSessions * 0.55),
      "perplexity.ai / referral": Math.round(aiReferralSessions * 0.3),
      "gemini.google.com / referral": Math.round(aiReferralSessions * 0.15),
    },
    sessionsBySourceDaily,
    mocked: true,
  };
}
