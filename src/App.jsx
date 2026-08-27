import { useEffect, useRef, useState } from 'react';
import { ReactLenis } from 'lenis/react';

import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import Ticker from './components/Ticker';
import AsciiDivider from './components/AsciiDivider';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Work from './components/Work';
import Journey from './components/Journey';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Terminal from './components/Terminal';
import { prefersReducedMotion } from './lib/motion';

function App() {
  const [ready, setReady] = useState(false);
  const lenisRef = useRef(null);

  // Lenis-aware section scrolling, shared with Nav / Terminal / Hero via lib/motion.js
  useEffect(() => {
    window.__scrollToSection = (id, offset = 0) => {
      const lenis = lenisRef.current?.lenis;
      const target = id === 'home' ? 0 : document.getElementById(id) || 0;
      const immediate = prefersReducedMotion();
      if (lenis) {
        lenis.scrollTo(target, { offset, immediate, duration: 1.2 });
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' });
      }
    };
    return () => {
      delete window.__scrollToSection;
    };
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ lerp: 0.12, duration: 1.1, wheelMultiplier: 1.1 }}>
      <Preloader onComplete={() => setReady(true)} />
      <Cursor />
      <Ticker />
      <Nav />

      <main>
        <Hero ready={ready} />
        <About />
        <Skills />
        <Work />
        <AsciiDivider />
        <Journey />
        <Contact />
      </main>

      <Footer />
      <Terminal />
    </ReactLenis>
  );
}

export default App;
