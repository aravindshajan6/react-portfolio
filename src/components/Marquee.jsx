// Infinite marquee strip — content duplicated for a seamless -50% loop.
const Marquee = ({ items, speed = '28s', reverse = false }) => {
  const row = (key) => (
    <div
      className="marquee__track"
      key={key}
      style={{
        '--marquee-speed': speed,
        animationDirection: reverse ? 'reverse' : 'normal',
      }}
      aria-hidden={key === 'b'}
    >
      {items.map((item, i) => (
        <span className="marquee__item" key={i}>
          {item} <span className="dot">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee">
      {row('a')}
      {row('b')}
    </div>
  );
};

export default Marquee;
