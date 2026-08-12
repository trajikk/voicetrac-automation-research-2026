# TASK-03 [reporting] — label token counts as estimates

Owner: claude · Wave: rev.1 · Deps: TASK-01, TASK-02 (edits output lines in compress.js and prune.js — serialized to avoid conflicts).

<context>
Token counts come from `@anthropic-ai/tokenizer` (Claude 2 vocabulary) but are displayed as exact numbers —
a credibility gap on current models. Close it with honest labeling. Out of scope: `count_tokens` API mode
(repo has zero network/API-key code; `countTokens` is called synchronously throughout — async threading +
watch-redraw throttling is disproportionate). Hook templates already say "estimate" (own word×1.3 math) — untouched.
</context>

<decisions>
- `~` prefix on displayed counts in measure.js, watch.js, diff.js, compress.js, and ALL four prune output
  sites (all or none for consistency).
- audit.js stays unprefixed — its label/detail strings serialize into `--json` output; prefixing changes a
  machine-readable CI contract for zero benefit.
- Footnote per report (measure/diff/compress): `Counts are estimates (Claude 2 tokenizer) — actual usage on current models varies.`
- README: short caveat under the measurement section.
- Known test breakage fixed in-task: watch.test.js anchored regexes `/CLAUDE\.md\s+(\d+)\s+tokens/` →
  `/CLAUDE\.md\s+~?(\d+)\s+tokens/`.
</decisions>

<preflight>
```bash
node bin/cto.js audit --json   # capture shape BEFORE; must be unchanged after
```
</preflight>

<tdd>
Red: assert measure/diff/compress report output includes `~` prefix + estimate footnote (substring style);
update watch regexes; full suite proves nothing else depended on bare `N tokens`.
Behavior: `node bin/cto.js measure` / `diff` on a temp project; `audit --json` shape unchanged.
</tdd>

<dod>
- [x] report output asserted (red→green)
- [x] real CLI exercised, output pasted below
- [x] `audit --json` shape unchanged
- [x] full suite green via backlog/checks.sh
</dod>

<ac>
- ac(workspace): `bash backlog/checks.sh` green.
- ac(behavior): `node bin/cto.js measure` shows `~` counts + footnote; `audit --json` unchanged shape.
- ac(gates): `bash backlog/checks.sh` → 0 failures.
</ac>

<changelog>

## 2026-07-07 — implemented (executor)

**Files touched:**
- `src/commands/measure.js` — `~` prefix on `formatFileBreakdown` line, both "Total auto-loaded" lines, and the savings line (💡 Savings: ~N tokens); estimate footnote appended at end of `formatMeasureReport`.
- `src/commands/watch.js` — `~` prefix on `formatFileRow`, `formatWriteLogRow`, and the Total line (no footnote — live dashboard, excluded by spec).
- `src/commands/diff.js` — `~` prefix on Before/After/Saved/Added lines (Added line reads `~+N tokens`); estimate footnote appended at end of `formatDiffReport`.
- `src/commands/compress.js` — `~` prefix on `Before:`/`After:` lines in `printCompressionReport` and on the `✓ Saved — N tokens freed` line in `writeCompressed`; estimate footnote appended at the END of `printCompressionReport` (after the changes list / no-changes line — moved there in the post-approval nit fix; still fires on both branches).
- `src/commands/prune.js` — `~` prefix on all 4 sites: `formatDryRunLine`, `confirmTarget`, `printTargetYes`, and the `✓ Saved N tokens — CLAUDE.md now X tokens (was Y)` line in `commitChanges` (all three counts in that line prefixed for consistency). No footnote (excluded by spec).
- `README.md` — one-sentence caveat added under "Measure first": "Token counts are estimates from the Claude 2 tokenizer — actual usage on current models varies."
- `tests/measure.test.js`, `tests/diff.test.js`, `tests/compress.test.js`, `tests/prune.test.js` — new RED→GREEN assertions for `~` prefix + footnote (substring/regex style, mirroring each file's existing console-capture/spawnSync patterns). `compress.test.js` gained a `printCompressionReport` export import plus an interactive-apply e2e test (feeds `y\n` via spawnSync `input`) to exercise the `writeCompressed` "Saved" line. `prune.test.js` gained a `--yes` e2e test and an interactive-confirm e2e test (feeds `y\n`) to cover `printTargetYes`/`commitChanges` and `confirmTarget` respectively.
- `tests/watch.test.js` — anchored regexes at (former) lines 141 and 189-190 updated from `/CLAUDE\.md\s+(\d+)\s+tokens/` to `/CLAUDE\.md\s+~?(\d+)\s+tokens/`; added one new positive assertion that `~` actually appears.
- `audit.js` — untouched, as required (verified below).

**RED (before implementation) — 12 new assertions failed for the expected reason (`~`/footnote not yet present):**
```
✖ prefixes before/after token counts with ~ (estimate marker)      [compress]
✖ includes estimate footnote                                       [compress]
✖ interactive apply prints ~ prefixed saved token count             [compress e2e]
✖ formatDiffReport: prefixes token counts with ~ (estimate marker)  [diff]
✖ formatDiffReport: includes estimate footnote                      [diff]
✖ prefixes token count with ~ (estimate marker)                     [measure formatFileBreakdown]
✖ prefixes total token counts with ~ (estimate marker)              [measure formatMeasureReport]
✖ includes estimate footnote                                        [measure formatMeasureReport]
✖ prefixes token count with ~ (estimate marker)                     [prune formatDryRunLine]
✖ prefixes token counts with ~ (estimate marker) in --yes output    [prune e2e]
✖ interactive confirm prints ~ prefixed token count                 [prune e2e]
✖ prefixes token count with ~ (estimate marker)                     [watch]
ℹ tests 156 / pass 144 / fail 12   (all 12 failures were the new assertions; 0 pre-existing regressions)
```

**GREEN (after implementation):**
```
node --test tests/measure.test.js tests/diff.test.js tests/compress.test.js tests/prune.test.js tests/watch.test.js
ℹ tests 156 / pass 156 / fail 0
```

**Full suite:**
```
node --test tests/*.test.js
ℹ tests 396 / pass 396 / fail 0   (baseline 384 + 12 new = 396; matches)
```

**Local subprocess proofs** (fixture: `task03-fixture/CLAUDE.md` + `.bak`, copied then appended a section so `diff` has a real delta):

`node bin/cto.js measure`:
```
📊 Token Audit — task03-fixture/

  BEFORE (current state)
  ─────────────────────────────────────────────
  CLAUDE.md                                ~99 tokens
  ─────────────────────────────────────────────
  Total auto-loaded:                       ~99 tokens

  ✓ Already initialized. Run cto compress to reduce further.
  Counts are estimates (Claude 2 tokenizer) — actual usage on current models varies.
```

`node bin/cto.js diff`:
```
📊 Token diff — CLAUDE.md

  ────────────────────────────────────────────
  Before (CLAUDE.md.bak):                                      ~68 tokens
  After  (CLAUDE.md):                                      ~99 tokens
  ────────────────────────────────────────────
  Added:                               ~+   31 tokens  (+46%)

  Line diff: +3 lines  (11 → 14)

  Counts are estimates (Claude 2 tokenizer) — actual usage on current models varies.
```

`audit --json` shape check — ran `git stash` to capture the pre-change baseline, ran `audit --json` on the identical fixture both before and after the stash pop, then `diff`'d the two JSON files: **byte-identical**. Also `grep -c '~' audit_after.json` → `0` — confirms no `~` leaked into the machine-readable output and the shape/keys (`results[].label/pass/severity/detail/fixKey`, `errors/warnings/infos`) are unchanged.

**Ceilings (by design, not bugs):**
- `audit.js` stays completely unprefixed — its label/detail strings serialize into `--json`, a machine-readable CI contract. Confirmed untouched via `git diff src/commands/audit.js` (empty) and the before/after JSON diff above.
- Hook templates' own `word × 1.3` estimates (in `hooks.js` / templates) are untouched — already labeled as estimates, out of scope per the task's `<context>`.
- `watch.js` and `prune.js` intentionally have no estimate footnote (live redrawing dashboard / already terse per-line format, per spec).

**Note:** `src/cli.js` shows as modified in `git status` (adds `--days` option to `prune`) — this is a pre-existing uncommitted change from another task (TASK-02), not touched by this task.

**Critic pass (opus): APPROVE**, zero blockers. Coverage verified complete (every displayed count site grepped);
tests confirmed genuinely fail-able (positive `~` assertion per surface — the `~?` watch regexes are value-extractors
for redraw-stability tests, not the tilde pins); audit.js diff empty; README's "Claude 2 tokenizer" claim verified
accurate. Two cosmetic nits fixed post-approval (gate re-run green, 396/396):
- diff.js Added line now pads `('~+' + N).padStart(6)` so it column-aligns with Before/After/Saved
  (was `~+   31`, now right-aligned like its siblings).
- compress.js footnote moved to the END of `printCompressionReport` (after the changes list / no-changes line),
  matching measure/diff placement; still prints exactly once on both branches.
Third nit (diff.js `padEnd` precedence quirk on the Before/After labels) is PRE-EXISTING, out of scope, left alone.
Verified via real CLI run: footnote at report end, `Added: ~+5 tokens` aligned.
</changelog>
