#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${1:-$ROOT_DIR/.env.int2.real}"
HOOK_SERVER_SCRIPT="$ROOT_DIR/int2-ihm-scripts/int2-ihm-business-hooks-server.js"
TRANSCODE_SCRIPT="$ROOT_DIR/int2-ihm-scripts/int2-ihm-transcode-evidence-mp4.sh"
RESULTS_DIR="$ROOT_DIR/int2-ihm-test-results"
OUTPUT_DIR="$ROOT_DIR/int2-ihm-recordings/int2-real-chains"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing env file: $ENV_FILE"
  echo "Copy $ROOT_DIR/.env.int2.real.example to .env.int2.real and fill all ORION_UPSTREAM_* URLs."
  exit 2
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

required_vars=(
  ORION_HOOK_EXEC_URL
)

missing=()
for name in "${required_vars[@]}"; do
  value="${!name:-}"
  if [[ -z "$value" ]]; then
    missing+=("$name")
  fi
done

if [[ ${#missing[@]} -gt 0 ]]; then
  echo "Missing required environment variables in $ENV_FILE:"
  for name in "${missing[@]}"; do
    echo "  - $name"
  done
  exit 3
fi

if [[ -z "${ORION_UPSTREAM_EXEC_URL:-}" ]]; then
  action_vars=(
    ORION_UPSTREAM_SEED_URL
    ORION_UPSTREAM_CLEANUP_URL
    ORION_UPSTREAM_CREATE_SERIES_URL
    ORION_UPSTREAM_TRIGGER_RRULE_URL
    ORION_UPSTREAM_READ_INTERVENTIONS_URL
    ORION_UPSTREAM_UPDATE_INTERVENTION_URL
    ORION_UPSTREAM_CANCEL_INTERVENTION_URL
    ORION_UPSTREAM_VERIFY_KAFKA_URL
    ORION_UPSTREAM_VERIFY_SIRENE_URL
    ORION_UPSTREAM_VERIFY_INS_LIFECYCLE_URL
    ORION_UPSTREAM_VERIFY_DMP_URL
  )

  missing_actions=()
  for name in "${action_vars[@]}"; do
    value="${!name:-}"
    if [[ -z "$value" ]]; then
      missing_actions+=("$name")
    fi
  done

  if [[ ${#missing_actions[@]} -gt 0 ]]; then
    echo "Missing upstream mapping in $ENV_FILE:"
    echo "  Provide ORION_UPSTREAM_EXEC_URL for single-endpoint mode"
    echo "  OR provide every per-action URL below:"
    for name in "${missing_actions[@]}"; do
      echo "  - $name"
    done
    exit 3
  fi
fi

for cmd in node npx ffmpeg ffprobe curl; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Missing required command: $cmd"
    exit 4
  fi
done

HOOK_URL="${ORION_HOOK_EXEC_URL%/exec}"
if [[ -z "$HOOK_URL" || "$HOOK_URL" == "$ORION_HOOK_EXEC_URL" ]]; then
  HOOK_URL="http://127.0.0.1:${ORION_HOOK_PORT:-8787}"
fi

echo "Cleaning previous artifacts for strict real run..."
rm -rf "$RESULTS_DIR" "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

cleanup() {
  if [[ -n "${HOOK_SERVER_PID:-}" ]] && kill -0 "$HOOK_SERVER_PID" >/dev/null 2>&1; then
    kill "$HOOK_SERVER_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

echo "Starting local hook relay..."
node "$HOOK_SERVER_SCRIPT" > "$ROOT_DIR/int2-ihm-recordings/int2-real-chains/hook-server.log" 2>&1 &
HOOK_SERVER_PID=$!

for _ in $(seq 1 30); do
  if curl -fsS "$HOOK_URL/health" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! curl -fsS "$HOOK_URL/health" >/dev/null 2>&1; then
  echo "Hook relay did not become healthy at $HOOK_URL/health"
  exit 5
fi

echo "Running strict real INT2 chains..."
npx playwright test \
  "$ROOT_DIR/int2-ihm-tests/int2-ihm-pp-domicile-e2e.spec.ts" \
  "$ROOT_DIR/int2-ihm-tests/int2-ihm-pro-multisites-e2e.spec.ts" \
  "$ROOT_DIR/int2-ihm-tests/int2-ihm-saad-sante-e2e.spec.ts" \
  --config="$ROOT_DIR/playwright.int2.record.config.ts"

echo "Transcoding webm to mp4..."
bash "$TRANSCODE_SCRIPT" "$RESULTS_DIR" "$OUTPUT_DIR"

echo "Strict real run completed. MP4 output: $OUTPUT_DIR"
