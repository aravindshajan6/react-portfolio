import { useState } from 'react';
import { animate, createAnimatable, createTimer, onScroll, stagger, utils } from 'animejs';
import useAnimeScope from '../hooks/useAnimeScope';
import useReveal from '../hooks/useReveal';
import StackCube from './StackCube';
import { skills } from '../content';
import './skills.css';

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9.]+/g, '-');

export default function Skills() {
  const revealRef = useReveal();
  const [active, setActive] = useState(null);

  const [boardRef, scopeRef] = useAnimeScope((scope) => {
    const board = boardRef.current;
    if (!board) return;
    const keys = Array.from(board.querySelectorAll('.keycap'));
    const wraps = Array.from(board.querySelectorAll('.keywrap'));
    const nums = Array.from(board.querySelectorAll('.keycap__num'));
    scope.data.tilt = new Map();

    /* key press — the top travels down into its skirt and springs back */
    const press = (cap) => {
      const top = cap.querySelector('.keycap__top');
      if (!top) return;
      animate(top, {
        z: [
          { to: 4, duration: 80, ease: 'out(2)' },
          { to: 20, duration: 280, ease: 'outBack(1.6)' },
        ],
        y: [
          { to: 4, duration: 80 },
          { to: 0, duration: 280 },
        ],
      });
    };
    scope.add('press', press);

    if (scope.matches.reduce) {
      board.classList.add('is-inview');
      utils.set(wraps, { opacity: 1, rotateX: 0, y: 0 });
      nums.forEach((el) => {
        el.textContent = el.dataset.level;
      });
      return;
    }

    /* entrance: keys flip up into place in a grid-aware wave */
    const cols = getComputedStyle(board).gridTemplateColumns.split(' ').length || 1;
    const rows = Math.ceil(wraps.length / cols);
    animate(wraps, {
      opacity: [0, 1],
      rotateX: [-58, 0],
      y: [46, 0],
      duration: 900,
      ease: 'out(4)',
      delay: stagger(55, { grid: [cols, rows], from: 'first' }),
      onBegin: () => board.classList.add('is-inview'),
      autoplay: onScroll({ target: board, enter: 'bottom-=10% top', sync: 'play', repeat: false }),
    });

    /* proficiency counters */
    nums.forEach((el) =>
      animate(el, {
        innerHTML: [0, Number(el.dataset.level)],
        modifier: utils.round(0),
        duration: 1400,
        delay: 350,
        ease: 'out(3)',
        autoplay: onScroll({ target: el, enter: 'bottom-=10% top', sync: 'play', repeat: false }),
      })
    );

    /* ghost typist: a random key presses itself while the board is on screen */
    const ghost = createTimer({
      duration: 1700,
      loop: true,
      autoplay: false,
      onLoop: () => {
        const cap = utils.randomPick(keys);
        press(cap);
        cap.classList.add('is-ghost');
        setTimeout(() => cap.classList.remove('is-ghost'), 380);
      },
    });
    onScroll({
      target: board,
      enter: 'bottom top',
      leave: 'top bottom',
      onEnter: () => ghost.play(),
      onEnterBackward: () => ghost.play(),
      onLeave: () => ghost.pause(),
    });

    /* cursor tilt (fine pointers) — one Animatable per key */
    if (scope.matches.fine) {
      keys.forEach((cap) =>
        scope.data.tilt.set(cap, createAnimatable(cap, { rotateX: 380, rotateY: 380, ease: 'out(3)' }))
      );
    }
  });

  const onTilt = (e) => {
    const cap = e.currentTarget;
    const tilt = scopeRef.current?.data?.tilt?.get(cap);
    const rect = cap.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height;
    cap.style.setProperty('--gx', `${px * 100}%`);
    cap.style.setProperty('--gy', `${py * 100}%`);
    if (tilt) {
      tilt.rotateY((px - 0.5) * 18);
      tilt.rotateX((0.5 - py) * 14);
    }
  };

  const onUntilt = (e) => {
    const tilt = scopeRef.current?.data?.tilt?.get(e.currentTarget);
    if (tilt) {
      tilt.rotateX(0);
      tilt.rotateY(0);
    }
  };

  const onPress = (skill) => (e) => {
    setActive(skill);
    scopeRef.current?.methods?.press?.(e.currentTarget);
  };

  return (
    <section className="section skills-sec" id="skills" ref={revealRef}>
      <div className="container">
        <div className="skills-head">
          <div>
            <p className="section__index reveal">
              <span className="prompt">$</span> ls ./skills --sort=level
            </p>
            <h2 className="section__title reveal">
              TOOLS <span className="stroke">I USE</span>
            </h2>
          </div>
          <div className="skills-cube reveal" style={{ '--reveal-delay': '0.15s' }}>
            <StackCube />
          </div>
        </div>

        {/* live readout — pressing a key "types" it here */}
        <div className="skills-readout reveal" aria-live="polite">
          <span className="prompt">$</span>{' '}
          {active ? (
            <>
              man {slug(active.name)}
              <span className="skills-readout__out">
                {' '}
                → proficiency: {active.level}% · {active.tag}
              </span>
            </>
          ) : (
            <span className="skills-readout__hint">press a key…</span>
          )}
          <span className="skills-readout__cursor" aria-hidden="true">
            ▌
          </span>
        </div>

        <div className="skills-board" ref={boardRef}>
          {skills.map((skill, i) => (
            <div className="keywrap" key={skill.id}>
              <button
                type="button"
                className={`keycap ${active?.id === skill.id ? 'is-active' : ''}`}
                style={{ '--level': `${skill.level}%` }}
                onMouseMove={onTilt}
                onMouseLeave={onUntilt}
                onClick={onPress(skill)}
                onFocus={() => setActive(skill)}
                aria-label={`${skill.name} — ${skill.level} percent, ${skill.tag}`}
              >
                <span className="keycap__side" aria-hidden="true" />
                <span className="keycap__top">
                  <span className="keycap__row">
                    <span className="keycap__index">{String(i + 1).padStart(2, '0')}</span>
                    <span className="keycap__pct">
                      <span className="keycap__num" data-level={skill.level}>
                        0
                      </span>
                      %
                    </span>
                  </span>
                  <span className="keycap__name">{skill.name}</span>
                  <span className="keycap__tag">{skill.tag}</span>
                  <span className="keycap__led" aria-hidden="true" />
                  <span className="keycap__glare" aria-hidden="true" />
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
