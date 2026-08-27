import { useEffect, useRef } from 'react';
import { createTimeline } from 'animejs';
import './preloader.css';

const Preloader = ({ onComplete }) => {
  const rootRef = useRef(null);
  const counterRef = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (done.current) return;
      done.current = true;
      onComplete?.();
    };

    // skip on repeat visits in the same session / reduced motion
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem('preloaded') === '1';
      sessionStorage.setItem('preloaded', '1');
    } catch (e) {
      /* private mode */
    }

    const root = rootRef.current;
    if (seen || reduce) {
      root.style.display = 'none';
      finish();
      return undefined;
    }

    document.body.style.overflow = 'hidden';
    const counter = { v: 0 };

    const tl = createTimeline({
      defaults: { ease: 'inOut(3)' },
      onComplete: () => {
        root.style.display = 'none';
        document.body.style.overflow = '';
        finish();
      },
    });

    tl.add(counter, {
      v: 100,
      duration: 1500,
      ease: 'out(2)',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0');
        }
      },
    })
      .add('.preloader__brand', { opacity: [0, 1], y: ['24px', '0px'], duration: 700 }, 200)
      .add('.preloader__meta', { opacity: [0, 1], duration: 500 }, 500)
      .add('.preloader__content', { opacity: 0, duration: 350 }, '-=100')
      .add('.preloader__panel', {
        translateY: '-101%',
        duration: 800,
        delay: (el, i) => i * 90,
      });

    const failsafe = setTimeout(() => {
      root.style.display = 'none';
      document.body.style.overflow = '';
      finish();
    }, 5000);

    return () => {
      clearTimeout(failsafe);
      document.body.style.overflow = '';
      tl.cancel?.();
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
        <div className="preloader__meta">
          <span>[ BOOTING PORTFOLIO v2.0 ]</span>
          <span className="preloader__counter" ref={counterRef}>
            000
          </span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
