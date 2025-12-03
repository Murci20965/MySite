import AnimatedSection from './AnimatedSection';
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 bg-black overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/aboutPic.png)' }}></div>
      <div className="absolute inset-0 bg-black/70"></div>

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
        </div>
      </div>
    </section>
  );
}
