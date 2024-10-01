import {
  FaHome,
  FaUser,
  FaFolderOpen,
  FaEnvelopeOpen,
  FaBriefcase,
  FaGraduationCap,
  FaCode,
} from 'react-icons/fa';
import { FiFileText, FiUser, FiExternalLink } from 'react-icons/fi';

import Workm1 from './assets/project-m1.png';
import Work0 from './assets/project-0.png';
import Work1 from './assets/project-1.jpeg';
import Work2 from './assets/project-2.jpg';
import Work3 from './assets/project-3.jpeg';
import Work4 from './assets/project-4.jpeg';
import Work5 from './assets/project-5.jpg';
import Work6 from './assets/project-6.jpg';
import Work7 from './assets/project-7.png';
import Work8 from './assets/project-8.png';
import Work9 from './assets/project-9.png';

import Theme1 from './assets/purple.png';
import Theme2 from './assets/red.png';
import Theme3 from './assets/blueviolet.png';
import Theme4 from './assets/blue.png';
import Theme5 from './assets/goldenrod.png';
import Theme6 from './assets/magenta.png';
import Theme7 from './assets/yellowgreen.png';
import Theme8 from './assets/orange.png';
import Theme9 from './assets/green.png';
import Theme10 from './assets/yellow.png';

export const links = [
  {
    id: 'hom',
    name: 'Home',
    icon: <FaHome className='nav__icon' />,
    path: '/',
  },

  {
    id: 'abo',
    name: 'About',
    icon: <FaUser className='nav__icon' />,
    path: '/about',
  },

  {
    id: 'por',
    name: 'Portfolio',
    icon: <FaFolderOpen className='nav__icon' />,
    path: '/portfolio',
  },

  {
    id: 'con',
    name: 'Contact',
    icon: <FaEnvelopeOpen className='nav__icon' />,
    path: '/contact',
  },
];

export const personalInfo = [
  {
    id: 1,
    title: 'First Name : ',
    description: 'Aravind',
  },

  {
    id: 2,
    title: 'Last Name : ',
    description: 'Shajan',
  },

  {
    id: 3,
    title: 'Age : ',
    description: '25 Years',
  },

  {
    id: 4,
    title: 'Nationality : ',
    description: 'Indian',
  },

  {
    id: 5,
    title: 'Freelance : ',
    description: 'Available',
  },

  {
    id: 6,
    title: 'Address : ',
    description: 'Kannur, Kerala, India , 670142',
  },

  {
    id: 7,
    title: 'Phone : ',
    description: '+919072016134',
  },

  {
    id: 8,
    title: 'Email : ',
    description: 'aravindshajan6@mail.com',
  },

  {
    id: 9,
    title: 'Skype : ',
    description: 'aravind.shajan',
  },

  {
    id: 10,
    title: 'Langages : ',
    description: 'English, Malayalam, Hindi, Tamil'
  },
];

export const stats = [
  {
    id: 1,
    no: '1+',
    title: 'Years of <br /> Experience',
  },

  {
    id: 2,
    no: '10+',
    title: 'Completed <br /> Projects',
  },

  // {
  //   id: 3,
  //   no: '2',
  //   title: 'Apps <br /> Cloned',
  // },

  {
    id: 4,
    no: '∞',
    title: ' Dedication <br /> Commitment',
  },
];

export const resume = [
  {
    id: 1,
    category: 'experience',
    icon: <FaBriefcase />,
    year: '2023 - PRESENT',
    title: 'MERN stack Developer <span> Entri </span>',
    desc: 'Completed MERN stack developer Course from ENTRI',
  },

  // {
  //   id: 2,
  //   category: 'experience',
  //   icon: <FaBriefcase />,
  //   year: '2022 - 2023',
  //   title: 'Web Developer <span> Freelance </span>',
  //   desc: 'Worked as a Freelance Web developer.',
  // },

  // {
  //   id: 3,
  //   category: 'experience',
  //   icon: <FaBriefcase />,
  //   year: '2005 - 2013',
  //   title: 'Consultant <span> Videohive </span>',
  //   desc: 'Lorem ipsum dolor sit amet, tempor incididunt ut laboreconsectetur elit, sed do eiusmod tempor duntt',
  // },

  {
    id: 4,
    category: 'education',
    icon: <FaGraduationCap />,
    year: '2023',
    title: 'Engineering Degree <span>Prist University</span>',
    desc: 'Computer Science and Engineering',
  },

  {
    id: 5,
    category: 'education',
    icon: <FaGraduationCap />,
    year: '2016',
    title: 'Higher Secondary',
    desc: 'Marygiri Senior Secondary School',
  },

  // {
  //   id: 6,
  //   category: 'education',
  //   icon: <FaGraduationCap />,
  //   year: '2014',
  //   title: '10th ',
  //   desc: 'Marygiri Senior Secondary School',
  // },
];

export const skills = [
  {
    id: 1,
    title: 'Html',
    percentage: '75',
  },

  {
    id: 2,
    title: 'Javascript',
    percentage: '80',
  },

  {
    id: 3,
    title: 'Css',
    percentage: '70',
  },

  {
    id: 4,
    title: 'React',
    percentage: '75',
  },

  {
    id: 5,
    title: 'Node',
    percentage: '60',
  },

  {
    id: 6,
    title: 'Express',
    percentage: '75',
  },

  {
    id: 7,
    title: 'MongoDB',
    percentage: '65',
  },

  {
    id: 8,
    title: 'Python',
    percentage: '60',
  },
];

export const portfolio = [
  {
    id: 1,
    img: Workm1,
    title: 'SportsLive',
    details: [
      {
        icon: <FiFileText />,
        title: 'Project : ',
        desc: 'online live scores platform',
      },
      {
        icon: <FiUser />,
        title: 'Client : ',
        desc: '-',
      },
      {
        icon: <FaCode />,
        title: 'Language : ',
        desc: 'MERN',
      },
      {
        icon: <FiExternalLink />,
        title: 'Preview : ',
        desc: 'https://sports-live-api.netlify.app/',
      },
    ],
  },
  {
    id: 1,
    img: Work0,
    title: 'E-commerce App',
    details: [
      {
        icon: <FiFileText />,
        title: 'Project : ',
        desc: 'WebApp',
      },
      {
        icon: <FiUser />,
        title: 'Client : ',
        desc: '-',
      },
      {
        icon: <FaCode />,
        title: 'Language : ',
        desc: 'MERN',
      },
      {
        icon: <FiExternalLink />,
        title: 'Preview : ',
        desc: 'https://elecstore.onrender.com',
      },
    ],
  },
  {
    id: 1,
    img: Work9,
    title: 'Ecommerce Dashboard',
    details: [
      {
        icon: <FiFileText />,
        title: 'Project : ',
        desc: 'Shopify dashboard with graphs',
      },
      {
        icon: <FiUser />,
        title: 'Client : ',
        desc: '-',
      },
      {
        icon: <FaCode />,
        title: 'Stack : ',
        desc: 'MERN',
      },
      {
        icon: <FiExternalLink />,
        title: 'Preview : ',
        desc: 'https://ecommerce-dashboard-a3ap.onrender.com/',
      },
    ],
  },
  {
    id: 8,
    img: Work8,
    title: 'Email Auth',
    details: [
      {
        icon: <FiFileText />,
        title: 'Project : ',
        desc: 'Email Auth',
      },
      {
        icon: <FiUser />,
        title: 'Client : ',
        desc: '-',
      },
      {
        icon: <FaCode />,
        title: 'Stack : ',
        desc: 'JS, React, tailwind',
      },
      {
        icon: <FiExternalLink />,
        title: 'Preview : ',
        desc: 'https://email-auth-app.onrender.com/',
      },
    ],
  },
  {
    id: 1,
    img: Work1,
    title: 'Real Estate Website',
    details: [
      {
        icon: <FiFileText />,
        title: 'Project : ',
        desc: 'Website',
      },
      {
        icon: <FiUser />,
        title: 'Client : ',
        desc: '-',
      },
      {
        icon: <FaCode />,
        title: 'Language : ',
        desc: 'React JS',
      },
      {
        icon: <FiExternalLink />,
        title: 'Preview : ',
        desc: 'https://aravindshajan6.github.io/real-estate-website/',
      },
    ],
  },

  {
    id: 2,
    img: Work2,
    title: 'Blog',
    details: [
      {
        icon: <FiFileText />,
        title: 'Project : ',
        desc: 'Blog',
      },
      {
        icon: <FiUser />,
        title: 'Client : ',
        desc: '-',
      },
      {
        icon: <FaCode />,
        title: 'Language : ',
        desc: 'HTML, CSS',
      },
      {
        icon: <FiExternalLink />,
        title: 'Preview : ',
        desc: 'https://aravindshajan6.github.io/frontendblog/',
      },
    ],
  },

  {
    id: 3,
    img: Work3,
    title: 'Cards Layout',
    details: [
      {
        icon: <FiFileText />,
        title: 'Project : ',
        desc: 'Cards',
      },
      {
        icon: <FiUser />,
        title: 'Client : ',
        desc: '-',
      },
      {
        icon: <FaCode />,
        title: 'Language : ',
        desc: 'Html, CSS',
      },
      {
        icon: <FiExternalLink />,
        title: 'Preview : ',
        desc: 'https://aravindshajan6.github.io/four-cards/',
      },
    ],
  },

  {
    id: 4,
    img: Work4,
    title: 'Price Grid',
    details: [
      {
        icon: <FiFileText />,
        title: 'Project : ',
        desc: 'Price Grid ',
      },
      {
        icon: <FiUser />,
        title: 'Client : ',
        desc: '-',
      },
      {
        icon: <FaCode />,
        title: 'Language : ',
        desc: 'Html, CSS',
      },
      {
        icon: <FiExternalLink />,
        title: 'Preview : ',
        desc: 'https://neon-vacherin-945cc4.netlify.app/',
      },
    ],
  },

  {
    id: 5,
    img: Work5,
    title: 'Landing Page',
    details: [
      {
        title: 'Project : ',
        desc: 'Landing Landing ',
      },
      {
        title: 'Client : ',
        desc: '-',
      },
      {
        title: 'Language : ',
        desc: 'CSS, HTML',
      },
      {
        title: 'Preview : ',
        desc: 'https://aravindshajan6.github.io/apparel-coming-soon/',
      },
    ],
  },

  {
    id: 6,
    img: Work6,
    title: 'Piano App',
    details: [
      {
        icon: <FiFileText />,
        title: 'Project : ',
        desc: ' Online Paino',
      },
      {
        icon: <FiUser />,
        title: 'Client : ',
        desc: '-',
      },
      {
        icon: <FaCode />,
        title: 'Language : ',
        desc: 'JS, HTML, CSS',
      },
      {
        icon: <FiExternalLink />,
        title: 'Preview : ',
        desc: 'https://aravindshajan6.github.io/piano/',
      },
    ],
  },
  {
    id: 7,
    img: Work7,
    title: 'Realtime location Tracker',
    details: [
      {
        icon: <FiFileText />,
        title: 'Project : ',
        desc: 'Location Tracker',
      },
      {
        icon: <FiUser />,
        title: 'Client : ',
        desc: '-',
      },
      {
        icon: <FaCode />,
        title: 'Stack : ',
        desc: 'JS, socket.io, Leaflet',
      },
      {
        icon: <FiExternalLink />,
        title: 'Github : ',
        desc: 'https://github.com/aravindshajan6/realtime-tracker/tree/main',
      },
    ],
  },
];

export const themes = [
  {
    id: 1,
    img: Theme1,
    color: 'hsl(252, 35%, 51%)',
  },

  {
    id: 2,
    img: Theme2,
    color: 'hsl(4, 93%, 54%)',
  },

  {
    id: 3,
    img: Theme3,
    color: 'hsl(271, 76%, 53%)',
  },

  {
    id: 4,
    img: Theme4,
    color: 'hsl(225, 73%, 57%)',
  },

  {
    id: 5,
    img: Theme5,
    color: 'hsl(43, 74%, 49%)',
  },

  {
    id: 6,
    img: Theme6,
    color: 'hsl(339, 81%, 66%)',
  },

  {
    id: 7,
    img: Theme7,
    color: 'hsl(80, 61%, 50%)',
  },

  {
    id: 8,
    img: Theme8,
    color: 'hsl(19, 96%, 52%)',
  },

  {
    id: 9,
    img: Theme9,
    color: 'hsl(88, 65%, 43%)',
  },

  {
    id: 10,
    img: Theme10,
    color: 'hsl(42, 100%, 50%)',
  },
];
