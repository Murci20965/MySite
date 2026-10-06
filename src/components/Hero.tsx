import { useEffect, useRef } from 'react';
import StudioScreen from './StudioScreen';
import ScreenPlaceholder from './ScreenPlaceholder';
import HeroTerminal from './HeroTerminal';

/**
 * Chapter 01, "Prompt" (Studio direction): the story on the left, the laptop
 * on the right. The screen plays the film once it exists (a placeholder
 * until then), and its terminal is the site assistant, so the first thing a
 * visitor can do is ask.
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
    <section id="hero" className="relative flex min-h-[100dvh] items-center pt-24 pb-16 lg:pt-20">
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
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">01 · Prompt</span>
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
            I build production AI systems: agentic workflows, RAG architectures and end-to-end
            MLOps. At Nudle I engineer the generative pipelines behind XR simulation learning.
            The screen is live: ask it anything about my work.
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
          <StudioScreen media={<ScreenPlaceholder />}>
            <HeroTerminal />
          </StudioScreen>
        </div>
      </div>
    </section>
  );
}
