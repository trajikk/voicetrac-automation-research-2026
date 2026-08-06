# Installing Claude Code

## CLI (local development)

```bash
npm install -g @anthropic-ai/claude-code
```

Then authenticate:

```bash
claude
```

and follow the login prompt (or set `ANTHROPIC_API_KEY` for API-key auth).
See https://docs.claude.com/en/docs/claude-code for full setup docs.

## Project config

This repo ships a `.claude/settings.json` with recommended permissions for
working here. Running `claude` from the repo root picks it up
automatically — no extra install step needed.

## GitHub integration (issues/PRs)

`.github/workflows/claude.yml` and `.github/workflows/claude-code-review.yml`
run Claude Code in CI via [`anthropics/claude-code-action`](https://github.com/anthropics/claude-code-action).
They require a `CLAUDE_CODE_OAUTH_TOKEN` (or `ANTHROPIC_API_KEY`) repository
secret:

```bash
claude setup-token
```

then add the printed token as the `CLAUDE_CODE_OAUTH_TOKEN` secret under
this repo's Settings → Secrets and variables → Actions.
