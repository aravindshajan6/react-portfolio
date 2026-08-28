import './ticker.css';

const ITEMS = [
  'OPEN TO FREELANCE',
  'PYTHON AUTOMATION',
  'MERN STACK',
  'FASTAPI · PLAYWRIGHT',
  'KERALA, IN → REMOTE',
];

// thin always-visible status strip above the nav.
// content rendered twice inside one track = seamless -50% loop
const Ticker = () => (
  <div className="ticker">
    <span className="sr-only">Status: open to freelance. Press the backtick key to open the terminal.</span>
    <div className="ticker__track" aria-hidden="true">
      {[...ITEMS, ...ITEMS].map((item, i) => (
        <span className="ticker__item" key={i}>
          {item} <span className="ticker__sep">+</span>
        </span>
      ))}
    </div>
  </div>
);

export default Ticker;
