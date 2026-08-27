import { useEffect, useState } from 'react';
import './footer.css';

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

export default function Footer() {
  const [time, setTime] = useState(() => timeFormatter.format(new Date()));

  useEffect(() => {
    const tick = () => setTime(timeFormatter.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const backToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container footer__row">
        <p className="footer__copy">&copy; 2026 Aravind Shajan</p>

        <p className="footer__time" aria-label="Current local time in Kannur, India">
          KANNUR, IN &mdash; <span className="footer__clock">{time}</span> IST
        </p>

        <button type="button" className="footer__top" onClick={backToTop}>
          Back to top <span aria-hidden="true">&uarr;</span>
        </button>
      </div>

      <div className="container">
        <p className="footer__credit">
          Designed &amp; built by Aravind Shajan &mdash; React &middot; Three.js &middot; anime.js
        </p>
      </div>
    </footer>
  );
}
