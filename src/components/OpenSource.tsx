import { ArrowUpRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import PopNumber from './PopNumber';

export default function OpenSource() {
  const contributions = [
    {
      repo: 'ml-pipeline-optimizer',
      description:
        'High-performance ML pipeline optimization toolkit with automated hyperparameter tuning and distributed training support.',
      language: 'Python',
      stars: 2400,
      forks: 340,
      commits: 156,
      role: 'Core Maintainer',
      lastUpdate: '2 days ago',
      tags: ['Machine Learning', 'Optimization', 'Pipeline'],
      link: '#',
    },
    {
      repo: 'realtime-anomaly-detection',
      description:
        'Real-time anomaly detection library for streaming data with support for multiple algorithms and custom models.',
      language: 'Python',
      stars: 1800,
      forks: 280,
      commits: 98,
      role: 'Creator',
      lastUpdate: '1 week ago',
      tags: ['Anomaly Detection', 'Streaming', 'Real-time'],
      link: '#',
    },
    {
      repo: 'explainable-ai-toolkit',
      description:
        'Comprehensive toolkit for model interpretability featuring SHAP, LIME, and custom visualization tools.',
      language: 'Python',
      stars: 3200,
      forks: 520,
      commits: 72,
      role: 'Contributor',
      lastUpdate: '3 days ago',
      tags: ['Explainable AI', 'Interpretability', 'Visualization'],
      link: '#',
    },
    {
      repo: 'data-quality-validator',
      description:
        'Automated data quality validation framework with schema enforcement and anomaly detection.',
      language: 'Python',
      stars: 1200,
      forks: 180,
      commits: 134,
      role: 'Creator',
      lastUpdate: '5 days ago',
      tags: ['Data Quality', 'Validation', 'Pipeline'],
      link: '#',
    },
    {
      repo: 'mlops-deployment-templates',
      description:
        'Production-ready MLOps templates for AWS, Azure, and GCP with CI/CD pipelines and monitoring.',
      language: 'Python / YAML',
      stars: 1600,
      forks: 420,
      commits: 88,
      role: 'Core Maintainer',
      lastUpdate: '1 week ago',
      tags: ['MLOps', 'DevOps', 'Cloud'],
      link: '#',
    },
  ];

  const stats = [
    { value: '892', label: 'Contributions' },
    { value: '42', label: 'Repositories' },
    { value: '156', label: 'Pull requests' },
    { value: '234', label: 'Issues resolved' },
  ];

  return (
    <section id="opensource" className="relative bg-black py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <AnimatedSection animation="fade-in">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
              Open source
            </span>
            <span className="h-px flex-1 bg-white/15" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/30">06</span>
          </div>

          <h2 className="mb-6 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl">
            Open-source work
          </h2>
          <p className="max-w-2xl font-sans text-lg leading-relaxed text-white/70">
            Building and maintaining tools across the machine-learning and AI ecosystem.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-6 border-y border-white/10 py-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-mono text-3xl text-white">
                  <PopNumber value={stat.value} />
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
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
              href="https://github.com"
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
