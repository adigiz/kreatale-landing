#!/usr/bin/env bash
# Re-fetch production hero illustration WebPs (paths may change on redeploy).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/maxima/reverse/illu"
BASE="https://maximatherapy.com/assets/svg/photo"
mkdir -p "$OUT"
for f in \
  illu-0-to-3-bg.webp illu-0-to-3.webp \
  illu-3-to-18-bg.webp illu-3-to-18.webp \
  illu-18-to-65-bg.webp illu-18-to-65.webp \
  illu-65-and-plus-bg.webp illu-65-and-plus.webp; do
  curl -fsSL "$BASE/$f" -o "$OUT/$f"
  echo "ok $f"
done
