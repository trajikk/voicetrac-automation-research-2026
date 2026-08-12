# TASK-01 [compress] — strip HTML comments + SVG placeholders (issue #18)

Owner: claude · Wave: rev.1 · Deps: none
Footprint: `src/commands/compress.js`, `tests/compress.test.js` — disjoint from TASK-02 (prune.js) → ran in parallel with it.

<context>
Issue #18: CLAUDE.md files accumulate HTML comments (`<!-- ... -->`) and large inline SVGs that burn tokens
without informing Claude. Ask: strip comments entirely; collapse inline SVG blocks into `[SVG Asset]`.
Out of scope: other inline assets (base64 images), CLI flags.
</context>

<decisions>
- One new pure function `stripMarkup(content) → { result, changes }` (self-reporting shape like
  `truncateLongLists`), running FIRST in `applyCompressionRules` so leftover blank lines are collapsed by
  the existing `removeExtraBlankLines` pass. Not gated on `--aggressive`.
- Code fences NOT exempt — consistent with existing rules (all fence-agnostic); pinned with a test.
- Nested `<svg>`: lazy match stops at first `</svg>`, leaving residue — accepted ceiling
  (`ponytail:` comment; upgrade path: balance-count scan); pinned. Unclosed `<svg` never matches; pinned.
- Change messages use repo's conditional-plural style: `HTML comment${n > 1 ? 's' : ''}`.
- Rejected: rules registry (repo has fixed-order calls); `--strip-markup` flag (issue asks default-on).
</decisions>

<preflight>
```bash
grep -n "stripMarkup" src/commands/compress.js   # 0 before
```
</preflight>

<tdd>
`tests/compress.test.js` — new `stripMarkup` block: single-line comment removed, multi-line comment removed,
`<svg ...>...</svg>` → `[SVG Asset]`, comment inside code fence IS stripped (pinned), nested-svg residue
(pinned), unclosed `<svg` untouched, plain content untouched, headings preserved, deterministic;
`applyCompressionRules` reports the new changes. Red (right reason) → green.
Behavior: real subprocess `node bin/cto.js compress` in a temp project.
</tdd>

<dod>
- [x] pure logic unit-tested (red→green), no I/O in stripMarkup
- [x] real CLI exercised (subprocess run), output pasted below
- [x] full suite green via backlog/checks.sh
- [x] ceilings named, not gold-plated
</dod>

<ac>
- ac(workspace): `bash backlog/checks.sh` green.
- ac(behavior): temp CLAUDE.md with comment + SVG → `node bin/cto.js compress --dry-run` reports both removals; applied run strips them from the file.
- ac(gates): `bash backlog/checks.sh` → 0 failures.
</ac>

<changelog>

**Files touched:**
- `src/commands/compress.js` — added `stripMarkup(content)` export; wired it first in `applyCompressionRules`.
- `tests/compress.test.js` — added `stripMarkup` import + describe block (8 tests), plus 1 new `applyCompressionRules` test.

**Red run (right reason — missing export):**
```
file:///.../tests/compress.test.js:11
  stripMarkup,
  ^^^^^^^^^^^
SyntaxError: The requested module '../src/commands/compress.js' does not provide an export named 'stripMarkup'
✖ tests/compress.test.js (39.98775ms)
ℹ tests 1
ℹ pass 0
ℹ fail 1
```

**Green run (`node --test tests/compress.test.js`):**
```
  ▶ stripMarkup
    ✔ removes a single-line HTML comment (0.363ms)
    ✔ removes a multi-line HTML comment (0.136708ms)
    ✔ replaces an inline SVG block with [SVG Asset] (0.060708ms)
    ✔ strips HTML comments inside code fences (not exempt) (0.040542ms)
    ✔ leaves residue on nested <svg> (lazy match ceiling) (0.038166ms)
    ✔ leaves unclosed <svg (no closing tag) untouched (0.038875ms)
    ✔ leaves plain content untouched (0.036333ms)
    ✔ produces same output on same input (deterministic) (0.039709ms)
  ✔ stripMarkup (0.886709ms)
  ...
  ✔ applyCompressionRules
    ✔ reports HTML comment and SVG removal changes (0.201542ms)
    ✔ never removes section headings (0.060125ms)
ℹ tests 36
ℹ pass 36
ℹ fail 0
```

**Subprocess proof (fixture project with an HTML comment + inline `<svg>`):**
```
$ node bin/cto.js compress --dry-run
  Changes:
  - Removed 1 HTML comment
  - Collapsed 1 inline SVG to [SVG Asset]
  - Removed 1 extra blank line block
  --dry-run: no files written.

$ printf 'y\n' | node bin/cto.js compress
✓ Saved — 40 tokens freed (62% reduction)

$ cat CLAUDE.md   # after
# Project Notes

Some real content here.

[SVG Asset]

More content after the svg.
```
Comment removed, `[SVG Asset]` placed correctly, blank lines collapsed by the existing pass — confirmed.

**Full suite:** `node --test tests/*.test.js` → 339 tests, 338 pass, 1 fail (`tests/prune.test.js`, owned by TASK-02, mid-TDD-red for `isOlderThan` export — out of scope, file not touched). Excluding `prune.test.js`: 338/338 pass, 0 fail.

**Ceilings (named):** nested `<svg>` blocks leave residue because the lazy match stops at the first `</svg>` (upgrade path: balance-count scan tracking open/close `<svg>` tag depth — see `ponytail:` comment in `compress.js`); HTML comments inside code fences are deliberately NOT exempt, consistent with the repo's existing fence-agnostic compression rules.

**Critic pass (opus): APPROVE** with one real nit, fixed in-task: a self-closing `<svg a/>` followed by a later
paired `</svg>` was treated as an opening tag and silently ate the content between them (content loss).
Hardened the opening-tag regex to `<svg\b(?:[^>]*[^/>])?>` (a tag ending `/>` is not a block start) and added
4 tests red→green: self-closing cross-match keeps interstitial content, lone self-closing untouched,
`<svgfoo>` word-boundary guard, lazy comment match keeps content between two comments.
Green: `node --test tests/compress.test.js` → 40 pass, 0 fail.
</changelog>
