import AnimatedSection from './AnimatedSection';

export default function Education() {
  const education = [
    {
      degree: 'Master of Science in Computer Science',
      specialization: 'Machine Learning & Artificial Intelligence',
      institution: 'Stanford University',
      year: '2020 – 2022',
      gpa: '3.9 / 4.0',
      thesis: 'Optimizing Neural Architecture Search for Resource-Constrained Edge Devices',
      achievements: [
        "Dean's List — all semesters",
        'Outstanding Graduate Research Award',
        'Published 3 papers in top-tier conferences',
      ],
    },
    {
      degree: 'Bachelor of Science in Mathematics',
      specialization: 'Statistics & Data Science',
      institution: 'MIT',
      year: '2016 – 2020',
      gpa: '3.8 / 4.0',
      thesis: 'Statistical Methods for High-Dimensional Data Analysis',
      achievements: [
        'Summa Cum Laude',
        'Mathematics Department Award',
        'Undergraduate Research Fellowship',
      ],
    },
  ];

  const courses = [
    {
      title: 'Deep Learning Specialization',
      provider: 'deeplearning.ai',
      instructor: 'Andrew Ng',
      completed: '2023',
      skills: ['Neural Networks', 'CNN', 'RNN', 'Transformers'],
    },
    {
      title: 'Machine Learning Engineering for Production',
      provider: 'deeplearning.ai',
      instructor: 'Andrew Ng',
      completed: '2023',
      skills: ['MLOps', 'Model Deployment', 'Data Pipeline', 'Monitoring'],
    },
    {
      title: 'Advanced NLP with Transformers',
      provider: 'Hugging Face',
      instructor: 'Thomas Wolf',
      completed: '2024',
      skills: ['BERT', 'GPT', 'T5', 'Fine-tuning'],
    },
    {
      title: 'AWS Certified Machine Learning — Specialty',
      provider: 'Amazon Web Services',
      instructor: 'AWS Training',
      completed: '2024',
      skills: ['SageMaker', 'AWS ML Services', 'Cloud Deployment'],
    },
    {
      title: 'TensorFlow Developer Certificate',
      provider: 'Google',
      instructor: 'TensorFlow Team',
      completed: '2023',
      skills: ['TensorFlow', 'Keras', 'Model Building', 'Deployment'],
    },
    {
      title: 'Reinforcement Learning Specialization',
      provider: 'Coursera',
      instructor: 'Martha White & Adam White',
      completed: '2023',
      skills: ['Q-Learning', 'Policy Gradient', 'Actor-Critic', 'DQN'],
    },
  ];

  const currentLearning = [
    {
      topic: 'Large Language Models',
      focus: 'Fine-tuning and prompt engineering for enterprise applications',
    },
    {
      topic: 'Edge AI & Model Optimization',
      focus: 'Deploying ML models on edge devices with resource constraints',
    },
    {
      topic: 'Federated Learning',
      focus: 'Privacy-preserving machine learning techniques',
    },
  ];

  return (
    <section id="education" className="relative bg-black py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <AnimatedSection animation="fade-in">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
              Education
            </span>
            <span className="h-px flex-1 bg-white/15" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/30">07</span>
          </div>

          <h2 className="mb-6 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl">
            Education &amp; learning
          </h2>
          <p className="max-w-2xl font-sans text-lg leading-relaxed text-white/70">
            Formal study paired with a continuous habit of learning.
          </p>
        </AnimatedSection>

        <div className="mt-16">
          <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">
            Academic background
          </div>
          <div className="border-t border-white/10">
            {education.map((edu, index) => (
              <AnimatedSection key={edu.degree} animation="fade-in" delay={index > 0}>
                <article className="grid gap-4 border-b border-white/10 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12">
                  <div>
                    <div className="font-mono text-sm text-white/80">{edu.year}</div>
                    <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                      GPA {edu.gpa}
                    </div>
                    <div className="mt-4 font-sans text-white/90">{edu.institution}</div>
                  </div>
                  <div>
                    <h3 className="mb-1 font-display text-2xl font-medium text-white">{edu.degree}</h3>
                    <p className="mb-4 font-sans text-white/60">{edu.specialization}</p>
                    <p className="mb-5 font-sans text-sm leading-relaxed text-white/60">
                      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                        Thesis&nbsp;
                      </span>
                      {edu.thesis}
                    </p>
                    <ul className="space-y-2">
                      {edu.achievements.map((achievement) => (
                        <li key={achievement} className="flex gap-3 font-sans text-sm text-white/70">
                          <span className="select-none text-white/30">&mdash;</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <AnimatedSection animation="fade-in">
          <div className="mt-20">
            <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">
              Certifications &amp; courses
            </div>
            <div className="border-t border-white/10">
              {courses.map((course) => (
                <div
                  key={course.title}
                  className="grid gap-3 border-b border-white/10 py-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] sm:items-baseline sm:gap-8"
                >
                  <div>
                    <div className="font-display text-lg text-white">{course.title}</div>
                    <div className="mt-1 font-sans text-sm text-white/50">
                      {course.provider} &middot; {course.instructor}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {course.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] tracking-wide text-white/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="font-mono text-sm text-white/40 sm:text-right">{course.completed}</div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-in">
          <div className="mt-20">
            <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">
              Currently learning
            </div>
            <div className="grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-3">
              {currentLearning.map((item) => (
                <div key={item.topic}>
                  <h4 className="mb-2 font-display text-xl font-medium text-white">{item.topic}</h4>
                  <p className="font-sans text-sm leading-relaxed text-white/60">{item.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
