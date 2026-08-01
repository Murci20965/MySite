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
import ScrollProgress from './components/ScrollProgress';
import ExpandMedia from './components/ExpandMedia';
import Marquee from './components/Marquee';
import ChatWidget from './components/ChatWidget';
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
        <ScrollProgress />
        <Navigation />
        <HeroBackdrop />
        <div className="relative">
          {/* No background here: the fixed Earth canvas paints beneath this
              wrapper, so an opaque bg would hide it. The page black comes
              from the root element. */}
          <div className="relative overflow-hidden">
            <Hero />
            <About />
          </div>
          <div className="relative">
            <Marquee />
            <Experience />
            <Projects />
            <ExpandMedia />
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
        <ChatWidget />
      </div>
    </div>
  );
}

export default App;
