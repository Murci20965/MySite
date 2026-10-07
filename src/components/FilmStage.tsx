import { useEffect, useRef } from 'react';
import { CLIPS, FILM_END, frameUrl, parseBeat, RENDITION_WIDTH } from '../lib/film';
import type { Rendition } from '../lib/film';
import { filmClock, FOCUS, KNOTS } from '../lib/filmJourney';
import type { GradeSide, Look } from '../lib/filmJourney';

/** Clip-to-clip dissolve, as a fraction of the incoming clip (0.06 = 0.6 s). */
const CROSSFADE = 0.06;
/** A beat that has fired stays until the film is this far before it again. */
const BEAT_HYSTERESIS = 0.04;
/** Decoded frames kept around the playhead (each side), plus every KEEP_EVERY-th frame. */
const WINDOW = 12;
const KEEP_EVERY = 8;
const MAX_FETCHES = 4;
const MAX_DECODES = 2;
/** Before the first scroll, only this much of the opening clip is fetched (data on phones). */
const PRE_SCROLL_FRAMES = 24;

type Beat = { el: Element; T: number; on: boolean };
type Frame = ImageBitmap | HTMLImageElement;
type Slot = { blob?: Blob; frame?: Frame; fetching?: boolean; decoding?: boolean };

const canBitmap = typeof window !== 'undefined' && 'createImageBitmap' in window;

async function decode(blob: Blob): Promise<Frame> {
  if (canBitmap) return createImageBitmap(blob); // decodes off the main thread
  const img = new Image();
  img.src = URL.createObjectURL(blob);
  await img.decode();
  return img;
}

function release(frame: Frame) {
  if ('close' in frame) frame.close();
  else URL.revokeObjectURL(frame.src);
}

/**
 * The film as the site's background (and its front): one fixed full-screen
 * canvas behind every section. Scroll position maps to film time through
 * lib/filmJourney's knots; the drawn time eases toward it (so wheel notches
 * glide), the two nearest frames are blended, clips dissolve into each other,
 * and each section's lighting (a light veil plus a one-sided grade where its
 * text sits) is drawn over the frame.
 *
 * Smoothness: frames are fetched as files and decoded off the main thread
 * (createImageBitmap), only a window around the playhead stays decoded, and
 * section positions are measured when the layout changes, not every frame.
 *
 * Text cues: elements with data-beat="mN:fraction" get .is-beat while the film
 * is at or past that moment. Cues hide text only after the visitor's first
 * scroll (html[data-film="on"]), so crawlers and anyone who has not scrolled
 * see all text. Reduced motion or Save-Data: one still per knot, no cues.
 */
export default function FilmStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return;
    const root = document.documentElement;

    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const still = Boolean(conn?.saveData) || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const TAU = coarse ? 70 : 110; // ms: how quickly the drawn film catches the scroll

    let rendition: Rendition = window.innerWidth >= window.innerHeight ? 'wide' : 'tall';
    let slots: Slot[][] = CLIPS.map((c) => Array.from({ length: c.count }, () => ({})));
    const bg = (getComputedStyle(root).getPropertyValue('--c-bg').trim() || '10 10 10').split(/\s+/).join(',');
    let disposed = false;

    // ---- Timeline: knot scroll positions, measured when the layout changes ----
    let positions: number[] = [];
    const measure = () => {
      const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
      let prev = -Infinity;
      positions = KNOTS.map((k) => {
        let y: number;
        if (k.at === 'start') y = 0;
        else if (k.at === 'end') y = maxScroll;
        else {
          const el = document.getElementById(k.at);
          if (!el) y = prev;
          else {
            const top = el.getBoundingClientRect().top + window.scrollY;
            y = top + (k.f ?? 0) * el.offsetHeight - FOCUS * window.innerHeight;
          }
        }
        y = Math.max(y, prev + 1); // keep the timeline strictly increasing
        prev = y;
        return y;
      });
    };

    type Pose = { T: number; a: Look; b: Look; t: number };
    const at = (y: number): Pose => {
      const last = KNOTS.length - 1;
      const look = (i: number) => KNOTS[i][rendition];
      if (y <= positions[0]) return { T: KNOTS[0].T, a: look(0), b: look(0), t: 0 };
      if (y >= positions[last]) return { T: KNOTS[last].T, a: look(last), b: look(last), t: 0 };
      let i = 0;
      while (i < last - 1 && y >= positions[i + 1]) i++;
      const t = (y - positions[i]) / (positions[i + 1] - positions[i]);
      if (still) return { T: KNOTS[i].T, a: look(i), b: look(i), t: 0 };
      return { T: KNOTS[i].T + (KNOTS[i + 1].T - KNOTS[i].T) * t, a: look(i), b: look(i + 1), t };
    };

    const split = (T: number) => {
      const c = Math.min(FILM_END - 1, Math.floor(T));
      return { c, f: Math.min(1, T - c) };
    };
    const indexAt = (T: number) => {
      const { c, f } = split(T);
      return { c, i: Math.round(f * (CLIPS[c].count - 1)) };
    };

    // ---- Frames: fetch (network) and decode (off-thread), around the playhead ----
    let started = false; // full fetching waits for the page's load event
    let scrolled = false; // neighbours and the full opening clip wait for a first scroll
    let fetches = 0;
    let decodes = 0;
    let focus = { c: 0, i: 0 };

    /** Fetch order: the playhead outward, every 4th frame first, then the rest. */
    const fetchOrder = (): Array<[number, number]> => {
      const { c, i } = focus;
      const out: Array<[number, number]> = [];
      const clipOrder = (k: number, center: number, limit: number) => {
        const n = CLIPS[k].count;
        const idx = Array.from({ length: n }, (_, j) => j).filter((j) => j < limit);
        const byDist = (a: number, b: number) => Math.abs(a - center) - Math.abs(b - center);
        idx.filter((j) => j % 4 === 0).sort(byDist).forEach((j) => out.push([k, j]));
        idx.filter((j) => j % 4 !== 0).sort(byDist).forEach((j) => out.push([k, j]));
      };
      if (still) return [[c, i]];
      if (!started) return [[c, i]]; // the poster only
      if (!scrolled) {
        clipOrder(c, i, c === 0 ? PRE_SCROLL_FRAMES : CLIPS[c].count);
        return out;
      }
      clipOrder(c, i, CLIPS[c].count);
      if (c + 1 < CLIPS.length) clipOrder(c + 1, 0, CLIPS[c + 1].count);
      if (c > 0) out.push([c - 1, CLIPS[c - 1].count - 1]); // the dissolve's source frame
      return out;
    };

    /** Which decoded frames to keep: a window around the playhead, a sparse spine, dissolve edges. */
    const keep = (k: number, j: number) => {
      const { c, i } = focus;
      if (k === c) return Math.abs(j - i) <= WINDOW || j % KEEP_EVERY === 0;
      if (k === c - 1) return j === CLIPS[k].count - 1;
      if (k === c + 1) return j <= WINDOW;
      return false;
    };

    const pump = () => {
      if (disposed) return;
      // Evict decoded frames outside the window (the encoded file stays cached in memory).
      slots.forEach((clip, k) =>
        clip.forEach((s, j) => {
          if (s.frame && !keep(k, j)) {
            release(s.frame);
            s.frame = undefined;
          }
        }),
      );
      // Decode what the window needs and is already downloaded, nearest first.
      const { c, i } = focus;
      const want: Array<[number, number]> = [];
      for (let d = 0; d <= WINDOW; d++) {
        for (const j of d ? [i - d, i + d] : [i]) if (j >= 0 && j < CLIPS[c].count) want.push([c, j]);
      }
      for (let j = 0; j < CLIPS[c].count; j += KEEP_EVERY) want.push([c, j]);
      if (c > 0) want.push([c - 1, CLIPS[c - 1].count - 1]);
      if (c + 1 < CLIPS.length) for (let j = 0; j <= 2; j++) want.push([c + 1, j]);
      for (const [k, j] of want) {
        if (decodes >= MAX_DECODES) break;
        const s = slots[k][j];
        if (!s.blob || s.frame || s.decoding) continue;
        s.decoding = true;
        decodes++;
        const forRendition = rendition;
        decode(s.blob)
          .then((frame) => {
            if (disposed || forRendition !== rendition || !keep(k, j)) return release(frame);
            s.frame = frame;
            dirty = true;
            schedule();
          })
          .catch(() => undefined)
          .finally(() => {
            s.decoding = false;
            decodes--;
            pump();
          });
      }
      // Fetch the next files in priority order.
      for (const [k, j] of fetchOrder()) {
        if (fetches >= (started ? MAX_FETCHES : 1)) break;
        const s = slots[k][j];
        if (s.blob || s.fetching) continue;
        s.fetching = true;
        fetches++;
        const forRendition = rendition;
        fetch(frameUrl(CLIPS[k], rendition, j))
          .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
          .then((blob) => {
            if (!disposed && forRendition === rendition) s.blob = blob;
          })
          .catch(() => undefined) // a missing frame is skipped; the nearest one is drawn
          .finally(() => {
            s.fetching = false;
            fetches--;
            pump();
          });
      }
    };

    // ---- Drawing ----
    let dirty = true;
    let lastKey = '';
    const nearest = (k: number, i: number) => {
      const list = slots[k];
      for (let d = 0; d < list.length; d++) {
        if (list[i - d]?.frame) return list[i - d].frame;
        if (list[i + d]?.frame) return list[i + d].frame;
      }
      return undefined;
    };
    const frameSize = (f: Frame) => ('naturalWidth' in f ? [f.naturalWidth, f.naturalHeight] : [f.width, f.height]);
    const cover = (img: Frame, alpha: number) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const [iw, ih] = frameSize(img);
      const s = Math.max(cw / iw, ch / ih);
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cw - iw * s) / 2, (ch - ih * s) / 2, iw * s, ih * s);
    };

    // Grades: full-strength gradients, cached per size; drawn with globalAlpha = strength.
    const gradients = new Map<string, CanvasGradient[]>();
    const gradesFor = (side: GradeSide): CanvasGradient[] => {
      const key = `${side}|${canvas.width}x${canvas.height}`;
      const hit = gradients.get(key);
      if (hit) return hit;
      const w = canvas.width;
      const h = canvas.height;
      const make = (x0: number, y0: number, x1: number, y1: number) => {
        const g = ctx.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, `rgba(${bg},1)`);
        g.addColorStop(0.45, `rgba(${bg},0.55)`);
        g.addColorStop(1, `rgba(${bg},0)`);
        return g;
      };
      const reach = { x: w * 0.62, y: h * 0.5 };
      const list: CanvasGradient[] = [];
      if (side === 'left' || side === 'sides') list.push(make(0, 0, side === 'sides' ? w * 0.38 : reach.x, 0));
      if (side === 'right' || side === 'sides') list.push(make(w, 0, w - (side === 'sides' ? w * 0.38 : reach.x), 0));
      if (side === 'top' || side === 'ends') list.push(make(0, 0, 0, side === 'ends' ? h * 0.42 : reach.y));
      if (side === 'bottom' || side === 'ends') list.push(make(0, h, 0, h - (side === 'ends' ? h * 0.42 : reach.y)));
      gradients.set(key, list);
      return list;
    };
    const lightBy = (look: Look, weight: number) => {
      if (weight <= 0.001) return;
      if (look.dim > 0.005) {
        ctx.globalAlpha = look.dim * weight;
        ctx.fillStyle = `rgb(${bg})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      if (look.grade !== 'none' && look.strength > 0.005) {
        ctx.globalAlpha = look.strength * weight;
        for (const g of gradesFor(look.grade)) {
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    };

    const draw = (T: number, pose: Pose) => {
      const { c, f } = split(T);
      const x = f * (CLIPS[c].count - 1);
      const i0 = Math.floor(x);
      const a = still ? 0 : x - i0;
      const base = nearest(c, i0);
      if (!still && c > 0 && f < CROSSFADE) {
        // Dissolve from the previous clip's last frame into this one.
        const prev = nearest(c - 1, CLIPS[c - 1].count - 1);
        if (prev) cover(prev, 1);
        if (base) cover(base, prev ? f / CROSSFADE : 1);
        if (!prev && !base) fillBg();
      } else if (base) {
        cover(base, 1);
        const next = slots[c][i0 + 1]?.frame;
        if (a > 0.02 && next) cover(next, a);
      } else fillBg();
      // Lighting: the two knots' looks cross-fade as the scroll moves between them.
      lightBy(pose.a, pose.a === pose.b ? 1 : 1 - pose.t);
      if (pose.a !== pose.b) lightBy(pose.b, pose.t);
      ctx.globalAlpha = 1;
    };
    const fillBg = () => {
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgb(${bg})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // ---- Text cues ----
    let beats: Beat[] = [];
    const collectBeats = () => {
      beats = Array.from(document.querySelectorAll('[data-beat]'))
        .map((el) => ({ el, T: parseBeat(el.getAttribute('data-beat') ?? ''), on: el.classList.contains('is-beat') }))
        .filter((b) => !Number.isNaN(b.T));
    };
    const runBeats = (T: number) => {
      for (const b of beats) {
        const on = b.on ? T >= b.T - BEAT_HYSTERESIS : T >= b.T;
        if (on !== b.on) {
          b.on = on;
          b.el.classList.toggle('is-beat', on);
        }
      }
    };

    // ---- Sizing ----
    const resize = () => {
      const next: Rendition = window.innerWidth >= window.innerHeight ? 'wide' : 'tall';
      if (next !== rendition) {
        rendition = next;
        slots.forEach((clip) => clip.forEach((s) => s.frame && release(s.frame)));
        slots = CLIPS.map((c) => Array.from({ length: c.count }, () => ({})));
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const cssW = canvas.clientWidth || window.innerWidth;
      const cssH = canvas.clientHeight || window.innerHeight;
      const w = Math.min(Math.round(cssW * dpr), Math.round(RENDITION_WIDTH[rendition] * 1.25));
      const h = Math.round(w * (cssH / Math.max(1, cssW)));
      if (w !== canvas.width || h !== canvas.height) {
        canvas.width = w;
        canvas.height = h;
        gradients.clear();
      }
      dirty = true;
      measure();
    };

    // ---- The loop: target from scroll, drawn time eases toward it ----
    let raf = 0;
    let drawnT = Number.NaN;
    let lastNow = 0;
    const update = (now: number) => {
      raf = 0;
      const pose = at(window.scrollY);
      const target = pose.T;
      const dt = lastNow ? Math.min(64, now - lastNow) : 16;
      lastNow = now;
      if (still || Number.isNaN(drawnT) || Math.abs(target - drawnT) > 0.5) drawnT = target; // jumps snap
      else drawnT += (target - drawnT) * (1 - Math.exp(-dt / TAU));
      const settling = Math.abs(target - drawnT) > 1e-4;
      if (!settling) drawnT = target;

      const nextFocus = indexAt(drawnT);
      if (nextFocus.c !== focus.c || Math.abs(nextFocus.i - focus.i) >= 2) {
        focus = nextFocus;
        pump();
      }
      // The scroll position fixes the lighting; the drawn time fixes the frame.
      const key = `${drawnT.toFixed(4)}|${Math.round(window.scrollY)}|${canvas.width}x${canvas.height}`;
      if (dirty || key !== lastKey) {
        draw(drawnT, pose);
        lastKey = key;
        dirty = false;
      }
      if (!still) {
        runBeats(drawnT);
        if (drawnT !== filmClock.T) filmClock.set(drawnT);
      }
      if (settling) schedule();
      else lastNow = 0;
    };
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    const onScroll = () => {
      if (!scrolled && !still) {
        scrolled = true;
        root.dataset.film = 'on'; // cues start hiding text only once the visitor scrolls
        pump();
      }
      schedule();
    };
    const onLoad = () => {
      started = true;
      collectBeats();
      measure();
      pump();
      schedule();
    };
    const onResize = () => {
      resize();
      collectBeats();
      schedule();
    };

    resize();
    collectBeats();
    if (!still) filmClock.on = true;
    if (window.scrollY > 0) onScroll(); // a deep link or restored position counts as scrolled
    focus = indexAt(at(window.scrollY).T);
    pump();
    update(performance.now());
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    // Section heights change as fonts land and late content mounts: re-measure then, not per frame.
    const ro = new ResizeObserver(() => {
      measure();
      schedule();
    });
    ro.observe(document.body);
    document.fonts?.ready.then(() => !disposed && onResize());

    return () => {
      disposed = true;
      filmClock.on = false;
      delete root.dataset.film;
      ro.disconnect();
      window.removeEventListener('load', onLoad);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) window.cancelAnimationFrame(raf);
      slots.forEach((clip) => clip.forEach((s) => s.frame && release(s.frame)));
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="t-film-stage pointer-events-none fixed inset-x-0 top-0 z-0 h-[100lvh] w-full"
    />
  );
}
