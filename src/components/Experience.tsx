import { MapPin, ArrowRight, Briefcase, Code } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
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
  order: number;
}

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const supabase = createClient(
          import.meta.env.VITE_SUPABASE_URL,
          import.meta.env.VITE_SUPABASE_ANON_KEY
        );

        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .order('order', { ascending: true });

        if (error) throw error;
        setExperiences(data || []);
      } catch (err) {
        console.error('Failed to fetch experiences:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <section id="experience" className="py-24 bg-gradient-to-b from-gray-800/70 to-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection animation="fade-in">
          <div className="mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-4">
              Professional Experience
            </h2>
            <p className="text-gray-400 text-lg">
              Journey through impactful roles driving innovation in machine learning and data science
            </p>
          </div>
        </AnimatedSection>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white/30 via-white/10 to-transparent"></div>

          <div className="space-y-12 pl-12">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Loading experiences...</p>
              </div>
            ) : experiences.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No experiences found</p>
              </div>
            ) : (
              experiences.map((exp, index) => (
              <AnimatedSection key={exp.id} animation="fade-in" delay={index > 0}>
                <div className="relative group">
                  <div className="absolute -left-16 top-6 w-8 h-8 bg-black border-2 border-white/30 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group hover:shadow-lg hover:shadow-white/5">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-white/10 rounded-lg">
                            <Briefcase className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-xs font-medium text-white/60 bg-white/5 px-3 py-1 rounded-full">
                            {exp.type}
                          </span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl text-white font-light mb-2">
                          {exp.role}
                        </h3>
                        <p className="text-lg text-gray-300 mb-3">{exp.company}</p>
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{exp.location}</span>
                        </div>
                      </div>
                      <div className="lg:text-right">
                        <div className="text-sm text-gray-400 mb-1">Duration</div>
                        <div className="text-lg text-white font-light">{exp.duration}</div>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {exp.description}
                    </p>

                    <div className="grid sm:grid-cols-3 gap-4 mb-8">
                      {exp.metrics.map((metric, i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                          <div className="text-2xl font-light text-white mb-1">
                            {metric.value}
                          </div>
                          <div className="text-xs text-gray-400">{metric.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mb-6">
                      <p className="text-sm text-gray-400 mb-3 font-medium">Key Achievements</p>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                            <ArrowRight className="w-4 h-4 text-white/40 flex-shrink-0 mt-1" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-3 font-medium">Technologies & Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
              ))
            )}
          </div>
        </div>

        <AnimatedSection animation="fade-in">
          <div className="mt-20 bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-3xl p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl text-white font-light mb-1">
                    Open to Opportunities
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Actively seeking roles in ML engineering, data science, and AI research
                  </p>
                </div>
              </div>
              <button className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-sm font-light transition-all duration-300 whitespace-nowrap">
                Get In Touch
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
