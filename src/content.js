// ── Central content file — edit your info here ─────────────────────────────
import WorkSportscast from './assets/project-sportscast.webp';
import Work0 from './assets/project-0.webp';
import Work1 from './assets/project-1.webp';
import Work2 from './assets/project-2.webp';
import Work6 from './assets/project-6.webp';
import Work7 from './assets/project-7.webp';
import WorkNova from './assets/project-novacommerce.webp';
import WorkLoan from './assets/project-loan.svg';
import WorkSteaminc from './assets/project-steaminc.webp';
import WorkStreamGen from './assets/project-streamgen.svg';
import WorkFootinc from './assets/project-footinc.webp';
import WorkReelease from './assets/project-reelease.webp';
import WorkIdeary from './assets/project-ideary.webp';
import WorkMotionAI from './assets/project-motionai.webp';

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
  { id: 14, name: 'Solidity', level: 55, tag: 'web3' },
  { id: 15, name: 'Git & GitHub', level: 85, tag: 'tools' },
  { id: 16, name: 'Azure DevOps', level: 65, tag: 'tools' },
];

export const timeline = [
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
    id: 1,
    img: WorkLoan,
    title: 'Loan Management System',
    desc: "Backend for a bank's loan-approval system — origination, validation rules, workflows. Private client work, so no demo.",
    stack: ['Node.js', 'Express', 'MongoDB', 'REST'],
    link: null,
    featured: true,
  },
  {
    id: 14,
    img: WorkReelease,
    title: 'Reelease',
    desc: 'All-in-one AI content suite — text-to-image, image-to-video, and social-ready reels from one dashboard.',
    stack: ['React', 'Node.js', 'AI APIs'],
    link: null,
    featured: true,
  },
  {
    id: 15,
    img: WorkMotionAI,
    title: 'MotionAI',
    desc: 'Editorial-grade AI video studio (live as Pixloops) — drop a photo, pick an effect, get a social-ready motion clip.',
    stack: ['React', 'AI Video', 'Templates'],
    link: 'https://pixloops.app/',
    featured: true,
  },
  {
    id: 16,
    img: WorkIdeary,
    title: 'Ideary',
    desc: 'AI website builder — describe the idea and it generates the sitemap, structure, and UX wireframes, ready to export.',
    stack: ['React', 'TypeScript', 'Supabase', 'OpenAI'],
    link: null,
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
    id: 2,
    img: WorkSteaminc,
    title: 'Steaminc',
    desc: 'Finds where any movie is legally streaming in your region, and plays public-domain films straight from the Internet Archive.',
    stack: ['Node.js', 'JavaScript', 'TMDB API', 'Docker'],
    link: 'https://steaminc.onrender.com/',
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
    id: 5,
    img: Work0,
    title: 'E-Commerce App',
    desc: 'Online store with cart, orders, JWT auth, and PayPal/Razorpay payments.',
    stack: ['MongoDB', 'Express', 'React', 'Redux'],
    link: 'https://elecstore.onrender.com',
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
  {
    id: 11,
    img: Work6,
    title: 'Piano App',
    desc: 'Playable piano in the browser.',
    stack: ['JavaScript', 'HTML', 'CSS'],
    link: 'https://aravindshajan6.github.io/piano/',
    featured: false,
  },
  {
    id: 12,
    img: Work2,
    title: 'Frontend Blog',
    desc: 'Clean, responsive blog layout.',
    stack: ['HTML', 'CSS'],
    link: 'https://aravindshajan6.github.io/frontendblog/',
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
