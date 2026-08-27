import { lazy, Suspense, useEffect, useRef } from 'react';
import { animate, createTimeline, stagger } from 'animejs';
import { profile } from '../content';
import './hero.css';

const Scene3D = lazy(() => import('./three/Scene3D'));

const GLYPHS = '!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// decode/scramble text into an element over `duration` ms
const scrambleInto = (el, text, duration = 900) => {
  const start = performance.now();
  let raf;
  const tick = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const lock = Math.floor(p * text.length);
    let out = text.slice(0, lock);
    for (let i = lock; i < text.length; i++) {
      out += text[i] === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }
    el.textContent = out;
    if (p < 1) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
};

const Hero = ({ ready }) => {
  const rootRef = useRef(null);
  const roleRef = useRef(null);

  useEffect(() => {
    if (!ready) return undefined;
    const root = rootRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      root.classList.add('hero--ready');
      if (roleRef.current) roleRef.current.textContent = 'FULL STACK DEVELOPER';
      return undefined;
    }

    root.classList.add('hero--ready');

    const tl = createTimeline({ defaults: { ease: 'out(4)' } });
    tl.add(root.querySelectorAll('.hero__title .line-mask > span'), {
      y: ['110%', '0%'],
      duration: 1100,
      delay: stagger(140),
    })
      .add(root.querySelector('.hero__prompt'), { opacity: [0, 1], duration: 500 }, '-=700')
      .add(root.querySelector('.hero__badge'), { opacity: [0, 1], y: [18, 0], duration: 600 }, '-=600')
      .add(root.querySelector('.hero__desc'), { opacity: [0, 1], y: [22, 0], duration: 700 }, '-=450')
      .add(root.querySelectorAll('.hero__cta .btn'), {
        opacity: [0, 1],
        y: [20, 0],
        duration: 600,
        delay: stagger(120),
      }, '-=450')
      .add(root.querySelector('.hero__scroll'), { opacity: [0, 1], duration: 700 }, '-=200')
      .add(root.querySelector('.hero__meta'), { opacity: [0, 1], duration: 700 }, '-=700');

    const stop = scrambleInto(roleRef.current, 'FULL STACK DEVELOPER', 1300);

    // subtle parallax on the big type
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      animate(root.querySelector('.hero__title'), {
        x: x * -10,
        y: y * -6,
        duration: 700,
        ease: 'out(3)',
      });
    };
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (fine) window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      stop();
      if (fine) window.removeEventListener('mousemove', onMove);
    };
  }, [ready]);

  return (
    <section className="hero" id="home" ref={rootRef}>
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>

      <div className="hero__inner container">
        <p className="hero__prompt">
          <span className="accent">aravind@portfolio</span>:~$ ./init.sh
        </p>

        <div className="hero__badge">
          <span className="hero__badge-dot" />
          [STATUS: AVAILABLE_FOR_FREELANCE]
        </div>

        <h1 className="hero__title">
          <span className="line-mask">
            <span>ARAVIND</span>
          </span>
          <span className="line-mask">
            <span className="hero__title-stroke">SHAJAN</span>
          </span>
        </h1>

        <p className="hero__role mono-label">
          <span ref={roleRef}>FULL STACK DEVELOPER</span>
        </p>

        <p className="hero__desc">
          {profile.tagline.charAt(0).toUpperCase() + profile.tagline.slice(1)}
        </p>

        <div className="hero__cta">
          <a href="#work" className="btn" onClick={(e) => {
            e.preventDefault();
            document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            ./view-work ↓
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn--ghost">
            gh --profile ↗
          </a>
        </div>
      </div>

      <div className="hero__meta mono-label">
        <span>$ locale — kerala, IN</span>
        <span>$ stack — react · node · mongo</span>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-line" />
        <span className="hero__scroll-text">SCROLL</span>
      </div>
    </section>
  );
};

export default Hero;
