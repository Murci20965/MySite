import { useEffect, useRef } from 'react';
import { filmClock } from '../lib/filmJourney';

/* Chapter 06, "Classroom": the film's emotional peak. The section is tall and
 * its stage sticky, so it holds while film clip M5 plays behind it (lit
 * server racks, a golden doorway opening at 5-7 s, the XR classroom from
 * 8 s). The title and copy move with the FILM, not with their own scroll
 * progress: the two words part as the doorway opens and the mission copy
 * lands when the classroom appears. Under reduced motion (the film is a still
 * then) both render in their final state.
 */

// Film times (lib/film.ts: clip index + fraction). M5 is clip 4.
const DOOR_OPEN = [4.45, 4.72] as const;
const CLASSROOM = [4.78, 4.9] as const;

const ramp = (T: number, [a, b]: readonly [number, number]) => Math.min(1, Math.max(0, (T - a) / (b - a)));

export default function ExpandMedia() {
  const leftRef = useRef<HTMLHeadingElement>(null);
  const rightRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apply = (T: number) => {
      const open = filmClock.on ? ramp(T, DOOR_OPEN) : 1;
      const copy = filmClock.on ? ramp(T, CLASSROOM) : 1;
      // Clamped so the words separate dramatically but never leave the viewport.
      const spread = Math.min(26, (window.innerWidth * 0.26) / 16);
      if (leftRef.current) leftRef.current.style.transform = `translateX(${-open * spread}vw)`;
      if (rightRef.current) rightRef.current.style.transform = `translateX(${open * spread}vw)`;
      if (copyRef.current) {
        copyRef.current.style.opacity = String(copy);
        copyRef.current.style.transform = `translateY(${(1 - copy) * 24}px)`;
      }
    };
    return filmClock.subscribe(apply);
  }, []);

  return (
    <section id="vision" className="relative">
      <div className="relative h-[240vh]">
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
          {/* Its own small scrim: this label sits over the film's brightest frames. */}
          <div className="pointer-events-none absolute top-24 z-40 flex items-center gap-4 rounded-full bg-bg/60 px-4 py-1.5">
            <span className="h-px w-10 bg-fg/25" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-fg/60">Vision</span>
            <span className="h-px w-10 bg-fg/25" />
          </div>

          {/* Legibility: a soft pool behind the title, and a floor under the copy. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_45%,rgb(var(--c-bg)/0.7),rgb(var(--c-bg)/0.3)_60%,transparent_85%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg/90 via-bg/50 to-transparent"
          />

          {/* Theme ink over the pool, not mix-blend-difference: the film is a
              separate fixed layer, so a blend only ever saw the pool and
              rendered grey on paper. */}
          <div className="pointer-events-none absolute z-40 flex w-full flex-col items-center gap-2 text-center">
            <h2
              ref={leftRef}
              className="t-scroll-linked font-display text-5xl font-medium leading-none tracking-[-0.01em] text-fg sm:text-6xl lg:text-7xl"
            >
              Learning,
            </h2>
            <h2
              ref={rightRef}
              className="t-scroll-linked font-display text-5xl font-medium leading-none tracking-[-0.01em] text-fg sm:text-6xl lg:text-7xl"
            >
              made spatial
            </h2>
          </div>

          <div
            ref={copyRef}
            className="t-scroll-linked pointer-events-none absolute bottom-10 z-40 max-w-2xl px-6 text-center"
            style={{ opacity: 0 }}
          >
            <p className="font-sans text-base leading-relaxed text-fg/85 sm:text-lg">
              Traditional education gates real skills behind resources and rigid methods. I&rsquo;m
              building toward XR learning where anyone, anywhere, can practise real skills:
              interactively, spatially, without the gatekeeping.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
