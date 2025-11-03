import { Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CTO, Fintech Startup',
      avatar: 'SC',
      rating: 5,
      text: "Nhlanhla's expertise in ML engineering transformed our fraud detection system. His models achieved 98% accuracy and reduced false positives by 60%. His code quality and documentation are exceptional.",
    },
    {
      name: 'Michael Torres',
      role: 'Data Science Manager, Global Corp',
      avatar: 'MT',
      rating: 5,
      text: 'Outstanding analytical skills and problem-solving abilities. Nhlanhla delivered a customer segmentation model that increased our marketing ROI by 45%. He consistently exceeds expectations.',
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Head of AI Research, HealthTech',
      avatar: 'EW',
      rating: 5,
      text: 'Working with Nhlanhla on our predictive diagnostics platform was remarkable. His deep learning models and deployment pipeline were production-ready and scalable. Highly recommend.',
    },
    {
      name: 'James Park',
      role: 'VP Engineering, E-commerce Platform',
      avatar: 'JP',
      rating: 5,
      text: 'Nhlanhla built our recommendation engine from scratch. The system handles millions of users daily with impressive accuracy. His attention to performance optimization is unmatched.',
    },
    {
      name: 'Lisa Anderson',
      role: 'Product Director, SaaS Company',
      avatar: 'LA',
      rating: 5,
      text: 'A true professional who understands both the technical and business sides of AI. Nhlanhla delivered our churn prediction model on time and provided excellent post-launch support.',
    },
    {
      name: 'David Kumar',
      role: 'Lead Data Scientist, Analytics Firm',
      avatar: 'DK',
      rating: 5,
      text: 'Exceptional data scientist with strong engineering fundamentals. His work on our time series forecasting models was brilliant, and his collaborative approach made the project smooth.',
    },
  ];

  return (
    <section id="reviews" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-light text-white mb-4">
            Client Testimonials
          </h2>
          <p className="text-gray-400 text-lg">
            Trusted by industry leaders and innovative companies
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-black border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-white text-white" />
                ))}
              </div>

              <p className="text-gray-300 leading-relaxed mb-8">{testimonial.text}</p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{testimonial.avatar}</span>
                </div>
                <div>
                  <div className="text-white font-light">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
