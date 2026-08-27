import { useState } from 'react';
import { ReactLenis } from 'lenis/react';

import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
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
      <Nav />

      <main>
        <Hero ready={ready} />
        <Marquee
          items={['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'Three.js', 'Python']}
          speed="30s"
        />
        <About />
        <Skills />
        <Work />
        <Marquee
          items={['Available for freelance', "Let's work together", 'Open to opportunities']}
          speed="36s"
          reverse
        />
        <Journey />
        <Contact />
      </main>

      <Footer />
    </ReactLenis>
  );
}

export default App;
