import { Scene, Step, StepLabel } from './Scene';
import type { Place } from '../lib/stage';

interface ExperienceData {
  id: string;
  company: string;
  role: string;
  location: string;
  duration: string;
  type: string;
  description: string;
  achievements: string[];
  technologies: string[];
  metrics: Array<{ label: string; value: string }>;
}

const experiences: ExperienceData[] = [
  // Source of truth: the CV (Sep 2026 export). Where a CV claim is contradicted
  // by evidence it is softened or left out, and the CV is flagged for a fix
  // (see .claude/docs/content-truth-map.md). Employer internals beyond what
  // the CV itself discloses never appear here.
  {
    id: '1',
    company: 'Nudle',
    role: 'AI Engineer',
    location: 'Johannesburg, South Africa (On-site)',
    duration: 'May 2025 - Present',
    type: 'XR Simulations',
    description:
      'Engineering the AI layer of an XR simulation-training platform: agentic generation pipelines that turn curriculum input into interactive 3D lessons, served by containerised GPU models.',
    achievements: [
      'Developed a headless Blender AI agent framework that executes programmatic Python scripts to build, bake and render 3D lesson environments from dynamic curricular inputs',
      'Architected multimodal GenAI pipelines integrating TRELLIS for high-fidelity 3D asset generation from text and image prompts, cutting manual 3D modelling overhead by 65%',
      'Orchestrated text-to-video workflows to render domain-specific educational lesson animations',
      'Scaled Docker-containerised GPU serving for production video, image and 3D generation models',
    ],
    technologies: ['Python', 'FastAPI', 'Agentic AI', 'Blender', 'TRELLIS', 'Text-to-video', 'Docker'],
    metrics: [
      { label: 'Manual 3D modelling', value: '-65%' },
      { label: 'Generation', value: '3D+video' },
      { label: 'GPU serving', value: 'Docker' },
    ],
  },
  {
    id: '2',
    company: 'Alignerr',
    role: 'AI Trainer',
    location: 'Remote',
    duration: 'Dec 2024 - Jan 2025',
    type: 'AI Model Training',
    description:
      'Scoring, red-teaming and refining LLM responses to improve dialogue safety and reasoning alignment.',
    achievements: [
      'Improved dialogue safety and reasoning alignment, optimising model adherence across edge-case benchmarks by systematically scoring, red-teaming and refining model responses',
      'Conducted deep-dive alignment testing on LLMs, identifying behavioural drift and improving conversational reasoning',
      'Evaluated complex model outputs for strict compliance with safety guidelines and behavioural guardrails',
    ],
    technologies: ['LLM Evaluation', 'Red-teaming', 'AI Safety', 'Alignment'],
    metrics: [
      { label: 'Focus', value: 'Safety' },
      { label: 'Method', value: 'Red-team' },
      { label: 'Output', value: 'Evals' },
    ],
  },
  {
    id: '3',
    company: 'Artintel',
    role: 'Junior AI Software Developer',
    location: 'Remote',
    duration: 'Oct 2023 - Sep 2024',
    type: 'AI Software',
    description:
      'Data and evaluation infrastructure for LLM training and RAG applications, exposed through REST APIs for non-technical users.',
    achievements: [
      'Converted unstructured data into clean tokens for LLM training and RAG applications',
      'Integrated Hugging Face Transformers and PyTorch into a CI/CD pipeline for automated model evaluation',
      'Lowered computational overhead and abstracted model complexity behind REST APIs for non-technical users',
    ],
    technologies: ['Python', 'PyTorch', 'Hugging Face', 'RAG', 'CI/CD', 'REST APIs'],
    metrics: [
      { label: 'Data', value: 'LLM-ready' },
      { label: 'Evaluation', value: 'CI/CD' },
      { label: 'Users', value: 'Non-dev' },
    ],
  },
];

/** What I can build: the answer to "what would I hire him to do?". Principles covers HOW I work;
 *  this covers WHAT you get. */
const capabilities = [
  {
    title: 'Agentic AI systems',
    text: 'LLMs that take actions reliably: tool use, structured outputs under strict schemas, and evaluation loops that catch drift.',
    proof: 'Avatar-3D Pipeline',
    href: 'https://github.com/Murci20965/avatar-pipeline',
  },
  {
    title: 'RAG & knowledge systems',
    text: 'Retrieval that grounds answers in your own data, with honest failure modes instead of confident invention.',
    proof: 'Applied at Artintel (LLM training and RAG data)',
    href: '',
  },
  {
    title: 'XR & 3D pipelines',
    text: 'Text or images into web-ready 3D: generation, headless normalisation and delivery into the browser via WebXR.',
    proof: 'Orbit-3D Asset Pipeline',
    href: 'https://github.com/Murci20965/orbit-3d-pipeline',
  },
  {
    title: 'MLOps delivery',
    text: 'Models that survive contact with production: containerised services, CI/CD, and metrics measured on unseen data.',
    proof: 'Real Estate Predictor',
    href: 'https://github.com/Murci20965/real_estate_price_predictor',
  },
];

// Film 5.0-7.6 s, the light field: open on the right while threads stream in from the left
// (storyboard v1). Phones: the slice's upper band.
const ROLE_PLACES: Place[] = [
  { wide: { x: 0.55, y: 0.24, w: 0.36 }, tall: { y: 0.13 } },
  { wide: { x: 0.56, y: 0.3, w: 0.35 }, tall: { y: 0.15 } },
  { wide: { x: 0.55, y: 0.27, w: 0.36 }, tall: { y: 0.13 } },
];
const CAPABILITY_PLACES: Place[] = [
  { wide: { x: 0.57, y: 0.32, w: 0.32 }, tall: { y: 0.18 } },
  { wide: { x: 0.58, y: 0.38, w: 0.31 }, tall: { y: 0.2 } },
  { wide: { x: 0.57, y: 0.3, w: 0.32 }, tall: { y: 0.18 } },
  { wide: { x: 0.58, y: 0.36, w: 0.31 }, tall: { y: 0.2 } },
];

export default function Experience() {
  return (
    // Chapter 03: one role at a time (Nudle, then Alignerr, then Artintel), then what I can build.
    <Scene id="experience" n="03" name="Experience">
      {experiences.map((exp, i) => (
        <Step key={exp.id} place={ROLE_PLACES[i]}>
          <StepLabel n="03" name="Experience" i={i} of={experiences.length} />
          <div className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            {`${exp.duration} · ${exp.type}`}
          </div>
          <h3 className="mt-3 font-display text-4xl font-medium leading-[1.04] tracking-[-0.02em] text-fg lg:text-5xl">
            {exp.role}
          </h3>
          <div className="mt-2 font-sans text-base text-fg">
            {exp.company} <span className="text-fg/80">{`· ${exp.location}`}</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {exp.metrics.map((metric) => (
              <div key={metric.label}>
                <div className="font-display text-2xl text-fg">{metric.value}</div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-fg">{metric.label}</div>
              </div>
            ))}
          </div>
          <details className="step-more mt-6">
            <summary>Read more</summary>
            <div className="step-more-body mt-4 space-y-4 pr-2">
              <p className="font-sans text-base leading-relaxed text-fg">{exp.description}</p>
              <ul className="space-y-2.5">
                {exp.achievements.map((achievement) => (
                  <li key={achievement} className="flex gap-3 font-sans text-[15px] leading-relaxed text-fg">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
              <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-fg">
                {exp.technologies.join(' · ')}
              </p>
            </div>
          </details>
        </Step>
      ))}
      {capabilities.map((c, i) => (
        <Step key={c.title} place={CAPABILITY_PLACES[i]}>
          <StepLabel n="03" name="What I can build" i={i} of={capabilities.length} />
          <h3 className="mt-5 font-display text-3xl font-medium leading-[1.08] tracking-[-0.02em] text-fg lg:text-4xl">
            {c.title}
          </h3>
          <p className="mt-3 font-sans text-base leading-relaxed text-fg lg:text-lg">{c.text}</p>
          <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-fg">
            {c.href ? (
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                Proof: {c.proof} ↗
              </a>
            ) : (
              <span>{c.proof}</span>
            )}
          </div>
        </Step>
      ))}
    </Scene>
  );
}
