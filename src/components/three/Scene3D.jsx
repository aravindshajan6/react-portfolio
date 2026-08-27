import React, { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Grid, Points, PointMaterial } from '@react-three/drei';
import 'animejs/adapters/three';
import {
  animate,
  createAnimatable,
  createTimeline,
  createTimer,
  onScroll,
  stagger,
  utils,
} from 'animejs';

/* ── helpers ─────────────────────────────────────────────── */

function supportsWebGL() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* Reads theme colors from the design tokens and re-reads them
   whenever data-theme flips on <html>. */
function readThemeColors() {
  const styles = getComputedStyle(document.documentElement);
  const light = document.documentElement.getAttribute('data-theme') === 'light';
  return {
    accent:
      styles.getPropertyValue('--scene-accent').trim() ||
      styles.getPropertyValue('--accent').trim() ||
      '#7c6cff',
    accent2: styles.getPropertyValue('--accent-2').trim() || '#ff8c42',
    bg: styles.getPropertyValue('--bg').trim() || '#0a0a0f',
    // retro plastic: charcoal in dark mode, classic beige in light mode
    body: light ? '#d9d2c2' : '#32323e',
    bodyDark: light ? '#b8b0a0' : '#20202a',
    isLight: light,
  };
}

function useThemeColors() {
  const [colors, setColors] = useState(readThemeColors);

  useEffect(() => {
    const observer = new MutationObserver(() => setColors(readThemeColors()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  return colors;
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

/* Collects refs into an array (for staggered targets). */
function useRefList() {
  const list = useRef([]);
  const set = useMemo(
    () => (i) => (el) => {
      if (el) list.current[i] = el;
    },
    []
  );
  return [list, set];
}

const BASE_CAMERA_Z = 5;
const CAMERA_FOV = 45;
const NAV_SAFE_PX = 110; // fixed ticker + nav band that the model must never overlap

/* ── camera: parallax (animatable) + scroll z pull ───────── */

function CameraRig({ camState, isTouch }) {
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    if (isTouch || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const parallax = createAnimatable(camera.position, {
      x: { duration: 900 },
      y: { duration: 900 },
      ease: 'out(3)',
    });
    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      parallax.x(nx * 0.6);
      parallax.y(ny * 0.3);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      parallax.revert();
    };
  }, [camera, isTouch]);

  useFrame(({ camera: cam }) => {
    cam.position.z = camState.z;
    cam.lookAt(0, 0, 0);
  });

  return null;
}

/* ── CRT screen: canvas texture with typing terminal ─────── */

const TERMINAL_LINES = [
  'ARAVIND.SYS v2.0',
  '',
  '> whoami',
  '  full stack developer',
  '> skills --top',
  '  react · node · mongo',
  '> status',
  '  AVAILABLE FOR WORK',
  '> run portfolio',
];
const TOTAL_CHARS = TERMINAL_LINES.reduce((n, l) => n + (l.length || 1), 0);

function useTerminalTexture(accent) {
  const state = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 2;
    return { canvas, texture, chars: 0, cursorOn: true, booted: false };
  }, []);

  const draw = useMemo(
    () => () => {
      const ctx = state.canvas.getContext('2d');
      const { width: w, height: h } = state.canvas;
      // phosphor-dark background with a soft vignette
      ctx.fillStyle = '#04040a';
      ctx.fillRect(0, 0, w, h);
      const grad = ctx.createRadialGradient(w / 2, h / 2, 60, w / 2, h / 2, w * 0.72);
      grad.addColorStop(0, 'rgba(124, 108, 255, 0.10)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.42)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      if (state.booted) {
        // typed text (reveals `chars` characters across all lines)
        ctx.font = 'bold 26px monospace';
        ctx.fillStyle = accent;
        ctx.shadowColor = accent;
        ctx.shadowBlur = 8;
        let budget = Math.round(state.chars);
        let y = 52;
        let lastX = 26;
        let lastY = y;
        for (const line of TERMINAL_LINES) {
          if (budget <= 0) break;
          const visible = line.slice(0, budget);
          ctx.fillText(visible, 26, y);
          lastX = 26 + ctx.measureText(visible).width;
          lastY = y;
          budget -= line.length || 1;
          y += 36;
        }
        // blinking block cursor
        if (state.cursorOn) {
          ctx.fillRect(lastX + 6, lastY - 22, 16, 26);
        }
        ctx.shadowBlur = 0;
      }

      // scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
      for (let sy = 0; sy < h; sy += 4) {
        ctx.fillRect(0, sy, w, 2);
      }
      state.texture.needsUpdate = true;
    },
    [state, accent]
  );

  return { state, draw };
}

/* ── keyboard: rows of key caps ──────────────────────────── */

const KEY_POSITIONS = (() => {
  const out = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 12; c++) {
      out.push([-0.66 + c * 0.12 + (r % 2) * 0.03, 0.05, -0.17 + r * 0.115]);
    }
  }
  return out;
})();

const Keyboard = React.forwardRef(function Keyboard({ init, mats, keyRef, turboRef }, ref) {
  return (
    <group ref={ref} position={[0, -0.62, 1.05]} rotation={[-0.08, 0, 0]}>
      {/* deck */}
      <mesh>
        <boxGeometry args={[1.62, 0.09, 0.62]} />
        <meshStandardMaterial ref={mats('body')} color={init.body} roughness={0.55} metalness={0.1} />
      </mesh>
      {/* key caps */}
      {KEY_POSITIONS.map((p, i) => (
        <mesh key={i} ref={keyRef(i)} position={p}>
          <boxGeometry args={[0.095, 0.05, 0.095]} />
          <meshStandardMaterial ref={mats('bodyDark')} color={init.bodyDark} roughness={0.6} />
        </mesh>
      ))}
      {/* space bar */}
      <mesh ref={keyRef(KEY_POSITIONS.length)} position={[0, 0.05, 0.29]}>
        <boxGeometry args={[0.62, 0.05, 0.09]} />
        <meshStandardMaterial ref={mats('bodyDark')} color={init.bodyDark} roughness={0.6} />
      </mesh>
      {/* one accent key, because every rig needs a turbo button */}
      <mesh ref={turboRef} position={[0.66, 0.055, 0.29]}>
        <boxGeometry args={[0.095, 0.055, 0.09]} />
        <meshStandardMaterial
          ref={mats('accentEmissive')}
          color={init.accent}
          emissive={init.accent}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
});

/* ── floppy disk ─────────────────────────────────────────── */

const FLOPPY_ORBIT = { x: -1.55, y: 0.75, z: 0.4, rotateX: 17, rotateY: 29, rotateZ: -8.5 };
// lying flat, lined up with the drive slot in the monitor base
const FLOPPY_SLOT = { x: -0.15, y: -0.5, rotateX: -90, rotateY: 0, rotateZ: 0 };

const Floppy = React.forwardRef(function Floppy({ init, mats }, ref) {
  return (
    <group ref={ref} scale={0.5}>
      <mesh>
        <boxGeometry args={[1, 1, 0.06]} />
        <meshStandardMaterial ref={mats('bodyDark')} color={init.bodyDark} roughness={0.5} />
      </mesh>
      {/* shutter */}
      <mesh position={[0.05, 0.34, 0.035]}>
        <boxGeometry args={[0.55, 0.3, 0.02]} />
        <meshStandardMaterial color="#8a8a94" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* label */}
      <mesh position={[0, -0.22, 0.035]}>
        <boxGeometry args={[0.7, 0.42, 0.02]} />
        <meshStandardMaterial
          ref={mats('accentEmissive')}
          color={init.accent}
          emissive={init.accent}
          emissiveIntensity={0.25}
        />
      </mesh>
    </group>
  );
});

/* ── the retro computer ──────────────────────────────────── */

function RetroComputer({ colors, isMobile, isTablet, ready, camState }) {
  const size = useThree((s) => s.size);

  // JSX gets the *initial* palette only; theme changes are tweened via anime
  const init = useRef(colors).current;
  const matLists = useRef({ body: [], bodyDark: [], accentEmissive: [], accentBasic: [], amber: [] });
  const mats = useMemo(
    () => (kind) => (m) => {
      if (m && !matLists.current[kind].includes(m)) matLists.current[kind].push(m);
    },
    []
  );

  const layoutRef = useRef();
  const scrollRef = useRef();
  const idleRef = useRef();
  const monitorRef = useRef();
  const keyboardRef = useRef();
  const floppyRef = useRef();
  const ledRef = useRef();
  const slotLightRef = useRef();
  const glowRef = useRef();
  const turboRef = useRef();
  const [keyList, keyRef] = useRefList();

  const { state: term, draw } = useTerminalTexture(colors.accent);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  // redraw when the theme accent changes
  useEffect(() => {
    draw();
  }, [draw]);

  /* ── responsive layout: keep the model inside the viewport & below the nav ── */
  const layoutDone = useRef(false);
  useLayoutEffect(() => {
    const g = layoutRef.current;
    if (!g || !size.height) return undefined;
    const fullH = 2 * BASE_CAMERA_Z * Math.tan((CAMERA_FOV * Math.PI) / 360);
    const fullW = fullH * (size.width / size.height);
    const perPx = fullH / size.height;
    // model bounds in its own space: x ±0.85 (monitor), floppy reaches x -1.8, y from -0.7 to 1.05
    let scale;
    let x;
    let y;
    if (isMobile) {
      // fit into the free band between the fixed nav/ticker and the hero text
      const heroInner = document.querySelector('.hero__inner');
      const heroText = heroInner
        ? heroInner.getBoundingClientRect().top - (heroInner.closest('.hero')?.getBoundingClientRect().top ?? 0)
        : 340;
      const bandTop = NAV_SAFE_PX + 6;
      const bandBottom = Math.max(bandTop + 90, heroText - 6);
      const bandH = (bandBottom - bandTop) * perPx;
      scale = Math.min(0.42, bandH / 1.8);
      x = 0.12 * scale; // nudge right so the floppy on the left stays centred as a whole
      const centerPx = (bandTop + bandBottom) / 2;
      y = (size.height / 2 - centerPx) * perPx - 0.17 * scale;
    } else if (isTablet) {
      scale = 0.7;
      x = fullW / 2 - 0.9 * scale - 0.18;
      const maxTop = fullH / 2 - (NAV_SAFE_PX + 34) * perPx;
      y = Math.min(0.8, maxTop - 1.05 * scale);
    } else {
      scale = 0.92;
      x = Math.min(1.7, fullW / 2 - 0.9 * scale - 0.2);
      const maxTop = fullH / 2 - (NAV_SAFE_PX + 16) * perPx;
      y = Math.min(0.15, maxTop - 1.05 * scale);
    }
    if (!layoutDone.current) {
      layoutDone.current = true;
      g.position.set(x, y, 0);
      g.scale.setScalar(scale);
      return undefined;
    }
    const anim = animate(g, { x, y, scale, duration: 700, ease: 'out(3)' });
    return () => anim.cancel();
  }, [isMobile, isTablet, size.width, size.height]);

  /* ── idle motion (anime loops instead of drei Float / useFrame) ── */
  useEffect(() => {
    const idle = idleRef.current;
    const sway = animate(idle, {
      rotateY: [isMobile ? -14 : -30, isMobile ? -2 : -10],
      rotateX: [-2.5, 2.5],
      duration: 4200,
      ease: 'inOutSine',
      loop: true,
      alternate: true,
    });
    const bob = animate(idle, {
      y: [-0.05, 0.05],
      duration: 2700,
      ease: 'inOutSine',
      loop: true,
      alternate: true,
    });
    return () => {
      sway.revert();
      bob.revert();
    };
  }, [isMobile]);

  /* ── boot sequence (runs once, when the preloader is done) ── */
  const booted = useRef(false);
  useEffect(() => {
    const monitor = monitorRef.current;
    const keyboard = keyboardRef.current;
    const floppy = floppyRef.current;
    const led = ledRef.current;
    const slotLight = slotLightRef.current;
    const keys = keyList.current.filter(Boolean);
    const turbo = turboRef.current;

    const hide = () => {
      monitor.scale.setScalar(0);
      monitor.visible = false;
      keyboard.position.y = -1.4;
      keyboard.scale.setScalar(0);
      keyboard.visible = false;
      keys.forEach((k) => k.scale.setScalar(0));
      turbo.scale.setScalar(0);
      floppy.position.set(-4.5, 2.6, 1.2);
      floppy.rotation.set(0.9, -1.2, 0.6);
      floppy.scale.setScalar(0);
      floppy.visible = false;
      led.material.opacity = 0;
      slotLight.material.opacity = 0;
    };

    if (!ready) {
      hide();
      return undefined;
    }
    if (booted.current) return undefined;
    booted.current = true;
    hide();

    let typing;
    let cursor;
    const tl = createTimeline({ defaults: { ease: 'out(3)' } })
      // monitor pops in
      .add(monitor, { scale: [0, 1], duration: 1300, ease: 'outElastic(1, .62)' })
      // keyboard deck slides up from below
      .add(keyboard, { y: [-1.4, -0.62], scale: [0.6, 1], duration: 900, ease: 'out(4)' }, 250)
      // keycaps rise row by row
      .add(
        keys,
        {
          scale: [0, 1],
          y: [-0.1, 0.05],
          duration: 480,
          ease: 'outBack(1.6)',
          delay: stagger(11),
        },
        700
      )
      .add(turbo, { scale: [0, 1], y: [-0.1, 0.055], duration: 500, ease: 'outBack(2)' }, '-=250')
      // power LED comes on, blinks, settles amber
      .add(
        led,
        {
          opacity: [
            { to: 1, duration: 120 },
            { to: 0.15, duration: 140 },
            { to: 1, duration: 120 },
            { to: 0.25, duration: 160 },
            { to: 1, duration: 200 },
          ],
        },
        1200
      )
      .add(slotLight, { opacity: [0, 0.9], duration: 400 }, '<<')
      // floppy flies in, lines up with the drive slot…
      .add(
        floppy,
        {
          scale: [0, 0.5],
          x: FLOPPY_SLOT.x,
          y: FLOPPY_SLOT.y,
          z: 0.95,
          rotateX: FLOPPY_SLOT.rotateX,
          rotateY: FLOPPY_SLOT.rotateY,
          rotateZ: FLOPPY_SLOT.rotateZ,
          duration: 1100,
          ease: 'inOut(3)',
        },
        900
      )
      // …inserts, pauses, ejects…
      .add(floppy, { z: 0.33, duration: 420, ease: 'in(2)' })
      .add(slotLight, { opacity: [0.9, 0.2, 0.9, 0.2, 0.9], duration: 700, ease: 'linear' }, '<<')
      .add(floppy, { z: 0.78, duration: 380, ease: 'out(3)' }, '+=650')
      // …then settles into its floating orbit
      .add(
        floppy,
        {
          x: FLOPPY_ORBIT.x,
          y: FLOPPY_ORBIT.y,
          z: FLOPPY_ORBIT.z,
          rotateX: FLOPPY_ORBIT.rotateX,
          rotateY: FLOPPY_ORBIT.rotateY,
          rotateZ: FLOPPY_ORBIT.rotateZ,
          duration: 1300,
          ease: 'out(4)',
        },
        '-=120'
      )
      // screen glass warms up, then the terminal boots
      .add(glowRef.current, { opacity: [0, 0.07], duration: 700 }, '-=1200')
      .call(() => {
        term.booted = true;
        term.chars = 0;
        drawRef.current();
        typing = animate(term, {
          chars: TOTAL_CHARS,
          duration: TOTAL_CHARS * 55,
          ease: 'linear',
          modifier: utils.round(0),
          onUpdate: () => drawRef.current(),
        });
        cursor = createTimer({
          duration: 480,
          loop: true,
          onLoop: () => {
            term.cursorOn = !term.cursorOn;
            drawRef.current();
          },
        });
      }, '-=900');

    // floppy idle drift once it is in orbit
    let drift;
    tl.then(() => {
      drift = animate(floppy, {
        y: [FLOPPY_ORBIT.y - 0.08, FLOPPY_ORBIT.y + 0.08],
        rotateZ: [FLOPPY_ORBIT.rotateZ - 6, FLOPPY_ORBIT.rotateZ + 6],
        rotateY: [FLOPPY_ORBIT.rotateY - 8, FLOPPY_ORBIT.rotateY + 8],
        duration: 3200,
        ease: 'inOutSine',
        loop: true,
        alternate: true,
      });
    });

    return () => {
      tl.revert();
      typing?.revert();
      cursor?.revert();
      drift?.revert();
      booted.current = false;
      term.booted = false;
    };
  }, [ready, keyList, term]);

  /* ── scroll reaction: rotate / drop / shrink as the hero scrolls out ── */
  useEffect(() => {
    const heroEl = document.getElementById('home') || document.querySelector('.hero');
    if (!heroEl) return undefined;
    const tl = createTimeline({
      defaults: { ease: 'linear', duration: 1000 },
      autoplay: onScroll({
        target: heroEl,
        sync: true,
        // progress 0 while the hero top sits at the window top,
        // 1 when the hero bottom has reached the window top
        enter: 'top top',
        leave: 'top bottom',
        debug: false,
      }),
    })
      .add(scrollRef.current, { rotateY: -35, y: -1.2, scale: 0.8 }, 0)
      .add(camState, { z: BASE_CAMERA_Z + 1.6 }, 0);
    return () => tl.revert();
  }, [camState]);

  /* ── theme change: tween material colors instead of snapping ── */
  const firstTheme = useRef(true);
  useEffect(() => {
    if (firstTheme.current) {
      firstTheme.current = false;
      return undefined;
    }
    const m = matLists.current;
    const anims = [
      animate(m.body, { color: colors.body, duration: 600 }),
      animate(m.bodyDark, { color: colors.bodyDark, duration: 600 }),
      animate(m.accentEmissive, { color: colors.accent, emissive: colors.accent, duration: 600 }),
      animate(m.accentBasic, { color: colors.accent, duration: 600 }),
      animate(m.amber, { color: colors.accent2, duration: 600 }),
    ];
    return () => anims.forEach((a) => a.cancel());
  }, [colors]);

  return (
    <group ref={layoutRef}>
      <group ref={scrollRef}>
        <group ref={idleRef}>
          <group ref={monitorRef}>
            {/* ── CRT monitor shell ── */}
            <mesh position={[0, 0.32, -0.15]}>
              <boxGeometry args={[1.7, 1.35, 1.15]} />
              <meshStandardMaterial ref={mats('body')} color={init.body} roughness={0.55} metalness={0.08} />
            </mesh>
            {/* front bezel */}
            <mesh position={[0, 0.32, 0.44]}>
              <boxGeometry args={[1.58, 1.22, 0.08]} />
              <meshStandardMaterial ref={mats('bodyDark')} color={init.bodyDark} roughness={0.6} />
            </mesh>
            {/* the screen — glowing terminal */}
            <mesh position={[0, 0.36, 0.49]}>
              <planeGeometry args={[1.3, 0.95]} />
              <meshBasicMaterial map={term.texture} toneMapped={false} />
            </mesh>
            {/* screen glass glow */}
            <mesh ref={glowRef} position={[0, 0.36, 0.5]}>
              <planeGeometry args={[1.3, 0.95]} />
              <meshBasicMaterial ref={mats('accentBasic')} color={init.accent} transparent opacity={0} />
            </mesh>
            {/* power LED (amber) */}
            <mesh ref={ledRef} position={[0.62, -0.18, 0.49]}>
              <sphereGeometry args={[0.025, 12, 12]} />
              <meshBasicMaterial ref={mats('amber')} color={init.accent2} transparent opacity={0} />
            </mesh>
            {/* vents on top */}
            {[-0.45, -0.15, 0.15, 0.45].map((x) => (
              <mesh key={x} position={[x, 1.01, -0.3]}>
                <boxGeometry args={[0.2, 0.02, 0.5]} />
                <meshStandardMaterial ref={mats('bodyDark')} color={init.bodyDark} roughness={0.7} />
              </mesh>
            ))}

            {/* ── neck + base with a floppy drive ── */}
            <mesh position={[0, -0.4, -0.15]}>
              <boxGeometry args={[0.55, 0.14, 0.55]} />
              <meshStandardMaterial ref={mats('bodyDark')} color={init.bodyDark} roughness={0.6} />
            </mesh>
            <mesh position={[0, -0.5, -0.1]}>
              <boxGeometry args={[1.1, 0.2, 0.85]} />
              <meshStandardMaterial ref={mats('body')} color={init.body} roughness={0.55} />
            </mesh>
            {/* drive slot */}
            <mesh position={[-0.15, -0.5, 0.33]}>
              <boxGeometry args={[0.56, 0.06, 0.02]} />
              <meshStandardMaterial color="#08080c" roughness={0.9} />
            </mesh>
            {/* drive activity light (amber) */}
            <mesh ref={slotLightRef} position={[0.32, -0.5, 0.33]}>
              <boxGeometry args={[0.07, 0.03, 0.02]} />
              <meshBasicMaterial ref={mats('amber')} color={init.accent2} transparent opacity={0} />
            </mesh>
          </group>

          <Keyboard ref={keyboardRef} init={init} mats={mats} keyRef={keyRef} turboRef={turboRef} />
          <Floppy ref={floppyRef} init={init} mats={mats} />
        </group>
      </group>
    </group>
  );
}

/* ── ambient particle starfield ──────────────────────────── */

function ParticleField({ color, count }) {
  const ref = useRef();
  const matRef = useRef();
  const initColor = useRef(color).current;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, [count]);

  useEffect(() => {
    const spin = animate(ref.current, {
      rotateY: 360,
      rotateX: 144,
      duration: 300000,
      ease: 'linear',
      loop: true,
    });
    return () => spin.revert();
  }, []);

  const firstColor = useRef(true);
  useEffect(() => {
    if (firstColor.current) {
      firstColor.current = false;
      return undefined;
    }
    const a = animate(matRef.current, { color, duration: 600 });
    return () => a.cancel();
  }, [color]);

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        ref={matRef}
        transparent
        color={initColor}
        size={0.018}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

/* ── scene assembly ──────────────────────────────────────── */

function SceneContents({ isMobile, isTablet, isTouch, ready }) {
  const colors = useThemeColors();
  const { accent, bg } = colors;
  const camState = useMemo(() => ({ z: BASE_CAMERA_Z }), []);
  const keyLight = useRef();
  const initAccent = useRef(accent).current;

  const dimAccent = useMemo(
    () => `#${new THREE.Color(accent).lerp(new THREE.Color(bg), 0.4).getHexString()}`,
    [accent, bg]
  );

  const particleCount = useMemo(() => {
    const lowPower =
      typeof navigator !== 'undefined' &&
      typeof navigator.hardwareConcurrency === 'number' &&
      navigator.hardwareConcurrency < 4;
    return isMobile || lowPower ? 800 : 2200;
  }, [isMobile]);

  // tween the accent point light on theme change
  const firstLight = useRef(true);
  useEffect(() => {
    if (firstLight.current) {
      firstLight.current = false;
      return undefined;
    }
    const a = animate(keyLight.current, { color: accent, duration: 600 });
    return () => a.cancel();
  }, [accent]);

  return (
    <>
      <ambientLight intensity={colors.isLight ? 0.75 : 0.5} />
      <directionalLight position={[3, 4, 5]} intensity={colors.isLight ? 1.4 : 1.1} />
      <pointLight ref={keyLight} position={[-3, -2, 2]} intensity={2.2} color={initAccent} />

      <RetroComputer
        colors={colors}
        isMobile={isMobile}
        isTablet={isTablet}
        ready={ready}
        camState={camState}
      />

      {/* tron-style floor, fading into the distance */}
      <Grid
        position={[0, isMobile ? -2.4 : -2, 0]}
        args={[20, 20]}
        cellSize={0.55}
        cellThickness={0.6}
        cellColor={dimAccent}
        sectionSize={2.75}
        sectionThickness={1.1}
        sectionColor={accent}
        fadeDistance={isMobile ? 11 : 16}
        fadeStrength={1.5}
        infiniteGrid
      />

      <ParticleField color={dimAccent} count={particleCount} />
      <CameraRig camState={camState} isTouch={isTouch} />
    </>
  );
}

/* ── root component ──────────────────────────────────────── */

export default function Scene3D({ ready }) {
  const [enabled] = useState(() => supportsWebGL() && !prefersReducedMotion());
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1023px)');
  const isTouch = useMediaQuery('(pointer: coarse)');

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.5]}
          frameloop="always"
          camera={{ position: [0, 0, BASE_CAMERA_Z], fov: CAMERA_FOV }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ background: 'transparent' }}
        >
          <SceneContents
            isMobile={isMobile}
            isTablet={isTablet}
            isTouch={isTouch}
            ready={ready === undefined ? true : ready}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
