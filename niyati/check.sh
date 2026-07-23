#!/usr/bin/env bash
set -euo pipefail

echo "[NIYATI] check.sh started"
echo "[NIYATI] pwd=$(pwd)"
echo "[NIYATI] node=$(node -v 2>/dev/null || true) npm=$(npm -v 2>/dev/null || true)"

ROOT="$(pwd)"
has_backend=0
has_frontend=0
has_root=0

[ -f "$ROOT/backend/package.json" ] && has_backend=1
[ -f "$ROOT/frontend/package.json" ] && has_frontend=1
[ -f "$ROOT/package.json" ] && has_root=1

run_node_pkg() {
  local dir="$1"
  echo "[NIYATI] ---- $dir ----"
  cd "$dir"

if [ -f "package-lock.json" ]; then
  echo "[NIYATI] npm ci"
  npm ci
else
  echo "[NIYATI] package-lock.json missing -> using npm install"
  npm install
fi

if npm run | grep -qE " build"; then
    echo "[NIYATI] npm run build"
    npm run build
  fi

  if npm run | grep -qE " test"; then
    echo "[NIYATI] npm test"
    npm test
  fi

if npm run | grep -qE " lint"; then
    echo "[NIYATI] npm run lint"
    npm run lint
  fi
}

# Monorepo mode
if [ "$has_backend" -eq 1 ]; then
  run_node_pkg "$ROOT/backend"
fi

if [ "$has_frontend" -eq 1 ]; then
  # For frontend, build is expected (if package exists)
  echo "[NIYATI] Frontend detected"
  cd "$ROOT/frontend"
  
if [ -f "package-lock.json" ]; then
  echo "[NIYATI] npm ci"
  npm ci
else
  echo "[NIYATI] package-lock.json missing -> using npm install"
  npm install
fi


if npm run | grep -qE " build"; then
    echo "[NIYATI] npm run build"
    npm run build
  else
    echo "[NIYATI] Frontend has no build script (FAIL)"
    exit 11
  fi
fi

# Single-root mode (if no backend/frontend)
if [ "$has_backend" -eq 0 ] && [ "$has_frontend" -eq 0 ]; then
  if [ "$has_root" -eq 1 ]; then
    run_node_pkg "$ROOT"
  else
    echo "[NIYATI] No package.json found at root or in backend/frontend."
    echo "[NIYATI] Add backend/package.json + frontend/package.json OR a root package.json."
    exit 12
  fi
fi

echo "[NIYATI] ✅ checks passed"
