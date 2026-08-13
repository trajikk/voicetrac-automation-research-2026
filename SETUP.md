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

# mcp-apple-notes setup

This repo also vendors [RafalWilinski/mcp-apple-notes](https://github.com/RafalWilinski/mcp-apple-notes)
under `mcp-apple-notes/`. It's a Model Context Protocol server that gives
Claude Desktop semantic search / RAG over Apple Notes, using on-device
`all-MiniLM-L6-v2` embeddings (via `@huggingface/transformers`), LanceDB for
vector storage, and JXA (JavaScript for Automation) to talk to the Notes.app
on macOS.

## Setup performed

```bash
cd mcp-apple-notes
bun install
bun pm trust onnxruntime-node protobufjs   # blocked postinstall scripts, both standard for these packages
npx tsx index.test.ts
```

`bun install` and `bun build index.ts --outdir dist --target node` both
completed successfully (`node_modules/` and `dist/` are gitignored via the
vendored `mcp-apple-notes/.gitignore` and not committed). The test suite
passes everything that doesn't require live macOS Notes access:

```
# tests 4
# pass 3
# fail 0
# skipped 1   (the real-Notes indexing test, skipped when JXA/osascript isn't available)
```

Table creation, embedding, and vector search all work as-is on Linux since
they don't touch macOS APIs.

## Known gap: this is a macOS-only tool at runtime

This container is Linux, so the server was verified to install, build, and
pass its non-macOS tests, but it was **not** run end-to-end as a live MCP
server here:

- The Apple Notes read/write tools shell out to `osascript`/JXA against
  Notes.app, which only exists on macOS. There is no Notes app to index in
  this sandbox.
- On first run the server downloads the `all-MiniLM-L6-v2` embeddings model
  from Hugging Face; in this sandbox that download hit `ECONNRESET` through
  the environment's outbound proxy (`bun`'s fetch vs. the proxy), even
  though plain `curl` to the same host worked. On a real machine with normal
  network access this is expected to succeed as documented upstream.

To actually use it, follow the upstream README on a Mac: install Bun and
Claude Desktop, then point `claude_desktop_config.json`'s `mcpServers` entry
at this vendored `mcp-apple-notes/index.ts` with the local `bun` binary path.
No API keys or secrets were configured or committed as part of this
vendoring.
