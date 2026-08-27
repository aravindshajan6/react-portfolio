# Aravind Shajan — Portfolio

A futuristic, animation-heavy single-page portfolio. Dark/light themed, fully responsive, built around a real-time 3D hero scene.

**Live:** https://aravindshajan6.github.io/react-portfolio

## Stack

- **React 18 + Vite** — app framework
- **Three.js + React Three Fiber + drei** — 3D hero (distorted blob, wireframe torus-knot, particle field, mouse-parallax camera)
- **anime.js v4** — preloader timeline, hero text reveals, count-ups
- **GSAP ScrollTrigger** — pinned horizontal project gallery (desktop)
- **Lenis** — smooth scrolling

## Features

- Animated preloader (counter + panel wipe, skipped on repeat visits)
- Custom magnetic cursor with "VIEW" morph over project cards (fine pointers only)
- Kinetic oversized typography with scramble/decode effect
- Scroll-triggered reveals, marquee strips, film-grain overlay
- Terminal-style about card, animated stats and skill bars with spotlight hover
- Pinned horizontal work gallery on desktop → native snap-swipe on mobile
- Timeline + certification lightbox, mailto contact form, live IST clock
- Dark/light theme toggle (persisted, no flash on load)
- `prefers-reduced-motion` respected throughout

## Development

```bash
npm install
npm run dev      # http://localhost:8000/react-portfolio
npm run build
npm run deploy   # publish to GitHub Pages
```

## Editing content

All personal content (bio, projects, skills, timeline, certifications, socials) lives in [`src/content.js`](src/content.js). Design tokens (colors, fonts, spacing, both themes) live in [`src/styles/global.css`](src/styles/global.css).
