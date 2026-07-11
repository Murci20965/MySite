import AnimatedSection from './AnimatedSection';
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 bg-black overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        <AnimatedSection animation="fade-in" delay>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-white/50">
              Profile
            </span>
            <span className="h-px flex-1 bg-white/15" />
            <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-white/30">01</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-white leading-[1.05] tracking-[-0.01em] mb-10 max-w-3xl">
            Who am I?
          </h2>

          <p className="font-sans text-xl lg:text-2xl text-white/80 leading-relaxed max-w-3xl mb-10">
            With a strong foundation in <span className="text-white">statistical modeling</span> and{' '}
            <span className="text-white">advanced machine learning algorithms</span>, I transform
            complex data into actionable insights and innovative AI solutions.
          </p>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl font-sans text-white/60">
            <p className="text-base lg:text-lg leading-relaxed">
              My experience spans across <span className="text-white/90">predictive analytics</span>,{' '}
              <span className="text-white/90">natural language processing</span>, and{' '}
              <span className="text-white/90">computer vision</span>, driving efficiency and strategic
              growth for businesses across various industries.
            </p>
            <p className="text-base lg:text-lg leading-relaxed">
              I thrive on challenging problems and am passionate about contributing to projects that
              push the boundaries of technology and data-driven decision-making. Whether it's building
              scalable ML pipelines, deploying AI models to production, or extracting meaningful
              patterns from massive datasets, I bring a comprehensive approach to every project.
            </p>
          </div>

          <div className="h-px bg-white/10 my-10 max-w-4xl" />

          <div className="flex flex-wrap items-center justify-between gap-6 max-w-4xl">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-emerald-400/90">
                Available for new projects
              </span>
            </div>

            <div className="flex items-center gap-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://kaggle.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
                aria-label="Kaggle"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
