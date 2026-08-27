import { useMemo } from 'react';
import './asciidivider.css';

const GLYPHS = '{}[]<>/\\|=+*#$%&@!?;:~^._-01';

const randomRow = (len) => {
  let out = '';
  for (let i = 0; i < len; i++) {
    out += Math.random() < 0.16 ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
  }
  return out;
};

// glyph-noise band between sections
const AsciiDivider = () => {
  const rows = useMemo(() => [randomRow(360), randomRow(360), randomRow(360)], []);

  return (
    <div className="ascii-divider" aria-hidden="true">
      {rows.map((row, i) => (
        <div
          className={`ascii-divider__row ${i % 2 ? 'ascii-divider__row--rev' : ''}`}
          key={i}
        >
          <span>{row}</span>
          <span>{row}</span>
        </div>
      ))}
    </div>
  );
};

export default AsciiDivider;
