import AnimatedSection from './AnimatedSection';
import RevealHeading from './RevealHeading';

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
  {
    id: '1',
    company: 'Nudle',
    role: 'Junior AI Engineer',
    location: 'Johannesburg, South Africa (Remote)',
    duration: 'May 2026 - Present',
    type: 'Full-time',
    description:
      'Building the AI layer of an XR simulation-training platform, turning text and images into interactive 3D learning experiences.',
    achievements: [
      'Cut 3D asset turnaround from days to hours with text/image-to-GLB generation pipelines delivered into XR via WebXR',
      'Mapped natural-language instructions to avatar actions and animation logic with explainable AI-driven reasoning',
      'Removed the need for engineering support in customising simulations: training scenarios, role-play dialogues and learning tasks generated from prompts',
      'Reduced manual grading workload across learner scenarios through automated assessment and feedback tooling',
    ],
    technologies: ['Python', 'FastAPI', 'Next.js', 'Docker', 'PostgreSQL'],
    metrics: [
      { label: 'Asset Turnaround', value: 'Days→hrs' },
      { label: 'Pipeline Output', value: '3D GLB' },
      { label: 'Scenario Setup', value: 'Prompt' },
    ],
  },
  {
    id: '2',
    company: 'Alignerr',
    role: 'AI Trainer',
    location: 'Remote',
    duration: 'Jan 2026 - Present',
    type: 'Freelance',
    description:
      'Systematically evaluating production model behaviour on reasoning, programming and agent tasks against strict quality rubrics.',
    achievements: [
      'Improved production model reliability on reasoning, programming and agent-behaviour tasks',
      'Reduced recurring failure modes in agentic and tool-use workflows through structured evaluation feedback used in training cycles',
    ],
    technologies: ['Python', 'LLM Evaluation', 'Agentic Workflows', 'Tool Use'],
    metrics: [
      { label: 'Focus', value: 'Agents' },
      { label: 'Method', value: 'Rubrics' },
      { label: 'Output', value: 'Evals' },
    ],
  },
  {
    id: '3',
    company: 'Artintel',
    role: 'Junior AI Software Developer',
    location: 'Remote',
    duration: 'Jan 2025 - Jul 2025',
    type: 'Contract',
    description:
      'Backend systems for a no-code LLM fine-tuning platform, enabling non-technical users to fine-tune models without engineering support.',
    achievements: [
      'Built backend services powering no-code LLM fine-tuning for non-technical users',
      'Consolidated training-data handling into a single ETL pipeline integrating external APIs and databases, cutting manual data-prep steps',
    ],
    technologies: ['Python', 'ETL Pipelines', 'API Integration', 'SQL'],
    metrics: [
      { label: 'Platform', value: 'No-code' },
      { label: 'Data Flow', value: '1 ETL' },
      { label: 'Users', value: 'Non-dev' },
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative bg-black pt-12 pb-24 lg:pt-16 lg:pb-32">
      <div className="mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <AnimatedSection animation="fade-in">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
              Experience
            </span>
            <span className="h-px flex-1 bg-white/15" />
            <span className="t-drift font-mono text-[11px] uppercase tracking-[0.28em] text-white/30">02</span>
          </div>

          <RevealHeading
            text="Professional experience"
            className="mb-6 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl"
          />
          <p className="max-w-2xl font-sans text-lg leading-relaxed text-white/70 lg:text-xl">
            From ML foundations to production AI systems, and now the AI layer of XR education.
          </p>
        </AnimatedSection>

        <div className="mt-16 border-t border-white/10">
          {experiences.map((exp, index) => (
            <AnimatedSection key={exp.id} animation="fade-in" delay={index > 0}>
              <article className="grid gap-6 border-b border-white/10 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12">
                <div>
                  <div className="font-mono text-sm text-white/80">{exp.duration}</div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                    {exp.type}
                  </div>
                  <div className="mt-5 font-sans text-white/90">{exp.company}</div>
                  <div className="font-sans text-sm text-white/50">{exp.location}</div>
                </div>

                <div>
                  <h3 className="mb-3 font-display text-2xl font-medium text-white sm:text-3xl">
                    {exp.role}
                  </h3>
                  <p className="mb-8 max-w-2xl font-sans leading-relaxed text-white/60">
                    {exp.description}
                  </p>

                  <div className="mb-8 flex flex-wrap gap-x-10 gap-y-4">
                    {exp.metrics.map((metric, i) => (
                      <div key={i}>
                        <div className="font-mono text-2xl text-white">{metric.value}</div>
                        <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <ul className="mb-8 space-y-2.5">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex gap-3 font-sans text-sm text-white/70">
                        <span className="select-none text-white/30">&mdash;</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] tracking-wide text-white/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>

        {/* What I can build: the answer to "what would I hire him to do?".
            Principles covers HOW I work; this covers WHAT you get. */}
        <AnimatedSection animation="fade-in">
          <div className="mt-20">
            <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">
              What I can build
            </div>
            <div className="grid gap-5 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
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
                  proof: 'Applied at Nudle and Alignerr',
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
                <div key={s.step} className="flex flex-col rounded-2xl border border-white/10 p-6">
                  <div className="font-mono text-[11px] text-lime-400/80">{s.step}</div>
                  <h3 className="mt-3 font-display text-lg font-medium text-white">{s.title}</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-white/55">{s.text}</p>
                  <div className="mt-auto pt-5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/35">
                    {s.href ? (
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-lime-400"
                      >
                        Proof: {s.proof}
                      </a>
                    ) : (
                      <span>{s.proof}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-in">
          <div className="mt-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                Availability
              </div>
              <p className="max-w-md font-sans text-lg text-white/80">
                Open to conversations about AI engineering, agentic systems, and XR learning.
              </p>
            </div>
            <a
              href="#contact"
              className="whitespace-nowrap rounded-full border border-white/25 px-6 py-3 font-sans text-sm font-medium text-white transition-colors hover:border-white/40 hover:bg-white/10"
            >
              Get in touch
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
