import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import RevealHeading from './RevealHeading';

export default function Education() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollByCard = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };
  const education: Array<{
    degree: string;
    specialization: string;
    institution: string;
    year: string;
    gpa?: string;
    thesis?: string;
    achievements: string[];
  }> = [
    {
      degree: 'Data Science Programme',
      specialization: 'Machine learning, statistics & data engineering',
      institution: 'ALX / ExploreAI Academy',
      year: 'Certified',
      achievements: [
        'ALX/ExploreAI Certified Data Scientist',
        'AWS cloud coursework — IAM, networking, CloudFormation, cost management',
        'Portfolio of end-to-end ML projects across regression, classification and recommenders',
      ],
    },
    {
      degree: 'System Development Programme',
      specialization: 'Software development foundations',
      institution: 'DynamicDNA ICT Academy',
      year: 'Completed',
      achievements: ['Full-time software development training — systems, databases and programming fundamentals'],
    },
  ];

  const courses = [
    {
      title: 'Introducing Generative AI with AWS',
      provider: 'Udacity',
      completed: '',
      skills: ['Generative AI', 'AWS'],
    },
    {
      title: 'Microsoft Certified: Azure Fundamentals',
      provider: 'Microsoft',
      completed: '',
      skills: ['Azure', 'Cloud fundamentals'],
    },
    {
      title: 'Credit Risk Modelling in Python',
      provider: '365 Data Science',
      completed: '',
      skills: ['Python', 'Risk modelling'],
    },
    {
      title: 'Working with the OpenAI API',
      provider: '',
      completed: '',
      skills: ['OpenAI API', 'LLM integration'],
    },
    {
      title: 'Prompt Engineering with the OpenAI API',
      provider: '',
      completed: '',
      skills: ['Prompt engineering', 'Structured outputs'],
    },
    {
      title: 'Working with Hugging Face',
      provider: '',
      completed: '',
      skills: ['Transformers', 'Model Hub'],
    },
  ];

  const currentLearning = [
    {
      topic: 'XR & WebXR',
      focus: 'Interactive 3D learning experiences with React Three Fiber and WebXR',
    },
    {
      topic: 'Agentic AI Systems',
      focus: 'Multi-agent orchestration, tool use and evaluation for production reliability',
    },
    {
      topic: 'Local Model Serving',
      focus: 'Self-hosted LLMs and image models for cost-free, offline-tolerant inference',
    },
  ];

  return (
    <section id="education" className="relative bg-black py-24 lg:py-32">
      <div className="mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <AnimatedSection animation="fade-in">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
              Education
            </span>
            <span className="h-px flex-1 bg-white/15" />
            <span className="t-drift font-mono text-[11px] uppercase tracking-[0.28em] text-white/30">07</span>
          </div>

          <RevealHeading
            text="Education & learning"
            className="mb-6 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl"
          />
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
                    {edu.gpa && (
                      <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                        GPA {edu.gpa}
                      </div>
                    )}
                    <div className="mt-4 font-sans text-white/90">{edu.institution}</div>
                  </div>
                  <div>
                    <h3 className="mb-1 font-display text-2xl font-medium text-white">{edu.degree}</h3>
                    <p className="mb-4 font-sans text-white/60">{edu.specialization}</p>
                    {edu.thesis && (
                      <p className="mb-5 font-sans text-sm leading-relaxed text-white/60">
                        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                          Thesis&nbsp;
                        </span>
                        {edu.thesis}
                      </p>
                    )}
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
            <div className="mb-6 flex items-center justify-between">
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">
                Certifications &amp; courses
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollByCard(-1)}
                  aria-label="Previous certifications"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollByCard(1)}
                  aria-label="Next certifications"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div
              ref={trackRef}
              className="t-carousel flex gap-5 overflow-x-auto border-t border-white/10 pb-4 pt-8"
            >
              {courses.map((course) => (
                <div
                  key={course.title}
                  className="flex w-[17rem] shrink-0 snap-start flex-col rounded-2xl border border-white/10 bg-[#0e0e0e] p-6 sm:w-[19rem]"
                >
                  <div className="font-display text-lg leading-snug text-white">{course.title}</div>
                  {course.provider && (
                    <div className="mt-1 font-sans text-sm text-white/50">{course.provider}</div>
                  )}
                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
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
