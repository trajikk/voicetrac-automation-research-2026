#!/usr/bin/env bash
# Repo gate — 0 failures required before "done".
#   bash backlog/checks.sh
# This repo has no lint/typecheck scripts; npm test (node --test tests/*.test.js) is the only gate.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

fail=0
run() { local name="$1"; shift; echo "▶ $name"; if "$@"; then echo "  ✓ $name"; else echo "  ✗ FAIL: $name"; fail=$((fail+1)); fi; }

run "unit tests" npm test

echo
if [ "$fail" -eq 0 ]; then echo "✓ all checks passed"; else echo "✗ $fail check(s) failed"; exit 1; fi
