# claude-token-optimizer setup

This repo vendors [nadimtuhin/claude-token-optimizer](https://github.com/nadimtuhin/claude-token-optimizer)
(v2.3.20, MIT licensed) under `claude-token-optimizer/` for automation
research. It's an npm CLI (`cto`) that reports real token counts and helps
optimize a project's Claude Code setup to cut token usage.

## Setup performed

```bash
npm install -g claude-token-optimizer
```

Installed successfully (global npm install, not tied to this repo's own
`node_modules`):

```
$ cto --version
2.3.20
```

Run `cto init` inside a project to set it up, or `cto --help` for the full
command list. No API keys or secrets required.
