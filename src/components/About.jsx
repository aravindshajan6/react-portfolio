import { animate, createTimeline, onScroll, splitText, stagger, utils } from 'animejs';
import useAnimeScope from '../hooks/useAnimeScope';
import useReveal from '../hooks/useReveal';
import { profile, stats } from '../content';
import CV from '../assets/resume.pdf';
import './about.css';

const TERMINAL = [
  { cmd: 'whoami' },
  { out: `${profile.firstName} ${profile.lastName} — ${profile.role}` },
  { cmd: 'cat location.txt' },
  { out: profile.location },
  { cmd: 'echo $STATUS' },
  { out: `${profile.freelance} for freelance`, accent: true },
  { cmd: 'ls languages/' },
  { out: profile.languages.join('  ') },
  { cmd: 'uptime' },
  { out: `${stats[0].value}+ years shipping to production` },
];

export default function About() {
  const revealRef = useReveal();

  const [gridRef] = useAnimeScope((scope) => {
    const root = gridRef.current;
    if (!root) return;
    const nums = Array.from(root.querySelectorAll('.stat__num'));
    const term = root.querySelector('.terminal');
    const lines = Array.from(root.querySelectorAll('.terminal__line'));

    if (scope.matches.reduce) {
      nums.forEach((el) => {
        el.textContent = el.dataset.value;
      });
      utils.set(lines, { opacity: 1 });
      return;
    }

    /* count-up stats, each fires once when it scrolls into view */
    nums.forEach((el) =>
      animate(el, {
        innerHTML: [0, Number(el.dataset.value)],
        modifier: utils.round(0),
        duration: 1600,
        ease: 'out(3)',
        autoplay: onScroll({ target: el, enter: 'bottom-=10% top', sync: 'play', repeat: false }),
      })
    );

    /* the terminal card types itself out */
    term.classList.add('terminal--typing');
    const tl = createTimeline({
      autoplay: onScroll({ target: term, enter: 'bottom-=15% top', sync: 'play', repeat: false }),
    });
    lines.forEach((line) => {
      const cmd = line.querySelector('.terminal__cmd');
      if (cmd) {
        const { chars } = splitText(cmd, { chars: { class: 'split-char' }, words: false, lines: false });
        tl.add(line, { opacity: 1, duration: 1 }, '+=180').add(
          chars,
          { opacity: [0, 1], duration: 1, delay: stagger(42) },
          '<<'
        );
      } else {
        tl.add(line, { opacity: [0, 1], x: [-6, 0], duration: 260, ease: 'out(2)' }, '+=140');
      }
    });
    tl.add('.terminal__cursor-line', { opacity: 1, duration: 200 }, '+=200');
  });

  return (
    <section className="section about" id="about" ref={revealRef}>
      <div className="container" ref={gridRef}>
        <p className="section__index reveal">
          <span className="prompt">$</span> cat ./about.md
        </p>
        <h2 className="section__title reveal">
          README<span className="stroke">.md</span>
        </h2>

        <div className="about__grid">
          {/* ── left: bio ─────────────────────────────────── */}
          <div className="about__bio">
            <p className="reveal">
              I&apos;m Aravind, a full stack developer from Kerala, India. These days most of my
              time goes into Python and automation — browser automation with Playwright and
              Selenium, scrapers and bots, APIs with FastAPI. The rest is MERN-stack work:
              I&apos;ve built a loan platform for a bank, a couple of streaming apps, and a piano
              that runs in your browser — because why not.
            </p>
            <p className="reveal" style={{ '--reveal-delay': '0.12s' }}>
              Right now I&apos;m{' '}
              <span className="accent">open to freelance work and full-time roles</span>. If
              you&apos;re building something and need an extra pair of hands, mail me. I reply
              fast.
            </p>
            <div className="about__actions reveal" style={{ '--reveal-delay': '0.24s' }}>
              <a className="btn" href={CV} download>
                ./download-cv ↓
              </a>
              <a className="btn btn--ghost" href={profile.github} target="_blank" rel="noreferrer">
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
              {TERMINAL.map((line, i) =>
                line.cmd ? (
                  <p className="terminal__line" key={i}>
                    <span className="terminal__prompt">$</span>{' '}
                    <span className="terminal__cmd">{line.cmd}</span>
                  </p>
                ) : (
                  <p
                    className={`terminal__line terminal__out ${line.accent ? 'accent' : ''}`}
                    key={i}
                  >
                    {line.out}
                  </p>
                )
              )}
              <p className="terminal__cursor-line">
                <span className="terminal__prompt">$</span>{' '}
                <span className="terminal__cursor" aria-hidden="true" />
              </p>
            </div>
          </div>
        </div>

        {/* ── stats row ───────────────────────────────────── */}
        <div className="about__stats">
          {stats.map((stat, i) => (
            <div className="stat reveal" key={stat.id} style={{ '--reveal-delay': `${i * 0.1}s` }}>
              <div className="stat__value">
                <span className="stat__num" data-value={stat.value}>
                  0
                </span>
                {stat.suffix && <span className="stat__suffix">{stat.suffix}</span>}
              </div>
              <p className="mono-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
