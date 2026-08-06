# voicetrac-automation-research-2026

Research repo for Claude Code automation. Layout:

- `SETUP.md` — how the vendored `claude-mem` package was built and verified.
- `claude-mem/` — vendored copy of [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)
  (v13.13.1), a Claude Code plugin for persistent cross-session memory. Treat
  it as a third-party dependency: prefer not to hand-edit vendored source,
  and see `claude-mem/CLAUDE.md` for its own build/dev instructions.
- `INSTALL.md` — how to install the Claude Code CLI for local development.
- `.github/workflows/claude.yml` — responds to `@claude` mentions on issues
  and PRs.
- `.github/workflows/claude-code-review.yml` — automatic Claude review on
  new/updated pull requests.

## Working in this repo

- This is a research/vendoring repo, not an application with its own build.
  Build/test commands live inside `claude-mem/` (see its `CLAUDE.md`).
- Don't modify vendored files under `claude-mem/` unless the task is
  specifically about that package; prefer root-level docs and tooling
  changes here.
