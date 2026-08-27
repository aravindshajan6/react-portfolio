import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../content';
import './work.css';

gsap.registerPlugin(ScrollTrigger);

const pad = (n) => String(n).padStart(2, '0');

export default function Work() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const counterRef = useRef(null);

  // featured projects first, then the rest (stable within each group)
  const ordered = useMemo(
    () => [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)],
    []
  );
  const total = ordered.length;

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!section || !stage || !track) return undefined;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Pinned horizontal scroll — desktop only, and only when the user
      // hasn't asked for reduced motion. Every other case (tablet, phone,
      // reduced motion at any width) keeps the CSS-native swipe row.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: () => '+=' + getDistance(),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (barRef.current) {
                barRef.current.style.transform = `scaleX(${self.progress})`;
              }
              if (counterRef.current) {
                const current = Math.round(self.progress * (total - 1)) + 1;
                counterRef.current.textContent = `${pad(current)} / ${pad(total)}`;
              }
            },
          },
        });
      });
    }, section);

    // Re-measure once images have real dimensions.
    const onAssetLoad = () => ScrollTrigger.refresh();
    const images = Array.from(section.querySelectorAll('img'));
    const pendingImages = images.filter((img) => !img.complete);
    let remaining = pendingImages.length;
    const onImgDone = () => {
      remaining -= 1;
      if (remaining === 0) ScrollTrigger.refresh();
    };
    pendingImages.forEach((img) => {
      img.addEventListener('load', onImgDone, { once: true });
      img.addEventListener('error', onImgDone, { once: true });
    });
    window.addEventListener('load', onAssetLoad, { once: true });

    return () => {
      window.removeEventListener('load', onAssetLoad);
      pendingImages.forEach((img) => {
        img.removeEventListener('load', onImgDone);
        img.removeEventListener('error', onImgDone);
      });
      ctx.revert(); // reverts the matchMedia + triggers created inside the context
    };
  }, [total]);

  return (
    <section className="section work" id="work" ref={sectionRef}>
      <div className="work__stage" ref={stageRef}>
        <div className="container work__head">
          <p className="section__index"><span className="prompt">$</span> git log --oneline ./work</p>
          <h2 className="section__title">
            THINGS I&apos;VE <span className="stroke">BUILT</span>
          </h2>
        </div>

        <div className="work__viewport">
          <div className="work__track" ref={trackRef}>
            {ordered.map((project, i) => (
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

        <div className="container work__progress" aria-hidden="true">
          <div className="work__bar">
            <div className="work__bar-fill" ref={barRef} />
          </div>
          <span className="work__counter" ref={counterRef}>
            {`${pad(1)} / ${pad(total)}`}
          </span>
        </div>
      </div>
    </section>
  );
}
