import { useEffect, useRef, useState } from 'react';
import { animate, onScroll, stagger, utils } from 'animejs';
import { navLinks } from '../content';
import useAnimeScope from '../hooks/useAnimeScope';
import { EVENTS, emit, scrollToSection } from '../lib/motion';
import './nav.css';

const THEME_KEY = 'theme-v2';

const readTheme = () =>
  document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

const applyTheme = (next) => {
  if (next === 'light') document.documentElement.setAttribute('data-theme', 'light');
  else document.documentElement.removeAttribute('data-theme');
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (e) {
    /* private mode */
  }
};

const Nav = () => {
  const [theme, setTheme] = useState(readTheme);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const [rootRef, scopeRef] = useAnimeScope((scope) => {
    const bar = rootRef.current?.querySelector('.nav__progress');

    // page progress bar + "scrolled" state, one observer for the whole document
    onScroll({
      target: document.body,
      enter: 'top top',
      leave: 'bottom bottom',
      onUpdate: (self) => {
        if (bar) bar.style.transform = `scaleX(${utils.clamp(self.progress, 0, 1)})`;
        setScrolled(self.container.scrollY > 40);
      },
    });

    // active section = the one straddling the vertical centre of the viewport
    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      onScroll({
        target: el,
        enter: 'center top',
        leave: 'center bottom',
        onEnter: () => setActive(id),
        onEnterBackward: () => setActive(id),
      });
    });

    // mobile overlay link stagger
    scope.add('openMenu', () => {
      if (scope.matches.reduce) {
        utils.set('.nav-overlay__link, .nav-overlay__footer', { opacity: 1, y: 0 });
        return;
      }
      animate('.nav-overlay__link', {
        opacity: [0, 1],
        y: [28, 0],
        duration: 550,
        ease: 'out(4)',
        delay: stagger(70, { start: 180 }),
      });
      animate('.nav-overlay__footer', { opacity: [0, 1], duration: 500, delay: 600 });
    });
    scope.add('resetMenu', () => {
      utils.set('.nav-overlay__link, .nav-overlay__footer', { opacity: 0 });
    });
  });

  // theme toggling — from the button or from anywhere via EVENTS.themeToggle
  useEffect(() => {
    const onToggle = (e) => {
      const want = e?.detail;
      const next =
        want === 'light' || want === 'dark'
          ? want
          : themeRef.current === 'dark'
            ? 'light'
            : 'dark';
      applyTheme(next);
      setTheme(next);
    };
    window.addEventListener(EVENTS.themeToggle, onToggle);
    return () => window.removeEventListener(EVENTS.themeToggle, onToggle);
  }, []);

  // mobile menu: lock scroll while open, animate links in, Esc closes
  useEffect(() => {
    if (!open) return undefined;
    const scope = scopeRef.current;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    scope?.methods.openMenu?.();
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      scope?.methods.resetMenu?.();
    };
  }, [open, scopeRef]);

  const goTo = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <div ref={rootRef}>
      <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <a href="#home" className="nav__logo" onClick={goTo('home')} aria-label="Back to top">
          aravind<span className="accent">@</span>portfolio:<span className="accent">~</span>
          <span className="nav__cwd">/{active === 'home' ? '' : active}</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {navLinks.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`nav__link ${active === l.id ? 'nav__link--active' : ''}`}
              aria-current={active === l.id ? 'true' : undefined}
              onClick={goTo(l.id)}
            >
              <span className="nav__link-index">./</span>
              {l.label.toLowerCase()}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <button
            type="button"
            className="nav__term"
            onClick={() => emit(EVENTS.terminalToggle)}
            aria-label="Open interactive terminal"
            title="Terminal  (` or Ctrl+K)"
          >
            &gt;_
          </button>

          <button
            className="nav__theme"
            onClick={() => emit(EVENTS.themeToggle)}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title="Toggle theme"
          >
            <span className="nav__theme-icon">{theme === 'dark' ? '☀' : '☾'}</span>
            <span className="nav__theme-label">{theme === 'dark' ? '--light' : '--dark'}</span>
          </button>

          <button
            className={`nav__burger ${open ? 'nav__burger--open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span />
            <span />
          </button>
        </div>

        <span className="nav__progress" aria-hidden="true" />
      </header>

      <div
        id="mobile-menu"
        className={`nav-overlay ${open ? 'nav-overlay--open' : ''}`}
        aria-hidden={!open}
      >
        <nav className="nav-overlay__links" aria-label="Mobile">
          {navLinks.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`nav-overlay__link ${active === l.id ? 'is-active' : ''}`}
              onClick={goTo(l.id)}
              tabIndex={open ? 0 : -1}
            >
              <span className="nav-overlay__index">./</span>
              {l.label.toLowerCase()}
            </a>
          ))}
        </nav>
        <div className="nav-overlay__footer mono-label">
          $ status: available_for_freelance — {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default Nav;
