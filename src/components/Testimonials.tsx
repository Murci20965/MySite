import AnimatedSection from './AnimatedSection';
import RevealHeading from './RevealHeading';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Measure, don’t guess',
      role: 'How I debug',
      avatar: '01',
      text: 'If a claim matters, I verify it against the source before building on it. Assumptions are where systems quietly break, so evidence comes first and action second.',
    },
    {
      name: 'Docs are part of done',
      role: 'How I ship',
      avatar: '02',
      text: 'Documentation ships in the same change as the code. Stale docs are a defect, not a chore. The next engineer should never have to reverse-engineer intent.',
    },
    {
      name: 'Secure by default',
      role: 'How I build',
      avatar: '03',
      text: 'Secrets out of code, least privilege, input validation from day one. Security is a property of the design, not a patch applied at the end.',
    },
    {
      name: 'Honest reporting',
      role: 'How I communicate',
      avatar: '04',
      text: 'If tests fail or a step was skipped, I say so plainly. An honest status report beats a green façade every time, especially under deadline pressure.',
    },
    {
      name: 'Proven over clever',
      role: 'How I choose tools',
      avatar: '05',
      text: 'For anything that must run in production, boring and well-supported beats bleeding-edge. I save the experiments for clearly-labelled experiments.',
    },
    {
      name: 'Learning in public',
      role: 'How I grow',
      avatar: '06',
      text: 'Everything I build outside work is open on GitHub from the first commit. Showing the process, rough edges included, is how skills compound.',
    },
  ];

  return (
    <section id="reviews" className="relative bg-black py-24 lg:py-32">
      <div className="mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <AnimatedSection animation="fade-in">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
              Principles
            </span>
            <span className="h-px flex-1 bg-white/15" />
            <span className="t-drift font-mono text-[11px] uppercase tracking-[0.28em] text-white/30">08</span>
          </div>

        </AnimatedSection>

        {/* Sticky rail: the heading holds its place on the left while the
            cards stack past it, so each principle gets the full column. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-20">
          <AnimatedSection animation="fade-in">
            <div className="lg:sticky lg:top-32">
              <RevealHeading
                text="How I work"
                className="mb-6 font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-white sm:text-5xl"
              />
              <p className="max-w-md font-sans text-lg leading-relaxed text-white/70">
                The standards behind everything I ship, and the same ones you&rsquo;ll find in my
                commits.
              </p>
            </div>
          </AnimatedSection>

          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="sticky mb-8"
                style={{ top: `calc(7rem + ${index} * 2.25rem)` }}
              >
                <figure className="t-stack-card group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e0e] p-8 transition-colors duration-500 hover:border-white/25 sm:p-10">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2 -top-6 font-display text-[7rem] leading-none text-white/[0.04]"
                  >
                    {testimonial.avatar}
                  </span>
                  <blockquote className="relative font-sans text-lg leading-relaxed text-white/80 sm:text-xl">
                    &ldquo;{testimonial.text}&rdquo;
                  </blockquote>
                  <figcaption className="relative mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-lime-400/30 font-mono text-xs text-lime-400/80">
                      {testimonial.avatar}
                    </span>
                    <span>
                      <span className="block font-sans text-sm text-white">{testimonial.name}</span>
                      <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-white/40">
                        {testimonial.role}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
