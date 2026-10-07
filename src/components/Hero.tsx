import { useEffect, useRef } from 'react';
import Kicker from './Kicker';

const RESUME = { href: '/resume.pdf', filename: 'Nhlanhla_Mokoena_Resume.pdf' };

/**
 * Chapter 01, "Prompt". The film is the front of the page (FilmStage): its
 * opening shot is a night desk, the camera gliding toward the laptop as you
 * scroll. The copy sits in the frame's measured dark zone (the window side on
 * wide screens, the top band on phones) with a lime margin rule, title
 * lettering and no box. The laptop stays in full light.
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
    <section id="hero" className="t-ink relative flex min-h-[100svh] items-center pb-24 pt-28">
      <div
        ref={stageRef}
        className="t-stagger relative z-20 mx-auto w-full max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24"
      >
        <div className="relative max-w-[35rem] lg:pl-9">
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-0 top-1 hidden w-px bg-gradient-to-b from-accent via-accent/40 to-transparent lg:block"
          />
          <Kicker n="01" name="Prompt" className="t-stagger-line t-stagger-line--1" />

          <h1 className="t-stagger-line t-stagger-line--2 mt-6 font-display text-[clamp(3.2rem,13vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.025em] text-fg lg:text-[clamp(4.5rem,6.4vw,6.5rem)]">
            Nhlanhla
            <br />
            <span className="font-normal italic">Mokoena</span>
          </h1>

          <p className="t-stagger-line t-stagger-line--3 mt-7 max-w-[30rem] font-sans text-lg leading-relaxed text-fg/90 lg:text-xl">
            I build production AI systems: agentic workflows, RAG architectures and end-to-end MLOps.
            At Nudle I engineer the generative pipelines behind XR simulation learning.
          </p>

          <div className="t-stagger-line t-stagger-line--4 mt-9 flex flex-wrap items-center gap-x-3 gap-y-4">
            <a
              href="#opensource"
              className="rounded-full bg-fg px-7 py-3 font-sans text-sm font-semibold text-bg transition-opacity hover:opacity-90 active:scale-[0.98]"
            >
              View my work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-fg/50 px-7 py-3 font-sans text-sm font-semibold text-fg transition-colors hover:border-fg hover:bg-fg/10 active:scale-[0.98]"
            >
              Get in touch
            </a>
            <a
              href={RESUME.href}
              download={RESUME.filename}
              className="ml-2 font-mono text-[11px] uppercase tracking-[0.24em] text-accent underline-offset-4 hover:underline"
            >
              Resume ↓
            </a>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-20 z-20 mx-auto flex max-w-[1760px] items-center gap-3 px-6 font-mono sm:bottom-7 text-[11px] uppercase tracking-[0.24em] text-fg/80 sm:px-10 lg:px-16 xl:px-24"
      >
        <span className="h-px w-10 bg-fg/50" />
        Scroll to play
      </div>
    </section>
  );
}
