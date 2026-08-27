import { useState } from 'react';
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

function App() {
  const [ready, setReady] = useState(false);

  return (
    <ReactLenis root options={{ lerp: 0.18, duration: 0.9, wheelMultiplier: 1.15 }}>
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
    </ReactLenis>
  );
}

export default App;
