import { useEffect, useRef, useState } from 'react';
import useReveal from '../hooks/useReveal';
import { timeline, certifications } from '../content';
import './journey.css';

/* deterministic fake commit hash from a string */
const commitHash = (s) => {
  let h = 5381;
  for (const c of s) h = ((h * 33) ^ c.charCodeAt(0)) >>> 0;
  return h.toString(16).padStart(7, '0').slice(0, 7);
};

const tagSlug = (place) => place.toLowerCase().split(/[\s,]+/)[0];

const HEX = '0123456789abcdef';

/* fake verification script shown before a certificate preview */
const certSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24);
const bootLines = (slug) => [
  { text: `$ certctl --verify ${slug}.pem`, cmd: true },
  { text: 'checking issuer ............. OK' },
  { text: 'validating signature ........ OK' },
  { text: 'decrypting preview .......... OK' },
  { text: `$ display ./${slug}.png`, cmd: true },
];

export default function Journey() {
  const ref = useReveal();
  const [lightbox, setLightbox] = useState(null); // certification object or null
  const [bootStep, setBootStep] = useState(0); // lines revealed in the loader
  const [certShown, setCertShown] = useState(false);
  const wrapRef = useRef(null);
  const fillRef = useRef(null);
  const headRef = useRef(null);

  /* run the terminal "verification" sequence when a cert is opened */
  useEffect(() => {
    if (!lightbox) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lines = bootLines(certSlug(lightbox.title));

    setBootStep(0);
    setCertShown(false);

    if (reduce) {
      setBootStep(lines.length);
      setCertShown(true);
      return undefined;
    }

    const timers = [];
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setBootStep(i + 1), 260 * (i + 1)));
    });
    timers.push(setTimeout(() => setCertShown(true), 260 * lines.length + 350));
    return () => timers.forEach(clearTimeout);
  }, [lightbox]);

  /* ── scroll-driven rail: fill line + glowing head + lit nodes ── */
  useEffect(() => {
    const wrap = wrapRef.current;
    const fill = fillRef.current;
    const head = headRef.current;
    if (!wrap || !fill || !head) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes = Array.from(wrap.querySelectorAll('.timeline__entry'));

    if (reduce) {
      fill.style.transform = 'scaleY(1)';
      head.style.opacity = '0';
      nodes.forEach((n) => n.classList.add('is-lit'));
      return undefined;
    }

    let target = 0;
    let current = 0;
    let raf;

    const measure = () => {
      const rect = wrap.getBoundingClientRect();
      // rail "commits" as it crosses 72% of the viewport height
      const passed = window.innerHeight * 0.72 - rect.top;
      target = Math.max(0, Math.min(rect.height, passed));
    };

    const loop = () => {
      current += (target - current) * 0.12;
      const h = wrap.offsetHeight || 1;
      fill.style.transform = `scaleY(${current / h})`;
      head.style.transform = `translateY(${current}px)`;
      head.style.opacity = current > 4 && current < h - 2 ? '1' : '0';
      nodes.forEach((n) => {
        n.classList.toggle('is-lit', n.offsetTop + 14 <= current + 1);
      });
      raf = requestAnimationFrame(loop);
    };

    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, []);

  /* ── scramble-in the commit hashes when they enter the viewport ── */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const spans = Array.from(wrap.querySelectorAll('.timeline__hash'));
    if (reduce || !spans.length) return undefined;

    const timers = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          const el = entry.target;
          const final = el.dataset.final || '';
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min(1, (now - start) / 900);
            const lock = Math.floor(p * final.length);
            let out = final.slice(0, lock);
            for (let i = lock; i < final.length; i++) {
              out += HEX[(Math.random() * 16) | 0];
            }
            el.textContent = out;
            if (p < 1) timers.add(requestAnimationFrame(tick));
          };
          timers.add(requestAnimationFrame(tick));
        });
      },
      { threshold: 0.6 }
    );
    spans.forEach((s) => io.observe(s));
    return () => {
      io.disconnect();
      timers.forEach((t) => cancelAnimationFrame(t));
    };
  }, []);

  useEffect(() => {
    if (!lightbox) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightbox]);

  return (
    <section className="section journey" id="journey" ref={ref}>
      <div className="container">
        <p className="section__index"><span className="prompt">$</span> git log --graph --career</p>
        <h2 className="section__title reveal">
          COMMIT <span className="stroke">HISTORY</span>
        </h2>

        <div className="timeline-wrap" ref={wrapRef}>
          <span className="timeline__fillline" ref={fillRef} aria-hidden="true" />
          <span className="timeline__headdot" ref={headRef} aria-hidden="true" />

          <ol className="timeline">
            {timeline.map((entry, i) => (
              <li
                key={entry.id}
                className={`timeline__entry timeline__entry--${entry.kind} reveal`}
                style={{ '--reveal-delay': `${i * 0.12}s` }}
              >
                <span className="timeline__node" aria-hidden="true" />
                <div className="timeline__card" data-cursor="">
                  <p className="timeline__commit">
                    <span className="timeline__star">*</span> commit{' '}
                    <span
                      className="timeline__hash"
                      data-final={commitHash(entry.title + entry.place)}
                    >
                      {commitHash(entry.title + entry.place)}
                    </span>
                    {i === 0 && <span className="timeline__ref"> (HEAD → now)</span>}
                    <span className="timeline__tag"> tag: {tagSlug(entry.place)}</span>
                  </p>
                  <div className="timeline__meta">
                    <span className="timeline__year">{entry.year}</span>
                    <span className="timeline__badge">
                      {entry.kind === 'experience' ? 'Experience' : 'Education'}
                    </span>
                  </div>
                  <h3 className="timeline__title" data-text={entry.title}>{entry.title}</h3>
                  <p className="timeline__place">@ {entry.place}</p>
                  <p className="timeline__desc">{entry.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="certs">
          <p className="certs__header mono-label reveal">Certifications</p>
          <div className="certs__grid">
            {certifications.map((cert, i) => (
              <button
                key={cert.id}
                type="button"
                className="certs__card spot-card term-chrome reveal"
                style={{ '--reveal-delay': `${i * 0.1}s` }}
                onClick={() => setLightbox(cert)}
                aria-label={`Enlarge certificate: ${cert.title}`}
              >
                <img
                  className="certs__img"
                  src={cert.img}
                  alt={cert.title}
                  loading="lazy"
                />
                <span className="certs__title">{cert.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="lightbox__close"
            aria-label="Close certificate view"
            onClick={() => setLightbox(null)}
          >
            &times;
          </button>

          {!certShown && (
            <div className="lightbox__term" onClick={(e) => e.stopPropagation()}>
              <div className="lightbox__term-bar">
                <span /><span /><span />
                <em>certctl — verifying</em>
              </div>
              <div className="lightbox__term-body">
                {bootLines(certSlug(lightbox.title))
                  .slice(0, bootStep)
                  .map((line, i) => (
                    <p key={i} className={line.cmd ? 'is-cmd' : 'is-out'}>
                      {line.text}
                    </p>
                  ))}
                <p className="lightbox__term-cursor" aria-hidden="true">▌</p>
              </div>
            </div>
          )}

          {certShown && (
            <>
              <img
                className="lightbox__img lightbox__img--reveal"
                src={lightbox.img}
                alt={lightbox.title}
              />
              <p className="lightbox__caption mono-label">{lightbox.title}</p>
            </>
          )}
        </div>
      )}
    </section>
  );
}
