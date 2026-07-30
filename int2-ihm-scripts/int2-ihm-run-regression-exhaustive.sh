#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Execution de la suite exhaustive unifiee INT2 (tous les parcours stables)..."
npm run test:exhaustive:mp4

echo "Validation des artefacts MP4/JSON..."

mp4_count="$(find int2-ihm-recordings/exhaustive -maxdepth 1 -type f -name '*.mp4' | wc -l | tr -d ' ')"
json_count="$(find int2-ihm-recordings/exhaustive -maxdepth 1 -type f -name '*.json' | wc -l | tr -d ' ')"

if [[ "$json_count" -lt 10 ]]; then
  echo "Echec: moins de 10 manifests JSON detectes (trouve: $json_count)"
  exit 1
fi

if [[ "$mp4_count" -ne "$json_count" ]]; then
  echo "Echec: desynchronisation artefacts (MP4=$mp4_count JSON=$json_count)"
  exit 1
fi

echo "Generation du rapport KPI/couverture en francais..."
node int2-ihm-scripts/int2-ihm-report-kpi-fr.js

echo "Generation du panneau exhaustif des cas de test..."
node int2-ihm-scripts/int2-ihm-report-exhaustive-panel.js

echo "Generation de la matrice fonctionnelle INT2 des enregistrements..."
node int2-ihm-scripts/int2-ihm-report-functional-matrix.js

echo "Validation OK: MP4=$mp4_count JSON=$json_count"
echo "Termine."
