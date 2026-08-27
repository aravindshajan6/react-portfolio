import { useMemo, useRef, useState } from 'react';
import { animate, createAnimatable, onScroll, stagger, utils } from 'animejs';
import { projects } from '../content';
import useAnimeScope from '../hooks/useAnimeScope';
import { scrollToSection } from '../lib/motion';
import './work.css';

const pad = (n) => String(n).padStart(2, '0');
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const isGithub = (link) => !!link && /github\.com/i.test(link);

const FILTERS = [
  { id: 'all', label: 'all', test: () => true },
  { id: 'featured', label: 'featured', test: (p) => !!p.featured },
  { id: 'live', label: 'live', test: (p) => !!p.link && !isGithub(p.link) },
  { id: 'open-source', label: 'open-source', test: (p) => isGithub(p.link) },
];

export default function Work() {
  const [filter, setFilter] = useState('all');
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const barRef = useRef(null);
  const counterRef = useRef(null);
  const dotsRef = useRef(null);
  const mobileCounterRef = useRef(null);

  // featured projects first, then the rest (stable within each group)
  const ordered = useMemo(
    () => [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)],
    []
  );
  const visible = useMemo(() => {
    const def = FILTERS.find((f) => f.id === filter) || FILTERS[0];
    return ordered.filter(def.test);
  }, [ordered, filter]);
  const total = visible.length;

  const [rootRef, scopeRef] = useAnimeScope(
    (scope) => {
      const section = rootRef.current;
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!section || !track || !viewport) return undefined;

      const cards = Array.from(track.querySelectorAll('.work-card'));
      const count = cards.length;
      const reduce = scope.matches.reduce;
      const pinned = scope.matches.desktop && !reduce;
      const fine = scope.matches.fine && !reduce;
      const cleanups = [];

      const setCounter = (el, index) => {
        if (el) el.textContent = `${pad(index + 1)} / ${pad(count)}`;
      };
      const setActiveDot = (index) => {
        const dots = dotsRef.current ? dotsRef.current.children : [];
        Array.from(dots).forEach((dot, i) => dot.classList.toggle('is-active', i === index));
        setCounter(mobileCounterRef.current, index);
      };

      // No motion at all: everything static & visible, first card marked.
      if (reduce) {
        setActiveDot(0);
        return undefined;
      }

      /* ── card reveal (staggered, fires once when the section nears view) ── */
      if (count) {
        utils.set(cards, { opacity: 0, y: 40 });
        animate(cards, {
          opacity: [0, 1],
          y: [40, 0],
          duration: 900,
          ease: 'out(3)',
          delay: stagger(70),
          autoplay: onScroll({
            target: section,
            enter: 'bottom-=100 top',
            sync: 'play',
            repeat: false,
          }),
        });
      }

      /* ── 3D tilt on fine pointers ── */
      if (fine) {
        cards.forEach((card) => {
          // NB: no `y` here — the reveal animation owns `y`; sharing a property
          // would let anime's `replace` composition cancel the animatable.
          const tilt = createAnimatable(card, { rotateX: 400, rotateY: 400, ease: 'out(3)' });
          const onMove = (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            tilt.rotateX(-py * 8);
            tilt.rotateY(px * 8);
          };
          const onLeave = () => {
            tilt.rotateX(0);
            tilt.rotateY(0);
          };
          card.addEventListener('pointermove', onMove);
          card.addEventListener('pointerleave', onLeave);
          cleanups.push(() => {
            card.removeEventListener('pointermove', onMove);
            card.removeEventListener('pointerleave', onLeave);
          });
        });
      }

      if (pinned) {
        /* ── desktop: sticky stage + scroll-scrubbed horizontal track ── */
        const measure = () => Math.max(0, track.scrollWidth - window.innerWidth);
        let distance = measure();
        section.style.setProperty('--work-scroll', `${distance}px`);

        // velocity-driven skew on the viewport wrapper (smoothed via animatable)
        const skew = createAnimatable(viewport, { skewX: 350, ease: 'out(3)' });

        const observer = onScroll({
          target: section,
          enter: 'top top',
          leave: 'bottom bottom',
          sync: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
            setCounter(counterRef.current, count > 1 ? Math.round(p * (count - 1)) : 0);
            setActiveDot(count > 1 ? Math.round(p * (count - 1)) : 0);

            // velocity is a magnitude (px/ms); sign comes from direction
            const v = clamp(self.velocity * 1.2, 0, 6) * (self.backward ? -1 : 1);
            skew.skewX(-v);

            // per-card image parallax based on where the card sits on screen
            const shift = -p * distance;
            const vw = window.innerWidth;
            cards.forEach((card) => {
              const center = card.offsetLeft + card.offsetWidth / 2 + shift - vw / 2;
              const ratio = clamp(center / vw, -1, 1);
              card.style.setProperty('--px', `${(ratio * 6).toFixed(2)}%`);
            });
          },
        });

        const slide = animate(track, {
          x: [() => 0, () => -measure()],
          ease: 'linear',
          autoplay: observer,
        });

        let raf = 0;
        const refresh = () => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            const next = measure();
            if (next !== distance) {
              distance = next;
              section.style.setProperty('--work-scroll', `${distance}px`);
              slide.refresh();
            }
            observer.refresh();
          });
        };

        const ro = new ResizeObserver(refresh);
        ro.observe(track);
        window.addEventListener('resize', refresh);
        const imgs = Array.from(track.querySelectorAll('img')).filter((img) => !img.complete);
        imgs.forEach((img) => {
          img.addEventListener('load', refresh, { once: true });
          img.addEventListener('error', refresh, { once: true });
        });
        cleanups.push(() => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          window.removeEventListener('resize', refresh);
          imgs.forEach((img) => {
            img.removeEventListener('load', refresh);
            img.removeEventListener('error', refresh);
          });
          section.style.removeProperty('--work-scroll');
          cards.forEach((card) => card.style.removeProperty('--px'));
          if (barRef.current) barRef.current.style.transform = 'scaleX(0)';
        });
      } else {
        /* ── tablet / mobile: native snap row + dot indicator via onScroll ── */
        setActiveDot(0);
        cards.forEach((card, i) => {
          onScroll({
            container: track,
            axis: 'x',
            target: card,
            enter: 'center start',
            leave: 'center end',
            sync: false,
            onEnter: () => setActiveDot(i),
          });
        });
      }

      // jump to a card from the dot indicator — registered for React handlers
      const distanceNow = () => Math.max(0, track.scrollWidth - window.innerWidth);
      scope.add('goTo', (index) => {
        const card = cards[index];
        if (!card) return;
        if (pinned) {
          const p = count > 1 ? index / (count - 1) : 0;
          window.scrollTo({ top: section.offsetTop + p * distanceNow(), behavior: 'smooth' });
        } else {
          track.scrollTo({ left: card.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft), behavior: 'smooth' });
        }
      });

      return () => cleanups.forEach((fn) => fn());
    },
    [filter]
  );

  const onFilter = (id) => {
    if (id === filter) return;
    // If the user is deep inside the sticky stage, bring them back to the top of
    // the section so the re-measured (possibly shorter) track doesn't strand them.
    const section = rootRef.current;
    if (section) {
      const r = section.getBoundingClientRect();
      if (r.top < 0 && r.bottom > window.innerHeight) scrollToSection('work');
    }
    setFilter(id);
  };

  return (
    <section className="section work" id="work" ref={rootRef}>
      <div className="work__stage">
        <div className="container work__head">
          <p className="section__index"><span className="prompt">$</span> git log --oneline ./work</p>
          <h2 className="section__title">
            THINGS I&apos;VE <span className="stroke">BUILT</span>
          </h2>
          <div className="work__filters" role="group" aria-label="Filter projects">
            {FILTERS.map((f) => (
              <button
                type="button"
                key={f.id}
                className={`work-card__chip work__filter${filter === f.id ? ' is-active' : ''}`}
                aria-pressed={filter === f.id}
                onClick={() => onFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="work__viewport" ref={viewportRef}>
          <div className="work__track" ref={trackRef}>
            {visible.length === 0 && (
              <p className="work__empty">{"// nothing matches this filter"}</p>
            )}
            {visible.map((project, i) => (
              <article className="work-card term-chrome" data-cursor="view" key={project.id}>
                <div className="work-card__media">
                  <img
                    src={project.img}
                    alt={project.title}
                    loading={i < 2 ? 'eager' : 'lazy'}
                  />
                </div>
                <div className="work-card__body">
                  <span className="work-card__num">{pad(i + 1)}</span>
                  <h3 className="work-card__title">{project.title}</h3>
                  <p className="work-card__desc">{project.desc}</p>
                  <ul className="work-card__stack">
                    {project.stack.map((tech) => (
                      <li className="work-card__chip" key={tech}>
                        {tech}
                      </li>
                    ))}
                  </ul>
                  {project.link ? (
                    <span className="work-card__cta">
                      Open project <span aria-hidden="true">↗</span>
                    </span>
                  ) : (
                    <span className="work-card__cta work-card__cta--private">
                      Client project — private
                    </span>
                  )}
                </div>
                {project.link && (
                  <a
                    className="work-card__link"
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open project: ${project.title}`}
                  />
                )}
              </article>
            ))}
          </div>
        </div>

        {/* desktop progress bar + counter */}
        <div className="container work__progress" aria-hidden="true">
          <div className="work__bar">
            <div className="work__bar-fill" ref={barRef} />
          </div>
          <span className="work__counter" ref={counterRef}>
            {`${pad(1)} / ${pad(total)}`}
          </span>
        </div>

        {/* mobile / tablet dot indicator + counter */}
        <div className="container work__indicator">
          <div className="work__dots" ref={dotsRef} role="group" aria-label="Jump to project">
            {visible.map((project, i) => (
              <button
                type="button"
                key={project.id}
                className={`work__dot${i === 0 ? ' is-active' : ''}`}
                aria-label={`Go to project ${i + 1}: ${project.title}`}
                onClick={() => scopeRef.current?.methods.goTo(i)}
              />
            ))}
          </div>
          <span className="work__counter" ref={mobileCounterRef} aria-hidden="true">
            {`${pad(1)} / ${pad(total)}`}
          </span>
        </div>
      </div>
    </section>
  );
}
