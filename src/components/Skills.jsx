import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import useReveal from '../hooks/useReveal';
import { skills } from '../content';
import './skills.css';

/* shared spotlight handler — feeds --x/--y to .spot-card::before */
function handleSpotlight(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--x', `${e.clientX - rect.left}px`);
  card.style.setProperty('--y', `${e.clientY - rect.top}px`);
}

export default function Skills() {
  const revealRef = useReveal();
  const gridRef = useRef(null);

  /* count up each skill's % when its card scrolls into view */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;

    const nums = grid.querySelectorAll('.skill-card__num');
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

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

  return (
    <section className="section skills-sec" id="skills" ref={revealRef}>
      <div className="container">
        <p className="section__index reveal">02 / Skills</p>
        <h2 className="section__title reveal">
          MY <span className="stroke">ARSENAL</span>
        </h2>

        <div className="skills-grid" ref={gridRef}>
          {skills.map((skill, i) => (
            <article
              className="spot-card skill-card reveal"
              key={skill.id}
              onMouseMove={handleSpotlight}
              style={{
                '--reveal-delay': `${(i % 4) * 0.08}s`,
                '--level': `${skill.level}%`,
              }}
            >
              <div className="skill-card__top">
                <span className="skill-card__index">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="skill-card__pct">
                  <span className="skill-card__num" data-level={skill.level}>
                    0
                  </span>
                  %
                </span>
              </div>
              <h3 className="skill-card__name">{skill.name}</h3>
              <p className="mono-label skill-card__tag">{skill.tag}</p>
              <div className="skill-card__track" aria-hidden="true">
                <div className="skill-card__fill" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
