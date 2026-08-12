# TASK-04: `.ctorc` shared config file for hook thresholds (issue #23)

## Status: done

## Source
https://github.com/nadimtuhin/claude-token-optimizer/issues/23

## Scope decision
Two critiques run before implementing (codex + `claude -p`): codex recommended a
minimal JSON `.ctorc.json` v1; `claude -p` argued the commenter's full 5-tier
spec (CLI>env>project>user>defaults, `--show-config`, versioned schema,
monorepo tests) is over-engineered for 13 env vars read inline by bash hooks,
and that if anything ships it should be a 2-tier plain-`KEY=value` file with
zero parser dependency. User picked the shell-based 2-tier option.

**v1 shipped:** single `.ctorc` file at repo root, `KEY=value` lines (`#`
comments, blank lines ok). Only `CTO_WARN_TOKENS`, `CTO_BLOCK_TOKENS`,
`CTO_LEARNINGS_DIR` recognized — unknown keys silently ignored (no `eval`
injection surface, no code exec). Precedence: env > `.ctorc` > hook default
(unchanged from before). Wired into `pre-tool-token-guard.sh` and
`user-prompt-inject-context.sh` — the two hooks that read those 3 vars.

**Deferred (explicitly out of scope):** JSON, schema versioning, `--show-config`,
CLI-flag tier, `~/.ctorc` user-level config, nearest-project directory walk,
monorepo test matrix. Add any of these only when a real user hits the wall —
env vars already give CLI/shell/direnv layering for free; the only confirmed
gap was "can't commit shared thresholds to git."

## Implementation
- `templates/hooks/lib/load-ctorc.sh` — new shared loader, sourced by hooks.
  Reads `.ctorc` from cwd if present, applies only allowlisted `CTO_*` keys,
  never clobbers an already-exported env var (env > file precedence).
- `templates/hooks/pre-tool-token-guard.sh` — sources the loader before
  reading `CTO_WARN_TOKENS`/`CTO_BLOCK_TOKENS`.
- `templates/hooks/user-prompt-inject-context.sh` — sources the loader before
  reading `CTO_LEARNINGS_DIR`.

## Tests
- `tests/ctorc.test.js` (new, 6 tests): loader behavior in isolation — no
  `.ctorc` present, KEY=value parsing, env-overrides-file precedence, comments/
  blank lines ignored, unknown keys ignored, no-op when file absent.
- `tests/hook-scripts.test.js` (+2 tests): `pre-tool-token-guard.sh` end-to-end
  — `.ctorc`-only threshold triggers the warning; env var still overrides it.

## Proof
`npm test`: 404/404 passing (396 baseline + 8 new). `bash backlog/checks.sh`:
green. No existing hook behavior changed for users who never create a
`.ctorc` (loader is a no-op — file absent, block silently skipped).

## Gotchas
- Hooks are invoked with the caller's cwd as the working dir already (existing
  `docs/learnings` default relies on this), so `.ctorc` at cwd root — no path
  resolution logic needed beyond what already existed.
- Used `eval` only to read/set a var by a name drawn from an allowlist
  (never from unsanitized file content) — avoids introducing an injection
  vector while keeping the loader POSIX-sh-compatible (no bash arrays needed).
