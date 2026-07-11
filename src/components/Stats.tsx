export default function Stats() {
  const stats = [
    { value: '15+', label: 'Successful deployments', description: 'Production ML models' },
    { value: '96%', label: 'Model accuracy achieved', description: 'Average performance' },
    { value: '4.9', label: 'Employer rating', description: 'Client satisfaction' },
  ];

  return (
    <section id="stats" className="relative bg-black py-16 lg:py-20">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="grid gap-10 border-y border-white/10 py-12 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-5xl font-medium text-white sm:text-6xl">
                {stat.value}
              </div>
              <div className="mt-3 font-sans text-white/80">{stat.label}</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
