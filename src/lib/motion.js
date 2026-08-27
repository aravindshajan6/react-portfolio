/* small, dependency-free helpers shared by every animated component */

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

export const isDesktop = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;

/** subscribe to a media query; returns an unsubscribe fn */
export const onMedia = (query, cb) => {
  const mql = window.matchMedia(query);
  const handler = (e) => cb(e.matches);
  mql.addEventListener('change', handler);
  cb(mql.matches);
  return () => mql.removeEventListener('change', handler);
};

/** read a CSS custom property from :root (trimmed) */
export const cssVar = (name, fallback = '') =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

/**
 * Smooth-scroll to a section id. App registers a Lenis-aware implementation on
 * `window.__scrollToSection`; this falls back to native scrolling.
 */
export const scrollToSection = (id, offset = 0) => {
  if (typeof window.__scrollToSection === 'function') {
    window.__scrollToSection(id, offset);
    return;
  }
  const el = id === 'home' ? null : document.getElementById(id);
  const reduce = prefersReducedMotion();
  if (!el) window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  }
};

/** app-wide events (kept as strings so any component can dispatch/listen) */
export const EVENTS = {
  themeToggle: 'app:theme-toggle',
  terminalToggle: 'app:terminal-toggle',
  terminalOpen: 'app:terminal-open',
};

export const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));
