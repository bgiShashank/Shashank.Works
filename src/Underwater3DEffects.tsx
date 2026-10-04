import { useEffect, useRef } from 'react';

interface FloatParticle {
  el: HTMLDivElement;
  x: number;
  y: number;
  speed: number;
  phase: number;
  size: number;
  hue: number;
}

/** Underwater 3D ambient effects: floating light particles, liquid blobs, and depth cues */
export default function Underwater3DEffects() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const container = containerRef.current;
    if (!container) return;

    const particles: FloatParticle[] = [];
    let raf = 0;

    const spawnParticle = (x: number, y: number, size: number, speed: number, hue: number) => {
      const el = document.createElement('div');
      el.className = 'underwater-particle';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.background = `radial-gradient(circle, rgba(168, 213, 255, 0.6) 0%, rgba(123, 179, 232, 0.2) 60%, transparent 100%)`;
      el.style.boxShadow = `0 0 12px rgba(168, 213, 255, 0.3), 0 0 30px rgba(74, 143, 199, 0.15)`;
      el.style.borderRadius = '50%';
      el.style.opacity = '0';
      container.appendChild(el);

      particles.push({ el, x, y, speed, phase: Math.random() * Math.PI * 2, size, hue });
      el.addEventListener('animationend', () => el.remove());
    };

    const spawnBlob = (x: number, y: number, size: number, hue: number) => {
      const el = document.createElement('div');
      el.className = 'underwater-blob';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.background = `radial-gradient(circle, rgba(100, 180, 255, 0.12) 0%, rgba(74, 143, 199, 0.05) 50%, transparent 100%)`;
      el.style.boxShadow = `inset 0 0 40px rgba(123, 179, 232, 0.06), 0 0 20px rgba(123, 179, 232, 0.04)`;
      el.style.borderRadius = '50%';
      el.style.filter = 'blur(6px)';
      container.appendChild(el);
      return el;
    };

    // Spawn floating particles at intervals
    const spawnLoop = () => {
      const now = Date.now();
      const baseDelay = 800 + Math.random() * 1200;

      for (let i = 0; i < 2; i++) {
        const x = Math.random() * container.clientWidth;
        const y = Math.random() * container.clientHeight;
        const size = 2 + Math.random() * 6;
        const speed = 0.5 + Math.random() * 1.5;
        const hue = 180 + Math.random() * 40; // blue tones
        spawnParticle(x, y, size, speed, hue);

        // Also spawn slow-moving liquid blobs occasionally
        if (Math.random() > 0.7) {
          const b = spawnBlob(x, y, 80 + Math.random() * 120, 180 + Math.random() * 30);
          // Animate blob with CSS class for floating
          setTimeout(() => {
            if (b.isConnected) b.classList.add('blob-animate');
          }, 100);
        }
      }

      raf = requestAnimationFrame(spawnLoop);
    };

    // Start spawning after a short delay
    const timer = setTimeout(spawnLoop, 500);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      particles.forEach((p) => p.el.remove());
    };
  }, []);

  return <div className="underwater-container" ref={containerRef} aria-hidden="true" />;
}
