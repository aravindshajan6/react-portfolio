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

/* Reads --scene-accent / --bg from the design tokens and re-reads
   them whenever data-theme flips on <html>. */
function useThemeColors() {
  const read = () => {
    const styles = getComputedStyle(document.documentElement);
    return {
      accent:
        styles.getPropertyValue('--scene-accent').trim() ||
        styles.getPropertyValue('--accent').trim() ||
        '#7c6cff',
      bg: styles.getPropertyValue('--bg').trim() || '#0a0a0f',
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

/* ── gyroscope ring with an orbiting data node ───────────── */

function GyroRing({ radius, tilt, speed, accent, nodeCount = 1 }) {
  const orbit = useRef();

  useFrame((_, dt) => {
    if (orbit.current) orbit.current.rotation.z += dt * speed;
  });

  const nodes = useMemo(
    () =>
      Array.from({ length: nodeCount }, (_, i) => {
        const a = (i / nodeCount) * Math.PI * 2;
        return [Math.cos(a) * radius, Math.sin(a) * radius, 0];
      }),
    [radius, nodeCount]
  );

  return (
    <group rotation={tilt}>
      {/* the ring itself — thin, holographic */}
      <mesh>
        <torusGeometry args={[radius, 0.006, 8, 128]} />
        <meshBasicMaterial color={accent} transparent opacity={0.38} />
      </mesh>

      {/* data nodes travelling along the ring */}
      <group ref={orbit}>
        {nodes.map((p, i) => (
          <group key={i} position={p}>
            <mesh scale={0.055}>
              <octahedronGeometry args={[1, 0]} />
              <meshBasicMaterial color={accent} />
            </mesh>
            {/* halo */}
            <mesh scale={0.11}>
              <sphereGeometry args={[1, 12, 12]} />
              <meshBasicMaterial color={accent} transparent opacity={0.15} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ── dot-matrix sphere (fibonacci distribution) ──────────── */

function DotGlobe({ radius, count, color }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      arr[i * 3] = Math.cos(theta) * r * radius;
      arr[i * 3 + 1] = y * radius;
      arr[i * 3 + 2] = Math.sin(theta) * r * radius;
    }
    return arr;
  }, [radius, count]);

  return (
    <Points positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.028}
        sizeAttenuation
        depthWrite={false}
        opacity={0.9}
      />
    </Points>
  );
}

/* ── the tech core: holo globe + gyroscope rings ─────────── */

function TechCore({ accent, isMobile, isTouch }) {
  const spin = useRef();

  const position = isMobile ? [0, 0.9, 0] : [1.6, 0.1, 0];
  const scale = isMobile ? 0.72 : 1;

  useFrame((_, dt) => {
    if (!spin.current) return;
    // constant slow spin; a touch faster on touch devices where
    // there's no pointer parallax to add life
    spin.current.rotation.y += dt * (isTouch ? 0.22 : 0.12);
  });

  return (
    <group position={position} scale={scale}>
      <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.7}>
        {/* spinning digital globe */}
        <group ref={spin}>
          {/* geodesic wireframe shell */}
          <mesh>
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial color={accent} wireframe transparent opacity={0.42} />
          </mesh>

          {/* dot-matrix surface */}
          <DotGlobe radius={1} count={220} color={accent} />

          {/* glowing reactor core */}
          <mesh scale={0.5}>
            <icosahedronGeometry args={[1, 2]} />
            <meshStandardMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={0.85}
              roughness={0.25}
              metalness={0.7}
              transparent
              opacity={0.92}
            />
          </mesh>

          {/* inner halo */}
          <mesh scale={0.62}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshBasicMaterial color={accent} transparent opacity={0.08} />
          </mesh>
        </group>

        {/* counter-rotating gyroscope rings */}
        <GyroRing radius={1.35} tilt={[Math.PI / 2.15, 0, 0]} speed={0.55} accent={accent} nodeCount={2} />
        <GyroRing radius={1.6} tilt={[Math.PI / 3, 0.6, 0]} speed={-0.4} accent={accent} nodeCount={1} />
        <GyroRing radius={1.85} tilt={[Math.PI / 1.75, -0.5, 0.4]} speed={0.3} accent={accent} nodeCount={1} />
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
  const { accent, bg } = useThemeColors();

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
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <pointLight position={[-3, -2, 2]} intensity={2.5} color={accent} />

      <TechCore accent={accent} isMobile={isMobile} isTouch={isTouch} />

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
