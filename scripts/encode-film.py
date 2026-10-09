"""Encode the film master into the WebP frame sequences the site draws on its canvas.

    python scripts/encode-film.py media-src/film-v4-4k.mp4

Reads the kept source frames from src/lib/filmFrames.json (scripts/pick-film-frames.py) and writes
public/film/v4/<rendition>/NNN.webp (1-based, in kept order). Masters stay in media-src/ (gitignored).

Renditions, chosen by the viewport's shape (see src/lib/film.ts):
  wide/  1920 px wide, the full frame          landscape screens
  tall/  540x960, a vertical slice              portrait phones (a P30 lite canvas is 540 px wide)

The tall slice is centred on the subject: at the start the monitor sits right of centre, so the
slice starts there and glides to the middle by 4 s; after that the action is centred.
A mild hqdn3d pass trims encoder noise; the page adds its own grain. Needs ffmpeg.
"""
import json
import os
import shutil
import subprocess
import sys

SRC = sys.argv[1] if len(sys.argv) > 1 else 'media-src/film-v4-4k.mp4'
OUT = 'public/film/v4'
QUALITY = 45

with open('src/lib/filmFrames.json', encoding='utf-8') as f:
    frames = json.load(f)['frames']

# Phone slice centre (fraction of the width) over time: on the monitor at 0 s, centred from 4 s.
CENTRE = "(0.5+0.16*max(0\\,1-t/4))"
RENDITIONS = {
    'wide': 'scale=1920:-2:flags=lanczos',
    'tall': f"crop=ih*9/16:ih:min(max(0\\,iw*{CENTRE}-ih*9/32)\\,iw-ih*9/16):0,scale=540:960:flags=lanczos",
}

# ffmpeg cannot parse a select expression with hundreds of terms, so every source frame is encoded to
# a temporary folder (a few tens of MB) and the kept ones are moved into place in kept order.
for name, vf in RENDITIONS.items():
    out = os.path.join(OUT, name)
    tmp = out + '.all'
    for d in (out, tmp):
        shutil.rmtree(d, ignore_errors=True)
        os.makedirs(d)
    subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-vf', f'hqdn3d=2:2:4:4,{vf}',
                    '-c:v', 'libwebp', '-quality', str(QUALITY), '-compression_level', '6', '-preset', 'photo',
                    '-start_number', '0', os.path.join(tmp, '%04d.webp')], check=True)
    for k, n in enumerate(frames):
        os.replace(os.path.join(tmp, f'{n:04d}.webp'), os.path.join(out, f'{k + 1:03d}.webp'))
    shutil.rmtree(tmp)
    files = sorted(os.listdir(out))
    size = sum(os.path.getsize(os.path.join(out, x)) for x in files)
    print(f'{name}: {len(files)} frames, {size / 1e6:.1f} MB')
    assert len(files) == len(frames), f'{name}: expected {len(frames)} frames, got {len(files)}'
