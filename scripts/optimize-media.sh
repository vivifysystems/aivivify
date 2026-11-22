#!/usr/bin/env bash
# Generates optimized copies of the media the site currently uses.
#
# - Originals in src/assets and public/ are NEVER modified or deleted.
# - Output is deterministic for a given ffmpeg build, so re-running is safe.
# - Requires ffmpeg built with libwebp and libx264 (no npm dependencies).
#
# Usage: bash scripts/optimize-media.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/src/assets"
OUT="$ROOT/src/assets/optimized"
mkdir -p "$OUT/card" "$OUT/full"

webp() { # <input> <output> <max-width> <quality>
  ffmpeg -v error -y -i "$1" \
    -vf "scale='min($3,iw)':-1:flags=lanczos" \
    -c:v libwebp -quality "$4" -compression_level 6 "$2"
}

# Full-size workflow proofs shown in the case-study modal (max ~830 CSS px wide → 1600 px covers 2x).
for f in "$SRC"/proof-*.png "$SRC"/proof-*.jpg; do
  name="$(basename "${f%.*}")"
  webp "$f" "$OUT/full/$name.webp" 1600 88
done

# Card thumbnails (cards are 340–380 CSS px wide → 800 px covers 2x).
for name in \
  proof-voice-receptionist proof-file-management proof-social-engine \
  cover-social-auto cover-ugc-script viviene-portrait; do
  f="$(ls "$SRC/$name".* | head -n1)"
  webp "$f" "$OUT/card/$name.webp" 800 85
done

# Hero video: same 1080p framing, no audio track (it always plays muted), web-optimized.
ffmpeg -v error -y -i "$ROOT/design/legacy-public/videos/hero.mp4" -an \
  -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart \
  "$ROOT/design/legacy-public/videos/hero-optimized.mp4"
# Poster shown instantly while the video loads, and instead of it for reduced-motion / data-saver users.
ffmpeg -v error -y -i "$ROOT/design/legacy-public/videos/hero.mp4" -frames:v 1 \
  -vf "scale=1600:-1:flags=lanczos" -c:v libwebp -quality 80 "$ROOT/design/legacy-public/videos/hero-poster.webp"

# Dino backdrop: rendered blurred at ≤60% of section height, so 480p is ample.
ffmpeg -v error -y -i "$ROOT/design/legacy-public/dino.mp4" -an \
  -vf "scale=-2:480:flags=lanczos" \
  -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart \
  "$ROOT/design/legacy-public/videos/dino-480.mp4"

echo "Done. Optimized media written to src/assets/optimized and design/legacy-public/videos (v1 media, not deployed)."
