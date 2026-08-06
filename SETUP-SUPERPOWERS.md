# Superpowers setup

This repo vendors [obra/superpowers](https://github.com/obra/superpowers)
(v6.2.0) under `superpowers/` for automation research, and installs it as a
real Claude Code plugin via the official Superpowers marketplace.

## Setup performed

```bash
claude plugin marketplace add obra/superpowers-marketplace
claude plugin install superpowers@superpowers-marketplace
claude plugin list
```

The marketplace was registered and the plugin installed successfully:

```
Installed plugins:

  > superpowers@superpowers-marketplace
    Version: 6.2.0
    Scope: user
    Status: √ enabled
```

Marketplace source: `obra/superpowers-marketplace`
(cloned to `~/.claude/plugins/marketplaces/superpowers-marketplace`).
Plugin cache: `~/.claude/plugins/cache/superpowers-marketplace/superpowers/6.2.0`
(commit `44c9b2d6e889982ac18c27d05a19fefe335194e1`).

The vendored copy under `superpowers/` is the plugin source (skills, hooks,
docs) at the same version, kept for reference alongside the live installed
plugin.
