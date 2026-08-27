# Aravind Shajan — Portfolio (v3)

A terminal-themed, animation-heavy single-page portfolio. Dark/light themed, fully responsive, built around a real-time 3D hero scene and an interactive in-page shell.

**Live:** https://aravindshajan6.github.io/react-portfolio

## Stack

- **React 18 + Vite** — app framework
- **anime.js v4** — the single motion engine for the whole site: timelines, `onScroll` scroll-scrubbing, `splitText` / `scrambleText`, `createAnimatable` (cursor, parallax, tilt, magnetic buttons), `createDraggable` (terminal window, stack cube), `createScope` (React-safe cleanup) and the **Three.js adapter** (`animejs/adapters/three`) that animates meshes, materials, lights and the camera directly
- **Three.js + React Three Fiber + drei** — 3D hero (retro CRT computer with a live typing terminal, keyboard, floppy disk, grid floor, particles)
- **Lenis** — smooth scrolling (window-based, so anime's `onScroll` reads it natively)

## Features

- Boot-log preloader (counter + `[ OK ]` lines + panel wipe, skipped on repeat visits)
- 3D hero: anime.js-driven boot sequence (monitor pops in, keys rise in a stagger, floppy inserts into the drive), idle sway, mouse parallax, scroll-linked rotation, theme-tweened materials; fits every breakpoint
- Kinetic split-character title, decoding role line, content that drifts out on scroll
- **Interactive terminal** (`` ` ``, `~`, Ctrl/Cmd+K, or the `>_` button): `help`, `neofetch`, `ls`, `projects`, `open <n>`, `skills`, `git log`, `goto <section>`, `theme`, `cv`, `sudo hire aravind`, `matrix`… draggable window on desktop, bottom sheet on mobile
- Nav with scroll progress bar, live `~/section` cwd, active-section highlighting
- Self-typing terminal card and count-up stats in About
- Skills: 3D mechanical keyboard (grid-wave entrance, ghost typist, cursor tilt, press animation) + a draggable CSS-3D **stack cube**
- Work: sticky, scroll-scrubbed horizontal gallery with progress/counter, per-card 3D tilt and image parallax, filter chips (all / featured / live / open-source); native snap-swipe with dot indicator on mobile
- Journey: scroll-driven git-graph rail, hex-scrambling commit hashes, certificate lightbox with focus management
- Contact: magnetic buttons, web3forms delivery (mailto fallback), animated status
- Dark/light theme (persisted, no flash), `prefers-reduced-motion` respected everywhere, custom cursor on fine pointers only
- SEO: Open Graph / Twitter card image, JSON-LD Person, canonical, robots + sitemap; WebP images

## Development

```bash
npm install
npm run dev      # http://localhost:8000/react-portfolio/
npm run lint
npm run build
npm run deploy   # publish to GitHub Pages
```

## Editing content

All personal content (bio, projects, skills, timeline, certifications, socials) lives in [`src/content.js`](src/content.js). Design tokens (colors, fonts, spacing, both themes) live in [`src/styles/global.css`](src/styles/global.css).

## Animation conventions

- Every animated component builds its motion inside `useAnimeScope` ([`src/hooks/useAnimeScope.js`](src/hooks/useAnimeScope.js)); the scope reverts all animations, observers, splitters and draggables on unmount and re-runs when `prefers-reduced-motion`, pointer type or breakpoint changes (`scope.matches.reduce / fine / desktop / mobile`).
- Scroll-triggered reveals use `.reveal` + `--reveal-delay` via [`src/hooks/useReveal.js`](src/hooks/useReveal.js).
- Cross-component actions go through `src/lib/motion.js` (`scrollToSection`, `EVENTS.themeToggle`, `EVENTS.terminalToggle`).
