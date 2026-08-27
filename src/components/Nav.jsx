import { useEffect, useState } from 'react';
import { navLinks } from '../content';
import './nav.css';

const getTheme = () =>
  document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

const Nav = () => {
  const [theme, setTheme] = useState(getTheme);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem('theme-v2', next);
    } catch (e) {
      /* private mode */
    }
  };

  const goTo = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(id);
    if (id === 'home' || !el) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <a href="#home" className="nav__logo" onClick={goTo('home')} aria-label="Back to top">
          aravind<span className="accent">@</span>portfolio:<span className="accent">~</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {navLinks.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="nav__link" onClick={goTo(l.id)}>
              <span className="nav__link-index">./</span>
              {l.label.toLowerCase()}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <button
            className="nav__theme"
            onClick={toggleTheme}
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
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`nav-overlay ${open ? 'nav-overlay--open' : ''}`} aria-hidden={!open}>
        <nav className="nav-overlay__links" aria-label="Mobile">
          {navLinks.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="nav-overlay__link"
              style={{ transitionDelay: open ? `${0.08 * i + 0.15}s` : '0s' }}
              onClick={goTo(l.id)}
            >
              <span className="nav-overlay__index">./</span>
              {l.label.toLowerCase()}
            </a>
          ))}
        </nav>
        <div className="nav-overlay__footer mono-label">$ status: available_for_freelance — 2026</div>
      </div>
    </>
  );
};

export default Nav;
