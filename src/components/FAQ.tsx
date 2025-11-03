import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
    <section id="skills" className="py-24 bg-black">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-light text-white mb-4">
            Questions & Answers
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to know about my expertise and approach
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left"
              >
                <span className="text-lg text-white font-light pr-8">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-white transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-8 pb-6">
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
