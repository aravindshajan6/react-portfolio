import { useEffect, useRef } from 'react';
import { createAnimatable } from 'animejs';
import './cursor.css';

// Custom cursor: block "dot" follows instantly, ring trails via an anime.js
// Animatable (smooth, frame-rate independent). Morphs into a "VIEW" pill over
// [data-cursor="view"] targets, grows over links/buttons. Fine pointers only.
const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return undefined;

    document.body.classList.add('has-custom-cursor');

    const dot = dotRef.current;
    const ring = ringRef.current;
    const trail = createAnimatable(ring, { x: 180, y: 180, ease: 'out(3)' });
    let visible = false;

    const onMove = (e) => {
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      trail.x(e.clientX);
      trail.y(e.clientY);
      if (!visible) {
        visible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
      const t = e.target;
      const view = t.closest?.('[data-cursor="view"]');
      const interactive = t.closest?.('a, button, input, textarea, [role="button"]');
      ring.classList.toggle('cursor__ring--view', !!view);
      ring.classList.toggle('cursor__ring--hover', !view && !!interactive);
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      trail.revert();
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div className="cursor__dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor__ring" ref={ringRef} aria-hidden="true">
        <span className="cursor__label">VIEW</span>
      </div>
    </>
  );
};

export default Cursor;
