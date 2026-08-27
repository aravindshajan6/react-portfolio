import { useEffect, useRef } from 'react';
import { animate, createScope, onScroll, utils } from 'animejs';
import { MEDIA } from './useAnimeScope';

/**
 * Attach the returned ref to a container. Every descendant carrying `.reveal`
 * fades/slides in (anime.js, scroll-triggered, fire-once) when it enters the
 * viewport. Stagger siblings by setting inline `--reveal-delay` (seconds) on
 * each element. `.is-inview` is added when the animation begins so CSS can
 * hook secondary effects (bars, underlines…).
 */
export default function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const scope = createScope({ root: ref, mediaQueries: MEDIA });
    scope.add((self) => {
      const els = Array.from(root.querySelectorAll('.reveal'));
      if (!els.length) return;

      if (self.matches.reduce) {
        els.forEach((el) => el.classList.add('is-inview'));
        utils.set(els, { opacity: 1, y: 0 });
        return;
      }

      els.forEach((el) => {
        const delay =
          (parseFloat(getComputedStyle(el).getPropertyValue('--reveal-delay')) || 0) * 1000;
        animate(el, {
          opacity: [0, 1],
          y: [46, 0],
          duration: 900,
          delay,
          ease: 'out(4)',
          onBegin: () => el.classList.add('is-inview'),
          // enter = element top crosses a line 8% above the viewport bottom
          autoplay: onScroll({ target: el, enter: 'bottom-=8% top', sync: 'play', repeat: false }),
        });
      });
    });

    return () => scope.revert();
  }, []);

  return ref;
}
