import { Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Hero() {
  const [modalMounted, setModalMounted] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
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
          className="t-stagger mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24 py-12 sm:py-16 lg:py-20"
        >
          <div className="flex justify-start lg:justify-start">
            <div className="w-full lg:w-[62%] lg:pr-12 xl:pr-16">
              <div className="t-stagger-line t-stagger-line--1 flex items-center gap-3 mb-5 sm:mb-6">
                <span className="w-2 h-2 rounded-full bg-white/80 flex-shrink-0"></span>
                <span className="font-mono text-[11px] sm:text-xs text-white/60 uppercase tracking-[0.28em]">
                  AI Engineer — Agentic AI, RAG &amp; MLOps
                </span>
              </div>

              <h1 className="t-stagger-line t-stagger-line--2 font-display text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-semibold mb-8 sm:mb-10 leading-[0.95] tracking-[-0.01em]">
                <div className="flex items-center gap-4 sm:gap-5">
                  <span className="text-white whitespace-nowrap">Nhlanhla</span>
                  <span className="text-white/50 whitespace-nowrap">
                    M
                    <button
                      onClick={openModal}
                      className="inline-flex items-center justify-center rounded-full bg-white/5 border border-white/25 hover:bg-white/15 hover:border-white/50 transition-colors duration-300 align-baseline"
                      style={{ width: '0.5em', height: '0.5em', marginLeft: '0.03em', marginRight: '0.03em', transform: 'translateY(-0.06em)' }}
                      aria-label="Play intro video"
                    >
                      <Play
                        style={{ width: '0.28em', height: '0.28em', marginLeft: '0.03em' }}
                        className="text-lime-400"
                        fill="currentColor"
                      />
                    </button>
                    koena
                  </span>
                </div>
              </h1>

              <p className="t-stagger-line t-stagger-line--3 font-sans text-base sm:text-lg text-white/55 max-w-2xl leading-relaxed lg:line-clamp-3">
                I build production AI systems — agentic workflows, RAG pipelines and end-to-end MLOps — shipped behind Python and FastAPI services. Right now I turn natural language into interactive 3D and XR learning experiences at Nudle.
              </p>
            </div>
          </div>

          <div className="t-stagger-line t-stagger-line--4 flex flex-wrap justify-center gap-3 mt-6 sm:mt-8">
            <button
              onClick={() => scrollToSection('projects')}
              className="font-sans px-8 py-3.5 bg-white text-black text-sm font-medium rounded-full hover:bg-white/85 active:scale-[0.98] transition duration-300"
            >
              View Projects
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="font-sans px-8 py-3.5 text-white text-sm font-medium border border-white/25 rounded-full hover:bg-white/10 hover:border-white/40 active:scale-[0.98] transition duration-300"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </div>

      {modalMounted && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-8 right-8 text-white hover:text-gray-300 transition-colors"
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
            <div className="w-full h-full rounded-2xl border border-white/15 bg-white/[0.03] flex flex-col items-center justify-center gap-4 px-8 text-center">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-white/25 bg-white/5">
                <Play className="w-5 h-5 text-lime-400" fill="currentColor" />
              </span>
              <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-white/50">
                Intro video — coming soon
              </p>
              <p className="font-sans text-sm text-white/40 max-w-md">
                A short introduction is on its way. Until then, the projects below speak for me.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
