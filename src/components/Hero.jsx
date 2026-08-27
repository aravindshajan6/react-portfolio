import { lazy, Suspense } from 'react';
import {
  animate,
  createAnimatable,
  createTimeline,
  onScroll,
  scrambleText,
  splitText,
  stagger,
  utils,
} from 'animejs';
import { profile } from '../content';
import useAnimeScope from '../hooks/useAnimeScope';
import { scrollToSection } from '../lib/motion';
import './hero.css';

const Scene3D = lazy(() => import('./three/Scene3D'));

const INTRO_ELS = [
  '.hero__prompt',
  '.hero__badge',
  '.hero__desc',
  '.hero__cta .btn',
  '.hero__scroll',
  '.hero__meta',
];

const Hero = ({ ready }) => {
  const [rootRef] = useAnimeScope(
    (scope) => {
      const root = rootRef.current;
      if (!root) return undefined;
      const lines = Array.from(root.querySelectorAll('.hero__title .line-mask > span'));
      const role = root.querySelector('.hero__role span');

      if (scope.matches.reduce) {
        utils.set(INTRO_ELS, { opacity: 1 });
        root.classList.add('hero--static');
        return undefined;
      }
      if (!ready) return undefined; // preloader still running

      /* ── 1. kinetic title: split each line into chars, roll them up ── */
      const chars = lines.flatMap(
        (line) => splitText(line, { chars: { class: 'split-char' }, words: false, lines: false }).chars
      );

      createTimeline({ defaults: { ease: 'out(4)' } })
        .add(chars, {
          y: ['110%', '0%'],
          rotateZ: [8, 0],
          duration: 1000,
          delay: stagger(30),
        })
        .add('.hero__prompt', { opacity: [0, 1], duration: 500 }, 100)
        .add('.hero__badge', { opacity: [0, 1], y: [18, 0], duration: 600 }, 350)
        .add('.hero__desc', { opacity: [0, 1], y: [22, 0], duration: 700 }, 850)
        .add(
          '.hero__cta .btn',
          { opacity: [0, 1], y: [20, 0], duration: 600, delay: stagger(120) },
          1000
        )
        .add('.hero__scroll, .hero__meta', { opacity: [0, 1], duration: 700 }, 1350);

      /* ── 2. role line decodes from glyph noise ── */
      animate(role, {
        innerHTML: scrambleText({
          text: profile.role.toUpperCase(),
          chars: 'uppercase',
          cursor: '▌',
          delay: 450,
          duration: 1500,
        }),
      });

      /* ── 3. mouse parallax on the big type (fine pointers) ── */
      if (scope.matches.fine) {
        const title = createAnimatable('.hero__title', { x: 700, y: 700, ease: 'out(3)' });
        const meta = createAnimatable('.hero__meta', { x: 900, y: 900, ease: 'out(3)' });
        const onMove = (e) => {
          const nx = (e.clientX / window.innerWidth - 0.5) * 2;
          const ny = (e.clientY / window.innerHeight - 0.5) * 2;
          title.x(nx * -10);
          title.y(ny * -6);
          meta.x(nx * 8);
          meta.y(ny * 5);
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        scope.data.offMove = () => window.removeEventListener('mousemove', onMove);
      }

      /* ── 4. content drifts up + fades as the hero scrolls out ── */
      animate('.hero__inner', {
        y: -90,
        opacity: 0.08,
        ease: 'linear',
        autoplay: onScroll({ target: root, enter: 'top top', leave: 'top bottom', sync: true }),
      });

      return () => scope.data.offMove?.();
    },
    [ready]
  );

  return (
    <section className="hero" id="home" ref={rootRef}>
      <Suspense fallback={null}>
        <Scene3D ready={ready} />
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
          <span>{profile.role.toUpperCase()}</span>
        </p>

        <p className="hero__desc">
          {profile.tagline.charAt(0).toUpperCase() + profile.tagline.slice(1)}
        </p>

        <div className="hero__cta">
          <a
            href="#work"
            className="btn"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('work');
            }}
          >
            ./view-work ↓
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn--ghost">
            gh --profile ↗
          </a>
        </div>
      </div>

      <div className="hero__meta mono-label">
        <span>$ locale — kerala, IN</span>
        <span>$ stack — python · react · node</span>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-line" />
        <span className="hero__scroll-text">SCROLL</span>
      </div>
    </section>
  );
};

export default Hero;
