import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What technologies do you specialize in?',
      answer:
        'I specialize in Python, TensorFlow, PyTorch, scikit-learn, Pandas, and NumPy for machine learning. I also work with SQL, NoSQL databases, Docker, Kubernetes, and cloud platforms like AWS, Azure, and GCP for deployment.',
    },
    {
      question: 'What is your experience with cloud platforms (AWS, Azure, GCP)?',
      answer:
        'I have extensive experience deploying and managing ML models on all major cloud platforms. This includes using AWS SageMaker, Azure ML, and Google Cloud AI Platform, along with containerization using Docker and orchestration with Kubernetes.',
    },
    {
      question: 'How long does a typical ML model deployment take?',
      answer:
        'The timeline varies based on project complexity. A standard supervised learning model can take 2-4 weeks from data preparation to deployment. More complex deep learning projects or custom AI systems typically require 6-12 weeks for full implementation and testing.',
    },
    {
      question: 'Do you provide code revisions and documentation?',
      answer:
        'Absolutely. All projects include comprehensive documentation covering model architecture, data pipelines, API endpoints, and deployment procedures. I also provide post-deployment support and am available for code reviews and optimizations.',
    },
    {
      question: 'What industries have you applied your models in?',
      answer:
        'I have worked across diverse industries including finance (fraud detection, risk assessment), healthcare (predictive diagnostics), e-commerce (recommendation systems), and marketing (customer segmentation, churn prediction).',
    },
    {
      question: 'What is your preferred programming language?',
      answer:
        'Python is my primary language for data science and ML work due to its robust ecosystem. I also use R for statistical analysis, SQL for data querying, and JavaScript/TypeScript for building ML-powered web applications and dashboards.',
    },
  ];

  return (
    <section id="faq" className="relative bg-black py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <AnimatedSection animation="fade-in">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
              FAQ
            </span>
            <span className="h-px flex-1 bg-white/15" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/30">09</span>
          </div>

          <h2 className="mb-6 font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl">
            Common questions
          </h2>
          <p className="max-w-2xl font-sans text-lg leading-relaxed text-white/70">
            How I work, and what to expect from a project.
          </p>
        </AnimatedSection>

        <div className="mt-12 border-t border-white/10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="border-b border-white/10">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-lg font-medium text-white">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-white/50 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] pb-6' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl font-sans leading-relaxed text-white/60">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
