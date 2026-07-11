import { useCallback, useEffect, useRef, useState } from 'react';
import { Github, ArrowUpRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import TiltCard from './TiltCard';

export default function Projects() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const tabsRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);

  const filters = ['All', 'NLP', 'Computer Vision', 'Time Series', 'Recommendation', 'Healthcare'];

  const projects = [
    {
      title: 'Medical Image Diagnostic System',
      category: 'Computer Vision',
      description:
        'Deep learning model for automated detection of abnormalities in chest X-rays using CNNs. Deployed on AWS with real-time inference capabilities.',
      image:
        'https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: { accuracy: '97.2%', impact: '40% faster diagnosis', data: '150K images' },
      tech: ['PyTorch', 'FastAPI', 'AWS SageMaker', 'Docker'],
      github: '#',
      demo: '#',
      duration: '12 weeks',
    },
    {
      title: 'Customer Churn Prediction Engine',
      category: 'Time Series',
      description:
        'ML pipeline predicting customer churn with 90%+ accuracy. Integrated with CRM systems for proactive retention campaigns.',
      image:
        'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: { accuracy: '92.5%', impact: '35% churn reduction', data: '2M records' },
      tech: ['Scikit-learn', 'XGBoost', 'Apache Airflow', 'PostgreSQL'],
      github: '#',
      demo: '#',
      duration: '8 weeks',
    },
    {
      title: 'Real-time Sentiment Analysis API',
      category: 'NLP',
      description:
        'Production NLP system analyzing social media sentiment in real-time. Processes 10K+ tweets per minute with sub-second latency.',
      image:
        'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: { accuracy: '89.3%', impact: '10K req/min', data: '50M tweets' },
      tech: ['TensorFlow', 'BERT', 'Redis', 'Kubernetes'],
      github: '#',
      demo: '#',
      duration: '10 weeks',
    },
    {
      title: 'E-commerce Recommendation System',
      category: 'Recommendation',
      description:
        'Hybrid collaborative filtering system increasing sales conversion by 28%. Handles millions of users with personalized recommendations.',
      image:
        'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: { accuracy: '85.7%', impact: '+28% conversion', data: '5M users' },
      tech: ['Python', 'Spark', 'Neo4j', 'AWS Lambda'],
      github: '#',
      demo: '#',
      duration: '14 weeks',
    },
    {
      title: 'Predictive Maintenance for IoT Devices',
      category: 'Time Series',
      description:
        'LSTM-based system predicting equipment failures 7 days in advance. Reduced downtime by 60% for manufacturing clients.',
      image:
        'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: { accuracy: '94.1%', impact: '60% less downtime', data: '100K sensors' },
      tech: ['PyTorch', 'LSTM', 'InfluxDB', 'Grafana'],
      github: '#',
      demo: '#',
      duration: '16 weeks',
    },
    {
      title: 'Document Classification System',
      category: 'NLP',
      description:
        'Automated legal document classification using transformer models. Processing 1000+ documents daily with 96% accuracy.',
      image:
        'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: { accuracy: '96.4%', impact: '80% time saved', data: '500K docs' },
      tech: ['HuggingFace', 'RoBERTa', 'MongoDB', 'FastAPI'],
      github: '#',
      demo: '#',
      duration: '9 weeks',
    },
    {
      title: 'Fraud Detection System',
      category: 'Healthcare',
      description:
        'Real-time anomaly detection for financial transactions using ensemble methods. Prevented $2M+ in fraudulent activity.',
      image:
        'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: { accuracy: '98.6%', impact: '$2M+ saved', data: '20M transactions' },
      tech: ['Scikit-learn', 'Isolation Forest', 'Kafka', 'Cassandra'],
      github: '#',
      demo: '#',
      duration: '12 weeks',
    },
    {
      title: 'Object Detection for Autonomous Systems',
      category: 'Computer Vision',
      description:
        'YOLOv8-based real-time object detection achieving 60 FPS on edge devices. Deployed in autonomous vehicle testing environments.',
      image:
        'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: { accuracy: '91.8%', impact: '60 FPS detection', data: '300K images' },
      tech: ['PyTorch', 'YOLOv8', 'ONNX', 'TensorRT'],
      github: '#',
      demo: '#',
      duration: '14 weeks',
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
            Production-grade machine-learning systems delivering measurable impact across domains.
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
                      { v: project.metrics.accuracy, l: 'Accuracy' },
                      { v: project.metrics.impact, l: 'Impact' },
                      { v: project.metrics.data, l: 'Dataset' },
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
                      className="inline-flex items-center gap-1.5 font-sans text-sm text-white/70 transition-colors hover:text-white"
                    >
                      <Github className="h-4 w-4" /> Code
                    </a>
                    <a
                      href={project.demo}
                      className="inline-flex items-center gap-1.5 font-sans text-sm text-white/70 transition-colors hover:text-white"
                    >
                      Demo <ArrowUpRight className="h-4 w-4" />
                    </a>
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
