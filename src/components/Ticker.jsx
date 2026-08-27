import './ticker.css';

const ITEMS = [
  'OPEN TO FREELANCE',
  'PYTHON AUTOMATION',
  'MERN STACK',
  'FASTAPI · PLAYWRIGHT',
  'KANNUR, IN → REMOTE',
  'HUMANS WELCOME',
];

// thin always-visible status strip above the nav.
// content rendered twice inside one track = seamless -50% loop
const Ticker = () => (
  <div className="ticker" role="marquee" aria-label="Status: open to freelance">
    <div className="ticker__track">
      {[...ITEMS, ...ITEMS].map((item, i) => (
        <span className="ticker__item" key={i} aria-hidden={i >= ITEMS.length}>
          {item} <span className="ticker__sep">+</span>
        </span>
      ))}
    </div>
  </div>
);

export default Ticker;
