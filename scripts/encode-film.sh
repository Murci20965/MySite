#!/usr/bin/env bash
# Encode one film clip into the WebP frame sequences the full-screen film
# backdrop draws on a canvas (see src/components/FilmStage.tsx and
# .claude/docs/film.md).
#
#   scripts/encode-film.sh <clip-id> <source.mp4> [step]
#   scripts/encode-film.sh m1 media-src/M1.mp4
#
# Masters live in media-src/ (gitignored); only these outputs are committed.
# Two renditions, chosen by the viewport's shape:
#   wide/  1280x720, the full frame       (landscape screens; budget <= 5 MB per clip)
#   tall/  432x720, a centre crop         (portrait phones; budget <= 2 MB per clip)
# The clips were generated with the subject centred, so the centre crop keeps it.
# `step` keeps every Nth source frame (default 3: 24 fps -> 81 frames for a
# 10 s clip); the renderer blends neighbouring frames, so motion stays smooth.
# A mild hqdn3d pass strips some generation noise; the page adds its own grain.
set -euo pipefail

id="${1:?clip id, e.g. m1}"
src="${2:?source clip, e.g. media-src/M1.mp4}"
step="${3:-3}"
out="public/film/${id}"

encode() {
  local name="$1" filter="$2" dir="${out}/$1"
  rm -rf "$dir"
  mkdir -p "$dir"
  ffmpeg -v error -i "$src" \
    -vf "select='not(mod(n\,${step}))',hqdn3d=2:2:4:4,${filter}" \
    -fps_mode vfr -c:v libwebp -quality 45 -compression_level 6 -preset photo \
    "${dir}/%03d.webp"
  local count bytes
  count=$(find "$dir" -name '*.webp' | wc -l)
  bytes=$(cat "$dir"/*.webp | wc -c)
  echo "${id} ${name}: ${count} frames, $((bytes / 1024)) KB"
}

encode wide "scale=1280:-2:flags=lanczos"
encode tall "crop=432:720"
