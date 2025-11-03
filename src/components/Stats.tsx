import { Rocket, Target, Star } from 'lucide-react';

export default function Stats() {
  const stats = [
    {
      icon: Rocket,
      value: '15+',
      label: 'Successful Deployments',
      description: 'Production ML models',
    },
    {
      icon: Target,
      value: '96%',
      label: 'Model Accuracy Achieved',
      description: 'Average performance',
    },
    {
      icon: Star,
      value: '4.9',
      label: 'Employer Rating',
      description: 'Client satisfaction',
    },
  ];

  return (
    <section id="experience" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-light text-white mb-4">
            Data-Driven Results
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Proven success in delivering high-impact solutions across various industries,
            consistently exceeding expectations
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-black border border-white/10 rounded-3xl p-8 text-center hover:border-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl sm:text-6xl font-light text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-xl text-white mb-2">{stat.label}</div>
                <div className="text-sm text-gray-400">{stat.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
