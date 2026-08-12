#!/bin/bash
# load-ctorc.sh
# Sourced by hook scripts to load shared config from a .ctorc file at cwd,
# without overriding already-exported env vars.
#
# Format: KEY=value lines, one per line. '#' starts a comment. Blank lines ok.
# Only CTO_* keys are read; unknown keys are ignored (no eval, no code exec).
# Precedence: env > .ctorc > hook's own default.
#
# Add new recognized keys here as they're needed.
_CTORC_ALLOWED_KEYS="CTO_WARN_TOKENS CTO_BLOCK_TOKENS CTO_LEARNINGS_DIR"

if [ -f ".ctorc" ]; then
  while IFS='=' read -r _key _val; do
    case "$_key" in
      ''|'#'*) continue ;;
    esac
    for _allowed in $_CTORC_ALLOWED_KEYS; do
      if [ "$_key" = "$_allowed" ]; then
        # env already set? don't clobber it.
        if [ -z "$(eval echo \"\$$_key\")" ]; then
          eval "$_key=\"\$_val\""
        fi
      fi
    done
  done < ".ctorc"
fi
