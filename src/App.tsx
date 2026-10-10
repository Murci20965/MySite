import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Stats from './components/Stats';
import OpenSource from './components/OpenSource';
import Education from './components/Education';
import Principles from './components/Principles';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SimpleCursor from './components/SimpleCursor';
import ScrollProgress from './components/ScrollProgress';
import ExpandMedia from './components/ExpandMedia';
import ChatWidget from './components/ChatWidget';
import FilmStage from './components/FilmStage';
import StageDirector from './components/StageDirector';

function App() {
  return (
    // overflow-x-CLIP, never -hidden: `hidden` turns this into a scroll
    // container and silently breaks every position:sticky on the page
    // (the Vision stage and the pinned filmstrip both depend on it).
    <div className="min-h-screen bg-bg overflow-x-clip">
      {/* The film is the background of every section (fixed, z-0); the
          sections themselves stay transparent so it shows through. */}
      <FilmStage />
      {/* Runs the staged scenes: content revealed one step at a time over the film. */}
      <StageDirector />
      <div className="grain-overlay" aria-hidden="true" />
      <div className="relative z-10">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-fg focus:px-5 focus:py-2.5 focus:font-sans focus:text-sm focus:font-semibold focus:text-bg"
        >
          Skip to content
        </a>
        <SimpleCursor />
        <ScrollProgress />
        <Navigation />
        <main id="main" className="relative">
          {/* No background on any wrapper: the fixed film paints beneath them.
              overflow-CLIP, not -hidden: `hidden` would make this a scroll
              container and break position: sticky inside it. */}
          <div className="relative overflow-clip">
            <Hero />
            <About />
          </div>
          <div className="relative">
            <Experience />
            {/* One work section: every project is open source. */}
            <OpenSource />
            {/* Receipts land right after the work, before the vision moment. */}
            <Stats />
            <ExpandMedia />
            <Skills />
            {/* The rise to orbit: the film's fastest stretch, crossed in a short scroll with no text. */}
            <div id="breather" className="breather" aria-hidden="true" />
            <Education />
            <Principles />
            <FAQ />
            <Contact />
          </div>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </div>
  );
}

export default App;
