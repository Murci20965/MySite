import AnimatedSection from './AnimatedSection';
import RevealHeading from './RevealHeading';
import Kicker from './Kicker';

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

export default function Experience() {
  return (
    // Chapter 03. Behind it the light bursts into an agent network that fills
    // the frame (the brightest stretch the text crosses), so everything reads
    // from one left-hand column over the graded side, and the network keeps the
    // right of the frame.
    <section id="experience" className="t-ink relative pb-24 pt-16 lg:pb-32 lg:pt-24">
      <div className="mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="max-w-[44rem]">
          <AnimatedSection animation="fade-in">
            <Kicker n="03" name="Experience" />
            {/* Film cue: the light bursts into the agent network (M2, 6 s). */}
            <div data-beat="m2:0.6" className="mt-6">
              <RevealHeading
                text="Professional experience"
                className="font-display text-5xl font-medium leading-[1.02] tracking-[-0.02em] text-fg lg:text-7xl"
              />
            </div>
            <p className="mt-6 font-sans text-lg leading-relaxed text-fg lg:text-xl">
              From ML foundations to production AI systems, and now the AI layer of XR education.
            </p>
          </AnimatedSection>

          <div className="mt-14">
            {experiences.map((exp, index) => (
              <AnimatedSection key={exp.id} animation="fade-in" delay={index > 0}>
                <article className="border-t border-fg/20 py-12">
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    {`${exp.duration} · ${exp.type}`}
                  </div>
                  <h3 className="mt-4 font-display text-3xl font-medium text-fg lg:text-4xl">{exp.role}</h3>
                  <div className="mt-2 font-sans text-base text-fg/90">
                    {exp.company} <span className="text-fg/80">{`· ${exp.location}`}</span>
                  </div>
                  <p className="mt-5 font-sans text-base leading-relaxed text-fg lg:text-lg">{exp.description}</p>

                  <div className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
                    {exp.metrics.map((metric, i) => (
                      <div key={i}>
                        <div className="font-display text-3xl text-fg">{metric.value}</div>
                        <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-fg/80">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <ul className="mt-7 space-y-2.5">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex gap-3 font-sans text-[15px] leading-relaxed text-fg/90">
                        <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-fg">
                    {exp.technologies.join(' · ')}
                  </p>
                </article>
              </AnimatedSection>
            ))}
          </div>

          {/* What I can build: the answer to "what would I hire him to do?".
              Principles covers HOW I work; this covers WHAT you get. */}
          <AnimatedSection animation="fade-in">
            <div className="mt-12 border-t border-fg/20 pt-12">
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">What I can build</div>
              <ol className="mt-8 space-y-9">
                {[
                  {
                    step: '01',
                    title: 'Agentic AI systems',
                    text: 'LLMs that take actions reliably: tool use, structured outputs under strict schemas, and evaluation loops that catch drift.',
                    proof: 'Avatar-3D Pipeline',
                    href: 'https://github.com/Murci20965/avatar-pipeline',
                  },
                  {
                    step: '02',
                    title: 'RAG & knowledge systems',
                    text: 'Retrieval that grounds answers in your own data, with honest failure modes instead of confident invention.',
                    proof: 'Applied at Artintel (LLM training and RAG data)',
                    href: '',
                  },
                  {
                    step: '03',
                    title: 'XR & 3D pipelines',
                    text: 'Text or images into web-ready 3D: generation, headless normalisation and delivery into the browser via WebXR.',
                    proof: 'Orbit-3D Asset Pipeline',
                    href: 'https://github.com/Murci20965/orbit-3d-pipeline',
                  },
                  {
                    step: '04',
                    title: 'MLOps delivery',
                    text: 'Models that survive contact with production: containerised services, CI/CD, and metrics measured on unseen data.',
                    proof: 'Real Estate Predictor',
                    href: 'https://github.com/Murci20965/real_estate_price_predictor',
                  },
                ].map((s) => (
                  <li key={s.step} className="grid grid-cols-[2.5rem_minmax(0,1fr)]">
                    <span className="pt-2 font-mono text-[11px] text-accent">{s.step}</span>
                    <div>
                      <h3 className="font-display text-2xl font-medium text-fg">{s.title}</h3>
                      <p className="mt-2 font-sans text-base leading-relaxed text-fg/90">{s.text}</p>
                      <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.15em] text-fg/80">
                        {s.href ? (
                          <a
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline-offset-4 transition-colors hover:text-accent hover:underline"
                          >
                            Proof: {s.proof} ↗
                          </a>
                        ) : (
                          <span>{s.proof}</span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
