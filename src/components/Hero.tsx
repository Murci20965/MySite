import { Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Hero() {
  const [modalMounted, setModalMounted] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  // Texts reveal: play the staggered entrance once on mount.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    void el.offsetWidth; // commit the hidden state, then reveal
    el.classList.add('is-shown');
  }, []);

  // Modal: scale up from --modal-scale once the surface is mounted.
  useEffect(() => {
    if (!modalMounted) return;
    const el = surfaceRef.current;
    if (!el) return;
    void el.offsetWidth; // commit the pre-open state, then scale up
    el.classList.add('is-open');
  }, [modalMounted]);

  const openModal = () => setModalMounted(true);
  const closeModal = () => {
    const el = surfaceRef.current;
    if (el) {
      el.classList.remove('is-open');
      el.classList.add('is-closing');
      window.setTimeout(() => setModalMounted(false), 150);
    } else {
      setModalMounted(false);
    }
  };

  return (
    <section id="hero" className="relative min-h-[100dvh] flex items-center justify-center pt-20 -mb-32">
      <div className="absolute inset-0">
        {/* Soft glows read as light on black and as smudges on paper: dark only. */}
        <div className="absolute top-1/4 right-1/4 hidden w-96 h-96 bg-fg/5 rounded-full blur-3xl dark:block" />
        <div className="absolute bottom-1/4 left-1/4 hidden w-96 h-96 bg-fg/5 rounded-full blur-3xl dark:block" />
      </div>

      <div className="stars-container absolute inset-0">
        <div className="radiate-star" style={{ top: '15%', left: '10%', animationDelay: '0s' }} />
        <div className="radiate-star" style={{ top: '25%', left: '85%', animationDelay: '0.5s' }} />
        <div className="radiate-star" style={{ top: '45%', left: '15%', animationDelay: '1s' }} />
        <div className="radiate-star" style={{ top: '65%', left: '75%', animationDelay: '1.5s' }} />
        <div className="radiate-star" style={{ top: '80%', left: '30%', animationDelay: '2s' }} />
        <div className="radiate-star" style={{ top: '35%', left: '60%', animationDelay: '2.5s' }} />
        <div className="radiate-star" style={{ top: '70%', left: '90%', animationDelay: '3s' }} />
        <div className="radiate-star" style={{ top: '10%', left: '50%', animationDelay: '3.5s' }} />
      </div>

      <div className="relative z-20 w-full">
        <div
          ref={stageRef}
          className="t-stagger mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24 py-10"
        >
          <div className="flex justify-start lg:justify-start">
            <div className="w-full lg:w-[54%] lg:pr-12 xl:pr-16">
              <div className="t-stagger-line t-stagger-line--1 flex items-center gap-3 mb-4 sm:mb-5">
                <span className="w-2 h-2 rounded-full bg-fg/80 flex-shrink-0"></span>
                <span className="font-mono text-[11px] sm:text-xs text-fg/60 uppercase tracking-[0.28em]">
                  AI Engineer &middot; Agentic AI, RAG &amp; MLOps
                </span>
              </div>

              {/* One line, always: the name never wraps, so it scales with the
                  viewport instead of breaking across two rows. */}
              <h1 className="t-stagger-line t-stagger-line--2 font-display text-[clamp(2rem,8.6vw,3rem)] lg:text-[clamp(3rem,4.3vw,4.6rem)] font-semibold mb-6 leading-[1] tracking-[-0.02em] whitespace-nowrap">
                <div className="flex flex-nowrap items-center gap-x-3 sm:gap-x-4">
                  <span className="text-fg whitespace-nowrap">Nhlanhla</span>
                  <span className="text-fg/50 whitespace-nowrap">
                    M
                    <button
                      onClick={openModal}
                      className="inline-flex items-center justify-center rounded-full bg-fg/5 border border-fg/25 hover:bg-fg/15 hover:border-fg/50 transition-colors duration-300 align-baseline"
                      style={{ width: '0.5em', height: '0.5em', marginLeft: '0.03em', marginRight: '0.03em', transform: 'translateY(-0.06em)' }}
                      aria-label="Play intro video"
                    >
                      <Play
                        style={{ width: '0.28em', height: '0.28em', marginLeft: '0.03em' }}
                        className="text-accent"
                        fill="currentColor"
                      />
                    </button>
                    koena
                  </span>
                </div>
              </h1>

              <p className="t-stagger-line t-stagger-line--3 font-sans text-base text-fg/55 max-w-lg leading-relaxed">
                I build production AI systems: agentic workflows, RAG architectures and end-to-end
                MLOps. At Nudle I engineer the generative pipelines behind XR simulation learning.
              </p>

              <div className="t-stagger-line t-stagger-line--4 mt-9 flex flex-wrap gap-3">
                <a
                  href="#opensource"
                  className="font-sans px-7 py-3 bg-fg text-bg text-sm font-medium rounded-full hover:bg-fg/85 active:scale-[0.98] transition duration-300"
                >
                  View Projects
                </a>
                <a
                  href="#contact"
                  className="font-sans px-7 py-3 text-fg text-sm font-medium border border-fg/25 rounded-full hover:bg-fg/10 hover:border-fg/40 active:scale-[0.98] transition duration-300"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalMounted && (
        <div
          className="fixed inset-0 z-50 bg-bg/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-8 right-8 text-fg hover:text-fg/70 transition-colors"
            aria-label="Close video"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            ref={surfaceRef}
            className="t-modal relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full rounded-2xl border border-fg/15 bg-fg/[0.03] flex flex-col items-center justify-center gap-4 px-8 text-center">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-fg/25 bg-fg/5">
                <Play className="w-5 h-5 text-accent" fill="currentColor" />
              </span>
              <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-fg/50">
                Intro video coming soon
              </p>
              <p className="font-sans text-sm text-fg/40 max-w-md">
                A short introduction is on its way. Until then, the projects below speak for me.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
