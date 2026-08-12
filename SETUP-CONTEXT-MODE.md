# context-mode setup

This repo vendors [mksglu/context-mode](https://github.com/mksglu/context-mode)
(v1.0.169, Elastic-2.0 licensed) under `context-mode/` for automation
research. It's an MCP plugin (works with Claude Code, Gemini CLI, VS Code
Copilot, OpenCode, and Codex CLI) that aims to save most of a session's
context window via sandboxed code execution, an FTS5/BM25 knowledge base,
and intent-driven search instead of dumping raw file/command output into
context.

## Setup performed

Installed as a real Claude Code plugin via its own marketplace (same
pattern as `token-reducer` and `superpowers` in this repo):

```bash
claude plugin marketplace add mksglu/context-mode
claude plugin install context-mode@context-mode
```

```
√ Successfully added marketplace: context-mode (declared in user settings)
√ Successfully installed plugin: context-mode@context-mode (scope: user)
```

The vendored copy under `context-mode/` is the plugin source (TypeScript
under `src/`, prebuilt `cli.bundle.mjs`/`server.bundle.mjs`, hooks, skills,
adapters for other agent runtimes) at the same version, kept for reference
alongside the live installed plugin. `node_modules/` is gitignored and not
committed. No API keys or secrets required.
