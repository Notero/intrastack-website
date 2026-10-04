#!/usr/bin/env bash
# Rewrite all source files to replace external image URLs with local /images/ paths
# using the mapping file produced by download-images.sh.
set -euo pipefail
cd "$(dirname "$0")/.."

MAP_FILE="${1:-/tmp/image-map.txt}"

# Build a list of files that reference any of the external URLs
FILES=$(grep -rlE 'images\.unsplash\.com|violet-coyote|wp\.ditsolution|cdn\.jsdelivr' src/ 2>/dev/null || true)
[ -z "$FILES" ] && { echo "no source files reference external images"; exit 0; }

# For each URL|LOCAL line in the map, sed-replace across the file list.
# Use a delimiter that won't appear in either side; '|' works since neither URL
# nor local paths contain it.
while IFS='|' read -r url local; do
  [ -z "$url" ] && continue
  # Escape regex metachars in url for sed
  esc_url=$(printf '%s' "$url" | sed -e 's/[\/&]/\\&/g')
  esc_local=$(printf '%s' "$local" | sed -e 's/[\/&]/\\&/g')
  # shellcheck disable=SC2086
  sed -i '' "s/${esc_url}/${esc_local}/g" $FILES
done < "$MAP_FILE"

echo "done. remaining external image refs:"
grep -rhoE '"https://[^"]*"' src/ 2>/dev/null \
  | grep -E 'images\.unsplash\.com|violet-coyote|wp\.ditsolution|cdn\.jsdelivr' \
  | sort -u
