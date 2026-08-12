# Backlog

Gate: `bash backlog/checks.sh` (= `npm test`, node --test tests/*.test.js — repo's only gate; no lint/typecheck scripts exist).

## Index

| Task | Title | Status |
|------|-------|--------|
| [TASK-01](TASK-01.md) | compress: strip HTML comments + SVG placeholders (issue #18) | done |
| [TASK-02](TASK-02.md) | prune: `--days <N>` age filter (issue #22) | done |
| [TASK-03](TASK-03.md) | label token counts as estimates | done |
| [TASK-04](TASK-04.md) | `.ctorc` shared config file for hook thresholds (issue #23) | done |

## Rev log

- **rev.1 — TASK-01** compress `stripMarkup`: HTML comments stripped (fences not exempt, pinned), `<svg>` blocks
  → `[SVG Asset]` (lazy match; nested-residue ceiling pinned; self-closing `<svg/>` hardened after critic pass —
  was silently eating content between a self-closing and a later paired svg). Runs first in `applyCompressionRules`.
  Proof: real `cto compress` subprocess on fixture — both changes reported, 62% reduction. Gate green (40 compress tests).
- **rev.2 — TASK-02** prune `--days <N>`: pure `isOlderThan` (lexicographic local `YYYY-MM-DD`, strictly-older,
  round-trip date validation), `findPruneTargets(content, {days})` optional param, `--days` CLI option +
  integer ≥ 1 validation exiting before any file I/O. Gotcha: no Date millisecond arithmetic — `new Date('Y-M-D')`
  parses UTC midnight (±14h boundary error). Proof: subprocess archived only the 60-day-old session; `--days 0`
  exits 1. Critic: APPROVE (2 cosmetic nits accepted). Gate green (380 tests, then 384 after TASK-01 hardening).
- **rev.3 — TASK-03** estimate labels: `~` prefix on every displayed token count (measure/watch/diff/compress +
  all 4 prune sites), estimate footnote on measure/diff/compress reports, README caveat; audit.js untouched —
  its strings serialize into `--json` (CI contract), verified byte-identical before/after. Gotcha: watch.test.js
  anchored `\d+ tokens` regexes needed `~?`, and each surface got a positive `~` assertion so the tilde is
  actually pinned. Critic: APPROVE; 2 cosmetic nits fixed post-approval (diff Added column alignment, compress
  footnote moved to report end), re-verified via real CLI. Gate green (396 tests, 0 failures).
- **rev.4 — holistic critic** (sonnet, full working-tree diff + backlog + skill files as one deliverable):
  APPROVE, zero blockers. Verified cross-command tilde/footnote consistency (footnote on measure/diff/compress,
  identical wording at report end; none on prune/watch by spec), paper-trail claims vs diff (396 tests re-run,
  audit.js structurally isolated, test-count deltas match), no debug leftovers. Nit 1 fixed: TASK-03.md
  "Files touched" still described the pre-fix footnote position ("precedes the branch"), contradicting its own
  changelog — reworded to match code. Nit 2 accepted, no change: the skills' "Parallelize & cost-optimize"
  section recommends opus for critic passes, which sits in tension with the sonnet-for-cost memory note; that
  note is scoped to autopilot routing, and the skill files live outside this repo — flagged to the user instead.
- **rev.5 — TASK-04** `.ctorc` shared config (issue #23): critiqued by codex (JSON v1) and `claude -p`
  (plain shell 2-tier, YAGNI-lens) — user picked the shell option. New `templates/hooks/lib/load-ctorc.sh`
  loader reads allowlisted `CTO_*` keys from `.ctorc` at cwd, env still overrides file (2-tier: env > file >
  default). Wired into `pre-tool-token-guard.sh` and `user-prompt-inject-context.sh`. Deferred: JSON, schema
  version, `--show-config`, CLI-flag tier, user-level config, nearest-lookup, monorepo tests — no confirmed
  pain beyond one commenter. TDD: 6 loader tests + 2 hook-integration tests, all RED before GREEN. Gate green
  (404 tests, 0 failures).
