import AnimatedSection from './AnimatedSection';
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 bg-black overflow-hidden">

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-1 gap-12 lg:gap-16 items-center">
          <AnimatedSection animation="fade-in" delay>
            <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight">
                Who Am I?
              </h2>
            </div>

            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg lg:text-xl">
                With a strong foundation in <span className="text-white font-medium">statistical modeling</span> and <span className="text-white font-medium">advanced machine learning algorithms</span>, I transform complex data into actionable insights and innovative AI solutions.
              </p>

              <p className="text-base lg:text-lg">
                My experience spans across <span className="text-white font-medium">predictive analytics</span>, <span className="text-white font-medium">natural language processing</span>, and <span className="text-white font-medium">computer vision</span>, driving efficiency and strategic growth for businesses across various industries.
              </p>

              <p className="text-base lg:text-lg">
                I thrive on challenging problems and am passionate about contributing to projects that push the boundaries of technology and data-driven decision-making. Whether it's building scalable ML pipelines, deploying AI models to production, or extracting meaningful patterns from massive datasets, I bring a comprehensive approach to every project.
              </p>

              <div className="pt-4 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-emerald-500 text-sm font-medium">Available for New Projects</span>
                </div>
              </div>
            </div>
            </div>
          </AnimatedSection>

          <div className="flex justify-center gap-8">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6 text-white" />
            </a>
            <a
              href="https://kaggle.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Kaggle"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6 text-white" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6 text-white" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
