import { useEffect, useState } from 'react';
import './footer.css';

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

// injected by vite.config.js `define`
const BUILD_HASH = typeof __BUILD_HASH__ !== 'undefined' ? __BUILD_HASH__ : 'dev';
const BUILD_DATE = typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : '';

export default function Footer() {
  const [time, setTime] = useState(() => timeFormatter.format(new Date()));

  useEffect(() => {
    const tick = () => setTime(timeFormatter.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const backToTop = () => {
    if (typeof window.__scrollToSection === 'function') window.__scrollToSection('home');
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container footer__row">
        <p className="footer__copy">&copy; {new Date().getFullYear()} Aravind Shajan</p>

        <p className="footer__time" aria-label="Current local time in Kerala, India">
          KERALA, IN &mdash; <span className="footer__clock">{time}</span> IST
        </p>

        <button type="button" className="footer__top" onClick={backToTop}>
          cd ~ <span aria-hidden="true">&uarr;</span>
        </button>
      </div>

      <div className="container">
        <p className="footer__credit">
          $ echo &quot;designed &amp; built by aravind shajan&quot; — react · three.js · anime.js
          <span className="footer__build">
            {' '}· build <span className="footer__hash">{BUILD_HASH}</span>
            {BUILD_DATE && ` · ${BUILD_DATE}`}
          </span>
        </p>
      </div>
    </footer>
  );
}
