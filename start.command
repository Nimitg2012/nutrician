#!/usr/bin/env bash
# Double-click to start Nutrician in Terminal, then open Chrome.

set -euo pipefail
unset npm_config_devdir NPM_CONFIG_DEVDIR 2>/dev/null || true

PORT="${PORT:-3000}"
URL="http://localhost:${PORT}"

fail() {
  printf "✗ %s\n" "$1" >&2
  printf "\nPress Return to close this window.\n"
  read -r || true
  exit 1
}

printf "\nNUTRICIAN\nStarting...\n\n"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

if [[ ! -f package.json || ! -d src ]]; then
  fail "Open start.command from the Nutrician project folder."
fi

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  fail "Install Node.js 18 or later from https://nodejs.org then try again."
fi

if [[ ! -d node_modules ]] || [[ ! -x node_modules/.bin/vite ]]; then
  printf "Installing dependencies...\n"
  npm install || fail "npm install failed."
fi

if command -v pgrep >/dev/null 2>&1; then
  if pgrep -f "${ROOT}/server.js" >/dev/null 2>&1 || pgrep -f "${ROOT}/node_modules/.bin/next" >/dev/null 2>&1; then
    printf "Stopping a leftover Nutrician process...\n"
    pkill -f "${ROOT}/server.js" >/dev/null 2>&1 || true
    pkill -f "${ROOT}/node_modules/.bin/next" >/dev/null 2>&1 || true
    sleep 1
  fi
fi

open_when_ready() {
  for _ in $(seq 1 60); do
    html="$(curl -sf --max-time 2 "http://127.0.0.1:${PORT}/" 2>/dev/null || true)"
    if printf "%s" "${html}" | grep -q "Track. Understand"; then
      printf "\nRunning at:\n%s\n\n" "${URL}"
      open -a "Google Chrome" "${URL}" >/dev/null 2>&1 || open "${URL}" >/dev/null 2>&1 || true
      return 0
    fi
    sleep 1
  done
}

export NODE_ENV="${NODE_ENV:-development}"
export NEXT_TELEMETRY_DISABLED="${NEXT_TELEMETRY_DISABLED:-1}"
export PORT

printf "Leave this window open. Press Ctrl+C to stop.\n\n"
open_when_ready &
trap 'kill $! >/dev/null 2>&1 || true' INT TERM

npm run dev
status=$?
if [[ "${status}" -ne 0 ]]; then
  printf "\nThe app stopped unexpectedly. Press Return to close.\n"
  read -r || true
fi
exit "${status}"
