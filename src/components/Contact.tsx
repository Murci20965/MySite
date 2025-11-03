import { useState } from 'react';
import { Mail, Linkedin, Github, Send, Calendar, Download, ExternalLink } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const socialLinks = [
    {
      icon: Mail,
      label: 'Email',
      value: 'nhlanhla.mokoena@email.com',
      link: 'mailto:nhlanhla.mokoena@email.com'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'linkedin.com/in/nhlanhla-mokoena',
      link: 'https://linkedin.com'
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'github.com/nhlanhla-mokoena',
      link: 'https://github.com'
    }
  ];

  const projectTypes = [
    'Machine Learning Model Development',
    'Computer Vision Application',
    'NLP/Text Analysis System',
    'Recommendation System',
    'Time Series Forecasting',
    'MLOps & Deployment',
    'Data Pipeline & Engineering',
    'AI Consulting',
    'Other'
  ];

  const budgetRanges = [
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000 - $100,000',
    '$100,000+'
  ];

  const timelines = [
    '1-2 weeks',
    '2-4 weeks',
    '1-2 months',
    '2-3 months',
    '3-6 months',
    '6+ months'
  ];

  return (
    <section id="contact" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-400">Available for New Projects</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-4">
            Let's Work Together
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Open to full-time, contract, and consulting opportunities. Response within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm text-gray-300 mb-2">
                  Company / Organization
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="Your Company"
                />
              </div>

              <div>
                <label htmlFor="projectType" className="block text-sm text-gray-300 mb-2">
                  Project Type
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-colors"
                >
                  <option value="" className="bg-black">Select a project type</option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type} className="bg-black">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="budget" className="block text-sm text-gray-300 mb-2">
                    Budget Range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-colors"
                  >
                    <option value="" className="bg-black">Select budget</option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range} className="bg-black">
                        {range}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="timeline" className="block text-sm text-gray-300 mb-2">
                    Expected Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-colors"
                  >
                    <option value="" className="bg-black">Select timeline</option>
                    {timelines.map((time) => (
                      <option key={time} value={time} className="bg-black">
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm text-gray-300 mb-2">
                  Project Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors resize-none"
                  placeholder="Tell me about your project, goals, and any specific requirements..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-all duration-300 hover:scale-[1.02]"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>

              <p className="text-xs text-gray-500 text-center">
                I typically respond within 24 hours during business days
              </p>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl text-white font-light mb-6">Get in Touch</h3>
              <div className="space-y-4">
                {socialLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={index}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
                    >
                      <div className="p-3 bg-white/10 rounded-xl">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-400">{link.label}</div>
                        <div className="text-sm text-white group-hover:text-gray-300 transition-colors">
                          {link.value}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl text-white font-light mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
                >
                  <Calendar className="w-5 h-5 text-white" />
                  <span className="text-sm text-white flex-1 group-hover:text-gray-300 transition-colors">
                    Schedule a Meeting
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
                >
                  <Download className="w-5 h-5 text-white" />
                  <span className="text-sm text-white flex-1 group-hover:text-gray-300 transition-colors">
                    Download Resume
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl text-white font-light mb-4">Work Preferences</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2" />
                  <span>Open to: Full-time, Contract, Consulting</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2" />
                  <span>Location: Remote / Hybrid</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2" />
                  <span>Rate: Starting from $150/hour</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2" />
                  <span>Availability: Immediate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
