import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import useReveal from '../hooks/useReveal';
import { profile, stats } from '../content';
import CV from '../assets/resume.pdf';
import './about.css';

export default function About() {
  const revealRef = useReveal();
  const statsRef = useRef(null);

  /* count-up stats when scrolled into view */
  useEffect(() => {
    const rootEl = statsRef.current;
    if (!rootEl) return undefined;

    const nums = rootEl.querySelectorAll('.stat__num');
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion) {
      nums.forEach((el) => {
        el.textContent = el.dataset.value;
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
            innerHTML: [0, Number(el.dataset.value)],
            modifier: (v) => Math.round(v),
            duration: 1600,
            ease: 'out(3)',
          });
        });
      },
      { threshold: 0.5 }
    );

    nums.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const bioLead = `I'm a ${profile.tagline}`;

  return (
    <section className="section about" id="about" ref={revealRef}>
      <div className="container">
        <p className="section__index reveal"><span className="prompt">$</span> cat ./about.md</p>
        <h2 className="section__title reveal">
          BEHIND <span className="stroke">THE CODE</span>
        </h2>

        <div className="about__grid">
          {/* ── left: bio ─────────────────────────────────── */}
          <div className="about__bio">
            <p className="reveal">
              {bioLead} From modernising a loan platform for an international
              banking client to building real-time apps with websockets and
              the Stream SDK, I turn ideas into fast, maintainable products —
              and I sweat the small details that make an interface feel
              effortless.
            </p>
            <p className="reveal" style={{ '--reveal-delay': '0.12s' }}>
              I&apos;m based in {profile.location}, and I&apos;m currently{' '}
              <span className="accent">available for freelance projects</span>.
              If you need a full-stack build shipped end to end — or a
              front-end that actually feels good to use — let&apos;s talk.
            </p>
            <div
              className="about__actions reveal"
              style={{ '--reveal-delay': '0.24s' }}
            >
              <a className="btn" href={CV} download>
                ./download-cv ↓
              </a>
              <a
                className="btn btn--ghost"
                href={profile.github}
                target="_blank"
                rel="noreferrer"
              >
                gh --profile ↗
              </a>
            </div>
          </div>

          {/* ── right: terminal card ──────────────────────── */}
          <div
            className="terminal reveal"
            style={{ '--reveal-delay': '0.18s' }}
            aria-label="Terminal-style summary card"
          >
            <div className="terminal__bar">
              <span className="terminal__dot" />
              <span className="terminal__dot" />
              <span className="terminal__dot" />
              <span className="terminal__title">aravind@portfolio: ~</span>
            </div>
            <div className="terminal__body">
              <p>
                <span className="terminal__prompt">$</span> whoami
              </p>
              <p className="terminal__out">
                {profile.firstName} {profile.lastName} — {profile.role}
              </p>
              <p>
                <span className="terminal__prompt">$</span> cat location.txt
              </p>
              <p className="terminal__out">{profile.location}</p>
              <p>
                <span className="terminal__prompt">$</span> echo $STATUS
              </p>
              <p className="terminal__out accent">Available for freelance</p>
              <p>
                <span className="terminal__prompt">$</span> ls languages/
              </p>
              <p className="terminal__out">{profile.languages.join('  ')}</p>
              <p>
                <span className="terminal__prompt">$</span>{' '}
                <span className="terminal__cursor" aria-hidden="true" />
              </p>
            </div>
          </div>
        </div>

        {/* ── stats row ───────────────────────────────────── */}
        <div className="about__stats" ref={statsRef}>
          {stats.map((stat, i) => (
            <div
              className="stat reveal"
              key={stat.id}
              style={{ '--reveal-delay': `${i * 0.1}s` }}
            >
              <div className="stat__value">
                <span className="stat__num" data-value={stat.value}>
                  0
                </span>
                {stat.suffix && (
                  <span className="stat__suffix">{stat.suffix}</span>
                )}
              </div>
              <p className="mono-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
