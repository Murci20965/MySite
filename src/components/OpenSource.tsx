import { Github, GitFork, Star, ExternalLink, Calendar, Code2 } from 'lucide-react';

export default function OpenSource() {
  const contributions = [
    {
      repo: 'ml-pipeline-optimizer',
      description: 'High-performance ML pipeline optimization toolkit with automated hyperparameter tuning and distributed training support',
      language: 'Python',
      stars: 2400,
      forks: 340,
      contributions: 156,
      role: 'Core Maintainer',
      lastUpdate: '2 days ago',
      tags: ['Machine Learning', 'Optimization', 'Pipeline'],
      link: '#'
    },
    {
      repo: 'realtime-anomaly-detection',
      description: 'Real-time anomaly detection library for streaming data with support for multiple algorithms and custom models',
      language: 'Python',
      stars: 1800,
      forks: 280,
      contributions: 98,
      role: 'Creator',
      lastUpdate: '1 week ago',
      tags: ['Anomaly Detection', 'Streaming', 'Real-time'],
      link: '#'
    },
    {
      repo: 'explainable-ai-toolkit',
      description: 'Comprehensive toolkit for model interpretability featuring SHAP, LIME, and custom visualization tools',
      language: 'Python',
      stars: 3200,
      forks: 520,
      contributions: 72,
      role: 'Contributor',
      lastUpdate: '3 days ago',
      tags: ['Explainable AI', 'Interpretability', 'Visualization'],
      link: '#'
    },
    {
      repo: 'tensorflow/tensorflow',
      description: 'Contributed performance optimizations for TensorFlow Serving and improved documentation for deployment',
      language: 'C++/Python',
      stars: 180000,
      forks: 88000,
      contributions: 24,
      role: 'Contributor',
      lastUpdate: '2 weeks ago',
      tags: ['Deep Learning', 'Framework', 'Deployment'],
      link: '#'
    },
    {
      repo: 'data-quality-validator',
      description: 'Automated data quality validation framework with schema enforcement and anomaly detection',
      language: 'Python',
      stars: 1200,
      forks: 180,
      contributions: 134,
      role: 'Creator',
      lastUpdate: '5 days ago',
      tags: ['Data Quality', 'Validation', 'Pipeline'],
      link: '#'
    },
    {
      repo: 'mlops-deployment-templates',
      description: 'Production-ready MLOps templates for AWS, Azure, and GCP with CI/CD pipelines and monitoring',
      language: 'Python/YAML',
      stars: 1600,
      forks: 420,
      contributions: 88,
      role: 'Core Maintainer',
      lastUpdate: '1 week ago',
      tags: ['MLOps', 'DevOps', 'Cloud'],
      link: '#'
    }
  ];

  const stats = {
    totalContributions: 892,
    repositories: 42,
    pullRequests: 156,
    issuesResolved: 234
  };

  const languageColors = {
    'Python': 'bg-blue-500',
    'C++/Python': 'bg-cyan-500',
    'Python/YAML': 'bg-green-500'
  };

  return (
    <section id="opensource" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-4">
            Open Source Contributions
          </h2>
          <p className="text-gray-400 text-lg">
            Actively contributing to the ML/AI ecosystem and maintaining popular open-source projects
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-black border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-all duration-300">
            <Github className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl text-white font-light mb-1">{stats.totalContributions}</div>
            <div className="text-sm text-gray-400">Contributions</div>
          </div>
          <div className="bg-black border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-all duration-300">
            <Code2 className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl text-white font-light mb-1">{stats.repositories}</div>
            <div className="text-sm text-gray-400">Repositories</div>
          </div>
          <div className="bg-black border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-all duration-300">
            <GitFork className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl text-white font-light mb-1">{stats.pullRequests}</div>
            <div className="text-sm text-gray-400">Pull Requests</div>
          </div>
          <div className="bg-black border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-all duration-300">
            <Star className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl text-white font-light mb-1">{stats.issuesResolved}</div>
            <div className="text-sm text-gray-400">Issues Resolved</div>
          </div>
        </div>

        <div className="space-y-6">
          {contributions.map((contrib, index) => (
            <div
              key={index}
              className="bg-black border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <Github className="w-6 h-6 text-white mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl text-white font-light">{contrib.repo}</h3>
                        <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs text-gray-300">
                          {contrib.role}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {contrib.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {contrib.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${languageColors[contrib.language as keyof typeof languageColors] || 'bg-gray-500'}`} />
                          <span>{contrib.language}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          <span>{contrib.stars.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GitFork className="w-4 h-4" />
                          <span>{contrib.forks.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Code2 className="w-4 h-4" />
                          <span>{contrib.contributions} commits</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{contrib.lastUpdate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href={contrib.link}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  View Repository
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full hover:bg-gray-200 transition-all duration-300 hover:scale-105"
          >
            <Github className="w-5 h-5" />
            View Full GitHub Profile
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
