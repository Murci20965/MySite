import PopNumber from './PopNumber';
import Kicker from './Kicker';

/* Chapter 05, By the numbers: one of the film's big moments. The camera has
 * passed the gate of light into a data-centre aisle, bright down the middle
 * and near-black along both rack walls (measured), so the four figures are set
 * large on the two dark sides like title cards, and the aisle stays clear.
 * Every number is countable on the page or the CV: the seven projects shown,
 * the CV's three AI roles and six certifications, the two deployed demos.
 */
const LEFT = [
  { value: '7', label: 'Open-source projects', note: 'Public from the first commit' },
  { value: '3', label: 'AI roles', note: 'Nudle · Alignerr · Artintel' },
];
const RIGHT = [
  { value: '2', label: 'Live AI demos', note: 'Try them in the browser' },
  { value: '6', label: 'Certifications', note: 'Azure · DataCamp · Udacity' },
];

function Figure({ value, label, note, align }: { value: string; label: string; note: string; align: 'left' | 'right' }) {
  return (
    <div className={align === 'right' ? 'lg:text-right' : ''}>
      <div className="font-display text-[clamp(5rem,13vw,7.5rem)] font-medium leading-[0.85] tracking-[-0.04em] text-fg lg:text-[clamp(7.5rem,11vw,10.5rem)]">
        {/* Pops as the data-centre racks come into view (M4, 6 s). */}
        <PopNumber value={value} beat="m4:0.6" />
      </div>
      <div className="mt-4 font-sans text-lg font-medium text-fg">{label}</div>
      <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-fg">{note}</div>
    </div>
  );
}

export default function Stats() {
  return (
    <section id="stats" className="t-ink relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <Kicker n="05" name="By the numbers" className="lg:justify-center" />
        <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-14 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="contents lg:block lg:space-y-16">
            {LEFT.map((s) => (
              <Figure key={s.label} {...s} align="left" />
            ))}
          </div>
          {/* The aisle: left empty on purpose, the film's subject. */}
          <div aria-hidden="true" className="hidden lg:block" />
          <div className="contents lg:block lg:space-y-16">
            {RIGHT.map((s) => (
              <Figure key={s.label} {...s} align="right" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
