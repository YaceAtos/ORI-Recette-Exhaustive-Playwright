#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
INPUT_DIR="${1:-$ROOT_DIR/int2-ihm-test-results}"
OUTPUT_DIR="${2:-$ROOT_DIR/int2-ihm-recordings/int2}"

mkdir -p "$OUTPUT_DIR"

WEBM_FILES=()
while IFS= read -r line; do
  WEBM_FILES+=("$line")
done < <(find "$INPUT_DIR" -type f -name '*.webm' | sort)

if [[ ${#WEBM_FILES[@]} -eq 0 ]]; then
  echo "No .webm videos found in $INPUT_DIR"
  exit 1
fi

echo "Converting ${#WEBM_FILES[@]} video(s) to MP4..."

for input in "${WEBM_FILES[@]}"; do
  rel_path="${input#"$INPUT_DIR"/}"
  rel_no_ext="${rel_path%.webm}"
  safe_name="${rel_no_ext//\//__}"
  output="$OUTPUT_DIR/${safe_name}.mp4"
  manifest="$OUTPUT_DIR/${safe_name}.json"

  ffmpeg -y -i "$input" -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -movflags +faststart "$output" >/dev/null 2>&1

  duration="$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$output" 2>/dev/null || echo "0")"
  chapter_dir="$(dirname "$input")/chapters"

  chapter_count=0
  if [[ -d "$chapter_dir" ]]; then
    chapter_count="$(find "$chapter_dir" -type f -name '*.png' | wc -l | tr -d ' ')"
  fi

  cat > "$manifest" <<EOF
{
  "source_webm": "${input}",
  "mp4": "${output}",
  "duration_seconds": ${duration},
  "chapter_screenshots_dir": "${chapter_dir}",
  "chapter_screenshots_count": ${chapter_count},
  "generated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

  echo "MP4 created: $output"
  echo "Manifest created: $manifest"
done

echo "Done. MP4 files are in: $OUTPUT_DIR"