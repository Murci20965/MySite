import { useCallback, useEffect, useRef, useState } from 'react';
import StudioScreen from './StudioScreen';
import HeroTerminal from './HeroTerminal';
import FilmScrub from './FilmScrub';
import type { ScrubMode } from './FilmScrub';
import { FILM } from '../lib/film';

// Pin where the whole hero fits one screen; elsewhere (phones, tablets, short
// windows) the film plays as the laptop scrolls up the page instead.
const PIN_QUERY = '(min-width: 1024px) and (min-height: 600px)';
const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';

function pickMode(): ScrubMode {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData || window.matchMedia(REDUCE_QUERY).matches) return 'still';
  return window.matchMedia(PIN_QUERY).matches ? 'pin' : 'pass';
}

/**
 * Chapter 01, "Prompt" (Studio direction): the story on the left, the laptop
 * on the right. The screen plays film M1 (night desk, dolly into the laptop)
 * scrubbed by scroll; on desktop the hero pins for one extra screen while it
 * plays. The screen's terminal is the site assistant, so the first thing a
 * visitor can do is ask.
 */
export default function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [mode, setMode] = useState<ScrubMode>(pickMode);

  useEffect(() => {
    const queries = [window.matchMedia(PIN_QUERY), window.matchMedia(REDUCE_QUERY)];
    const sync = () => setMode(pickMode());
    queries.forEach((q) => q.addEventListener('change', sync));
    return () => queries.forEach((q) => q.removeEventListener('change', sync));
  }, []);

  // The timeline bar under the laptop: one transform per progress change.
  const onProgress = useCallback((p: number) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
  }, []);
  const pinned = mode === 'pin';

  // Texts reveal: play the staggered entrance once on mount.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    void el.offsetWidth; // commit the hidden state, then reveal
    el.classList.add('is-shown');
  }, []);

  return (
    <section id="hero" ref={sectionRef} className={`relative ${pinned ? 'h-[200vh]' : ''}`}>
      <div
        className={`relative flex items-center pt-24 pb-16 lg:pt-20 ${
          pinned ? 'sticky top-0 h-[100dvh] overflow-hidden' : 'min-h-[100dvh]'
        }`}
      >
        <div className="absolute inset-0" aria-hidden="true">
          {/* Soft glows read as light on black and as smudges on paper: dark only. */}
          <div className="absolute top-1/4 right-1/4 hidden h-96 w-96 rounded-full bg-fg/5 blur-3xl dark:block" />
          <div className="absolute bottom-1/4 left-1/4 hidden h-96 w-96 rounded-full bg-fg/5 blur-3xl dark:block" />
        </div>

        <div
          ref={stageRef}
          className="t-stagger relative z-20 mx-auto grid w-full max-w-[1760px] items-center gap-12 px-6 sm:px-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:px-16 xl:px-24"
        >
          <div>
            <div className="t-stagger-line t-stagger-line--1 mb-5 flex items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
                01 · Prompt
              </span>
              <span className="h-px w-10 bg-fg/20" />
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-fg/60">
                AI Engineer
              </span>
            </div>

            <h1 className="t-stagger-line t-stagger-line--2 mb-6 font-display text-[clamp(2.6rem,9vw,3.4rem)] font-semibold leading-[0.98] tracking-[-0.02em] lg:text-[clamp(3.2rem,4.6vw,5rem)]">
              Nhlanhla
              <br />
              <span className="text-fg/60">Mokoena</span>
            </h1>

            <p className="t-stagger-line t-stagger-line--3 max-w-md font-sans text-base leading-relaxed text-fg/70 lg:text-lg">
              I build production AI systems: agentic workflows, RAG architectures and end-to-end MLOps. At
              Nudle I engineer the generative pipelines behind XR simulation learning. The screen is live: ask
              it anything about my work.
            </p>

            <div className="t-stagger-line t-stagger-line--4 mt-9 flex flex-wrap gap-3">
              <a
                href="#opensource"
                className="rounded-full bg-fg px-7 py-3 font-sans text-sm font-medium text-bg transition duration-300 hover:bg-fg/85 active:scale-[0.98]"
              >
                View my work
              </a>
              <a
                href="#contact"
                className="rounded-full border border-fg/25 px-7 py-3 font-sans text-sm font-medium text-fg transition duration-300 hover:border-fg/40 hover:bg-fg/10 active:scale-[0.98]"
              >
                Get in touch
              </a>
            </div>
          </div>

          <div className="t-stagger-line t-stagger-line--3">
            <StudioScreen
              media={
                <FilmScrub
                  clip={FILM.m1}
                  mode={mode}
                  track={sectionRef}
                  onProgress={onProgress}
                  label="Film, chapter one: a desk by a rainy window at night. The camera moves into the laptop screen, where code turns into streams of light."
                />
              }
              caption={
                mode === 'still' ? null : (
                  <figcaption
                    aria-hidden="true"
                    className="mt-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-fg/60"
                  >
                    <span>Scroll to play</span>
                    <span className="relative h-px flex-1 overflow-hidden bg-fg/15">
                      <span ref={barRef} className="t-film-bar t-scroll-linked absolute inset-0 bg-accent" />
                    </span>
                    <span>Prompt → People</span>
                  </figcaption>
                )
              }
            >
              <HeroTerminal />
            </StudioScreen>
          </div>
        </div>
      </div>
    </section>
  );
}
