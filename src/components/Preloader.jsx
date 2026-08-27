import { useEffect, useRef } from 'react';
import { createTimeline, stagger, utils } from 'animejs';
import './preloader.css';

const BOOT = [
  '[ OK ] mounting /dev/portfolio',
  '[ OK ] loading react@18 · anime@4 · three',
  '[ OK ] compiling shaders',
  '[ OK ] indexing 14 projects',
  '[ OK ] all systems nominal',
];

const Preloader = ({ onComplete }) => {
  const rootRef = useRef(null);
  const counterRef = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    const html = document.documentElement;

    const finish = () => {
      if (done.current) return;
      done.current = true;
      root.style.display = 'none';
      html.classList.remove('is-locked');
      try {
        sessionStorage.setItem('preloaded', '1');
      } catch (e) {
        /* private mode */
      }
      onComplete?.();
    };

    // skip on repeat visits in the same session / reduced motion
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem('preloaded') === '1';
    } catch (e) {
      /* private mode */
    }
    if (seen || reduce) {
      finish();
      return undefined;
    }

    html.classList.add('is-locked');
    const counter = { v: 0 };

    const tl = createTimeline({
      defaults: { ease: 'inOut(3)' },
      onComplete: finish,
    });

    tl.add(
      counter,
      {
        v: 100,
        duration: 1900,
        ease: 'out(2)',
        modifier: utils.round(0),
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = String(counter.v).padStart(3, '0');
          }
        },
      },
      0
    )
      .add('.preloader__brand', { opacity: [0, 1], y: [24, 0], duration: 700 }, 150)
      .add(
        '.preloader__line',
        { opacity: [0, 1], x: [-10, 0], duration: 260, ease: 'out(2)', delay: stagger(220) },
        400
      )
      .add('.preloader__meta', { opacity: [0, 1], duration: 500 }, 500)
      .add('.preloader__content', { opacity: 0, duration: 350 }, 1950)
      .add('.preloader__panel', { y: '-101%', duration: 800, delay: stagger(90) }, 2150);

    const failsafe = setTimeout(finish, 6500);

    return () => {
      clearTimeout(failsafe);
      tl.cancel();
      html.classList.remove('is-locked');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="preloader" ref={rootRef} aria-hidden="true">
      <div className="preloader__panel" />
      <div className="preloader__panel" />
      <div className="preloader__panel" />
      <div className="preloader__content">
        <div className="preloader__brand">
          aravind<span className="accent">@</span>shajan:~$ boot
        </div>
        <ul className="preloader__log">
          {BOOT.map((line) => (
            <li className="preloader__line" key={line}>
              {line}
            </li>
          ))}
        </ul>
        <div className="preloader__meta">
          <span>[ BOOTING PORTFOLIO v3.0 ]</span>
          <span className="preloader__counter" ref={counterRef}>
            000
          </span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
