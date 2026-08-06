# claude-mem setup

This repo vendors [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)
(v13.13.1) under `claude-mem/` for automation research.

## Setup performed

```bash
cd claude-mem
npm install
npm run build
npm run worker:start
npm run worker:status
```

`npm install` and `npm run build` completed successfully (`node_modules/` and
`dist/` are gitignored and not committed). The worker daemon starts
successfully and reports healthy status:

```
Worker is running
  PID: 7815
  Port: 37700
  Version: 13.13.1
```

`GET http://127.0.0.1:37700/health` returns `{"status":"ok", ...}`.

Note: `npm run worker:start` itself blocks in the foreground after spawning
the detached daemon — use `npm run worker:status` in a separate shell (or
after a few seconds) to confirm it's up.

## Claude Code setup

Separately from vendoring `claude-mem`, this repo is also set up to be
worked on with Claude Code itself. See `INSTALL.md` for CLI install steps,
`CLAUDE.md` for project instructions, and `.github/workflows/claude.yml` /
`.github/workflows/claude-code-review.yml` for the GitHub issue/PR
integration.
