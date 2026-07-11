import { Database, Brain, TrendingUp, Code } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Database,
      title: 'Data Science & Analytics',
      scope: 'Full-Stack Solutions',
      price: 'From $8,000',
      description:
        'Designing and implementing end-to-end solutions for predictive modeling, exploratory analysis, and business intelligence.',
    },
    {
      icon: Brain,
      title: 'AI & Machine Learning Engineering',
      scope: 'Specialized Implementation',
      price: 'From $12,000',
      description:
        'Building and deploying production-ready ML models, optimizing algorithms, and developing robust AI systems.',
    },
  ];

  const projectPreviews = [
    { gradient: 'from-blue-500/20 to-cyan-500/20' },
    { gradient: 'from-purple-500/20 to-pink-500/20' },
    { gradient: 'from-green-500/20 to-emerald-500/20' },
    { gradient: 'from-orange-500/20 to-red-500/20' },
  ];

  return (
    <section id="services" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-4">
            Let's Build with Data
          </h2>
          <p className="text-gray-400 text-lg">
            Proven expertise in delivering high-impact solutions across various industries
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">{service.scope}</div>
                    <div className="text-2xl text-white font-light">{service.price}</div>
                  </div>
                </div>
                <h3 className="text-2xl text-white font-light mb-4">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {projectPreviews.map((project, index) => (
            <div
              key={index}
              className="group aspect-square bg-gradient-to-br rounded-2xl border border-white/10 overflow-hidden relative hover:scale-105 transition-transform duration-300"
              style={{
                backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <TrendingUp className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-white/60" />
                  <span className="text-xs text-white/60">ML Project</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
