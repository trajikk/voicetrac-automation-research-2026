#!/bin/bash
set -euo pipefail

# Only needed in Claude Code on the web / remote sessions — each session runs
# in a fresh container, so the claude-mem plugin install doesn't persist on
# its own and needs to be re-applied on every session start.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Both commands are idempotent: install is safe to re-run against an existing
# install, and start is a no-op if the worker is already running.
npx -y claude-mem@13.13.1 install --ide claude-code --provider claude
npx -y claude-mem@13.13.1 start
