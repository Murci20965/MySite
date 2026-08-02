import PopNumber from './PopNumber';

export default function Stats() {
  const stats = [
    { value: '525', label: 'GitHub contributions', description: 'Past 12 months' },
    { value: '18', label: 'Public repositories', description: 'Open on GitHub' },
    { value: '2', label: 'Live AI demos', description: 'Deployed on Vercel' },
  ];

  return (
    <section id="stats" className="relative bg-black py-16 lg:py-20">
      <div className="mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="grid gap-10 border-y border-white/10 py-12 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-5xl font-medium text-white sm:text-6xl">
                <PopNumber value={stat.value} />
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
