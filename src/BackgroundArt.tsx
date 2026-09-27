import { useEffect, useRef } from 'react';

type DoodleKind =
  | 'star4'
  | 'star5'
  | 'dots'
  | 'moon'
  | 'planet'
  | 'cloud'
  | 'squiggle'
  | 'zigzag'
  | 'burst'
  | 'orbit'
  | 'heart'
  | 'plus';

interface DoodleDef {
  /** horizontal position in % of the viewport width */
  x: number;
  /** vertical position in % of the viewport height */
  y: number;
  /** rendered size in px */
  size: number;
  kind: DoodleKind;
  anim: 'twinkle' | 'bob' | 'spin' | 'dash';
}

// Far layer: small, faint, slow parallax.
const FAR_DOODLES: DoodleDef[] = [
  { x: 8, y: 12, size: 30, kind: 'star4', anim: 'twinkle' },
  { x: 38, y: 7, size: 34, kind: 'star5', anim: 'bob' },
  { x: 70, y: 11, size: 26, kind: 'plus', anim: 'twinkle' },
  { x: 22, y: 34, size: 56, kind: 'squiggle', anim: 'dash' },
  { x: 60, y: 30, size: 34, kind: 'dots', anim: 'twinkle' },
  { x: 88, y: 38, size: 44, kind: 'moon', anim: 'bob' },
  { x: 14, y: 58, size: 28, kind: 'star4', anim: 'twinkle' },
  { x: 45, y: 62, size: 52, kind: 'zigzag', anim: 'bob' },
  { x: 78, y: 70, size: 36, kind: 'burst', anim: 'spin' },
  { x: 93, y: 88, size: 30, kind: 'star5', anim: 'twinkle' },
  { x: 33, y: 85, size: 30, kind: 'dots', anim: 'twinkle' },
  { x: 55, y: 45, size: 24, kind: 'plus', anim: 'twinkle' },
];

// Near layer: bigger, brighter, faster parallax -> sense of depth.
const NEAR_DOODLES: DoodleDef[] = [
  { x: 18, y: 22, size: 62, kind: 'planet', anim: 'spin' },
  { x: 52, y: 16, size: 64, kind: 'cloud', anim: 'bob' },
  { x: 82, y: 20, size: 56, kind: 'moon', anim: 'bob' },
  { x: 35, y: 40, size: 58, kind: 'star4', anim: 'twinkle' },
  { x: 68, y: 48, size: 48, kind: 'heart', anim: 'bob' },
  { x: 10, y: 72, size: 64, kind: 'squiggle', anim: 'dash' },
  { x: 48, y: 78, size: 54, kind: 'star5', anim: 'twinkle' },
  { x: 88, y: 74, size: 60, kind: 'orbit', anim: 'spin' },
  { x: 62, y: 60, size: 36, kind: 'dots', anim: 'twinkle' },
  { x: 28, y: 90, size: 44, kind: 'burst', anim: 'twinkle' },
  { x: 92, y: 52, size: 30, kind: 'plus', anim: 'twinkle' },
  { x: 5, y: 44, size: 36, kind: 'star4', anim: 'twinkle' },
];

function DoodleShape({ kind }: { kind: DoodleKind }) {
  switch (kind) {
    case 'star4':
      return (
        <path
          d="M0 -16 C1.8 -5.5 5.5 -1.8 16 0 C5.5 1.8 1.8 5.5 0 16 C-1.8 5.5 -5.5 1.8 -16 0 C-5.5 -1.8 -1.8 -5.5 0 -16 Z"
          fill="rgba(123,179,232,0.30)"
          stroke="rgba(168,213,255,0.75)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );
    case 'star5':
      return (
        <path
          d="M0 -18 L5.3 -5.6 L18 -5.6 L7.3 2.2 L10.6 14.6 L0 7.2 L-10.6 14.6 L-7.3 2.2 L-18 -5.6 L-5.3 -5.6 Z"
          fill="rgba(74,143,199,0.18)"
          stroke="rgba(123,179,232,0.7)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );
    case 'dots':
      return (
        <g fill="rgba(168,213,255,0.55)">
          <circle r="3" />
          <circle cx="-16" cy="-8" r="2" />
          <circle cx="14" cy="-12" r="2.4" />
          <circle cx="10" cy="12" r="1.8" />
        </g>
      );
    case 'moon':
      return (
        <path
          d="M9 -13 A14.5 14.5 0 1 0 9 13 A11.5 11.5 0 1 1 9 -13 Z"
          fill="rgba(74,143,199,0.16)"
          stroke="rgba(150,205,255,0.7)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );
    case 'planet':
      return (
        <g>
          <circle r="11" fill="rgba(74,143,199,0.15)" stroke="rgba(150,205,255,0.7)" strokeWidth="2" />
          <ellipse rx="19" ry="5.5" fill="none" stroke="rgba(123,179,232,0.55)" strokeWidth="1.8" transform="rotate(-18)" />
        </g>
      );
    case 'cloud':
      return (
        <path
          d="M-16 6 A7.5 7.5 0 0 1 -9 -5 A10 10 0 0 1 8 -8 A7.5 7.5 0 0 1 16 6 Z"
          fill="rgba(74,143,199,0.12)"
          stroke="rgba(150,205,255,0.65)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      );
    case 'squiggle':
      return (
        <path
          className="d-dash"
          d="M-22 0 Q-14 -11 -6 0 T10 0 T26 0"
          fill="none"
          stroke="rgba(123,179,232,0.7)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="5 8"
        />
      );
    case 'zigzag':
      return (
        <path
          d="M-18 7 L-7 -7 L0 7 L7 -7 L18 7"
          fill="none"
          stroke="rgba(168,213,255,0.6)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case 'burst':
      return (
        <path
          d="M0 -15 V15 M-13 -7.5 L13 7.5 M-13 7.5 L13 -7.5"
          stroke="rgba(123,179,232,0.65)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      );
    case 'orbit':
      return (
        <g>
          <circle r="13" fill="none" stroke="rgba(123,179,232,0.5)" strokeWidth="1.6" strokeDasharray="4 7" />
          <circle cx="13" cy="0" r="3" fill="rgba(168,213,255,0.75)" />
        </g>
      );
    case 'heart':
      return (
        <path
          d="M0 10 C-13 0 -11 -14 0 -7 C11 -14 13 0 0 10 Z"
          fill="rgba(74,143,199,0.16)"
          stroke="rgba(150,205,255,0.65)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );
    case 'plus':
      return <path d="M0 -11 V11 M-11 0 H11" stroke="rgba(168,213,255,0.6)" strokeWidth="2.6" strokeLinecap="round" />;
    default:
      return null;
  }
}

function DoodleTile({ doodles }: { doodles: DoodleDef[] }) {
  return (
    <>
      {doodles.map((d, i) => (
        <span
          key={`${d.kind}-${i}`}
          className={`bg-doodle d-${d.anim}`}
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            animationDelay: `${((i * 0.73) % 4).toFixed(2)}s`,
          }}
        >
          <svg viewBox="-24 -24 48 48" aria-hidden="true" focusable="false">
            <DoodleShape kind={d.kind} />
          </svg>
        </span>
      ))}
    </>
  );
}

const TILE_SLOTS = [0, 1, 2];

export default function BackgroundArt() {
  const farRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);

  // Parallax: each layer drifts at a different rate and loops over a span of
  // two viewport heights, so the doodle field keeps flowing no matter how long
  // the page is.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let lastY = -1;
    const layers: [React.RefObject<HTMLDivElement>, number][] = [
      [farRef, 0.05],
      [nearRef, 0.14],
    ];
    const loop = () => {
      const y = window.scrollY;
      if (y !== lastY) {
        lastY = y;
        const span = window.innerHeight * 2;
        for (const [ref, speed] of layers) {
          const el = ref.current;
          if (!el) continue;
          const t = -((y * speed) % span);
          el.style.transform = `translate3d(0, ${t.toFixed(1)}px, 0)`;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="bg-art" aria-hidden="true">
      <div className="bg-art-track bg-art-far" ref={farRef}>
        {TILE_SLOTS.map((i) => (
          <div key={i} className="bg-art-tile" style={{ top: `${(i * 100) / 3}%` }}>
            <DoodleTile doodles={FAR_DOODLES} />
          </div>
        ))}
      </div>
      <div className="bg-art-track bg-art-near" ref={nearRef}>
        {TILE_SLOTS.map((i) => (
          <div key={i} className="bg-art-tile" style={{ top: `${(i * 100) / 3}%` }}>
            <DoodleTile doodles={NEAR_DOODLES} />
          </div>
        ))}
      </div>
    </div>
  );
}
