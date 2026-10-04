#!/usr/bin/env bash
# Download every external image referenced in the codebase to public/images/
# and print the URL -> local-path mapping (so the source can be rewritten).
set -euo pipefail

cd "$(dirname "$0")/.."

# Collect all external image URLs (double-quoted only — that's the only form used here)
URLS=$(grep -rhoE '"https://[^"]*"' src/ 2>/dev/null \
  | grep -E 'unsplash\.com|violet-coyote|wp\.ditsolution|cdn\.jsdelivr' \
  | tr -d '"' \
  | sort -u)

# Map each URL to a local path
map_url() {
  local url="$1"
  case "$url" in
    *images.unsplash.com/*)
      # photo-XXX?w=NNNN&q=80 -> photo-XXX-NNNN.jpg
      local id width
      id=$(echo "$url" | sed -E 's|.*/(photo-[^?]+).*|\1|')
      width=$(echo "$url" | sed -E 's|.*[?&]w=([0-9]+).*|\1|')
      echo "public/images/unsplash/${id}-${width}.jpg"
      ;;
    *cdn.jsdelivr.net/*)
      echo "public/images/vendor/$(basename "$url")"
      ;;
    *violet-coyote*|*wp.ditsolution*)
      echo "public/images/legacy/$(basename "$url")"
      ;;
    *)
      echo "public/images/other/$(basename "$url")"
      ;;
  esac
}

# Download + emit URL|LOCAL mapping
while IFS= read -r url; do
  [ -z "$url" ] && continue
  local_path=$(map_url "$url")
  mkdir -p "$(dirname "$local_path")"
  if [ ! -s "$local_path" ]; then
    echo "DL  $url" >&2
    if ! curl -fsSL --max-time 30 -o "$local_path" "$url"; then
      echo "FAIL $url" >&2
      rm -f "$local_path"
      continue
    fi
  else
    echo "OK  $local_path" >&2
  fi
  # Print mapping to stdout for the rewrite step
  echo "${url}|/${local_path#public/}"
done <<< "$URLS"
