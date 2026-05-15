#!/bin/bash
if [ -n "$CLAUDE_ENV_FILE" ]; then
  cat >> "$CLAUDE_ENV_FILE" <<'DIRENV'
eval "$(direnv export bash)"
cd() {
  builtin cd "$@" && eval "$(direnv export bash)"
}
DIRENV
fi
exit 0
