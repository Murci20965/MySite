import { useCallback, useEffect, useRef, useState } from 'react';
import { Github, ArrowUpRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import TiltCard from './TiltCard';

export default function Projects() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const tabsRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);

  const filters = ['All', '3D & XR', 'Machine Learning', 'AI Apps'];

  const projects = [
    {
      title: 'Avatar-3D Pipeline',
      category: '3D & XR',
      description:
        'A "Director & Marionette" engine that translates natural language into 14 deterministic 3D skeletal animation states — Groq Llama-3.3-70b under strict Pydantic JSON validation, rendered in Next.js 16 / React Three Fiber with 0.5s animation crossfading.',
      image: '/projects/avatar-pipeline.png',
      metrics: { accuracy: '14 states', impact: '0.5s crossfade', data: 'Llama-3.3-70b' },
      tech: ['FastAPI', 'Groq', 'Next.js 16', 'React Three Fiber', 'Docker'],
      github: 'https://github.com/Murci20965/avatar-pipeline',
      demo: 'https://avatar-pipeline.vercel.app',
      duration: 'Live demo',
    },
    {
      title: 'Orbit-3D Asset Pipeline',
      category: '3D & XR',
      description:
        'Multimodal text/image-to-3D generation pipeline producing optimised, web-ready 3D models — a Dockerised headless Blender engine centres, scales and formats AI-generated meshes for WebGL, with asyncio orchestration keeping latency low.',
      image: '/projects/orbit-3d-pipeline.png',
      metrics: { accuracy: 'Text + image', impact: 'Web-ready GLB', data: 'Headless Blender' },
      tech: ['Next.js 16', 'FastAPI', 'Tripo3D', 'Llama-4 Vision', 'Blender'],
      github: 'https://github.com/Murci20965/orbit-3d-pipeline',
      demo: 'https://orbit-3d-pipeline.vercel.app',
      duration: 'Live demo',
    },
    {
      title: 'Real Estate Price Predictor',
      category: 'Machine Learning',
      description:
        'End-to-end MLOps system predicting house prices with gradient boosting — from training and evaluation through a CI/CD pipeline with GitHub Actions and Docker to a deployable FastAPI service.',
      image: '/projects/real_estate_price_predictor.png',
      metrics: { accuracy: 'R² 0.9037', impact: 'RMSE 0.1341', data: 'CI/CD + Docker' },
      tech: ['XGBoost', 'FastAPI', 'Docker', 'GitHub Actions'],
      github: 'https://github.com/Murci20965/real_estate_price_predictor',
      demo: '',
      duration: 'MLOps',
    },
    {
      title: 'Medical Image Classifier',
      category: 'Machine Learning',
      description:
        'End-to-end pneumonia-detection system on chest X-rays using ResNet50 transfer learning — full pipeline from training and evaluation to a deployment-ready FastAPI service with an interactive Streamlit UI.',
      image: '/projects/medical_image_classifier.png',
      metrics: { accuracy: '82.85% acc', impact: '0.96 recall', data: 'ResNet50' },
      tech: ['PyTorch', 'ResNet50', 'FastAPI', 'Streamlit', 'Docker'],
      github: 'https://github.com/Murci20965/medical_image_classifier',
      demo: '',
      duration: 'MLOps',
    },
    {
      title: 'Resume-Match AI',
      category: 'AI Apps',
      description:
        'Automated tool that evaluates how well a jobseeker’s resume matches a job posting — structured LLM analysis turned into actionable fit feedback.',
      image: '/projects/resume-match-ai.png',
      metrics: { accuracy: 'Fit scoring', impact: 'Instant feedback', data: 'LLM-powered' },
      tech: ['Python', 'LLM APIs', 'FastAPI'],
      github: 'https://github.com/Murci20965/resume-match-ai',
      demo: '',
      duration: 'AI tool',
    },
    {
      title: 'Smart-Spend',
      category: 'AI Apps',
      description:
        'AI-powered personal finance management system — automated transaction understanding and budgeting intelligence built as a full-stack TypeScript application.',
      image: '/projects/smart-spend.png',
      metrics: { accuracy: 'Auto-categorise', impact: 'Budget insight', data: 'Full-stack TS' },
      tech: ['TypeScript', 'React', 'AI APIs'],
      github: 'https://github.com/Murci20965/smart-spend',
      demo: '',
      duration: 'AI tool',
    },
  ];

  const filteredProjects =
    selectedFilter === 'All' ? projects : projects.filter((p) => p.category === selectedFilter);

  const positionUnderline = useCallback((animate: boolean) => {
    const container = tabsRef.current;
    const underline = underlineRef.current;
    if (!container || !underline) return;
    const active = container.querySelector<HTMLElement>('[data-active="true"]');
    if (!active) return;
    const apply = () => {
      underline.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop + active.offsetHeight}px)`;
      underline.style.width = `${active.offsetWidth}px`;
    };
    if (animate) {
      apply();
    } else {
      const prev = underline.style.transition;
      underline.style.transition = 'none';
      apply();
      void underline.offsetWidth;
      underline.style.transition = prev;
    }
  }, []);

  useEffect(() => {
    positionUnderline(false);
    const onResize = () => positionUnderline(false);
    window.addEventListener('resize', onResize);
    if (document.fonts) {
      document.fonts.ready.then(() => positionUnderline(false));
    }
    return () => window.removeEventListener('resize', onResize);
  }, [positionUnderline]);

  useEffect(() => {
    positionUnderline(true);
  }, [selectedFilter, positionUnderline]);

  return (
    <section id="projects" className="relative bg-black py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <AnimatedSection animation="fade-in">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
              Projects
            </span>
            <span className="h-px flex-1 bg-white/15" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/30">03</span>
          </div>

          <h2 className="mb-6 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl">
            Selected work
          </h2>
          <p className="max-w-2xl font-sans text-lg leading-relaxed text-white/70">
            Real systems, really shipped — from text-to-3D pipelines to end-to-end MLOps. Code is public; two are live.
          </p>

          <div ref={tabsRef} className="relative mt-10 flex flex-wrap gap-x-6 gap-y-3 pb-2">
            {filters.map((filter) => (
              <button
                key={filter}
                data-active={selectedFilter === filter}
                onClick={() => setSelectedFilter(filter)}
                className={`font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  selectedFilter === filter ? 'text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {filter}
              </button>
            ))}
            <span ref={underlineRef} className="t-underline" aria-hidden="true" />
          </div>
        </AnimatedSection>

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2">
          {filteredProjects.map((project, index) => (
            <AnimatedSection key={project.title} animation="fade-in" delay={index % 2 === 1}>
              <article className="group flex flex-col">
                <TiltCard className="aspect-[16/10] border border-white/10">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-black/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
                    {project.category}
                  </span>
                </TiltCard>

                <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span>{project.duration}</span>
                  </div>

                  <h3 className="mb-3 font-display text-2xl font-medium text-white">{project.title}</h3>
                  <p className="mb-6 font-sans text-sm leading-relaxed text-white/60">
                    {project.description}
                  </p>

                  <div className="mb-6 flex flex-wrap gap-x-8 gap-y-3 border-y border-white/10 py-4">
                    {[
                      { v: project.metrics.accuracy, l: 'Key metric' },
                      { v: project.metrics.impact, l: 'Impact' },
                      { v: project.metrics.data, l: 'Built on' },
                    ].map((m, i) => (
                      <div key={i}>
                        <div className="font-mono text-base text-white">{m.v}</div>
                        <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
                          {m.l}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6 flex flex-wrap gap-2">
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] tracking-wide text-white/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-6">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-sans text-sm text-white/70 transition-colors hover:text-white"
                    >
                      <Github className="h-4 w-4" /> Code
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-sans text-sm text-white/70 transition-colors hover:text-white"
                      >
                        Live demo <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-in">
          <div className="mt-16 border-t border-white/10 pt-8">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 font-sans text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              Discuss a project <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
