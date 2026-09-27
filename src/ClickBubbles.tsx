import { useEffect, useRef } from 'react';

interface Bubble {
  el: HTMLSpanElement;
  x: number;
  y: number;
  born: number;
  life: number;
  dx: number;
  dy: number;
  size: number;
}

const BUBBLE_HUES = ['168, 213, 255', '123, 179, 232', '74, 143, 199', '255, 255, 255'];
const MAX_BUBBLES = 120;

export default function ClickBubbles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const bubbles: Bubble[] = [];
    let raf = 0;

    const tick = () => {
      const now = performance.now();
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        const t = (now - b.born) / b.life;
        if (t >= 1) {
          b.el.remove();
          bubbles.splice(i, 1);
          continue;
        }
        const dx = b.dx * t;
        const dy = b.dy * t - 26 * t * t; // gentle upward drift
        const scale = 0.35 + 0.65 * Math.sin(Math.PI * Math.min(t, 1));
        b.el.style.transform = `translate3d(${(b.x + dx).toFixed(1)}px, ${(b.y + dy).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        b.el.style.opacity = String(1 - t * t);
      }
      raf = requestAnimationFrame(tick);
    };

    const spawn = (x: number, y: number) => {
      const count = 6 + Math.floor(Math.random() * 3); // 6-8 bubbles per click
      for (let i = 0; i < count; i++) {
        if (bubbles.length >= MAX_BUBBLES) break;
        const hue = BUBBLE_HUES[i % BUBBLE_HUES.length];
        const size = 8 + Math.random() * 22;
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
        const speed = 40 + Math.random() * 70;
        const el = document.createElement('span');
        el.className = 'click-bubble';
        el.style.width = `${size.toFixed(1)}px`;
        el.style.height = `${size.toFixed(1)}px`;
        el.style.background = `radial-gradient(circle at 32% 30%, rgba(255,255,255,0.85) 0%, rgba(${hue},0.45) 34%, rgba(${hue},0.12) 68%, rgba(${hue},0.05) 100%)`;
        el.style.boxShadow = `inset 0 1px 1px rgba(255,255,255,0.7), 0 0 12px rgba(${hue},0.35)`;
        container.appendChild(el);
        bubbles.push({
          el,
          x,
          y,
          born: performance.now(),
          life: 620 + Math.random() * 320,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed - 24,
          size,
        });
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onPointerDown = (e: PointerEvent) => {
      spawn(e.clientX, e.clientY);
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointerdown', onPointerDown);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      cancelAnimationFrame(raf);
      bubbles.forEach((b) => b.el.remove());
    };
  }, []);

  return <div className="click-bubbles" aria-hidden="true" ref={containerRef} />;
}
