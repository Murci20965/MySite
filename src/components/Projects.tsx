import { useState } from 'react';
import { Brain, Eye, TrendingUp, MessageSquare, ShoppingCart, Activity, Github, ExternalLink, Filter } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

export default function Projects() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'NLP', 'Computer Vision', 'Time Series', 'Recommendation', 'Healthcare'];

  const projects = [
    {
      title: 'Medical Image Diagnostic System',
      category: 'Computer Vision',
      description: 'Deep learning model for automated detection of abnormalities in chest X-rays using CNNs. Deployed on AWS with real-time inference capabilities.',
      image: 'https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: {
        accuracy: '97.2%',
        impact: '40% faster diagnosis',
        data: '150K images'
      },
      tech: ['PyTorch', 'FastAPI', 'AWS SageMaker', 'Docker'],
      github: '#',
      demo: '#',
      duration: '12 weeks'
    },
    {
      title: 'Customer Churn Prediction Engine',
      category: 'Time Series',
      description: 'ML pipeline predicting customer churn with 90%+ accuracy. Integrated with CRM systems for proactive retention campaigns.',
      image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: {
        accuracy: '92.5%',
        impact: '35% churn reduction',
        data: '2M records'
      },
      tech: ['Scikit-learn', 'XGBoost', 'Apache Airflow', 'PostgreSQL'],
      github: '#',
      demo: '#',
      duration: '8 weeks'
    },
    {
      title: 'Real-time Sentiment Analysis API',
      category: 'NLP',
      description: 'Production NLP system analyzing social media sentiment in real-time. Processes 10K+ tweets per minute with sub-second latency.',
      image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: {
        accuracy: '89.3%',
        impact: '10K req/min',
        data: '50M tweets'
      },
      tech: ['TensorFlow', 'BERT', 'Redis', 'Kubernetes'],
      github: '#',
      demo: '#',
      duration: '10 weeks'
    },
    {
      title: 'E-commerce Recommendation System',
      category: 'Recommendation',
      description: 'Hybrid collaborative filtering system increasing sales conversion by 28%. Handles millions of users with personalized recommendations.',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: {
        accuracy: '85.7%',
        impact: '+28% conversion',
        data: '5M users'
      },
      tech: ['Python', 'Spark', 'Neo4j', 'AWS Lambda'],
      github: '#',
      demo: '#',
      duration: '14 weeks'
    },
    {
      title: 'Predictive Maintenance for IoT Devices',
      category: 'Time Series',
      description: 'LSTM-based system predicting equipment failures 7 days in advance. Reduced downtime by 60% for manufacturing clients.',
      image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: {
        accuracy: '94.1%',
        impact: '60% less downtime',
        data: '100K sensors'
      },
      tech: ['PyTorch', 'LSTM', 'InfluxDB', 'Grafana'],
      github: '#',
      demo: '#',
      duration: '16 weeks'
    },
    {
      title: 'Document Classification System',
      category: 'NLP',
      description: 'Automated legal document classification using transformer models. Processing 1000+ documents daily with 96% accuracy.',
      image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: {
        accuracy: '96.4%',
        impact: '80% time saved',
        data: '500K docs'
      },
      tech: ['HuggingFace', 'RoBERTa', 'MongoDB', 'FastAPI'],
      github: '#',
      demo: '#',
      duration: '9 weeks'
    },
    {
      title: 'Fraud Detection System',
      category: 'Healthcare',
      description: 'Real-time anomaly detection for financial transactions using ensemble methods. Prevented $2M+ in fraudulent activity.',
      image: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: {
        accuracy: '98.6%',
        impact: '$2M+ saved',
        data: '20M transactions'
      },
      tech: ['Scikit-learn', 'Isolation Forest', 'Kafka', 'Cassandra'],
      github: '#',
      demo: '#',
      duration: '12 weeks'
    },
    {
      title: 'Object Detection for Autonomous Systems',
      category: 'Computer Vision',
      description: 'YOLOv8-based real-time object detection achieving 60 FPS on edge devices. Deployed in autonomous vehicle testing environments.',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: {
        accuracy: '91.8%',
        impact: '60 FPS detection',
        data: '300K images'
      },
      tech: ['PyTorch', 'YOLOv8', 'ONNX', 'TensorRT'],
      github: '#',
      demo: '#',
      duration: '14 weeks'
    }
  ];

  const filteredProjects = selectedFilter === 'All'
    ? projects
    : projects.filter(p => p.category === selectedFilter);

  const categoryIcons = {
    'Computer Vision': Eye,
    'Time Series': TrendingUp,
    'NLP': MessageSquare,
    'Recommendation': ShoppingCart,
    'Healthcare': Activity
  };

  return (
    <section id="projects" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-4">
            Featured AI/ML Projects
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Production-grade solutions delivering measurable business impact across diverse domains
          </p>

          <div className="flex flex-wrap gap-3 items-center">
            <Filter className="w-5 h-5 text-gray-400" />
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedFilter === filter
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => {
            const CategoryIcon = categoryIcons[project.category as keyof typeof categoryIcons] || Brain;
            return (
              <AnimatedSection key={index} animation="fade-in" delay={index % 2 === 0}>
                <div
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
                >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full text-xs text-white flex items-center gap-2">
                    <CategoryIcon className="w-3 h-3" />
                    {project.category}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl text-white font-light mb-1">{project.title}</h3>
                    <p className="text-xs text-gray-300">{project.duration}</p>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {project.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl text-white font-light mb-1">
                        {project.metrics.accuracy}
                      </div>
                      <div className="text-xs text-gray-400">Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl text-white font-light mb-1 text-sm">
                        {project.metrics.impact}
                      </div>
                      <div className="text-xs text-gray-400">Impact</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl text-white font-light mb-1 text-sm">
                        {project.metrics.data}
                      </div>
                      <div className="text-xs text-gray-400">Dataset</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={project.github}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                    <a
                      href={project.demo}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white text-black rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Demo
                    </a>
                  </div>
                </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            View All Projects
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
