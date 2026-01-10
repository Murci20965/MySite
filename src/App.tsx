import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Stats from './components/Stats';
import Blog from './components/Blog';
import OpenSource from './components/OpenSource';
import Education from './components/Education';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SimpleCursor from './components/SimpleCursor';
import FutureticParticles from './components/FutureticParticles';
import GlowingOrbs from './components/GlowingOrbs';

function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <FutureticParticles />
      <GlowingOrbs />
      <div className="relative z-10">
        <SimpleCursor />
        <Navigation />
      <div className="relative">
        <Hero />
        <About />
        <div className="relative" style={{
          transform: `translateY(${Math.max(0, scrollY - 1200) * 0.5}px)`,
          transition: 'transform 0.1s linear'
        }}>
          <Experience />
          <Projects />
          <Skills />
          <Stats />
          <Blog />
          <OpenSource />
          <Education />
          <Testimonials />
          <FAQ />
          <Contact />
        </div>
      </div>
      <Footer />
      </div>
    </div>
  );
}

export default App;
