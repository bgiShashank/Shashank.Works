import { useMemo } from 'react';
import type { CSSProperties } from 'react';

type Particle = {
  left: number;
  size: number;
  color: string;
  driftX: number;
  opacity: number;
  duration: number;
  delay: number;
};

// Same three motes the reference theme spawns.
const PARTICLE_COLORS = [
  'rgba(139, 92, 246, 0.5)',
  'rgba(34, 211, 238, 0.4)',
  'rgba(147, 197, 253, 0.3)',
];

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => {
    const size = Math.random() * 4 + 1;
    return {
      left: Math.random() * 100,
      size,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      driftX: (Math.random() - 0.5) * 200,
      opacity: Math.random() * 0.4 + 0.2,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 20,
    };
  });
}

/**
 * Slow motes drifting up the backdrop, seeded once. The travel itself is pure
 * CSS (`particleDrift`), so nothing runs per frame in JS.
 */
function Particles() {
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
  // The reference draws fewer motes on phones.
  const particles = useMemo(
    () => makeParticles(window.innerWidth <= 768 ? 12 : 30),
    []
  );

  if (reducedMotion) return null;

  return (
    <>
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={
            {
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              bottom: '-10px',
              background: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              '--drift-x': `${p.driftX}px`,
              '--drift-y': 'calc(-100vh - 100px)',
              '--particle-opacity': `${p.opacity}`,
              animation: `particleDrift ${p.duration}s linear ${p.delay}s infinite`,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}

/**
 * Fixed background layers, mirroring the reference theme: a violet/cyan glow
 * gradient, a faint 60px grid, three slow-drifting blurred orbs, a whisper of
 * noise and the rising motes. Decorative only — the canvas is
 * pointer-events: none and sits at z-index 0, under `.container` (z-index 1).
 */
export default function Backdrop() {
  return (
    <div className="bg-canvas" aria-hidden="true">
      <div className="bg-layer bg-gradient-base" />
      <div className="bg-layer bg-grid" />
      <div className="bg-layer">
        <span className="bg-orb bg-orb-1" />
        <span className="bg-orb bg-orb-2" />
        <span className="bg-orb bg-orb-3" />
      </div>
      <div className="bg-layer bg-noise" />
      <Particles />
    </div>
  );
}
