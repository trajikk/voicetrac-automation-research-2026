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

# agent-reach setup

This repo also vendors [Panniantong/Agent-Reach](https://github.com/Panniantong/agent-reach)
(v1.5.0, MIT licensed) under `agent-reach/` for automation research. It's a
Python CLI that gives an agent read/search access to ~15 web platforms
(GitHub, YouTube, RSS, arbitrary web pages via Jina Reader, Bilibili, and
more behind optional extras) without paid API keys for the core channels.

Note: a second, unrelated repo (`EdisonChenAI/agent-reach`) exists with a
near-identical name and description. This vendors `Panniantong/Agent-Reach`
specifically — double-check before pulling in updates from anywhere else.

## Setup performed

```bash
cd agent-reach
python3 -m venv .venv
.venv/bin/pip install -e .
.venv/bin/agent-reach doctor
```

`pip install -e .` completed successfully (`.venv/` is gitignored and not
committed). `agent-reach doctor` confirms the CLI runs and reports which of
the ~15 channels are available out of the box:

```
Agent Reach v1.5.0
状态：4/15 个渠道可用
```

4 channels work with zero setup (GitHub via public API, RSS/Atom feeds,
arbitrary web pages via Jina Reader, V2EX). The rest need optional installs
(`yt-dlp`, `gh` CLI, `mcporter` + Exa API key, etc.) or platform credentials
— run `agent-reach setup` for the interactive wizard, or `agent-reach doctor`
to see the current gaps. No API keys or secrets were configured or committed
as part of this vendoring.
