import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';

export default function Blog() {
  const blogPosts = [
    {
      title: 'Building Scalable Machine Learning Pipelines: Lessons from Production',
      excerpt: 'A deep dive into the challenges and solutions I encountered while building and deploying ML pipelines that handle millions of predictions daily.',
      date: 'October 5, 2024',
      readTime: '8 min read',
      category: 'MLOps',
      tags: ['Machine Learning', 'DevOps', 'Python'],
      image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: 'The Art of Feature Engineering: Turning Raw Data into Gold',
      excerpt: 'Explore advanced feature engineering techniques that dramatically improved model performance in my recent projects, with practical examples and code snippets.',
      date: 'September 28, 2024',
      readTime: '12 min read',
      category: 'Data Science',
      tags: ['Feature Engineering', 'Analytics', 'Best Practices'],
      image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: 'Real-Time AI: Building a Low-Latency Recommendation System',
      excerpt: 'How I architected a recommendation system that serves personalized results in under 50ms, handling thousands of concurrent users without breaking a sweat.',
      date: 'September 15, 2024',
      readTime: '10 min read',
      category: 'AI Engineering',
      tags: ['Real-Time AI', 'Scalability', 'Architecture'],
      image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: 'Understanding Transformer Models: A Practical Guide',
      excerpt: 'Breaking down the complexities of transformer architectures with clear explanations and hands-on examples that you can implement today.',
      date: 'August 30, 2024',
      readTime: '15 min read',
      category: 'Deep Learning',
      tags: ['NLP', 'Transformers', 'PyTorch'],
      image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: 'Data Quality: The Foundation of Successful ML Projects',
      excerpt: 'Why data quality matters more than fancy algorithms, and practical strategies for ensuring your training data is reliable and representative.',
      date: 'August 12, 2024',
      readTime: '7 min read',
      category: 'Data Engineering',
      tags: ['Data Quality', 'Best Practices', 'SQL'],
      image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: 'From Jupyter Notebook to Production: A Survival Guide',
      excerpt: 'The practical steps and tools I use to transform experimental notebooks into production-ready code that other engineers can work with.',
      date: 'July 25, 2024',
      readTime: '9 min read',
      category: 'Software Engineering',
      tags: ['Python', 'CI/CD', 'Testing'],
      image: 'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const categories = ['All', 'MLOps', 'Data Science', 'AI Engineering', 'Deep Learning'];

  return (
    <section id="blog" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-4">
            Personal Blog
          </h2>
          <p className="text-gray-400 text-lg">
            Thoughts, tutorials, and insights from my journey in data science and AI engineering
          </p>
        </div>

        <div className="mb-12 flex flex-wrap gap-3">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                index === 0
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'bg-transparent text-gray-400 border border-white/10 hover:bg-white/5 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article
              key={index}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-emerald-500/90 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl text-white font-light mb-3 leading-tight group-hover:text-emerald-500 transition-colors">
                  {post.title}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="inline-flex items-center gap-2 text-sm text-white hover:text-emerald-500 transition-colors group/btn">
                  Read More
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium rounded-full transition-all duration-300 hover:scale-105">
            Load More Posts
          </button>
        </div>

        <div className="mt-20 bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-3xl p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl text-white font-light mb-2">
                Stay Updated
              </h3>
              <p className="text-gray-400 text-sm">
                Get notified when I publish new articles and tutorials
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-3 bg-white/5 border border-white/20 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full transition-all duration-300 hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
