import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import SocialIcons from './components/SocialIcons';
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

function App() {
  return (
    <div className="min-h-screen bg-black">
      <SimpleCursor />
      <Navigation />
      <Hero />
      <About />
      <SocialIcons />
      <Projects />
      <Skills />
      <Stats />
      <Blog />
      <OpenSource />
      <Education />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
