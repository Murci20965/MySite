import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import RevealHeading from './RevealHeading';
import ProjectDiagram from './ProjectDiagram';
import type { DiagramVariant } from './ProjectDiagram';

type Work = {
  repo: string;
  title: string;
  diagram: DiagramVariant;
  metric: string;
  summary: string;
  tags: string[];
  code: string;
  live?: string;
};

// Every project is public on GitHub. Facts are checked against each repo's
// code and README (record in .claude/docs/content-truth-map.md).
const WORK: Work[] = [
  {
    repo: 'avatar-pipeline',
    title: 'Avatar-3D Pipeline',
    diagram: 'avatar',
    metric: '14 states · 0.5s crossfade',
    summary:
      'Natural language to 14 deterministic 3D animation states: Groq Llama-3.3-70b under strict Pydantic validation, rendered in Next.js 16 and React Three Fiber.',
    tags: ['FastAPI', 'Groq', 'React Three Fiber', 'Docker'],
    code: 'https://github.com/Murci20965/avatar-pipeline',
    live: 'https://avatar-pipeline.vercel.app',
  },
  {
    repo: 'orbit-3d-pipeline',
    title: 'Orbit-3D Asset Pipeline',
    diagram: 'orbit',
    metric: 'Text + image · Draco GLB',
    summary:
      'Text or image to web-ready 3D: Tripo3D generation, Llama-4 Vision context, and a Dockerised headless Blender engine that centres, scales and Draco-compresses each mesh.',
    tags: ['Tripo3D', 'Llama-4 Vision', 'Blender', 'asyncio'],
    code: 'https://github.com/Murci20965/orbit-3d-pipeline',
    live: 'https://orbit-3d-pipeline.vercel.app',
  },
  {
    repo: 'real_estate_price_predictor',
    title: 'Real Estate Price Predictor',
    diagram: 'regression',
    metric: 'R² 0.9037 · RMSE 0.1341',
    summary:
      'XGBoost house-price model behind a FastAPI service, with a GitHub Actions pipeline that tests, builds to Amazon ECR and deploys to Elastic Beanstalk.',
    tags: ['XGBoost', 'FastAPI', 'Docker', 'AWS'],
    code: 'https://github.com/Murci20965/real_estate_price_predictor',
  },
  {
    repo: 'medical_image_classifier',
    title: 'Medical Image Classifier',
    diagram: 'transfer',
    metric: '82.85% acc · 0.96 recall',
    summary:
      'Pneumonia detection on chest X-rays with ResNet50 transfer learning, served by FastAPI with a Gradio UI, fully Dockerised.',
    tags: ['PyTorch', 'ResNet50', 'FastAPI', 'Gradio'],
    code: 'https://github.com/Murci20965/medical_image_classifier',
  },
  {
    repo: 'cat-dog-classifier',
    title: 'Cat vs Dog Classifier',
    diagram: 'vision',
    metric: 'FastAI CNN · Oxford-IIIT Pet',
    summary:
      'The full MLOps lifecycle on a vision model: a CNN trained with FastAI, served by FastAPI with a Gradio UI, and containerised with Docker.',
    tags: ['FastAI', 'FastAPI', 'Gradio', 'Docker'],
    code: 'https://github.com/Murci20965/cat-dog-classifier',
  },
  {
    repo: 'resume-match-ai',
    title: 'Resume-Match AI',
    diagram: 'match',
    metric: 'LLM fit scoring',
    summary:
      'Scores how well a resume matches a job posting, turning structured LLM analysis into actionable fit feedback.',
    tags: ['Python', 'LLM APIs', 'Docker'],
    code: 'https://github.com/Murci20965/resume-match-ai',
  },
  {
    repo: 'smart-spend',
    title: 'Smart-Spend',
    diagram: 'spend',
    metric: 'AI auto-categorisation',
    summary:
      'Personal finance manager that categorises bank transactions, learns from user corrections and gives personalised advice.',
    tags: ['FastAPI', 'PostgreSQL', 'Redis', 'Hugging Face'],
    code: 'https://github.com/Murci20965/smart-spend',
  },
];

const pad = (n: number) => String(n).padStart(2, '0');

// Progress bar + "01 of 07" counter, shared by both modes. Writes only when
// the label actually changes, so scrolling never churns the DOM text.
function showProgress(bar: HTMLDivElement | null, count: HTMLSpanElement | null, p: number) {
  if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
  const label = pad(Math.round(p * (WORK.length - 1)) + 1);
  if (count && count.textContent !== label) count.textContent = label;
}

// Pin only where a scroll-driven strip earns its place: wide screens, a fine
// pointer, and no reduced-motion preference. Everywhere else the strip is a
// native swipe/scroll carousel with scroll-snap.
const PIN_QUERY = '(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/**
 * Open-source work as a cinematic filmstrip. Pinned mode: the section sticks
 * for (track overflow) px of extra scroll, and vertical progress drives one
 * translate3d on the track. Each panel's opacity and scale, and its diagram's
 * parallax, follow its distance from centre. Transform and opacity only, and
 * nothing runs while the section is idle (scroll events, rAF-throttled).
 */
export default function OpenSource() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY);
    const sync = () => setPinned(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Pinned: vertical scroll drives the strip.
  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!pinned || !wrap || !stage || !track) return;
    const panels = Array.from(track.children) as HTMLElement[];
    let distance = 0;
    let raf = 0;

    // Travel = the last panel's right edge plus the end gutter, minus the
    // stage width. (track.scrollWidth leaves out a flex row's end padding,
    // which let the last panel overhang the viewport by ~70px.)
    const measure = () => {
      const last = panels[panels.length - 1];
      const endGutter = parseFloat(getComputedStyle(track).paddingRight) || 0;
      distance = Math.max(0, last.offsetLeft + last.offsetWidth + endGutter - stage.clientWidth);
      wrap.style.height = `${window.innerHeight + distance}px`;
    };

    const render = () => {
      raf = 0;
      const total = wrap.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -wrap.getBoundingClientRect().top / total)) : 0;
      const x = -p * distance;
      track.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
      const w = stage.clientWidth;
      for (const panel of panels) {
        // offsetLeft is layout position (pre-transform), so adding x gives the
        // panel's on-screen centre without reading transformed rects.
        const d = (panel.offsetLeft + x + panel.offsetWidth / 2 - w / 2) / w;
        const a = Math.abs(d);
        panel.style.opacity = (1 - Math.min(a * 0.9, 0.6)).toFixed(3);
        panel.style.transform = `scale(${(1 - Math.min(a * 0.1, 0.06)).toFixed(4)})`;
        const art = panel.querySelector<HTMLElement>('.t-film-art');
        if (art) art.style.transform = `translate3d(${(-d * 48).toFixed(1)}px, 0, 0)`;
      }
      showProgress(barRef.current, countRef.current, p);
    };

    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(render);
    };
    const onResize = () => {
      measure();
      schedule();
    };

    // Keyboard: focusing a link in an off-screen panel scrolls the page to
    // the point where that panel sits centre-stage. The stage is
    // overflow-x: clip, so the browser cannot scroll it sideways itself.
    const onFocusIn = (e: FocusEvent) => {
      const panel = (e.target as HTMLElement).closest('li');
      if (!panel || distance <= 0) return;
      const total = wrap.offsetHeight - window.innerHeight;
      const want = (panel.offsetLeft + panel.offsetWidth / 2 - stage.clientWidth / 2) / distance;
      const top = wrap.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + Math.min(1, Math.max(0, want)) * total, behavior: 'instant' });
    };

    measure();
    render();
    const ro = new ResizeObserver(onResize);
    ro.observe(track);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    track.addEventListener('focusin', onFocusIn);
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      track.removeEventListener('focusin', onFocusIn);
      if (raf) window.cancelAnimationFrame(raf);
      // Leave no inline state behind for the carousel mode.
      wrap.style.height = '';
      track.style.transform = '';
      for (const panel of panels) {
        panel.style.opacity = '';
        panel.style.transform = '';
        const art = panel.querySelector<HTMLElement>('.t-film-art');
        if (art) art.style.transform = '';
      }
    };
  }, [pinned]);

  // Carousel: progress follows the native horizontal scroll.
  useEffect(() => {
    const track = trackRef.current;
    if (pinned || !track) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = track.scrollWidth - track.clientWidth;
      showProgress(barRef.current, countRef.current, max > 0 ? track.scrollLeft / max : 0);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      track.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [pinned]);

  const step = (dir: 1 | -1) => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    track?.scrollBy({ left: dir * ((first?.offsetWidth ?? 320) + 24), behavior: 'smooth' });
  };

  const gutter = 'px-6 sm:px-10 lg:px-16 xl:px-24';

  return (
    <section id="opensource" className="relative bg-black">
      <div ref={wrapRef} className="relative">
        <div
          ref={stageRef}
          className={
            pinned
              ? 'sticky top-0 flex h-[100dvh] flex-col justify-center overflow-x-clip pt-20'
              : 'py-24 lg:py-32'
          }
        >
          <div className={`mx-auto w-full max-w-[1760px] ${gutter}`}>
            <AnimatedSection animation="fade-in">
              <div className="mb-8 flex items-center gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
                  Open source
                </span>
                <span className="h-px flex-1 bg-white/15" />
                <span className="t-drift font-mono text-[11px] uppercase tracking-[0.28em] text-white/30">03</span>
              </div>

              <div className="flex items-end justify-between gap-6">
                <div>
                  <RevealHeading
                    text="Open-source work"
                    className="mb-4 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl"
                  />
                  <p className="max-w-2xl font-sans text-lg leading-relaxed text-white/70">
                    Every project, public from the first commit. Two are live.
                  </p>
                  <a
                    href="https://github.com/Murci20965"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 font-sans text-sm font-medium text-white/80 transition-colors hover:text-white"
                  >
                    Full GitHub profile <ArrowUpRight className="t-nudge h-4 w-4" />
                  </a>
                </div>
                <div className="shrink-0 text-right" aria-hidden="true">
                  <span ref={countRef} className="block font-display text-4xl leading-none text-white lg:text-5xl">
                    01
                  </span>
                  <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                    of {pad(WORK.length)}
                  </span>
                  <div className="ml-auto mt-3 h-0.5 w-24 overflow-hidden rounded-full bg-white/10">
                    <div ref={barRef} className="t-film-bar h-full w-full bg-lime-400" />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <ol
            ref={trackRef}
            aria-label="Open-source projects"
            className={`flex gap-6 ${gutter} ${pinned ? 'mt-8' : 'mt-10'} ${
              pinned
                ? 't-film-track'
                : 't-carousel snap-x snap-mandatory overflow-x-auto scroll-px-6 pb-4 sm:scroll-px-10 lg:scroll-px-16 xl:scroll-px-24'
            }`}
          >
            {WORK.map((w) => (
              <li
                key={w.repo}
                className={`group relative flex shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e0e] ${
                  pinned ? 'h-[min(54vh,480px)] w-[min(440px,36vw)]' : 'w-[82vw] sm:w-[400px]'
                }`}
              >
                {/* Art is wider than its frame (inset -2rem) so the parallax
                    shift never reveals an edge. */}
                <div className="relative h-[42%] min-h-[150px] shrink-0 overflow-hidden">
                  <div className="t-film-art absolute inset-y-0 -left-8 -right-8">
                    <ProjectDiagram variant={w.diagram} />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="truncate font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                      {w.repo}
                    </span>
                    {w.live && (
                      <span className="t-live font-mono text-[11px] uppercase tracking-[0.2em] text-lime-400">
                        Live
                      </span>
                    )}
                  </div>
                  <h3 className="mb-2 font-display text-2xl font-medium text-white">{w.title}</h3>
                  <div className="mb-3 font-mono text-sm text-white">{w.metric}</div>
                  <p className="mb-4 line-clamp-3 font-sans text-sm leading-relaxed text-white/60">{w.summary}</p>
                  <div className="mb-5 flex flex-wrap gap-2">
                    {w.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] tracking-wide text-white/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center gap-6">
                    {w.live && (
                      <a
                        href={w.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-lime-400 transition-colors hover:text-lime-300"
                      >
                        Live demo <ArrowUpRight className="t-nudge h-4 w-4" />
                      </a>
                    )}
                    <a
                      href={w.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-sans text-sm text-white/70 transition-colors hover:text-white"
                    >
                      Code <ArrowUpRight className="t-nudge h-4 w-4" />
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {/* Header holds the progress and the profile link, so nothing sits in
              the bottom-right corner under the floating chat launcher. */}
          {!pinned && (
            <div className={`mx-auto mt-6 flex w-full max-w-[1760px] justify-end gap-2 ${gutter}`}>
              <button
                onClick={() => step(-1)}
                aria-label="Previous project"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => step(1)}
                aria-label="Next project"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
