# token-reducer setup

This repo vendors [Madhan230205/token-reducer](https://github.com/Madhan230205/token-reducer)
(v1.4.0, MIT licensed) under `token-reducer/` for automation research. It's a
local-first Claude Code plugin for context compression and token reduction,
using hybrid retrieval (BM25 + vectors), reranking, and AST-aware chunking.

## Setup performed

Installed as a real Claude Code plugin via its own marketplace (same pattern
as the `superpowers` install in this repo):

```bash
claude plugin marketplace add Madhan230205/token-reducer
claude plugin install claude-token-reducer@Madhan230205-claude-token-reducer
```

```
√ Successfully added marketplace: Madhan230205-claude-token-reducer (declared in user settings)
√ Successfully installed plugin: claude-token-reducer@Madhan230205-claude-token-reducer (scope: user)
```

The vendored copy under `token-reducer/` is the plugin source (hooks,
skills, agents, commands, Rust/Python core) at the same version, kept for
reference alongside the live installed plugin.

Optional extras (ML reranking, tree-sitter AST chunking) require
`pip install -e ".[full]"` inside `token-reducer/` — not installed here to
keep the base install lightweight. `.env.example` shows an optional
`CONTEXT7_API_KEY` for improved docs-lookup rate limits; no keys were
configured or committed.
