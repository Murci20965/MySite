import { useEffect, useRef } from 'react';
import HeroTerminal from './HeroTerminal';

/**
 * Chapter 01, "Prompt". The film plays behind the whole page (FilmStage); the
 * hero is the story over its opening shot: a night desk, the camera gliding
 * toward the laptop as you scroll. The copy sits on the left over a soft side
 * scrim and leaves the right of the frame to the film. The terminal is the
 * site assistant, so the first thing a visitor can do is ask.
 */
export default function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);

  // Texts reveal: play the staggered entrance once on mount.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    void el.offsetWidth; // commit the hidden state, then reveal
    el.classList.add('is-shown');
  }, []);

  return (
    <section id="hero" className="relative flex min-h-[100dvh] items-center pt-24 pb-24 lg:pt-20">
      {/* Legibility over the film: top to bottom on phones (the copy spans the
          width over the centred subject), from the copy's side on wide
          screens. The phone top is /60 because the lime kicker in Paper mode
          needs ~85% paper coverage there (measured 3.95:1 at /20). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/50 to-bg/75 lg:bg-gradient-to-r lg:from-bg/80 lg:via-bg/40 lg:to-transparent"
      />

      <div
        ref={stageRef}
        className="t-stagger relative z-20 mx-auto w-full max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24"
      >
        <div className="max-w-xl">
          <div className="t-stagger-line t-stagger-line--1 mb-5 flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">01 · Prompt</span>
            <span className="h-px w-10 bg-fg/20" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-fg/60">AI Engineer</span>
          </div>

          <h1 className="t-stagger-line t-stagger-line--2 mb-6 font-display text-[clamp(2.6rem,9vw,3.4rem)] font-semibold leading-[0.98] tracking-[-0.02em] lg:text-[clamp(3.4rem,5vw,5.4rem)]">
            Nhlanhla
            <br />
            <span className="text-fg/60">Mokoena</span>
          </h1>

          <p className="t-stagger-line t-stagger-line--3 max-w-md font-sans text-base leading-relaxed text-fg/75 lg:text-lg">
            I build production AI systems: agentic workflows, RAG architectures and end-to-end MLOps.
            At Nudle I engineer the generative pipelines behind XR simulation learning. Ask the
            terminal anything about my work.
          </p>

          <div className="t-stagger-line t-stagger-line--4 mt-8 flex flex-wrap gap-3">
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

          <div className="t-stagger-line t-stagger-line--4 mt-8 max-w-lg">
            <HeroTerminal />
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-6 z-20 mx-auto flex max-w-[1760px] items-center gap-3 px-6 font-mono text-[11px] uppercase tracking-[0.22em] text-fg/60 sm:px-10 lg:px-16 xl:px-24"
      >
        <span className="h-px w-10 bg-fg/30" />
        Scroll to play
      </div>
    </section>
  );
}
