// ── Central content file — edit your info here ─────────────────────────────
import WorkArgus from './assets/project-argus.webp';
import WorkSanctum from './assets/project-devotion.webp';
import WorkSportscast from './assets/project-sportscast.webp';
import WorkElecstore from './assets/project-elecstore.webp';
import Work1 from './assets/project-1.webp';
import Work7 from './assets/project-7.webp';
import WorkNova from './assets/project-novacommerce.webp';
import WorkLoan from './assets/project-loan.svg';
import WorkSteaminc from './assets/project-steaminc.webp';
import WorkStreamGen from './assets/project-streamgen.svg';
import WorkFootinc from './assets/project-footinc.webp';
import WorkReelform from './assets/project-reelform.webp';
import WorkValodex from './assets/project-valodex.webp';
import WorkBlueprint from './assets/project-blueprint.webp';
import WorkKinema from './assets/project-kinema.webp';

import certNsdc from './assets/nsdcMern.webp';
import certEntriCourse from './assets/entriCourse.webp';
import certEntriInternship from './assets/entriInternship.webp';

export const profile = {
  firstName: 'Aravind',
  lastName: 'Shajan',
  role: 'Full Stack Developer',
  tagline:
    'I build automation with Python and web apps with MERN stack — Playwright, FastAPI, React, Node.',
  location: 'Kerala, India',
  email: 'aravindshajan6@gmail.com',
  freelance: 'Available',
  languages: ['English', 'Hindi', 'Malayalam'],
  github: 'https://github.com/aravindshajan6',
  linkedin: 'https://www.linkedin.com/in/aravindshajan/',

  // Contact form delivery — get a free access key at https://web3forms.com
  // (enter your email, the key arrives instantly). Paste it here and the
  // form submits directly to your inbox. Left empty, the form falls back
  // to opening the visitor's email app (mailto).
  web3formsKey: 'a1797505-af81-454a-9bd3-71fda260b8a6',
};

export const stats = [
  { id: 1, value: 3, suffix: '+', label: 'Years of experience' },
  { id: 2, value: 20, suffix: '+', label: 'Projects built' },
  { id: 3, value: 18, suffix: '', label: 'Technologies used' },
  { id: 4, value: 3, suffix: '', label: 'Certifications earned' },
];

export const skills = [
  { id: 1, name: 'JavaScript', level: 90, tag: 'language' },
  { id: 2, name: 'React', level: 87, tag: 'frontend' },
  { id: 3, name: 'Next.js', level: 75, tag: 'frontend' },
  { id: 4, name: 'Node.js', level: 83, tag: 'backend' },
  { id: 5, name: 'Express', level: 83, tag: 'backend' },
  { id: 6, name: 'MongoDB', level: 79, tag: 'database' },
  { id: 7, name: 'MySQL', level: 70, tag: 'database' },
  { id: 8, name: 'HTML & CSS', level: 90, tag: 'frontend' },
  { id: 9, name: 'Tailwind', level: 80, tag: 'frontend' },
  { id: 10, name: 'Python', level: 80, tag: 'language' },
  { id: 11, name: 'FastAPI', level: 70, tag: 'backend' },
  { id: 12, name: 'Playwright', level: 75, tag: 'automation' },
  { id: 13, name: 'Selenium', level: 75, tag: 'automation' },
  { id: 14, name: 'Solidity', level: 70, tag: 'web3' },
  { id: 15, name: 'Git & GitHub', level: 85, tag: 'tools' },
  { id: 16, name: 'Azure DevOps', level: 70, tag: 'tools' },
];

export const timeline = [
  {
    id: 0,
    kind: 'experience',
    year: 'May 2026 — Present',
    title: 'Full Stack Developer',
    place: 'Synctric',
    desc: 'Building client products end to end — an intelligence console, a devotional-services platform and AI content tools. React on the front, FastAPI and Node behind it.',
  },
  {
    id: 1,
    kind: 'experience',
    year: 'Jan 2025 — Nov 2025',
    title: 'Full Stack Developer',
    place: 'Radicle',
    desc: 'Worked on a loan-approval platform for an international banking client — rules engine, approval workflows, the unglamorous backend stuff that has to be correct. Plus React features on the frontend.',
  },
  {
    id: 2,
    kind: 'experience',
    year: 'Oct 2024 — Dec 2024',
    title: 'Backend Developer Intern',
    place: 'Transition',
    desc: 'Three-month backend internship. REST APIs, data models, and a lot of code review.',
  },
  {
    id: 3,
    kind: 'experience',
    year: 'Apr 2023 — Sep 2023',
    title: 'Full Stack Developer',
    place: 'Bixel Technolab',
    desc: 'First dev job. Built and shipped MERN web apps end to end.',
  },
  {
    id: 4,
    kind: 'education',
    year: '2019 — 2023',
    title: 'B.Tech — Computer Science',
    place: 'Prist University, Chennai',
    desc: 'Computer science degree. Fundamentals, algorithms, and a lot of late-night lab work.',
  },
];

export const certifications = [
  { id: 1, img: certEntriCourse, title: 'Entri Elevate — MERN Stack Development · Nov 2023' },
  { id: 2, img: certNsdc, title: 'NSDC — Full Stack Development · Sep 2023' },
  { id: 3, img: certEntriInternship, title: 'Entri — Internship Certificate' },
];

export const projects = [
  {
    id: 19,
    img: WorkArgus,
    title: 'Argus',
    desc: 'Narrative & misinformation intelligence console — news-check verdicts, a threat board ranked by spread, anomaly detection, live ingest feed, spread map, keyword and account monitoring, AI briefs and multi-tenant RBAC. Client project, so no public link.',
    stack: ['React', 'FastAPI', 'Python', 'MapLibre', 'WhatsApp API'],
    link: null,
    featured: true,
  },
  {
    id: 14,
    img: WorkReelform,
    title: 'Reelform',
    desc: 'All-in-one AI content suite — text-to-image, image-to-video, and social-ready reels from one dashboard. Client project, so no public demo.',
    stack: ['React', 'Node.js', 'AI APIs'],
    link: null,
    featured: true,
  },
  {
    id: 20,
    img: WorkValodex,
    title: 'Valodex',
    desc: 'A Valorant codex — every agent, weapon, map, skin, bundle, rank and season pulled live from the game’s own data, plus a time-to-kill calculator, rendered with Three.js scenes and anime.js motion.',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Three.js', 'Drizzle', 'Postgres'],
    link: 'https://valodex.sapper.top',
    repo: 'https://github.com/aravindshajan6/valodex',
    featured: true,
  },
  {
    id: 15,
    img: WorkKinema,
    title: 'Kinema',
    desc: 'Editorial-grade AI video studio — drop a photo, pick an effect, get a social-ready motion clip. Client work, so no public demo.',
    stack: ['React', 'AI Video', 'Templates'],
    link: null,
    featured: true,
  },
  {
    id: 18,
    img: WorkSanctum,
    title: 'Sanctum',
    desc: 'Devotional-services platform — temple puja bookings, live darshan, prasad delivery and Vedic astrologer consults, with a warm editorial UI. Client project, so no public link.',
    stack: ['React', 'TanStack Start', 'TypeScript', 'Nginx'],
    link: null,
    featured: true,
  },
  {
    id: 16,
    img: WorkBlueprint,
    title: 'Blueprint',
    desc: 'AI website builder — describe the idea and it generates the sitemap, structure, and UX wireframes, ready to export. Client project, so no public demo.',
    stack: ['React', 'TypeScript', 'Supabase', 'OpenAI'],
    link: null,
    featured: true,
  },
  {
    id: 1,
    img: WorkLoan,
    title: 'Loan Management System',
    desc: "Backend for a bank's loan-approval system — origination, validation rules, workflows. Private client work, so no demo.",
    stack: ['Node.js', 'Express', 'MongoDB', 'REST'],
    link: null,
    featured: true,
  },
  {
    id: 17,
    img: WorkSportscast,
    title: 'Sportscast',
    desc: 'Live football scores, fixtures, 3D formation pitch, match stats and an RSS news hub — React 19 + anime.js front, Express 5 + MongoDB API, shipped with Docker.',
    stack: ['React', 'anime.js', 'Express', 'MongoDB', 'Docker'],
    link: 'https://sportscast-web.onrender.com/',
    repo: 'https://github.com/aravindshajan6/SportsLive',
    featured: true,
  },
  {
    id: 2,
    img: WorkSteaminc,
    title: 'Steaminc',
    desc: 'Finds where any movie is legally streaming in your region, and plays public-domain films straight from the Internet Archive.',
    stack: ['Node.js', 'JavaScript', 'TMDB API', 'Docker'],
    link: 'https://steaminc.onrender.com/',
    featured: true,
  },
  {
    id: 6,
    img: WorkNova,
    title: 'Nova Commerce',
    desc: 'E-commerce analytics platform — revenue intelligence, cohort retention, RFM segments, Holt forecasting, a live order feed and a 3D order globe over a Shopify-style dataset.',
    stack: ['React 19', 'Three.js', 'anime.js', 'Recharts', 'Express', 'MongoDB', 'Docker'],
    link: 'https://ecommerce-dashboard-a3ap.onrender.com/',
    repo: 'https://github.com/aravindshajan6/Ecommerce-Dashboard-Analytics',
    featured: true,
  },
  {
    id: 5,
    img: WorkElecstore,
    title: 'Elecstore',
    desc: 'Considered-tech storefront — curated catalogue with search and saved items, multi-step checkout with Razorpay, coupons, order history, and an admin area for products, orders and a sales dashboard. Shipped as a Docker + nginx stack.',
    stack: ['React', 'Redux', 'Framer Motion', 'Express', 'MongoDB', 'Razorpay', 'Docker'],
    link: 'https://elecstore-web.onrender.com/',
    repo: 'https://github.com/aravindshajan6/ecommerce-app',
    featured: true,
  },
  {
    id: 13,
    img: WorkFootinc,
    title: 'Footinc',
    desc: 'Football, floodlit — live scores, fixtures, standings, FPL and deep match stats for every league that matters, rendered like a night game.',
    stack: ['Next.js', 'React', 'Live Data'],
    link: 'https://footinc.onrender.com',
    featured: true,
  },
  {
    id: 3,
    img: WorkStreamGen,
    title: 'StreamGen',
    desc: 'Chat and video calls in the browser, built on the Stream SDK with JWT auth.',
    stack: ['React', 'Stream SDK', 'Express', 'MongoDB'],
    link: 'https://github.com/aravindshajan6/StreamGen',
    featured: true,
  },
  {
    id: 8,
    img: Work7,
    title: 'Realtime Location Tracker',
    desc: 'Live location sharing on an interactive map via websockets.',
    stack: ['Socket.io', 'Leaflet', 'JavaScript'],
    link: 'https://github.com/aravindshajan6/realtime-tracker/tree/main',
    featured: false,
  },
  {
    id: 10,
    img: Work1,
    title: 'Real Estate Website',
    desc: 'Property listing website with modern UI.',
    stack: ['React'],
    link: 'https://aravindshajan6.github.io/real-estate-website/',
    featured: false,
  },
];

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
];
