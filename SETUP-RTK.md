# rtk setup

This repo vendors [rtk-ai/rtk](https://github.com/rtk-ai/rtk) (v0.42.4) under
`rtk/` for automation research. It's a Rust CLI ("Token Killer") that wraps
common dev commands (git, npm, curl, wget, test runners, linters, etc.) and
condenses their output to cut token usage in AI coding assistant sessions.

Note: there is a name collision with an unrelated `reachingforthejack/rtk`
("Rust Type Kit") project — this vendors `rtk-ai/rtk` specifically.

## Setup performed

```bash
cd rtk
cargo install --path . --locked
```

Build completed successfully (`target/` is gitignored and not committed).
Verified the correct project installed (not the Type Kit collision):

```
$ rtk --version
rtk 0.42.4
$ rtk gain
No tracking data yet.
Run some rtk commands to start tracking savings.
```

Run `rtk init -g` to enable it globally across Claude Code projects (adds a
hook + `RTK.md`, ~10 tokens of context overhead) or `rtk init` to scope it to
a single project. No API keys or secrets required.
