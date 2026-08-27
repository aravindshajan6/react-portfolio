import { useMemo } from 'react';
import { animate, createDraggable, spring, onScroll, stagger, utils } from 'animejs';
import useAnimeScope from '../hooks/useAnimeScope';
import { skills } from '../content';
import './stackcube.css';

/* ── face layout: rotateY / rotateX that puts each face on the cube ── */
const FACES = [
  { id: 'front', label: 'frontend', tags: ['frontend'], ry: 0, rx: 0, led: true },
  { id: 'right', label: 'backend', tags: ['backend'], ry: 90, rx: 0 },
  { id: 'back', label: 'database', tags: ['database'], ry: 180, rx: 0 },
  { id: 'left', label: 'language', tags: ['language'], ry: -90, rx: 0 },
  { id: 'top', label: 'automation', tags: ['automation'], ry: 0, rx: 90 },
  { id: 'bottom', label: 'tools+web3', tags: ['tools', 'web3'], ry: 0, rx: -90 },
];

const groupSkills = () =>
  FACES.map((face) => ({
    ...face,
    items: skills.filter((s) => face.tags.includes(s.tag)).slice(0, 4),
  }));

/* resting pose used for reduced-motion and as the idle base */
const REST = { rx: -18, ry: 28 };

export default function StackCube({ size, className = '' }) {
  const faces = useMemo(groupSkills, []);

  const [rootRef] = useAnimeScope((scope) => {
    const root = rootRef.current;
    const cube = root.querySelector('.stackcube__cube');
    const stage = root.querySelector('.stackcube__stage');
    const dragTarget = root.querySelector('.stackcube__drag-target');
    const caption = root.querySelector('.stackcube__caption');
    const faceEls = Array.from(root.querySelectorAll('.stackcube__face'));

    /* three additive rotation layers → one transform write */
    const idle = { rx: 0, ry: 0 };
    const drag = { rx: 0, ry: 0 };
    const scroll = { ry: 0 };
    const render = () => {
      const rx = REST.rx + idle.rx + drag.rx;
      const ry = REST.ry + idle.ry + drag.ry + scroll.ry;
      cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    };

    /* per-face state written to CSS vars (translateZ stays in CSS units) */
    const faceState = FACES.map((f) => ({ rx: f.rx, ry: f.ry, z: 0.5, o: 1 }));
    const renderFaces = () => {
      faceState.forEach((s, i) => {
        const el = faceEls[i];
        el.style.setProperty('--frx', `${s.rx}deg`);
        el.style.setProperty('--fry', `${s.ry}deg`);
        el.style.setProperty('--fz', s.z);
        el.style.opacity = s.o;
      });
    };

    if (scope.matches.reduce) {
      renderFaces();
      render();
      utils.set(caption, { opacity: 1 });
      return undefined;
    }

    /* 1 ── assembly intro: faces fly in from scattered poses, once, on enter */
    faceState.forEach((s, i) => {
      s.z = 1.4 + (i % 3) * 0.25;
      s.rx += (i % 2 ? 55 : -70);
      s.ry += (i % 3 - 1) * 80;
      s.o = 0;
    });
    renderFaces();
    utils.set(caption, { opacity: 0 });

    const releaseSpring = spring({ mass: 1, stiffness: 70, damping: 13 });
    animate(faceState, {
      rx: (s, i) => FACES[i].rx,
      ry: (s, i) => FACES[i].ry,
      z: 0.5,
      o: { to: 1, duration: 500, ease: 'out(3)' },
      ease: releaseSpring,
      delay: stagger(90),
      onRender: renderFaces,
      onComplete: () => animate(caption, { opacity: 1, y: [6, 0], duration: 700 }),
      autoplay: onScroll({
        target: root,
        enter: 'bottom-=10% top',
        sync: 'play',
        repeat: false,
      }),
    });

    /* 2 ── idle tumble: loop on a plain object, applied via render() */
    const tumbleY = animate(idle, {
      ry: [0, 360],
      duration: 32000,
      ease: 'linear',
      loop: true,
      onUpdate: render,
    });
    const tumbleX = animate(idle, {
      rx: [-10, 10],
      duration: 7000,
      ease: 'inOutSine',
      loop: true,
      alternate: true,
    });

    /* 3 ── drag to rotate (stage is the transparent hit area; a 0-size element
       receives the draggable transform so nothing visible moves) */
    const fine = scope.matches.fine;
    const DEG_PER_PX = 0.55;
    createDraggable(dragTarget, {
      trigger: stage,
      x: true,
      y: fine, // touch: horizontal only → `touch-action: pan-y` keeps page scroll
      cursor: false,
      dragThreshold: { mouse: 3, touch: 10 },
      releaseEase: 'out(4)',
      velocityMultiplier: 1.2,
      onGrab: () => {
        tumbleY.pause();
        tumbleX.pause();
        root.classList.add('is-grabbing');
      },
      onUpdate: (self) => {
        drag.ry = self.x * DEG_PER_PX;
        drag.rx = utils.clamp(-self.y * DEG_PER_PX, -75, 75);
        render();
      },
      onRelease: () => root.classList.remove('is-grabbing'),
      onSettle: () => {
        tumbleY.resume();
        tumbleX.resume();
      },
    });

    /* 4 ── scroll-synced offset: +90deg on ry while the wrapper crosses the viewport */
    animate(scroll, {
      ry: 90,
      ease: 'linear',
      onUpdate: render,
      autoplay: onScroll({
        target: root,
        enter: 'bottom top',
        leave: 'top bottom',
        sync: true,
      }),
    });

    render();
    return undefined;
  });

  const style = size ? { '--cube-size': `${size}px` } : undefined;

  return (
    <div ref={rootRef} className={`stackcube ${className}`.trim()} style={style}>
      <div className="stackcube__stage" aria-hidden="true">
        <div className="stackcube__cube">
          {faces.map((face) => (
            <div key={face.id} className={`stackcube__face stackcube__face--${face.id}`}>
              <header className="stackcube__head">
                <span className="stackcube__label">{`// ${face.label}`}</span>
                {face.led ? <span className="stackcube__led" /> : <span className="stackcube__idx">0x{face.items.length}</span>}
              </header>
              <ul className="stackcube__list">
                {face.items.map((s) => (
                  <li key={s.id} className="stackcube__skill">
                    <span className="stackcube__name">{s.name}</span>
                    <span className="stackcube__lvl">{s.level}</span>
                    <span className="stackcube__bar">
                      <span className="stackcube__fill" style={{ width: `${s.level}%` }} />
                    </span>
                  </li>
                ))}
              </ul>
              <span className="stackcube__screw stackcube__screw--tl" />
              <span className="stackcube__screw stackcube__screw--tr" />
              <span className="stackcube__screw stackcube__screw--bl" />
              <span className="stackcube__screw stackcube__screw--br" />
            </div>
          ))}
        </div>
        <span className="stackcube__drag-target" />
      </div>
      <div className="stackcube__glow" aria-hidden="true" />
      <p className="stackcube__caption" aria-hidden="true">
        <span className="stackcube__caption-fine">
          <span className="stackcube__prompt">$</span> rotate --drag
        </span>
        <span className="stackcube__caption-touch">swipe to rotate</span>
      </p>

      {/* screen-reader content: the same skills, grouped per face */}
      <div className="stackcube__sr">
        <h3>Skills by area</h3>
        {faces.map((face) => (
          <dl key={face.id}>
            <dt>{face.label}</dt>
            {face.items.map((s) => (
              <dd key={s.id}>
                {s.name}, {s.level} percent
              </dd>
            ))}
          </dl>
        ))}
      </div>
    </div>
  );
}
