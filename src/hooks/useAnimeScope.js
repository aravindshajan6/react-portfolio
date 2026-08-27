import { useEffect, useRef } from 'react';
import { createScope } from 'animejs';

/**
 * Shared media queries every scope can read via `scope.matches.<key>`.
 * Scopes re-run their constructors automatically when one of these flips.
 */
export const MEDIA = {
  reduce: '(prefers-reduced-motion: reduce)',
  fine: '(pointer: fine)',
  desktop: '(min-width: 1024px)',
  mobile: '(max-width: 768px)',
};

/**
 * React binding for anime.js v4 `createScope`.
 *
 *   const [rootRef, scopeRef] = useAnimeScope((scope) => {
 *     if (scope.matches.reduce) return;          // respect reduced motion
 *     animate('.card', { y: [40, 0] });          // selectors are scoped to rootRef
 *     scope.add('press', (el) => animate(el, { scale: [0.94, 1] }));
 *     return () => { /* optional extra cleanup *\/ };
 *   });
 *   // later, from a React handler:  scopeRef.current?.methods.press(e.currentTarget)
 *
 * Everything created inside `build` (animations, timelines, scroll observers,
 * draggables, text splitters…) is reverted when the component unmounts or
 * when `deps` change.
 */
export default function useAnimeScope(build, deps = []) {
  const rootRef = useRef(null);
  const scopeRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return undefined;
    const scope = createScope({ root: rootRef, mediaQueries: MEDIA });
    scopeRef.current = scope;
    scope.add(build);
    return () => {
      scope.revert();
      scopeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return [rootRef, scopeRef];
}
