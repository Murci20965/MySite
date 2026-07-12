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
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-full lg:w-1/2 z-0 flex items-start justify-end pr-0 sm:pr-4 lg:pr-8 xl:pr-12 pt-24 lg:pt-28">
            <img
              src="/moon.jpg"
              alt=""
              className="w-full max-w-[350px] sm:max-w-[450px] md:max-w-[550px] lg:max-w-[650px] xl:max-w-[750px] h-auto object-contain opacity-50"
              style={{
                mixBlendMode: 'screen',
                maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
              }}
            />
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
