#!/usr/bin/env bash
# Encode one film clip into the WebP frame sequences the scroll-scrub chapters
# draw on a canvas (see src/components/FilmScrub.tsx, .claude/docs/film.md).
#
#   scripts/encode-film.sh <clip-id> <source.mp4> [step]
#   scripts/encode-film.sh m1 media-src/M1.mp4
#
# Masters live in media-src/ (gitignored); only these outputs are committed.
# Two renditions, chosen per device by FilmScrub:
#   960 px wide, quality 55: desktop (budget: <= 5 MB per chapter)
#   640 px wide, quality 50: phones and tablets (budget: <= 2 MB per chapter)
# `step` keeps every Nth source frame (default 2: 24 fps -> 121 frames for a
# 10 s clip). A mild hqdn3d pass strips some generation noise; the page adds
# its own film grain on top, so nothing is lost.
set -euo pipefail

id="${1:?clip id, e.g. m1}"
src="${2:?source clip, e.g. media-src/M1.mp4}"
step="${3:-2}"
out="public/film/${id}"

encode() {
  local width="$1" quality="$2" dir="${out}/$1"
  rm -rf "$dir"
  mkdir -p "$dir"
  ffmpeg -v error -i "$src" \
    -vf "select='not(mod(n\,${step}))',hqdn3d=2:2:4:4,scale=${width}:-2:flags=lanczos" \
    -fps_mode vfr -c:v libwebp -quality "$quality" -compression_level 6 -preset photo \
    "${dir}/%03d.webp"
  local count bytes
  count=$(find "$dir" -name '*.webp' | wc -l)
  bytes=$(cat "$dir"/*.webp | wc -c)
  echo "${id} ${width}px: ${count} frames, $((bytes / 1024)) KB"
}

encode 960 55
encode 640 50
