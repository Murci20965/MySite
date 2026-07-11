import AnimatedSection from './AnimatedSection';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CTO, Fintech Startup',
      avatar: 'SC',
      text: "Nhlanhla's expertise in ML engineering transformed our fraud detection system. His models achieved 98% accuracy and reduced false positives by 60%. His code quality and documentation are exceptional.",
    },
    {
      name: 'Michael Torres',
      role: 'Data Science Manager, Global Corp',
      avatar: 'MT',
      text: 'Outstanding analytical skills and problem-solving abilities. Nhlanhla delivered a customer segmentation model that increased our marketing ROI by 45%. He consistently exceeds expectations.',
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Head of AI Research, HealthTech',
      avatar: 'EW',
      text: 'Working with Nhlanhla on our predictive diagnostics platform was remarkable. His deep learning models and deployment pipeline were production-ready and scalable. Highly recommend.',
    },
    {
      name: 'James Park',
      role: 'VP Engineering, E-commerce Platform',
      avatar: 'JP',
      text: 'Nhlanhla built our recommendation engine from scratch. The system handles millions of users daily with impressive accuracy. His attention to performance optimization is unmatched.',
    },
    {
      name: 'Lisa Anderson',
      role: 'Product Director, SaaS Company',
      avatar: 'LA',
      text: 'A true professional who understands both the technical and business sides of AI. Nhlanhla delivered our churn prediction model on time and provided excellent post-launch support.',
    },
    {
      name: 'David Kumar',
      role: 'Lead Data Scientist, Analytics Firm',
      avatar: 'DK',
      text: 'Exceptional data scientist with strong engineering fundamentals. His work on our time series forecasting models was brilliant, and his collaborative approach made the project smooth.',
    },
  ];

  return (
    <section id="reviews" className="relative bg-black py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <AnimatedSection animation="fade-in">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
              Testimonials
            </span>
            <span className="h-px flex-1 bg-white/15" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/30">08</span>
          </div>

          <h2 className="mb-6 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl">
            What clients say
          </h2>
          <p className="max-w-2xl font-sans text-lg leading-relaxed text-white/70">
            Trusted by teams shipping machine learning into production.
          </p>
        </AnimatedSection>

        <div className="mt-14 grid gap-x-12 gap-y-12 border-t border-white/10 pt-12 sm:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={testimonial.name} animation="fade-in" delay={index % 2 === 1}>
              <figure className="flex h-full flex-col">
                <blockquote className="flex-1 font-sans text-lg leading-relaxed text-white/80">
                  &ldquo;{testimonial.text}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 font-mono text-xs text-white/70">
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
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
