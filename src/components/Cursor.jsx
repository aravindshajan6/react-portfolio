import { useEffect, useRef } from 'react';
import './cursor.css';

// Custom cursor: dot follows instantly, ring trails with lerp.
// Morphs into a "VIEW" pill over [data-cursor="view"] targets,
// grows over links/buttons. Fine pointers only.
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
    const mouse = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let raf;
    let visible = false;

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // move the dot immediately — zero perceived lag
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
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

    const loop = () => {
      // snappy trail: close 45% of the gap per frame
      pos.x += (mouse.x - pos.x) * 0.45;
      pos.y += (mouse.y - pos.y) * 0.45;
      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
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
