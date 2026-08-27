// ── Central content file — edit your info here ─────────────────────────────
import Workm1 from './assets/project-m1.png';
import Work0 from './assets/project-0.png';
import Work1 from './assets/project-1.jpeg';
import Work2 from './assets/project-2.jpg';
import Work6 from './assets/project-6.jpg';
import Work7 from './assets/project-7.png';
import Work9 from './assets/project-9.png';
import WorkLoan from './assets/project-loan.svg';
import WorkSteaminc from './assets/project-steaminc.png';
import WorkStreamGen from './assets/project-streamgen.svg';
import WorkFootinc from './assets/project-footinc.png';

import certNsdc from './assets/nsdcMern.png';
import certEntriCourse from './assets/entriCourse.png';
import certEntriInternship from './assets/entriInternship.png';

export const profile = {
  firstName: 'Aravind',
  lastName: 'Shajan',
  role: 'Full Stack Developer',
  tagline:
    'full-stack developer building scalable, user-friendly products — from React frontends to Node.js backends.',
  location: 'Kannur, Kerala, India',
  email: 'aravindshajan6@gmail.com',
  phone: '+91 9072016134',
  freelance: 'Available',
  languages: ['English', 'Hindi', 'Malayalam'],
  github: 'https://github.com/aravindshajan6',
  linkedin: 'https://www.linkedin.com/in/aravindshajan/',
  whatsapp: 'https://wa.me/919072016134',

  // Contact form delivery — get a free access key at https://web3forms.com
  // (enter your email, the key arrives instantly). Paste it here and the
  // form submits directly to your inbox. Left empty, the form falls back
  // to opening the visitor's email app (mailto).
  web3formsKey: 'a1797505-af81-454a-9bd3-71fda260b8a6',
};

export const stats = [
  { id: 1, value: 2, suffix: '+', label: 'Years of experience' },
  { id: 2, value: 15, suffix: '+', label: 'Projects built' },
  { id: 3, value: 18, suffix: '', label: 'Technologies used' },
  { id: 4, value: 3, suffix: '', label: 'Certifications earned' },
];

export const skills = [
  { id: 1, name: 'JavaScript', level: 85, tag: 'language' },
  { id: 2, name: 'React', level: 82, tag: 'frontend' },
  { id: 3, name: 'Next.js', level: 70, tag: 'frontend' },
  { id: 4, name: 'Node.js', level: 78, tag: 'backend' },
  { id: 5, name: 'Express', level: 78, tag: 'backend' },
  { id: 6, name: 'MongoDB', level: 74, tag: 'database' },
  { id: 7, name: 'MySQL', level: 65, tag: 'database' },
  { id: 8, name: 'HTML & CSS', level: 85, tag: 'frontend' },
  { id: 9, name: 'Tailwind', level: 75, tag: 'frontend' },
  { id: 10, name: 'Python', level: 75, tag: 'language' },
  { id: 11, name: 'FastAPI', level: 65, tag: 'backend' },
  { id: 12, name: 'Playwright', level: 70, tag: 'automation' },
  { id: 13, name: 'Selenium', level: 70, tag: 'automation' },
  { id: 14, name: 'Solidity', level: 50, tag: 'web3' },
  { id: 15, name: 'Git & GitHub', level: 80, tag: 'tools' },
  { id: 16, name: 'Azure DevOps', level: 60, tag: 'tools' },
];

export const timeline = [
  {
    id: 1,
    kind: 'experience',
    year: 'Jan 2025 — Nov 2025',
    title: 'Full Stack Developer',
    place: 'Radicle',
    desc: 'Built and shipped full-stack features across React frontends and Node.js/Express backend services, including work on a rule-driven loan platform for an international banking client.',
  },
  {
    id: 2,
    kind: 'experience',
    year: 'Oct 2024 — Dec 2024',
    title: 'Backend Developer Intern',
    place: 'Transition',
    desc: 'Backend internship focused on REST API design, data modelling, and service integrations.',
  },
  {
    id: 3,
    kind: 'experience',
    year: 'Apr 2023 — Sep 2023',
    title: 'Full Stack Developer',
    place: 'Bixel Technolab',
    desc: 'Developed responsive web applications end to end on the MERN stack.',
  },
  {
    id: 4,
    kind: 'education',
    year: '2019 — 2023',
    title: 'B.Tech — Computer Science',
    place: 'Prist University, Chennai',
    desc: 'Bachelor of Technology in Computer Science and Engineering.',
  },
];

export const certifications = [
  { id: 1, img: certEntriCourse, title: 'Entri Elevate — MERN Stack Development · Nov 2023' },
  { id: 2, img: certNsdc, title: 'NSDC — Full Stack Development · Sep 2023' },
  { id: 3, img: certEntriInternship, title: 'Entri — Internship Certificate' },
];

export const projects = [
  {
    id: 1,
    img: WorkLoan,
    title: 'Loan Management System',
    desc: 'Modernised a legacy loan-approval platform for an international banking client — rule-driven origination, approval workflows, validation and status tracking.',
    stack: ['Node.js', 'Express', 'MongoDB', 'REST'],
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
    desc: 'Streaming discovery deck — finds which licensed service carries any title in your region, and plays public-domain films instantly from the Internet Archive.',
    stack: ['Node.js', 'JavaScript', 'TMDB API', 'Docker'],
    link: 'https://github.com/aravindshajan6/steaminc',
    featured: true,
  },
  {
    id: 3,
    img: WorkStreamGen,
    title: 'StreamGen',
    desc: 'Real-time chat and video-calling platform built on the Stream SDK, with JWT auth and MongoDB persistence.',
    stack: ['React', 'Stream SDK', 'Express', 'MongoDB'],
    link: 'https://github.com/aravindshajan6/StreamGen',
    featured: true,
  },
  {
    id: 4,
    img: Workm1,
    title: 'SportsLive',
    desc: 'Real-time football live-scores and news platform built on an open sports API.',
    stack: ['React', 'Express', 'MongoDB'],
    link: 'https://sports-live-api.netlify.app/',
    featured: true,
  },
  {
    id: 5,
    img: Work0,
    title: 'E-Commerce App',
    desc: 'MERN + Redux store with cart, order processing, JWT auth, and PayPal/Razorpay payments.',
    stack: ['MongoDB', 'Express', 'React', 'Redux'],
    link: 'https://elecstore.onrender.com',
    featured: true,
  },
  {
    id: 6,
    img: Work9,
    title: 'E-Commerce Dashboard',
    desc: 'Shopify-style admin dashboard with live charts and analytics.',
    stack: ['MERN', 'Charts'],
    link: 'https://ecommerce-dashboard-a3ap.onrender.com/',
    featured: false,
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
