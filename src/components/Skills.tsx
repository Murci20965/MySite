import { Code, Database, Cloud, BarChart3, Brain, Cpu } from 'lucide-react';

export default function Skills() {
  const skillCategories = [
    {
      icon: Brain,
      title: 'ML/DL Frameworks',
      skills: [
        { name: 'TensorFlow', level: 95 },
        { name: 'PyTorch', level: 92 },
        { name: 'Scikit-learn', level: 98 },
        { name: 'Keras', level: 90 },
        { name: 'XGBoost', level: 88 }
      ]
    },
    {
      icon: Code,
      title: 'Programming Languages',
      skills: [
        { name: 'Python', level: 98 },
        { name: 'R', level: 85 },
        { name: 'SQL', level: 92 },
        { name: 'JavaScript', level: 80 },
        { name: 'Scala', level: 75 }
      ]
    },
    {
      icon: Cloud,
      title: 'Cloud Platforms',
      skills: [
        { name: 'AWS', level: 90 },
        { name: 'Azure ML', level: 85 },
        { name: 'GCP', level: 88 },
        { name: 'Docker', level: 92 },
        { name: 'Kubernetes', level: 85 }
      ]
    },
    {
      icon: Database,
      title: 'Data Engineering',
      skills: [
        { name: 'Apache Spark', level: 88 },
        { name: 'Apache Airflow', level: 85 },
        { name: 'PostgreSQL', level: 90 },
        { name: 'MongoDB', level: 82 },
        { name: 'Redis', level: 80 }
      ]
    },
    {
      icon: BarChart3,
      title: 'Visualization & BI',
      skills: [
        { name: 'Matplotlib', level: 95 },
        { name: 'Seaborn', level: 92 },
        { name: 'Plotly', level: 88 },
        { name: 'Tableau', level: 85 },
        { name: 'Power BI', level: 82 }
      ]
    },
    {
      icon: Cpu,
      title: 'MLOps & Deployment',
      skills: [
        { name: 'MLflow', level: 88 },
        { name: 'Kubeflow', level: 82 },
        { name: 'FastAPI', level: 90 },
        { name: 'TensorFlow Serving', level: 85 },
        { name: 'ONNX', level: 80 }
      ]
    }
  ];

  const certifications = [
    {
      title: 'AWS Certified Machine Learning',
      issuer: 'Amazon Web Services',
      year: '2024',
      badge: 'https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      title: 'TensorFlow Developer Certificate',
      issuer: 'Google',
      year: '2023',
      badge: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      title: 'Azure AI Engineer Associate',
      issuer: 'Microsoft',
      year: '2024',
      badge: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      title: 'Deep Learning Specialization',
      issuer: 'deeplearning.ai',
      year: '2023',
      badge: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=200'
    }
  ];

  return (
    <section id="skills" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-4">
            Technical Expertise
          </h2>
          <p className="text-gray-400 text-lg">
            Comprehensive skill set spanning the entire ML/AI development lifecycle
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="bg-black border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl text-white font-light">{category.title}</h3>
                </div>

                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">{skill.name}</span>
                        <span className="text-sm text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-white/80 to-white/40 rounded-full transition-all duration-1000"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <h3 className="text-3xl sm:text-4xl font-light text-white mb-8">
            Certifications & Credentials
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-black border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="aspect-square mb-4 rounded-xl overflow-hidden bg-white/5">
                  <img
                    src={cert.badge}
                    alt={cert.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-white font-light mb-2 text-sm leading-tight">
                  {cert.title}
                </h4>
                <p className="text-xs text-gray-400 mb-1">{cert.issuer}</p>
                <p className="text-xs text-gray-500">{cert.year}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-3xl p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl text-white font-light mb-2">
                Continuous Learning Journey
              </h3>
              <p className="text-gray-400 text-sm">
                Currently exploring: Large Language Models (LLMs), Reinforcement Learning, and Edge AI optimization
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl text-white font-light mb-1">50+</div>
                <div className="text-xs text-gray-400">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-white font-light mb-1">15+</div>
                <div className="text-xs text-gray-400">Certs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-white font-light mb-1">1000+</div>
                <div className="text-xs text-gray-400">Hours</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
