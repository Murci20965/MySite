import AnimatedSection from './AnimatedSection';
import RevealHeading from './RevealHeading';
import Kicker from './Kicker';

/* Chapter 09, Principles: how Murci works, in his own words (these are his
 * standards, not testimonials, so they are not marked up as quotes). Behind
 * them the film rises through a skylight into dusk; the right edge measured
 * darkest, so the list sits there as plain numbered type, no cards.
 */
const PRINCIPLES = [
  {
    title: 'Measure, don’t guess',
    area: 'How I debug',
    text: 'If a claim matters, I verify it against the source before building on it. Assumptions are where systems quietly break, so evidence comes first and action second.',
  },
  {
    title: 'Docs are part of done',
    area: 'How I ship',
    text: 'Documentation ships in the same change as the code. Stale docs are a defect, not a chore. The next engineer should never have to reverse-engineer intent.',
  },
  {
    title: 'Secure by default',
    area: 'How I build',
    text: 'Secrets out of code, least privilege, input validation from day one. Security is a property of the design, not a patch applied at the end.',
  },
  {
    title: 'Honest reporting',
    area: 'How I communicate',
    text: 'If tests fail or a step was skipped, I say so plainly. An honest status report beats a green façade every time, especially under deadline pressure.',
  },
  {
    title: 'Proven over clever',
    area: 'How I choose tools',
    text: 'For anything that must run in production, boring and well-supported beats bleeding-edge. I save the experiments for clearly-labelled experiments.',
  },
  {
    title: 'Learning in public',
    area: 'How I grow',
    text: 'Everything I build outside work is open on GitHub from the first commit. Showing the process, rough edges included, is how skills compound.',
  },
];

export default function Principles() {
  return (
    <section id="principles" className="t-ink relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="lg:ml-auto lg:w-[min(42rem,52%)]">
          <AnimatedSection animation="fade-in">
            <Kicker n="09" name="Principles" />
            <RevealHeading
              text="How I work"
              className="mt-6 font-display text-5xl font-medium leading-[1.02] tracking-[-0.02em] text-fg lg:text-7xl"
            />
            <p className="mt-6 font-sans text-lg leading-relaxed text-fg">
              The standards behind everything I ship, and the same ones you&rsquo;ll find in my commits.
            </p>
          </AnimatedSection>

          <ol className="mt-12">
            {PRINCIPLES.map((p, i) => (
              <AnimatedSection key={p.title} animation="fade-in" index={i % 3}>
                <li className="grid grid-cols-[2.75rem_minmax(0,1fr)] border-t border-fg/20 py-8">
                  <span className="pt-2 font-mono text-[11px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-display text-2xl font-medium text-fg lg:text-3xl">{p.title}</h3>
                    <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-fg/80">{p.area}</div>
                    <p className="mt-4 font-sans text-base leading-relaxed text-fg lg:text-lg">{p.text}</p>
                  </div>
                </li>
              </AnimatedSection>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
