# Twenty CRM setup

This repo installs [twentyhq/twenty](https://github.com/twentyhq/twenty) (Twenty
CRM, the open-source Salesforce/HubSpot alternative) under `twenty-crm/` for
automation research, self-hosted via its official Docker Compose stack rather
than vendored as source — Twenty ships prebuilt images for self-hosting and
its monorepo is not meant to be run from source in production.

## What's in `twenty-crm/`

- `docker-compose.yml` — unmodified copy of upstream
  `packages/twenty-docker/docker-compose.yml` (server, worker, postgres, redis).
- `docker-compose.override.yml` — **sandbox-only**. Anonymous `docker pull`
  against `registry-1.docker.io` is rate-limited (HTTP 429) from this
  environment's shared egress IP, so this override repoints the three
  upstream images at `mirror.gcr.io` (Google's public read-through cache of
  Docker Hub), which isn't subject to that limit. On a normal host with
  unrestricted Docker Hub access, delete this file and the stock upstream
  images are used.
- `.env.example` — unmodified copy of upstream `.env.example`.
- `.env` — generated locally (gitignored, not committed) with a random
  `ENCRYPTION_KEY` and `PG_DATABASE_PASSWORD`, per upstream's own
  `scripts/install.sh` (`openssl rand -base64 32` / `openssl rand -hex 32`).

## Setup performed

```bash
mkdir twenty-crm && cd twenty-crm
# docker-compose.yml + .env.example copied from twentyhq/twenty's
# packages/twenty-docker/ (same content curl'd by upstream's install.sh)

cp .env.example .env
echo "ENCRYPTION_KEY=$(openssl rand -base64 32)" >> .env
echo "PG_DATABASE_PASSWORD=$(openssl rand -hex 32)" >> .env

docker compose up -d
```

The Docker daemon isn't started by default in this environment; it was
started manually (`dockerd &`) and picked up the session's `HTTPS_PROXY` so
image-manifest requests route through the agent proxy. Image pulls for
`twentycrm/twenty:latest`, `postgres:16`, and `redis` were rate-limited at
`registry-1.docker.io` (429), so they were pulled from `mirror.gcr.io`
instead (see `docker-compose.override.yml` above).

## Verified running

```
NAME              IMAGE                                   STATUS
twenty-db-1       mirror.gcr.io/library/postgres:16       Up (healthy)
twenty-redis-1    mirror.gcr.io/library/redis              Up (healthy)
twenty-server-1   mirror.gcr.io/twentycrm/twenty:latest    Up (healthy)
twenty-worker-1   mirror.gcr.io/twentycrm/twenty:latest    Up
```

`curl http://localhost:3000/healthz` returns
`{"status":"ok","info":{},"error":{},"details":{}}`, and `GET /` returns
`HTTP 200` (the Twenty frontend). The worker container processes its BullMQ
cron queue normally (`WorkflowCronTriggerCronJob`, `CronTriggerCronJob`,
etc.) with no workspaces yet since no account has been created.

Note: the worker logs one benign `WARN` from `MarketplaceCatalogSyncCronJob`
— it can't verify TLS for `registry.npmjs.org` from inside the container
(containers in this sandbox can't reach the host's agent proxy or trust its
CA, per `/root/.ccr/README.md`). This only affects the optional marketplace
app-catalog sync, not core CRM functionality.

## Using it

Open `http://localhost:3000` in a browser to go through first-run signup and
create the initial workspace/account. Data persists in the `twenty_db-data`
and `twenty_server-local-data` Docker volumes across `docker compose
restart`.

```bash
cd twenty-crm
docker compose ps        # status
docker compose logs -f   # tail all services
docker compose down      # stop (add -v to also wipe volumes/data)
```
