import { ArrowUpRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import RevealHeading from './RevealHeading';

export default function OpenSource() {
  const contributions = [
    {
      repo: 'avatar-pipeline',
      description:
        'AI-to-3D interaction engine mapping natural language to deterministic WebGL animations, built with Next.js 16, Dockerized FastAPI and Groq-accelerated Llama-3.3.',
      language: 'TypeScript / Python',
      stars: 1,
      forks: 0,
      commits: 12,
      role: 'Creator',
      lastUpdate: 'Apr 2026',
      tags: ['3D & XR', 'LLM Agents', 'React Three Fiber'],
      link: 'https://github.com/Murci20965/avatar-pipeline',
    },
    {
      repo: 'orbit-3d-pipeline',
      description:
        'Automated pipeline for generating, optimizing and contextualizing AI-driven 3D assets for interactive learning, using Tripo3D, Llama-4 Vision and headless Blender.',
      language: 'Python',
      stars: 1,
      forks: 0,
      commits: 18,
      role: 'Creator',
      lastUpdate: 'Apr 2026',
      tags: ['Text-to-3D', 'Multimodal', 'Blender'],
      link: 'https://github.com/Murci20965/orbit-3d-pipeline',
    },
    {
      repo: 'smart-spend',
      description: 'AI-powered personal finance management system.',
      language: 'Python',
      stars: 1,
      forks: 1,
      commits: 23,
      role: 'Creator',
      lastUpdate: 'Dec 2025',
      tags: ['AI Apps', 'Personal Finance'],
      link: 'https://github.com/Murci20965/smart-spend',
    },
    {
      repo: 'resume-match-ai',
      description:
        'Automated tool that evaluates how well a jobseeker’s resume matches a job posting.',
      language: 'Python',
      stars: 1,
      forks: 0,
      commits: 16,
      role: 'Creator',
      lastUpdate: 'Oct 2025',
      tags: ['LLM Apps', 'Careers'],
      link: 'https://github.com/Murci20965/resume-match-ai',
    },
    {
      repo: 'cat-dog-classifier',
      description:
        'End-to-end image classifier with FastAI, served via FastAPI and containerized with Docker: a full MLOps workflow from training to deployable app with a Gradio UI.',
      language: 'Python',
      stars: 1,
      forks: 0,
      commits: 18,
      role: 'Creator',
      lastUpdate: 'Aug 2025',
      tags: ['MLOps', 'Computer Vision', 'FastAI'],
      link: 'https://github.com/Murci20965/cat-dog-classifier',
    },
  ];

  return (
    <section id="opensource" className="relative bg-black py-24 lg:py-32">
      <div className="mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <AnimatedSection animation="fade-in">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
              Open source
            </span>
            <span className="h-px flex-1 bg-white/15" />
            <span className="t-drift font-mono text-[11px] uppercase tracking-[0.28em] text-white/30">06</span>
          </div>

          <RevealHeading
            text="Open-source work"
            className="mb-6 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl"
          />
          <p className="max-w-2xl font-sans text-lg leading-relaxed text-white/70">
            Everything I build in the open: pipelines, apps and experiments, public from day one.
          </p>

        </AnimatedSection>

        <div className="border-b border-white/10">
          {contributions.map((contrib, index) => (
            <AnimatedSection key={contrib.repo} animation="fade-in" delay={index > 0}>
              <article className="grid gap-4 border-t border-white/10 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)] md:gap-12">
                <div>
                  <h3 className="break-words font-mono text-base text-white">{contrib.repo}</h3>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                    {contrib.role}
                  </div>
                  <div className="mt-4 font-mono text-sm text-white/50">{contrib.language}</div>
                </div>

                <div>
                  <p className="mb-5 max-w-2xl font-sans leading-relaxed text-white/60">
                    {contrib.description}
                  </p>

                  <div className="mb-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-white/45">
                    <span>&#9733; {contrib.stars.toLocaleString()}</span>
                    <span>{contrib.forks.toLocaleString()} forks</span>
                    <span>{contrib.commits} commits</span>
                    <span>{contrib.lastUpdate}</span>
                  </div>

                  <div className="mb-5 flex flex-wrap gap-2">
                    {contrib.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] tracking-wide text-white/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={contrib.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-sans text-sm text-white/70 transition-colors hover:text-white"
                  >
                    View repository <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-in">
          <div className="mt-10">
            <a
              href="https://github.com/Murci20965"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              View full GitHub profile <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
