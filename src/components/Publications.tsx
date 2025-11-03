import { BookOpen, ExternalLink, FileText, Video, TrendingUp } from 'lucide-react';

export default function Publications() {
  const publications = [
    {
      type: 'Research Paper',
      title: 'Optimizing LSTM Networks for Real-Time Time Series Forecasting in Production Environments',
      venue: 'Journal of Machine Learning Research',
      year: '2024',
      citations: 45,
      link: '#',
      abstract: 'Novel approach to reducing inference latency in LSTM models while maintaining prediction accuracy for high-frequency time series data.',
      tags: ['Deep Learning', 'Time Series', 'Optimization']
    },
    {
      type: 'Conference Paper',
      title: 'Transfer Learning Strategies for Medical Image Classification with Limited Datasets',
      venue: 'ICML 2024',
      year: '2024',
      citations: 32,
      link: '#',
      abstract: 'Comprehensive study on transfer learning techniques for medical imaging applications with small annotated datasets.',
      tags: ['Computer Vision', 'Transfer Learning', 'Healthcare']
    },
    {
      type: 'Technical Article',
      title: 'Building Production-Ready ML Pipelines: A Comprehensive Guide',
      venue: 'Towards Data Science',
      year: '2024',
      citations: 1200,
      link: '#',
      abstract: 'End-to-end guide covering best practices for deploying machine learning models in production environments.',
      tags: ['MLOps', 'Engineering', 'Best Practices']
    },
    {
      type: 'Blog Post',
      title: 'Scaling NLP Models: From Prototype to Production',
      venue: 'Personal Blog',
      year: '2023',
      citations: 850,
      link: '#',
      abstract: 'Practical insights on scaling natural language processing models for high-traffic applications.',
      tags: ['NLP', 'Scalability', 'Production']
    },
    {
      type: 'Workshop',
      title: 'Advanced Feature Engineering Techniques for Tabular Data',
      venue: 'DataCon 2023',
      year: '2023',
      citations: 0,
      link: '#',
      abstract: 'Hands-on workshop covering advanced feature engineering methods for structured data and their impact on model performance.',
      tags: ['Feature Engineering', 'Workshop', 'Tabular Data']
    },
    {
      type: 'Technical Article',
      title: 'Explainable AI: Making Black Box Models Interpretable',
      venue: 'Medium Engineering',
      year: '2023',
      citations: 920,
      link: '#',
      abstract: 'Deep dive into model interpretability techniques including SHAP, LIME, and attention visualization.',
      tags: ['XAI', 'Interpretability', 'Ethics']
    }
  ];

  const talks = [
    {
      title: 'The Future of MLOps: Trends and Best Practices',
      event: 'AI Conference 2024',
      date: 'March 2024',
      audience: '500+ attendees',
      type: 'Keynote',
      thumbnail: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'Real-time ML: From Theory to Production',
      event: 'ML Summit',
      date: 'January 2024',
      audience: '300+ attendees',
      type: 'Technical Talk',
      thumbnail: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'Building Ethical AI Systems',
      event: 'Tech Ethics Forum',
      date: 'November 2023',
      audience: '200+ attendees',
      type: 'Panel Discussion',
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const typeIcons = {
    'Research Paper': FileText,
    'Conference Paper': BookOpen,
    'Technical Article': FileText,
    'Blog Post': FileText,
    'Workshop': Video
  };

  return (
    <section id="publications" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-4">
            Research & Publications
          </h2>
          <p className="text-gray-400 text-lg">
            Contributing to the AI/ML community through research, writing, and knowledge sharing
          </p>
        </div>

        <div className="mb-20">
          <div className="grid md:grid-cols-2 gap-6">
            {publications.map((pub, index) => {
              const Icon = typeIcons[pub.type as keyof typeof typeIcons] || FileText;
              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-xl">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">{pub.type}</div>
                        <div className="text-sm text-white">{pub.year}</div>
                      </div>
                    </div>
                    {pub.citations > 0 && (
                      <div className="flex items-center gap-1 text-gray-400">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">{pub.citations} reads</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl text-white font-light mb-2 leading-tight">
                    {pub.title}
                  </h3>

                  <p className="text-sm text-gray-400 mb-4">{pub.venue}</p>

                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    {pub.abstract}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {pub.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={pub.link}
                    className="inline-flex items-center gap-2 text-sm text-white hover:text-gray-300 transition-colors"
                  >
                    Read Full Article
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-3xl sm:text-4xl font-light text-white mb-8">
            Speaking Engagements
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {talks.map((talk, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={talk.thumbnail}
                    alt={talk.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                      {talk.type}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-lg text-white font-light mb-3 leading-tight">
                    {talk.title}
                  </h4>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      {talk.event}
                    </div>
                    <div>{talk.date}</div>
                    <div className="text-gray-500">{talk.audience}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-3xl p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl text-white font-light mb-2">
                Publication Metrics
              </h3>
              <p className="text-gray-400 text-sm">
                Actively contributing to the data science and AI community
              </p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-3xl text-white font-light mb-1">15+</div>
                <div className="text-xs text-gray-400">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-white font-light mb-1">3K+</div>
                <div className="text-xs text-gray-400">Reads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-white font-light mb-1">10+</div>
                <div className="text-xs text-gray-400">Talks</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
