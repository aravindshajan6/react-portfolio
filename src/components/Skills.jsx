import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';
import useReveal from '../hooks/useReveal';
import { skills } from '../content';
import './skills.css';

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9.]+/g, '-');

export default function Skills() {
  const revealRef = useReveal();
  const gridRef = useRef(null);
  const [active, setActive] = useState(null);
  const fineRef = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      fineRef.current = fine.matches && !reduce.matches;
    };
    update();
    fine.addEventListener('change', update);
    reduce.addEventListener('change', update);
    return () => {
      fine.removeEventListener('change', update);
      reduce.removeEventListener('change', update);
    };
  }, []);

  /* count up each key's % when it scrolls into view */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;

    const nums = grid.querySelectorAll('.keycap__num');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      nums.forEach((el) => {
        el.textContent = el.dataset.level;
      });
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          io.unobserve(el);
          animate(el, {
            innerHTML: [0, Number(el.dataset.level)],
            modifier: (v) => Math.round(v),
            duration: 1400,
            delay: 250,
            ease: 'out(3)',
          });
        });
      },
      { threshold: 0.4 }
    );

    nums.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* 3D tilt following the cursor (fine pointers only) */
  const onTilt = (e) => {
    if (!fineRef.current) return;
    const cap = e.currentTarget;
    const rect = cap.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height;
    cap.style.setProperty('--ry', `${(px - 0.5) * 18}deg`);
    cap.style.setProperty('--rx', `${(0.5 - py) * 14}deg`);
    cap.style.setProperty('--gx', `${px * 100}%`);
    cap.style.setProperty('--gy', `${py * 100}%`);
  };

  const onUntilt = (e) => {
    const cap = e.currentTarget;
    cap.style.setProperty('--rx', '0deg');
    cap.style.setProperty('--ry', '0deg');
  };

  return (
    <section className="section skills-sec" id="skills" ref={revealRef}>
      <div className="container">
        <p className="section__index reveal"><span className="prompt">$</span> ls ./skills --sort=level</p>
        <h2 className="section__title reveal">
          TOOLS <span className="stroke">I USE</span>
        </h2>

        {/* live readout — pressing a key "types" it here */}
        <div className="skills-readout reveal" aria-live="polite">
          <span className="prompt">$</span>{' '}
          {active ? (
            <>
              man {slug(active.name)}
              <span className="skills-readout__out">
                {' '}→ proficiency: {active.level}% · {active.tag}
              </span>
            </>
          ) : (
            <span className="skills-readout__hint">press a key…</span>
          )}
          <span className="skills-readout__cursor" aria-hidden="true">▌</span>
        </div>

        <div className="skills-board" ref={gridRef}>
          {skills.map((skill, i) => (
            <div
              className="keywrap reveal"
              key={skill.id}
              style={{ '--reveal-delay': `${(i % 4) * 0.07 + Math.floor(i / 4) * 0.05}s` }}
            >
              <div className="keyfloat" style={{ '--i': i }}>
                <button
                  type="button"
                  className={`keycap ${active?.id === skill.id ? 'is-active' : ''}`}
                  style={{ '--level': `${skill.level}%` }}
                  onMouseMove={onTilt}
                  onMouseLeave={onUntilt}
                  onClick={() => setActive(skill)}
                  onFocus={() => setActive(skill)}
                  aria-label={`${skill.name} — ${skill.level} percent, ${skill.tag}`}
                >
                  <span className="keycap__side" aria-hidden="true" />
                  <span className="keycap__top">
                    <span className="keycap__row">
                      <span className="keycap__index">
                        {String(i + 1).padStart(2, '0')}
                      </span>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
