"""Choose which source frames of the film master the site keeps, spaced by equal amounts of motion.

    python scripts/pick-film-frames.py media-src/film-v4-4k.mp4

A scroll-scrubbed film blends neighbouring frames, so smoothness depends on how much the picture
changes between two kept frames, not on the frame rate. This keeps ~K frames so that change is about
equal everywhere: dense where the camera moves fast, sparse where it is nearly still, with a cap on
the time gap so slow drift still advances. Writes src/lib/filmFrames.json: {fps, frames: [source
frame numbers]}, which scripts/encode-film.py encodes and src/lib/film.ts reads for frame times.
Needs ffmpeg and numpy.
"""
import json
import subprocess
import sys

import numpy as np

SRC = sys.argv[1] if len(sys.argv) > 1 else 'media-src/film-v4-4k.mp4'
K = 320           # frames to keep (budget: about 24 MB desktop, 8 MB phone for a full read)
MAX_GAP = 6       # never skip more than this many source frames
FLOOR = 0.15      # motion floor per source frame, so a still stretch still gets frames
W, H = 192, 108   # motion is measured on a small grey copy

probe = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate',
                        '-of', 'csv=p=0', SRC], capture_output=True, text=True, check=True).stdout.strip()
num, den = probe.split('/')
fps = round(int(num) / int(den))

raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-vf', f'scale={W}:{H}:flags=area,format=gray',
                      '-f', 'rawvideo', '-'], capture_output=True, check=True).stdout
f = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
n = len(f)
motion = np.abs(np.diff(f, axis=0)).mean(axis=(1, 2))
cum = np.concatenate([[0.0], np.cumsum(motion + FLOOR)])
picked = sorted({int(np.searchsorted(cum, t)) for t in np.linspace(0, cum[-1], K)} | {0, n - 1})
frames = [picked[0]]
for p in picked[1:]:
    p = min(p, n - 1)
    while p - frames[-1] > MAX_GAP:
        frames.append(frames[-1] + MAX_GAP)
    if p > frames[-1]:
        frames.append(p)

between = [float(motion[a:b].sum()) for a, b in zip(frames[:-1], frames[1:])]
print(f'{n} source frames at {fps} fps -> kept {len(frames)}; '
      f'motion between kept frames: median {np.median(between):.2f}, max {max(between):.2f}')
with open('src/lib/filmFrames.json', 'w', encoding='utf-8') as out:
    json.dump({'fps': fps, 'frames': frames}, out)
    out.write('\n')
