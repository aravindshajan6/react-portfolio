import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Grid, Points, PointMaterial } from '@react-three/drei';

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
function useThemeColors() {
  const read = () => {
    const styles = getComputedStyle(document.documentElement);
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    return {
      accent:
        styles.getPropertyValue('--scene-accent').trim() ||
        styles.getPropertyValue('--accent').trim() ||
        '#7c6cff',
      bg: styles.getPropertyValue('--bg').trim() || '#0a0a0f',
      // retro plastic: charcoal in dark mode, classic beige in light mode
      body: light ? '#d9d2c2' : '#32323e',
      bodyDark: light ? '#b8b0a0' : '#20202a',
      isLight: light,
    };
  };

  const [colors, setColors] = useState(read);

  useEffect(() => {
    const observer = new MutationObserver(() => setColors(read()));
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

/* Normalized pointer tracked on window — the canvas wrapper has
   pointer-events: none, so R3F's own canvas pointer never fires. */
function useWindowPointer() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return pointer;
}

/* ── camera parallax rig ─────────────────────────────────── */

function CameraRig({ pointer, isTouch }) {
  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    if (isTouch) return;
    const t = 1 - Math.pow(0.001, dt);
    state.camera.position.lerp(
      v.set(pointer.current.x * 0.6, pointer.current.y * 0.3, 5),
      t
    );
    state.camera.lookAt(0, 0, 0);
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

function useTerminalTexture(accent) {
  const state = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 2;
    return { canvas, texture, chars: 0, cursorOn: true };
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

      // typed text (reveals `chars` characters across all lines)
      ctx.font = 'bold 26px monospace';
      ctx.fillStyle = accent;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 8;
      let budget = state.chars;
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

function Keyboard({ body, bodyDark, accent }) {
  const keys = useMemo(() => {
    const out = [];
    const rows = 4;
    const cols = 12;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        out.push([-0.66 + c * 0.12 + (r % 2) * 0.03, 0.05, -0.17 + r * 0.115]);
      }
    }
    return out;
  }, []);

  return (
    <group position={[0, -0.62, 1.05]} rotation={[-0.08, 0, 0]}>
      {/* deck */}
      <mesh>
        <boxGeometry args={[1.62, 0.09, 0.62]} />
        <meshStandardMaterial color={body} roughness={0.55} metalness={0.1} />
      </mesh>
      {/* key caps */}
      {keys.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.095, 0.05, 0.095]} />
          <meshStandardMaterial color={bodyDark} roughness={0.6} />
        </mesh>
      ))}
      {/* space bar */}
      <mesh position={[0, 0.05, 0.29]}>
        <boxGeometry args={[0.62, 0.05, 0.09]} />
        <meshStandardMaterial color={bodyDark} roughness={0.6} />
      </mesh>
      {/* one accent key, because every rig needs a turbo button */}
      <mesh position={[0.66, 0.055, 0.29]}>
        <boxGeometry args={[0.095, 0.055, 0.09]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

/* ── floppy disk drifting alongside ──────────────────────── */

function Floppy({ bodyDark, accent }) {
  return (
    <Float speed={2.2} rotationIntensity={1.1} floatIntensity={1.6}>
      <group position={[-1.55, 0.75, 0.4]} rotation={[0.3, 0.5, -0.15]} scale={0.5}>
        <mesh>
          <boxGeometry args={[1, 1, 0.06]} />
          <meshStandardMaterial color={bodyDark} roughness={0.5} />
        </mesh>
        {/* shutter */}
        <mesh position={[0.05, 0.34, 0.035]}>
          <boxGeometry args={[0.55, 0.3, 0.02]} />
          <meshStandardMaterial color="#8a8a94" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* label */}
        <mesh position={[0, -0.22, 0.035]}>
          <boxGeometry args={[0.7, 0.42, 0.02]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.25} />
        </mesh>
      </group>
    </Float>
  );
}

/* ── the retro computer ──────────────────────────────────── */

function RetroComputer({ colors, isMobile, isTouch }) {
  const { accent, body, bodyDark } = colors;
  const spin = useRef();
  const { state, draw } = useTerminalTexture(accent);
  const totalChars = useMemo(
    () => TERMINAL_LINES.reduce((n, l) => n + (l.length || 1), 0),
    []
  );

  const position = isMobile ? [0, 0.95, 0] : [1.7, 0.15, 0];
  const scale = isMobile ? 0.62 : 0.92;

  // redraw when the theme accent changes
  useEffect(() => {
    draw();
  }, [draw]);

  useFrame((clockState, dt) => {
    const t = clockState.clock.elapsedTime;

    if (spin.current) {
      if (isTouch) {
        spin.current.rotation.y += dt * 0.25;
      } else {
        // gentle idle sway facing the viewer
        spin.current.rotation.y = -0.35 + Math.sin(t * 0.4) * 0.16;
        spin.current.rotation.x = Math.sin(t * 0.3) * 0.05;
      }
    }

    // type on the terminal (~18 chars/sec), blink cursor at 2Hz
    const typed = Math.min(totalChars, Math.floor(t * 18));
    const cursorOn = Math.floor(t * 2) % 2 === 0;
    if (typed !== state.chars || cursorOn !== state.cursorOn) {
      state.chars = typed;
      state.cursorOn = cursorOn;
      draw();
    }
  });

  return (
    <group position={position} scale={scale}>
      <Float speed={1.5} rotationIntensity={0.18} floatIntensity={0.55}>
        <group ref={spin}>
          {/* ── CRT monitor shell ── */}
          <mesh position={[0, 0.32, -0.15]}>
            <boxGeometry args={[1.7, 1.35, 1.15]} />
            <meshStandardMaterial color={body} roughness={0.55} metalness={0.08} />
          </mesh>
          {/* front bezel */}
          <mesh position={[0, 0.32, 0.44]}>
            <boxGeometry args={[1.58, 1.22, 0.08]} />
            <meshStandardMaterial color={bodyDark} roughness={0.6} />
          </mesh>
          {/* the screen — glowing terminal */}
          <mesh position={[0, 0.36, 0.49]}>
            <planeGeometry args={[1.3, 0.95]} />
            <meshBasicMaterial map={state.texture} toneMapped={false} />
          </mesh>
          {/* screen glass glow */}
          <mesh position={[0, 0.36, 0.5]}>
            <planeGeometry args={[1.3, 0.95]} />
            <meshBasicMaterial color={accent} transparent opacity={0.05} />
          </mesh>
          {/* power LED */}
          <mesh position={[0.62, -0.18, 0.49]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshBasicMaterial color={accent} />
          </mesh>
          {/* vents on top */}
          {[-0.45, -0.15, 0.15, 0.45].map((x) => (
            <mesh key={x} position={[x, 1.01, -0.3]}>
              <boxGeometry args={[0.2, 0.02, 0.5]} />
              <meshStandardMaterial color={bodyDark} roughness={0.7} />
            </mesh>
          ))}

          {/* ── neck + base ── */}
          <mesh position={[0, -0.42, -0.15]}>
            <boxGeometry args={[0.55, 0.16, 0.55]} />
            <meshStandardMaterial color={bodyDark} roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.54, -0.1]}>
            <boxGeometry args={[1.0, 0.1, 0.8]} />
            <meshStandardMaterial color={body} roughness={0.55} />
          </mesh>

          {/* ── keyboard ── */}
          <Keyboard body={body} bodyDark={bodyDark} accent={accent} />
        </group>

        <Floppy bodyDark={bodyDark} accent={accent} />
      </Float>
    </group>
  );
}

/* ── ambient particle starfield ──────────────────────────── */

function ParticleField({ color, count }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, [count]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.02;
    ref.current.rotation.x += dt * 0.008;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.018}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

/* ── scene assembly ──────────────────────────────────────── */

function SceneContents({ isMobile, isTouch, pointer }) {
  const colors = useThemeColors();
  const { accent, bg } = colors;

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

  return (
    <>
      <ambientLight intensity={colors.isLight ? 0.75 : 0.5} />
      <directionalLight position={[3, 4, 5]} intensity={colors.isLight ? 1.4 : 1.1} />
      <pointLight position={[-3, -2, 2]} intensity={2.2} color={accent} />

      <RetroComputer colors={colors} isMobile={isMobile} isTouch={isTouch} />

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
      <CameraRig pointer={pointer} isTouch={isTouch} />
    </>
  );
}

/* ── root component ──────────────────────────────────────── */

export default function Scene3D() {
  const [enabled] = useState(() => supportsWebGL() && !prefersReducedMotion());
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTouch = useMediaQuery('(pointer: coarse)');
  const pointer = useWindowPointer();

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
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ background: 'transparent' }}
        >
          <SceneContents isMobile={isMobile} isTouch={isTouch} pointer={pointer} />
        </Canvas>
      </Suspense>
    </div>
  );
}
