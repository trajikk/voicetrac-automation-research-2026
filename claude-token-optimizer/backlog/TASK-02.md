# TASK-02 [prune] — `--days <N>` age filter (issue #22)

Owner: claude · Wave: rev.1 · Deps: none
Footprint: `src/commands/prune.js`, `src/cli.js`, `tests/prune*.test.js` — disjoint from TASK-01 (compress.js) → ran in parallel with it.

<context>
Issue #22: `cto prune --yes` is interactive-first; CI/cron users want age-based non-interactive pruning.
Ask: `--days <count>` combined with `--yes` auto-archives session notes older than N days.
Out of scope: duration syntax (`30d`), mtime-based aging of completed/empty sections.
</context>

<decisions>
- `--days <N>` = plain integer flag (no duration parser, YAGNI). When set, prune targets ONLY date-headed
  session sections whose heading date is strictly older than N days; completed/empty sections excluded in
  this mode (cron safety — age-scoped runs touch only what's provably old).
  Rejected: mtime for completed/empty — sections have no per-section mtime; heading date is the only truthful age signal.
- Boundary: strictly older — a section dated exactly N days ago is KEPT.
- Timezone-free comparison: cutoff = now − N days formatted `YYYY-MM-DD`, compared lexicographically against
  the heading's leading date. No Date millisecond arithmetic (`new Date('2026-06-07')` parses UTC midnight → ±14h boundary error).
- Validity: shape-valid but impossible dates (`2026-99-99`) are never "old" — Date round-trip validation; malformed → excluded.
- `--days 0` / NaN / negative → clear error (integer ≥ 1).
- Contract: pure exported `isOlderThan(heading, days, now = new Date())` (injected `now` like `buildWatchDisplay`);
  `findPruneTargets(content, options?)` optional second param — all existing one-arg call sites stay valid.
- Help text discloses narrowed scope: `--days <count>` "prune only dated session notes older than N days".
</decisions>

<preflight>
```bash
grep -n "days" src/commands/prune.js src/cli.js   # 0 before
```
</preflight>

<tdd>
Unit — `isOlderThan`: older → true, newer → false, exactly N days → false, malformed (`2026-99-99`) → false,
all with injected `now`. `findPruneTargets(content, {days})` returns only old sessions, excludes completed/empty.
Integration — temp dir, `pruneCommand({ yes: true, days: 30, backup: false })` archives 60-day-old session to
`.claude/sessions/archive/`, leaves fresh session + `## Completed` intact. Red (right reason) → green.
Behavior: real subprocess `node bin/cto.js prune --yes --days 30 --no-backup`.
</tdd>

<dod>
- [x] pure logic unit-tested (red→green)
- [x] real CLI exercised (subprocess run), output pasted below
- [x] full suite green via backlog/checks.sh
- [x] ceilings named, not gold-plated
</dod>

<ac>
- ac(workspace): `bash backlog/checks.sh` green.
- ac(behavior): temp project with old + fresh dated sections + `## Completed` → `node bin/cto.js prune --yes --days 30 --no-backup` archives only the old session; CLAUDE.md keeps fresh + Completed.
- ac(gates): `bash backlog/checks.sh` → 0 failures.
</ac>

<changelog>

Files touched:
- src/commands/prune.js — added `isOlderThan(heading, days, now)`, `formatLocalDate`, `isValidDateString`,
  `validateDays(value)`; threaded optional `{ days, now }` through `findPruneTargets`; validated `options.days`
  and threaded it through `loadTargets` in `pruneCommand`.
- src/cli.js — added `.option('--days <count>', 'prune only dated session notes older than N days')` to the
  `prune` command block (no other lines touched).
- tests/prune.test.js — added `isOlderThan` import + unit describe block (older/newer/exact-boundary/malformed),
  a `findPruneTargets` with `{ days }` describe block, and one integration test exercising
  `pruneCommand({ yes: true, days: 30, backup: false })` against dynamically-computed old/fresh dated sections.

Red run (before implementation — module failed to load, right reason: missing export):
```
file:///.../tests/prune.test.js:15
  isOlderThan,
  ^^^^^^^^^^^
SyntaxError: The requested module '../src/commands/prune.js' does not provide an export named 'isOlderThan'
✖ tests/prune.test.js (45.926125ms)
ℹ tests 1
ℹ pass 0
ℹ fail 1
```

Green run (tests/prune.test.js, after implementation):
```
ℹ tests 42
ℹ suites 12
ℹ pass 42
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

Full suite (`npm test`): 380 pass, 0 fail (baseline was 337 pass / 1 fail in compress.test.js — out of scope,
owned by the parallel TASK-01 agent; resolved independently by the time of this run).

Subprocess proof — success path (fixture: old 2026-05-01 session, fresh 2026-07-06 session, `## Completed`):
```
$ node bin/cto.js prune --yes --days 30 --no-backup
Found 1 item to prune:
  [1] Section "2026-05-01" (line 3, 18 tokens)
      → Archive to .claude/sessions/archive/
      Archived → .claude/sessions/archive/2026-07-07-pruned-2026-05-01.md
✓ Saved 18 tokens — CLAUDE.md now 30 tokens (was 50)
```
CLAUDE.md after: keeps `## 2026-07-06` and `## Completed`; `## 2026-05-01` removed and archived under
`.claude/sessions/archive/`.

Subprocess proof — error path:
```
$ node bin/cto.js prune --yes --days 0 --no-backup
✗ Invalid --days value: must be an integer >= 1.
exit code: 1
```
Also verified `--days -5`, `--days abc`, `--days 3.5` all print the same error and exit 1.

Ceilings (named):
- `--days` scope is intentionally narrower than plain `prune`: it targets ONLY date-headed session sections;
  `## Completed` and empty sections are excluded by design (cron safety — heading date is the only truthful
  age signal available; completed/empty sections have no per-section mtime).
- No duration-string parsing (`30d`, `2w`, etc.) — plain positive integer only (YAGNI, matches locked spec).
- Age comparison is date-only (day granularity via lexicographic `YYYY-MM-DD` string comparison), not
  timestamp/mtime-based — a section dated exactly N days ago is kept (strictly-older boundary).
- No `~` prefix on archived/output paths — deferred to a later task per instructions.

Critic pass (opus): APPROVE, no blockers. Two nits accepted as-is: (1) `validateDays` accepts non-canonical
integer literals (`1e2`, `0x1f`, `'01'`, `' 5 '`) — all resolve to genuine integers ≥ 1, spec's failure cases
(0/NaN/negative/non-integer) all correctly rejected; strict canonical-decimal regex not required. (2) `options.days`
flows as a string and relies on `-` operator coercion in the cutoff arithmetic — behavior verified correct.
Critic verified empirically: local-date formatting (no toISOString skew), round-trip rejection of `2026-99-99`,
strict-older boundary, exit(1) before any file I/O, 17 pre-existing prune tests unmodified and green.
</changelog>
