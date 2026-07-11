import AnimatedSection from './AnimatedSection';

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
    company: 'Tech Innovations Inc.',
    role: 'Senior ML Engineer',
    location: 'San Francisco, CA',
    duration: '2022 - Present',
    type: 'Full-time',
    description:
      'Leading machine learning infrastructure and deploying production-grade AI systems for enterprise clients.',
    achievements: [
      'Reduced model inference latency by 60% through optimization',
      'Built automated ML pipeline handling 10M+ records daily',
      'Led team of 5 engineers on deep learning projects',
    ],
    technologies: ['Python', 'TensorFlow', 'Kubernetes', 'AWS SageMaker', 'PostgreSQL'],
    metrics: [
      { label: 'Models Deployed', value: '15+' },
      { label: 'Latency Reduction', value: '60%' },
      { label: 'Team Size', value: '5' },
    ],
  },
  {
    id: '2',
    company: 'Data Analytics Pro',
    role: 'Data Scientist',
    location: 'New York, NY',
    duration: '2020 - 2022',
    type: 'Full-time',
    description:
      'Developed predictive analytics solutions and statistical models for financial services.',
    achievements: [
      'Created fraud detection model with 98.5% accuracy',
      'Automated reporting saving 40+ hours monthly',
      'Mentored 3 junior data scientists',
    ],
    technologies: ['Python', 'R', 'SQL', 'Scikit-learn', 'Tableau'],
    metrics: [
      { label: 'Model Accuracy', value: '98.5%' },
      { label: 'Time Saved', value: '40h/mo' },
      { label: 'Team Mentored', value: '3' },
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative bg-black py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <AnimatedSection animation="fade-in">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
              Experience
            </span>
            <span className="h-px flex-1 bg-white/15" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/30">02</span>
          </div>

          <h2 className="mb-6 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl">
            Professional experience
          </h2>
          <p className="max-w-2xl font-sans text-lg leading-relaxed text-white/70 lg:text-xl">
            A journey through impactful roles driving innovation in machine learning and data science.
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

        <AnimatedSection animation="fade-in">
          <div className="mt-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                Availability
              </div>
              <p className="max-w-md font-sans text-lg text-white/80">
                Open to roles in ML engineering, data science, and AI research.
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
