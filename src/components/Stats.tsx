import AnimatedSection from './AnimatedSection';
import PopNumber from './PopNumber';

/* The receipts band: four verified numbers set large, divided by hairlines
 * and spanning the page — the anchor that follows the work.
 */
const stats = [
  { value: '14', label: 'Projects shipped', description: 'Past 2 years' },
  { value: '18', label: 'Public repositories', description: 'Open on GitHub' },
  { value: '3', label: 'AI roles', description: 'Nudle · Alignerr · Artintel' },
  { value: '2', label: 'Live AI demos', description: 'Deployed on Vercel' },
];

export default function Stats() {
  return (
    <section id="stats" className="relative bg-black py-20 lg:py-24">
      <div className="mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <AnimatedSection animation="fade-in">
          <div className="mb-10 flex items-center gap-4">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
              By the numbers
            </span>
            <span className="h-px flex-1 bg-white/15" />
          </div>

          <div className="grid grid-cols-2 divide-x divide-y divide-white/10 border-y border-white/10 lg:grid-cols-4 lg:divide-y-0">
            {stats.map((stat) => (
              <div key={stat.label} className="px-5 py-10 first:pl-0 lg:px-10 lg:py-14">
                <div className="font-display text-6xl font-medium leading-none text-white lg:text-8xl">
                  <PopNumber value={stat.value} />
                </div>
                <div className="mt-5 font-sans text-base text-white/80 lg:text-lg">{stat.label}</div>
                <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
