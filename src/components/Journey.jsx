import { useEffect, useRef, useState } from 'react';
import { animate, createTimeline, onScroll, scrambleText } from 'animejs';
import useAnimeScope from '../hooks/useAnimeScope';
import useReveal from '../hooks/useReveal';
import { prefersReducedMotion } from '../lib/motion';
import { timeline, certifications } from '../content';
import './journey.css';

/* deterministic fake commit hash from a string */
const commitHash = (s) => {
  let h = 5381;
  for (const c of s) h = ((h * 33) ^ c.charCodeAt(0)) >>> 0;
  return h.toString(16).padStart(7, '0').slice(0, 7);
};

const tagSlug = (place) => place.toLowerCase().split(/[\s,]+/)[0];

/* fake verification script shown before a certificate preview */
const certSlug = (title) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24);
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
  const closeRef = useRef(null);
  const imgRef = useRef(null);

  /* ── scroll-driven git rail: fill line, travelling head, lit nodes ── */
  const [railRef] = useAnimeScope((scope) => {
    const wrap = railRef.current;
    if (!wrap) return;
    const fill = wrap.querySelector('.timeline__fillline');
    const head = wrap.querySelector('.timeline__headdot');
    const nodes = Array.from(wrap.querySelectorAll('.timeline__entry'));
    const hashes = Array.from(wrap.querySelectorAll('.timeline__hash'));

    if (scope.matches.reduce) {
      fill.style.transform = 'scaleY(1)';
      head.style.opacity = '0';
      nodes.forEach((n) => n.classList.add('is-lit'));
      return;
    }

    // the rail "commits" as it crosses a line 72% down the viewport
    onScroll({
      target: wrap,
      enter: '72% top',
      leave: '72% bottom',
      onUpdate: (self) => {
        const h = wrap.offsetHeight || 1;
        const cur = self.progress * h;
        fill.style.transform = `scaleY(${self.progress})`;
        head.style.transform = `translateY(${cur}px)`;
        head.style.opacity = cur > 4 && cur < h - 2 ? '1' : '0';
        nodes.forEach((n) => n.classList.toggle('is-lit', n.offsetTop + 14 <= cur + 1));
      },
    });

    // commit hashes decode from hex noise when they scroll in
    hashes.forEach((el) =>
      animate(el, {
        innerHTML: scrambleText({ text: el.dataset.final, chars: '0-9a-f', cursor: false, duration: 900 }),
        autoplay: onScroll({ target: el, enter: 'bottom-=10% top', sync: 'play', repeat: false }),
      })
    );
  });

  /* run the terminal "verification" sequence when a cert is opened */
  useEffect(() => {
    if (!lightbox) return undefined;
    const lines = bootLines(certSlug(lightbox.title));
    setBootStep(0);
    setCertShown(false);

    if (prefersReducedMotion()) {
      setBootStep(lines.length);
      setCertShown(true);
      return undefined;
    }

    const tl = createTimeline();
    lines.forEach((_, i) => tl.call(() => setBootStep(i + 1), 260 * (i + 1)));
    tl.call(() => setCertShown(true), 260 * lines.length + 350);
    return () => tl.cancel();
  }, [lightbox]);

  /* certificate pops in once "verified" */
  useEffect(() => {
    if (!certShown || !imgRef.current || prefersReducedMotion()) return undefined;
    const a = animate(imgRef.current, {
      opacity: [0, 1],
      scale: [0.96, 1],
      clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'],
      duration: 550,
      ease: 'out(4)',
    });
    return () => a.cancel();
  }, [certShown]);

  /* dialog focus management + Esc */
  useEffect(() => {
    if (!lightbox) return undefined;
    const previous = document.activeElement;
    closeRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'Tab') {
        e.preventDefault(); // single focusable control → keep focus on it
        closeRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      previous?.focus?.({ preventScroll: true });
    };
  }, [lightbox]);

  return (
    <section className="section journey" id="journey" ref={ref}>
      <div className="container">
        <p className="section__index reveal">
          <span className="prompt">$</span> git log --graph --career
        </p>
        <h2 className="section__title reveal">
          COMMIT <span className="stroke">HISTORY</span>
        </h2>

        <div className="timeline-wrap" ref={railRef}>
          <span className="timeline__fillline" aria-hidden="true" />
          <span className="timeline__headdot" aria-hidden="true" />

          <ol className="timeline">
            {timeline.map((entry, i) => (
              <li
                key={entry.id}
                className={`timeline__entry timeline__entry--${entry.kind} reveal`}
                style={{ '--reveal-delay': `${i * 0.12}s` }}
              >
                <span className="timeline__node" aria-hidden="true" />
                <div className="timeline__card">
                  <p className="timeline__commit">
                    <span className="timeline__star">*</span> commit{' '}
                    <span className="timeline__hash" data-final={commitHash(entry.title + entry.place)}>
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
                  <h3 className="timeline__title">{entry.title}</h3>
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
                <img className="certs__img" src={cert.img} alt={cert.title} loading="lazy" />
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
            ref={closeRef}
          >
            &times;
          </button>

          {!certShown && (
            <div className="lightbox__term" onClick={(e) => e.stopPropagation()}>
              <div className="lightbox__term-bar">
                <span />
                <span />
                <span />
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
                <p className="lightbox__term-cursor" aria-hidden="true">
                  ▌
                </p>
              </div>
            </div>
          )}

          {certShown && (
            <>
              <img className="lightbox__img" src={lightbox.img} alt={lightbox.title} ref={imgRef} />
              <p className="lightbox__caption mono-label">{lightbox.title}</p>
            </>
          )}
        </div>
      )}
    </section>
  );
}
