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
import HeroBackdrop from './components/HeroBackdrop';

function App() {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <FutureticParticles />
      <GlowingOrbs />
      <div className="grain-overlay" aria-hidden="true" />
      <div className="relative z-10">
        <SimpleCursor />
        <Navigation />
      <div className="relative">
        <div className="relative bg-black overflow-hidden">
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-full lg:w-1/2 z-0">
            <HeroBackdrop />
          </div>
          <Hero />
          <About />
        </div>
        <div className="relative">
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
