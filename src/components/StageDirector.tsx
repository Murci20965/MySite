import { useEffect } from 'react';
import { DECK, deckDepth, placeBox, stepLook } from '../lib/stage';
import type { Place } from '../lib/stage';
import { SHADE, shadeLayer } from '../lib/shade';

/** Where a nav link lands in a scene, in steps: past the first step's arrival (it ends at 0.12). */
const LAND = 0.3;

type SceneState = {
  el: HTMLElement;
  steps: HTMLElement[];
  places: Place[];
  stepVh: number;
  stack: boolean;
  /** a deeper shade under its steps (data-pool: the film's brightest frames) */
  pool: boolean;
  /** each step's placed box (viewport px, before its transform), for the shade under it */
  boxes: { left: number; top: number; width: number; height: number }[];
  top: number;
  stepPx: number;
  active: boolean;
};

/**
 * Runs every `.scene` (Scene.tsx) in staged mode: sizes each scene's spacer, places its steps for
 * the viewport, and on scroll moves only the active scene's steps (opacity and transform, so the
 * compositor does the work) and publishes the shade under each one for the film to paint. Staged mode follows html[data-film="on"], which FilmStage sets on the
 * first scroll and never under reduced motion or Save-Data. Mounted once, next to FilmStage.
 */
export default function StageDirector() {
  useEffect(() => {
    const root = document.documentElement;
    let scenes: SceneState[] = [];
    let staged = false;
    let raf = 0;
    let vw = 0;
    let vh = 0;

    const collect = () => {
      scenes = Array.from(document.querySelectorAll<HTMLElement>('.scene')).map((el) => {
        const steps = Array.from(el.querySelectorAll<HTMLElement>('.scene-step'));
        return {
          el,
          steps,
          places: steps.map((s) => JSON.parse(s.dataset.place ?? '{}') as Place),
          stepVh: Number(el.dataset.stepVh) || 85,
          stack: el.dataset.mode === 'stack',
          pool: el.dataset.pool !== undefined,
          boxes: [],
          top: 0,
          stepPx: 1,
          active: false,
        };
      });
    };

    const clearStep = (s: HTMLElement) => {
      s.style.cssText = '';
      delete s.dataset.on;
    };
    const clearShades = (s: SceneState) => s.steps.forEach((_, i) => shadeLayer.set(`${s.el.id}:${i}`, null));
    // A step's height, for its shade: measured at layout, and again when its "Read more" opens or closes.
    const measureBox = (s: SceneState, i: number) => {
      const b = s.boxes[i];
      if (!b) return;
      const step = s.steps[i];
      b.height = step.offsetHeight;
      if (step.style.top === '') b.top = vh - (parseFloat(step.style.bottom) || 0) - b.height;
    };

    const layout = () => {
      staged = root.dataset.film === 'on';
      vw = window.innerWidth;
      vh = window.innerHeight;
      for (const s of scenes) {
        s.stepPx = (s.stepVh / 100) * vh;
        if (!staged) {
          s.el.style.height = '';
          s.el.style.scrollMarginTop = '';
          delete s.el.dataset.active;
          s.steps.forEach(clearStep);
          clearShades(s);
          continue;
        }
        s.el.style.height = `${Math.round(s.steps.length * s.stepPx)}px`;
        // A nav link lands LAND into the first step, fully arrived and inside the scene's film window
        // (at the scene's top it was still half faded in, with the previous scene's film).
        s.el.style.scrollMarginTop = `${-Math.round(LAND * s.stepPx)}px`;
        s.steps.forEach((step, i) => {
          const b = placeBox(s.places[i], vw, vh);
          step.style.left = `${b.left}px`;
          step.style.width = `${b.width}px`;
          step.style.top = b.top === undefined ? '' : `${b.top}px`;
          step.style.bottom = b.bottom === undefined ? '' : `${b.bottom}px`;
          s.boxes[i] = { left: b.left, top: b.top ?? 0, width: b.width, height: 0 };
        });
        s.steps.forEach((_, i) => measureBox(s, i));
      }
      // Scene tops after every height is set: a scene's top depends on the scenes above it.
      for (const s of scenes) s.top = s.el.getBoundingClientRect().top + window.scrollY;
      update();
    };

    const update = () => {
      raf = 0;
      if (!staged) return;
      const y = window.scrollY;
      for (const s of scenes) {
        const n = s.steps.length;
        const p = (y - s.top) / s.stepPx;
        const active = p > -0.4 && p < n + 0.05;
        if (active !== s.active) {
          s.active = active;
          if (active) s.el.dataset.active = '';
          else {
            delete s.el.dataset.active;
            clearShades(s);
          }
        }
        if (!active) continue;
        const lastT = p - (n - 1);
        const ts = s.steps.map((_, i) => p - i);
        s.steps.forEach((step, i) => {
          const look = stepLook(ts[i], s.stack, lastT);
          // A deck card sinks into the pile as later cards land on it (lib/stage.ts DECK).
          const depth = s.stack ? deckDepth(ts[i], ts.slice(i + 1)) : 0;
          const y = look.y - DECK.lift * depth;
          const scale = look.scale * (1 - DECK.shrink * Math.min(depth, 6));
          const opacity = look.opacity * (1 - DECK.dim * Math.min(depth, 4));
          step.style.opacity = opacity.toFixed(3);
          step.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
          // A covered card keeps its glass but its words fade, so transparent cards never read through.
          if (s.stack) step.style.setProperty('--depth', depth.toFixed(3));
          // Only a step that is clearly on screen, and on top of its pile, takes pointer events.
          if (opacity > 0.5 && depth < 0.5) step.dataset.on = '';
          else delete step.dataset.on;
          // Its shade, painted by the film (lib/shade.ts), follows the step's transform (origin top
          // centre). In a deck only the top card casts one, or eight piled shades make a black block.
          const b = s.boxes[i];
          const alpha = opacity * (s.stack ? Math.max(0, 1 - depth) : 1) * (s.pool ? SHADE.pool : SHADE.base);
          shadeLayer.set(
            `${s.el.id}:${i}`,
            b ? { x: b.left + (b.width * (1 - scale)) / 2, y: b.top + y, w: b.width * scale, h: b.height * scale, alpha } : null
          );
        });
      }
    };
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    // Phones resize the viewport when the URL bar shows or hides; re-laying out then would change the
    // page height mid-scroll. Only a width change or a big height change (rotation) re-lays out.
    const onResize = () => {
      if (window.innerWidth !== vw || Math.abs(window.innerHeight - vh) > vh * 0.2) layout();
    };

    const onToggle = (e: Event) => {
      if (!staged) return;
      const step = (e.target as Element | null)?.closest?.('.scene-step');
      const s = step && scenes.find((sc) => sc.steps.includes(step as HTMLElement));
      if (!s) return;
      measureBox(s, s.steps.indexOf(step as HTMLElement));
      schedule();
    };

    // A keyboard user tabbing into a step that is not on screen is taken to it.
    const onFocus = (e: FocusEvent) => {
      if (!staged) return;
      const step = (e.target as Element | null)?.closest?.('.scene-step');
      if (!step || (step as HTMLElement).dataset.on !== undefined) return;
      const s = scenes.find((sc) => sc.steps.includes(step as HTMLElement));
      if (!s) return;
      const i = s.steps.indexOf(step as HTMLElement);
      window.scrollTo({ top: s.top + (i + 0.45) * s.stepPx, behavior: 'instant' as ScrollBehavior });
    };

    collect();
    layout();
    // Staged mode switches on with the first scroll (FilmStage sets data-film): re-lay out then.
    const mo = new MutationObserver(() => {
      if ((root.dataset.film === 'on') !== staged) layout();
    });
    mo.observe(root, { attributes: true, attributeFilter: ['data-film'] });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('focusin', onFocus);
    document.addEventListener('toggle', onToggle, true); // <details> toggle does not bubble
    document.fonts?.ready.then(layout);

    return () => {
      mo.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('toggle', onToggle, true);
      if (raf) window.cancelAnimationFrame(raf);
      for (const s of scenes) {
        s.el.style.height = '';
        delete s.el.dataset.active;
        s.steps.forEach(clearStep);
        clearShades(s);
      }
    };
  }, []);

  return null;
}
