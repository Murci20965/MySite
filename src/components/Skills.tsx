import AnimatedSection from './AnimatedSection';

export default function Skills() {
  const skillCategories = [
    {
      title: 'ML / DL Frameworks',
      skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'XGBoost'],
    },
    {
      title: 'Programming Languages',
      skills: ['Python', 'R', 'SQL', 'JavaScript', 'Scala'],
    },
    {
      title: 'Cloud Platforms',
      skills: ['AWS', 'Azure ML', 'GCP', 'Docker', 'Kubernetes'],
    },
    {
      title: 'Data Engineering',
      skills: ['Apache Spark', 'Apache Airflow', 'PostgreSQL', 'MongoDB', 'Redis'],
    },
    {
      title: 'Visualization & BI',
      skills: ['Matplotlib', 'Seaborn', 'Plotly', 'Tableau', 'Power BI'],
    },
    {
      title: 'MLOps & Deployment',
      skills: ['MLflow', 'Kubeflow', 'FastAPI', 'TensorFlow Serving', 'ONNX'],
    },
  ];

  const certifications = [
    { title: 'AWS Certified Machine Learning', issuer: 'Amazon Web Services', year: '2024' },
    { title: 'TensorFlow Developer Certificate', issuer: 'Google', year: '2023' },
    { title: 'Azure AI Engineer Associate', issuer: 'Microsoft', year: '2024' },
    { title: 'Deep Learning Specialization', issuer: 'deeplearning.ai', year: '2023' },
  ];

  return (
    <section id="skills" className="relative bg-zinc-950 py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <AnimatedSection animation="fade-in">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
              Skills
            </span>
            <span className="h-px flex-1 bg-white/15" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/30">04</span>
          </div>

          <h2 className="mb-6 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl">
            Technical expertise
          </h2>
          <p className="max-w-2xl font-sans text-lg leading-relaxed text-white/70">
            A toolkit spanning the entire machine-learning and AI development lifecycle.
          </p>
        </AnimatedSection>

        <div className="mt-16 grid gap-x-10 gap-y-12 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, index) => (
            <AnimatedSection key={category.title} animation="fade-in" delay={index > 2}>
              <div>
                <div className="mb-4 flex items-baseline gap-3">
                  <span className="font-mono text-[11px] text-white/30">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-lg font-medium text-white">{category.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] tracking-wide text-white/55"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-in">
          <div className="mt-20">
            <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">
              Certifications
            </div>
            <div className="border-t border-white/10">
              {certifications.map((cert) => (
                <div
                  key={cert.title}
                  className="flex items-baseline justify-between gap-4 border-b border-white/10 py-4"
                >
                  <div>
                    <div className="font-display text-lg text-white">{cert.title}</div>
                    <div className="font-sans text-sm text-white/50">{cert.issuer}</div>
                  </div>
                  <div className="shrink-0 font-mono text-sm text-white/40">{cert.year}</div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-in">
          <div className="mt-16 flex flex-col gap-8 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-md">
              <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                Currently exploring
              </div>
              <p className="font-sans text-lg text-white/80">
                Large Language Models, Reinforcement Learning, and Edge AI optimization.
              </p>
            </div>
            <div className="flex gap-10">
              {[
                { v: '50+', l: 'Courses' },
                { v: '15+', l: 'Certificates' },
                { v: '1000+', l: 'Hours' },
              ].map((stat) => (
                <div key={stat.l}>
                  <div className="font-mono text-2xl text-white">{stat.v}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
                    {stat.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
