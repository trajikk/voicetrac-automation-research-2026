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

# ruflo setup

[ruflo](https://github.com/ruvnet/ruflo) (published on npm as `ruflo`,
maintained by `ruvnet` under the `claude-flow` project) is installed globally
and registered as a project-scoped MCP server for Claude Code.

## Setup performed

```bash
npm install -g ruflo@latest
ruflo init
claude mcp add ruflo -- npx ruflo@latest mcp start   # already present via .mcp.json
```

`ruflo init` generated project files: `CLAUDE.md`, `.claude/settings.json`
(hooks, permissions, model/config overrides), `.claude/skills/`,
`.claude/commands/`, `.claude/agents/`, `.claude/helpers/`, `.mcp.json`
(registers the `claude-flow` MCP server), and `.claude-flow/` (runtime
config). Runtime/log data under `.claude-flow/data|logs|sessions/`, the
swarm SQLite state in `.swarm/`, and `ruvector.db` are gitignored and not
committed.

Note: `.claude/settings.json` installs Claude Code hooks that run on every
prompt (`UserPromptSubmit`), every `Bash`/`Write`/`Edit` tool call
(pre/post), and session start/end/compact events, dispatching to
`.claude/helpers/hook-handler.cjs`. This was an explicit choice to keep
ruflo's full intended behavior rather than a stripped-down MCP-only
install.

The MCP server (`npx ruflo@latest mcp start`, exposing ~314 tools) is
registered via `.mcp.json` at project scope. New Claude Code sessions
opened against this repo will show it as "⏸ Pending approval" until a user
approves it interactively.
