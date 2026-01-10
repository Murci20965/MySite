import { Play } from 'lucide-react';
import { useState } from 'react';

export default function Hero() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20 -mb-32">
      <div className="absolute inset-0 bg-black">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="stars-container absolute inset-0">
        <div className="radiate-star" style={{ top: '15%', left: '10%', animationDelay: '0s' }} />
        <div className="radiate-star" style={{ top: '25%', left: '85%', animationDelay: '0.5s' }} />
        <div className="radiate-star" style={{ top: '45%', left: '15%', animationDelay: '1s' }} />
        <div className="radiate-star" style={{ top: '65%', left: '75%', animationDelay: '1.5s' }} />
        <div className="radiate-star" style={{ top: '80%', left: '30%', animationDelay: '2s' }} />
        <div className="radiate-star" style={{ top: '35%', left: '60%', animationDelay: '2.5s' }} />
        <div className="radiate-star" style={{ top: '70%', left: '90%', animationDelay: '3s' }} />
        <div className="radiate-star" style={{ top: '10%', left: '50%', animationDelay: '3.5s' }} />
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 z-10 flex items-start justify-end pr-0 sm:pr-4 lg:pr-8 xl:pr-12 pt-8 lg:pt-16">
        <img
          src="/moon.jpg"
          alt=""
          className="w-full max-w-[350px] sm:max-w-[450px] md:max-w-[550px] lg:max-w-[650px] xl:max-w-[750px] h-auto object-contain opacity-40"
          style={{
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)'
          }}
        />
      </div>

      <div className="relative z-20 w-full">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-20 py-12 sm:py-16 lg:py-20">
          <div className="flex justify-start lg:justify-start">
            <div className="w-full lg:w-1/2 lg:pr-12 xl:pr-16">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-white flex-shrink-0"></span>
                <span className="text-xs sm:text-sm text-white/70 uppercase tracking-[0.35em] font-light">
                  Data Scientist & AI Engineer
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light mb-8 sm:mb-10 leading-[1.05] neon-glow">
                <div className="flex items-center gap-4 sm:gap-5">
                  <span className="text-white whitespace-nowrap">Nhlanhla</span>
                  <span className="text-white/60 whitespace-nowrap">Mokoena</span>
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 group flex-shrink-0 relative glow"
                    aria-label="Play video"
                  >
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white/60 group-hover:text-white ml-0.5 relative z-10" fill="currentColor" />
                    <div className="absolute inset-0 rounded-full water-ripple" />
                  </button>
                </div>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-white/60 mb-6 sm:mb-8 max-w-2xl leading-relaxed">
                I am a skilled Data Scientist specializing in Machine Learning and AI Engineering, focused on building robust, scalable solutions that drive business intelligence and innovation. Let's create the future with data.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => scrollToSection('projects')}
                  className="px-9 py-4 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105 shimmer"
                >
                  View Projects
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-9 py-4 bg-black text-white border border-white/30 font-medium rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:glow"
                >
                  Get in Touch
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isVideoModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <button
            onClick={() => setIsVideoModalOpen(false)}
            className="absolute top-8 right-8 text-white hover:text-gray-300 transition-colors"
            aria-label="Close video"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <iframe
              className="w-full h-full rounded-2xl"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Pitch Deck Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
