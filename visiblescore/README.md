# VisibleScore

A self-hosted dashboard for agencies to track a client's visibility in AI search
(ChatGPT, Perplexity, Google AI Overviews) alongside real Google Analytics 4 traffic,
and generate a branded PDF report you can email straight from the dashboard.

Runs entirely with demo/mock data out of the box — no API keys required to try it.
Add real credentials per source when you're ready to run it on an actual client.

Modeled after the AI-visibility category (Ziptie, Profound, Otterly.ai, Peec AI) —
same core mechanics (multi-platform mention/citation tracking, competitor share-of-voice,
sentiment, content-gap recommendations), plus GA4 traffic correlation and branded
PDF/email delivery, which most of them don't do natively.

## What it does

- **Add a client** — name, contact email, brand domain.
- **Add search terms** to track (e.g. "best roofing company near me"), or click
  **Suggest search terms from website** to auto-generate a candidate list from the
  client's homepage content.
- **Track competitors** — add named competitor domains; every scan checks who else
  shows up in the same AI answers.
- **Connect the client's GA4 property** (optional — falls back to demo traffic data).
- **Generate Report**: scans every tracked term against ChatGPT, Perplexity, and
  Google AI Overviews, checking a single AI response per term for every tracked entity
  (client + competitors) at once. Produces:
  - Overall visibility score + per-platform mention breakdown
  - Competitive leaderboard (mention rate, client vs. each competitor)
  - Sentiment breakdown of the client's mentions (positive/neutral/negative)
  - Content gaps — terms where competitors get cited and the client doesn't, with a
    one-line recommendation per gap
  - GA4 traffic (sessions/users/conversions) and AI-referral sessions, with a trend chart
  - Score change vs. the previous report
- **Email the report** to the client's contact directly from the dashboard.
- **Export** the full underlying scan data (every platform response, every entity's
  mention/position/sentiment) as CSV or JSON — not just the summarized PDF.
- **Auto-report cadence** — set a client to Weekly or Monthly and an hourly background
  scheduler generates and emails their report automatically, no manual clicks. New
  clients with a cadence set get their first report on the next scheduler tick.
- **White-label branding** — set your agency name, logo, and primary color once in
  Branding settings; it appears in the dashboard sidebar, on every PDF report's header
  and footer, and as the sender name on report emails. Resell this under your own brand.
- **Score trend** — every client card shows a mini trend sparkline and current score as
  a progress ring; the client detail page has a full trend chart across report history.

## Architecture

```
visiblescore/
  server/   Express + TypeScript API, SQLite (better-sqlite3), Puppeteer for PDF rendering
  client/   React + Vite dashboard
```

- `server/src/integrations/` — one file per AI platform (`perplexity.ts`, `chatgpt.ts`,
  `googleAiOverview.ts`) plus `ga4.ts`. Each platform integration fetches **one raw
  response per keyword** and falls back to deterministic mock data when its API key is
  unset, so the app is fully runnable without any credentials.
- `server/src/integrations/mentionDetect.ts` — checks a raw response for a single
  entity's (client or competitor) domain/name mentions and citation position.
- `server/src/services/visibilityScanner.ts` — orchestrates the scan: fetches each
  platform response once per keyword, then checks it against every tracked entity
  (client + competitors), computing the score and a mention-rate leaderboard.
- `server/src/services/sentimentAnalyzer.ts` — classifies the tone of each mention
  (OpenAI-backed when `OPENAI_API_KEY` is set, lexicon heuristic fallback otherwise).
- `server/src/services/queryGenerator.ts` — fetches the client's homepage and proposes
  tracked-term suggestions (OpenAI-backed, template fallback otherwise).
- `server/src/services/contentGap.ts` — flags terms where competitors are cited and the
  client isn't, with a generated recommendation per gap.
- `server/src/services/reportGenerator.ts` — renders `templates/report.hbs` to HTML,
  then to PDF via headless Chromium (Puppeteer).
- `server/src/services/exportReport.ts` — builds the full entity-level export (CSV/JSON).
- `server/src/services/emailer.ts` — sends the PDF via SMTP (nodemailer), using agency
  branding as the sender name; no-ops with a clear message if SMTP isn't configured.
- `server/src/services/scheduler.ts` — hourly due-check against each client's
  `auto_report_frequency`; generates and emails reports for clients that are due.
  `POST /api/scheduler/run-now` triggers the same check on demand.
- `server/src/db/index.ts` — SQLite schema/accessors, including `agency_settings`
  (singleton row for white-label branding) and `auto_report_frequency` on clients.

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

### White-label branding

No env var needed — set it from the dashboard's **Branding** page (agency name, logo,
primary color). Applied automatically to the sidebar, PDF report header/footer, and the
sender name on report emails. This is what makes the tool resellable as your own product
rather than looking like a third-party vendor's report.

### Auto-report scheduling

Set a client's cadence from **Off/Weekly/Monthly** pills on their detail page — no env
var or cron setup needed. The server runs an hourly in-process check (`server/src/services/scheduler.ts`)
against each client's last report date; anything due gets a fresh report generated and
emailed automatically. `POST /api/scheduler/run-now` triggers the same check immediately,
useful for testing or forcing a catch-up run without waiting for the next hourly tick.

## Data storage

SQLite database and generated PDFs live under `server/data/` (gitignored). Back that
directory up if you want report history to survive a redeploy — there's no external
database dependency to run this.
