import { useEffect, useState } from 'react';
import useReveal from '../hooks/useReveal';
import { timeline, certifications } from '../content';
import './journey.css';

export default function Journey() {
  const ref = useReveal();
  const [lightbox, setLightbox] = useState(null); // certification object or null

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
        <p className="section__index">04 / Journey</p>
        <h2 className="section__title reveal">
          PATH <span className="stroke">SO FAR</span>
        </h2>

        <ol className="timeline">
          {timeline.map((entry, i) => (
            <li
              key={entry.id}
              className={`timeline__entry timeline__entry--${entry.kind} reveal`}
              style={{ '--reveal-delay': `${i * 0.12}s` }}
            >
              <span className="timeline__node" aria-hidden="true" />
              <div className="timeline__card">
                <div className="timeline__meta">
                  <span className="timeline__year">{entry.year}</span>
                  <span className="timeline__badge">
                    {entry.kind === 'experience' ? 'Experience' : 'Education'}
                  </span>
                </div>
                <h3 className="timeline__title">{entry.title}</h3>
                <p className="timeline__place">{entry.place}</p>
                <p className="timeline__desc">{entry.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="certs">
          <p className="certs__header mono-label reveal">Certifications</p>
          <div className="certs__grid">
            {certifications.map((cert, i) => (
              <button
                key={cert.id}
                type="button"
                className="certs__card spot-card reveal"
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
          <img className="lightbox__img" src={lightbox.img} alt={lightbox.title} />
          <p className="lightbox__caption mono-label">{lightbox.title}</p>
        </div>
      )}
    </section>
  );
}
