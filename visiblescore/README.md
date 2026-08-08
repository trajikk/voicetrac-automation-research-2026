# VisibleScore

A self-hosted dashboard for agencies to track a client's visibility in AI search
(ChatGPT, Perplexity, Google AI Overviews) alongside real Google Analytics 4 traffic,
and generate a branded PDF report you can email straight from the dashboard.

Runs entirely with demo/mock data out of the box — no API keys required to try it.
Add real credentials per source when you're ready to run it on an actual client.

## What it does

- **Add a client** — name, contact email, brand domain.
- **Add search terms** to track (e.g. "best roofing company near me").
- **Connect that client's GA4 property** (optional — falls back to demo traffic data).
- **Generate Report**: scans every tracked term against ChatGPT, Perplexity, and
  Google AI Overviews for brand mentions/citations, pulls GA4 sessions/users/conversions
  and AI-referral traffic, and renders a branded PDF with a visibility score, per-platform
  breakdown, a term-by-term mention table, and a traffic trend chart.
- **Email the report** to the client's contact directly from the dashboard.
- Every report is stored, so each new one shows score change vs. the last one.

## Architecture

```
visiblescore/
  server/   Express + TypeScript API, SQLite (better-sqlite3), Puppeteer for PDF rendering
  client/   React + Vite dashboard
```

- `server/src/integrations/` — one file per data source (`ga4.ts`, `perplexity.ts`,
  `chatgpt.ts`, `googleAiOverview.ts`). Each falls back to deterministic mock data when
  its API key is unset, so the app is fully runnable without any credentials.
- `server/src/services/visibilityScanner.ts` — runs every tracked keyword against all
  three AI platforms and computes the visibility score.
- `server/src/services/reportGenerator.ts` — renders `templates/report.hbs` to HTML,
  then to PDF via headless Chromium (Puppeteer).
- `server/src/services/emailer.ts` — sends the PDF via SMTP (nodemailer); no-ops with a
  clear message if SMTP isn't configured.

## Running it locally

Requires Node 20+.

```bash
# Terminal 1 — API server (port 4000)
cd server
npm install
cp .env.example .env   # optional — works without editing it
npm run dev

# Terminal 2 — dashboard (port 5173, proxies /api to the server)
cd client
npm install
npm run dev
```

Open http://localhost:5173, add a client, add a couple of search terms, and click
**Generate Report**. With no API keys configured you'll get a fully working report
built from mock data — this is the fastest way to see the whole pipeline.

## Connecting real data sources

Each source is optional and independent — connect only what you need. Set values in
`server/.env`.

### Google Analytics 4 (real traffic + AI-referral data)

1. In Google Cloud Console, create a service account and download its JSON key.
2. In each client's GA4 property: **Admin → Property Access Management → Add users**,
   grant that service account's email **Viewer** access.
3. In the dashboard, open the client, paste the GA4 **Property ID** (the numeric ID,
   not `properties/123...`) and the service account JSON into the GA4 Source form.

No global env var needed — GA4 credentials are stored per-client since every client has
their own property and grants access to your service account individually.

Uses the [GA4 Data API](https://developers.google.com/analytics/devguides/reporting/data/v1).
AI-referral traffic is estimated by matching `sessionSource` against known AI platform
domains (chatgpt.com, perplexity.ai, gemini.google.com, etc.) — a reasonable proxy, since
none of these platforms send a distinct UTM by default.

### Perplexity (accurate — live web search + citations)

Set `PERPLEXITY_API_KEY` ([get one here](https://www.perplexity.ai/settings/api)).
Perplexity's API performs a real web search per query and returns citation URLs, so this
check is a direct, accurate read of whether the client's domain gets cited — not an
approximation.

### ChatGPT (best-effort approximation)

Set `OPENAI_API_KEY` ([get one here](https://platform.openai.com/api-keys)).

**Caveat:** OpenAI has no API that reproduces the consumer ChatGPT app, which blends
live browsing, memory, and a proprietary retrieval stack you can't call directly. This
uses the web-search-enabled Chat Completions model as the closest available proxy for
"would ChatGPT's browsing surface this brand." Treat results as directional signal, not
a literal transcript of what a ChatGPT user would see.

### Google AI Overviews (requires a third-party SERP service)

Set `SERPAPI_KEY` ([get one here](https://serpapi.com)). Google has no official API for
AI Overviews, so this uses SerpAPI — a third-party, ToS-compliant SERP data service — to
fetch the AI Overview content when Google renders one for a query.

### Email delivery

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and optionally `SMTP_FROM` in
`server/.env`. Works with any SMTP provider (Gmail app password, Postmark, SendGrid SMTP,
etc.). Without these set, "Email to Client" fails with a clear message and the report
stays downloadable as a PDF from the dashboard.

## Notes on scanning cadence

`Generate Report` runs synchronously when clicked — fine for on-demand use. For running
this against many clients on a schedule (e.g. weekly), the natural next step is a cron
job or scheduled task that calls `POST /api/clients/:id/reports` per client and emails
the result automatically.

## Data storage

SQLite database and generated PDFs live under `server/data/` (gitignored). Back that
directory up if you want report history to survive a redeploy — there's no external
database dependency to run this.
