import { GraduationCap, Award, BookOpen, TrendingUp } from 'lucide-react';

export default function Education() {
  const education = [
    {
      degree: 'Master of Science in Computer Science',
      specialization: 'Machine Learning & Artificial Intelligence',
      institution: 'Stanford University',
      year: '2020-2022',
      gpa: '3.9/4.0',
      thesis: 'Optimizing Neural Architecture Search for Resource-Constrained Edge Devices',
      image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=600',
      achievements: [
        'Dean\'s List - All Semesters',
        'Outstanding Graduate Research Award',
        'Published 3 papers in top-tier conferences'
      ]
    },
    {
      degree: 'Bachelor of Science in Mathematics',
      specialization: 'Statistics & Data Science',
      institution: 'MIT',
      year: '2016-2020',
      gpa: '3.8/4.0',
      thesis: 'Statistical Methods for High-Dimensional Data Analysis',
      image: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=600',
      achievements: [
        'Summa Cum Laude',
        'Mathematics Department Award',
        'Undergraduate Research Fellowship'
      ]
    }
  ];

  const courses = [
    {
      title: 'Deep Learning Specialization',
      provider: 'deeplearning.ai',
      instructor: 'Andrew Ng',
      completed: '2023',
      skills: ['Neural Networks', 'CNN', 'RNN', 'Transformers'],
      certificate: '#'
    },
    {
      title: 'Machine Learning Engineering for Production',
      provider: 'deeplearning.ai',
      instructor: 'Andrew Ng',
      completed: '2023',
      skills: ['MLOps', 'Model Deployment', 'Data Pipeline', 'Monitoring'],
      certificate: '#'
    },
    {
      title: 'Advanced NLP with Transformers',
      provider: 'Hugging Face',
      instructor: 'Thomas Wolf',
      completed: '2024',
      skills: ['BERT', 'GPT', 'T5', 'Fine-tuning'],
      certificate: '#'
    },
    {
      title: 'AWS Certified Machine Learning - Specialty',
      provider: 'Amazon Web Services',
      instructor: 'AWS Training',
      completed: '2024',
      skills: ['SageMaker', 'AWS ML Services', 'Cloud Deployment'],
      certificate: '#'
    },
    {
      title: 'TensorFlow Developer Certificate',
      provider: 'Google',
      instructor: 'TensorFlow Team',
      completed: '2023',
      skills: ['TensorFlow', 'Keras', 'Model Building', 'Deployment'],
      certificate: '#'
    },
    {
      title: 'Reinforcement Learning Specialization',
      provider: 'Coursera',
      instructor: 'Martha White & Adam White',
      completed: '2023',
      skills: ['Q-Learning', 'Policy Gradient', 'Actor-Critic', 'DQN'],
      certificate: '#'
    }
  ];

  const currentLearning = [
    {
      topic: 'Large Language Models (LLMs)',
      progress: 75,
      focus: 'Fine-tuning and prompt engineering for enterprise applications'
    },
    {
      topic: 'Edge AI & Model Optimization',
      progress: 60,
      focus: 'Deploying ML models on edge devices with resource constraints'
    },
    {
      topic: 'Federated Learning',
      progress: 45,
      focus: 'Privacy-preserving machine learning techniques'
    }
  ];

  return (
    <section id="education" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-4">
            Education & Learning
          </h2>
          <p className="text-gray-400 text-lg">
            Continuous learning journey combining formal education with cutting-edge skills
          </p>
        </div>

        <div className="mb-20">
          <h3 className="text-3xl sm:text-4xl font-light text-white mb-8">
            Academic Background
          </h3>
          <div className="space-y-8">
            {education.map((edu, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300"
              >
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <div className="h-full min-h-[250px] relative overflow-hidden">
                      <img
                        src={edu.image}
                        alt={edu.institution}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      <div className="absolute bottom-6 left-6">
                        <GraduationCap className="w-12 h-12 text-white mb-2" />
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-2 p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-2xl text-white font-light mb-2">{edu.degree}</h4>
                        <p className="text-lg text-gray-300 mb-1">{edu.specialization}</p>
                        <p className="text-gray-400">{edu.institution}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-400">{edu.year}</div>
                        <div className="text-white font-light">GPA: {edu.gpa}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-400">
                        <span className="text-gray-300 font-medium">Thesis:</span> {edu.thesis}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-300 mb-2">Key Achievements:</p>
                      <ul className="space-y-1">
                        {edu.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className="text-sm text-gray-400 flex items-center gap-2">
                            <Award className="w-4 h-4 text-white/60 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h3 className="text-3xl sm:text-4xl font-light text-white mb-8">
            Professional Certifications & Courses
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-light mb-1 leading-tight">{course.title}</h4>
                    <p className="text-xs text-gray-400">{course.provider}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mb-4">
                  Instructor: {course.instructor}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {course.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-gray-400">Completed: {course.completed}</span>
                  <a
                    href={course.certificate}
                    className="text-xs text-white hover:text-gray-300 transition-colors"
                  >
                    View Certificate
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-3xl sm:text-4xl font-light text-white mb-8">
            Currently Learning
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {currentLearning.map((item, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start gap-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-white mt-1" />
                  <div>
                    <h4 className="text-lg text-white font-light mb-2">{item.topic}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.focus}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Progress</span>
                    <span className="text-xs text-white">{item.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-white to-white/60 rounded-full transition-all duration-1000"
                      style={{ width: `${item.progress}%` }}
                    />
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
                Lifelong Learning Commitment
              </h3>
              <p className="text-gray-400 text-sm">
                Dedicated to staying at the forefront of AI and ML innovation
              </p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-3xl text-white font-light mb-1">50+</div>
                <div className="text-xs text-gray-400">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-white font-light mb-1">15+</div>
                <div className="text-xs text-gray-400">Certificates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-white font-light mb-1">1000+</div>
                <div className="text-xs text-gray-400">Learning Hours</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
