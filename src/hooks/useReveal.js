import { useEffect, useRef } from 'react';

/**
 * Attach the returned ref to a container. Every descendant carrying
 * `.reveal` or `.reveal-clip` (or the container itself, if it has one)
 * gets `.is-inview` added once it enters the viewport (fire-once).
 * Stagger siblings by setting inline `--reveal-delay` on each element.
 */
export default function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const targets = [
      ...(root.matches('.reveal, .reveal-clip') ? [root] : []),
      ...root.querySelectorAll('.reveal, .reveal-clip'),
    ];
    if (!targets.length) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return ref;
}
