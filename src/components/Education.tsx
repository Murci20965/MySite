import AnimatedSection from './AnimatedSection';
import RevealHeading from './RevealHeading';
import Kicker from './Kicker';

/* Chapter 08, Education. Word for word from the CV (Sep 2026): its education
 * entries, statuses and six certifications, nothing added. Set as one column
 * on the frame's dark right edge (measured), with no cards: the film behind it
 * (the night room, the skylight) stays in full view on the left.
 */
const EDUCATION = [
  { institution: 'ALX / ExploreAI Academy', years: 'Jun 2023 - Sep 2024', programmes: ['Data Science'] },
  { institution: 'DynamicDNA ICT Academy', years: 'May 2023 - Aug 2024', programmes: ['Systems Development, NQF Level 4'] },
  {
    institution: 'University of the Witwatersrand',
    years: '2015 - 2019',
    programmes: ['BSc in Biological Science (incomplete)', 'BSc in Mechanical Engineering (incomplete)'],
  },
];

// The CV's certification list, in its order.
const CERTIFICATIONS = [
  { issuer: 'DataCamp', title: 'Associate AI Engineer for Developers' },
  { issuer: 'Microsoft', title: 'Azure Fundamentals (AZ-900)' },
  { issuer: 'Microsoft', title: 'Microsoft 365 Certified' },
  { issuer: 'Udacity', title: 'Introducing Generative AI with AWS' },
  { issuer: 'ALX / ExploreAI', title: 'AI Career Essentials' },
  { issuer: '365 Data Science', title: 'Credit Risk Modelling in Python & Machine Learning' },
];

const CURRENTLY_LEARNING = [
  { topic: 'XR & WebXR', focus: 'Interactive 3D learning experiences with React Three Fiber and WebXR' },
  { topic: 'Agentic AI systems', focus: 'Multi-agent orchestration, tool use and evaluation for production reliability' },
  { topic: 'Local model serving', focus: 'Self-hosted LLMs and image models for cost-free, offline-tolerant inference' },
];

export default function Education() {
  return (
    <section id="education" className="t-ink relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="lg:ml-auto lg:w-[min(42rem,52%)]">
          <AnimatedSection animation="fade-in">
            <Kicker n="08" name="Education" />
            <RevealHeading
              text="Education & learning"
              className="mt-6 font-display text-5xl font-medium leading-[1.02] tracking-[-0.02em] text-fg lg:text-7xl"
            />
            <p className="mt-6 font-sans text-lg leading-relaxed text-fg">
              Formal study paired with a continuous habit of learning.
            </p>
          </AnimatedSection>

          <div className="mt-12">
            {EDUCATION.map((edu, index) => (
              <AnimatedSection key={edu.institution} animation="fade-in" delay={index > 0}>
                <article className="border-t border-fg/20 py-8">
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{edu.years}</div>
                  <h3 className="mt-3 font-display text-2xl font-medium text-fg lg:text-3xl">{edu.institution}</h3>
                  <ul className="mt-2 space-y-1">
                    {edu.programmes.map((p) => (
                      <li key={p} className="font-sans text-base text-fg lg:text-lg">
                        {p}
                      </li>
                    ))}
                  </ul>
                </article>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection animation="fade-in">
            <div className="mt-10 border-t border-fg/20 pt-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Certifications</div>
              <ol className="mt-6 space-y-4">
                {CERTIFICATIONS.map((c, i) => (
                  <li key={c.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)]">
                    <span className="pt-1 font-mono text-[11px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <div className="font-display text-lg font-medium leading-snug text-fg lg:text-xl">{c.title}</div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg/80">{c.issuer}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-in">
            <div className="mt-10 border-t border-fg/20 pt-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Currently learning</div>
              <div className="mt-6 space-y-6">
                {CURRENTLY_LEARNING.map((item) => (
                  <div key={item.topic}>
                    <h4 className="font-display text-xl font-medium text-fg">{item.topic}</h4>
                    <p className="mt-1 font-sans text-base leading-relaxed text-fg/90">{item.focus}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
