import { useEffect, useRef } from 'react';

/**
 * Custom cursor: an instant glow dot plus a slower trailing glass ring that
 * swells over interactive elements. Desktop (fine pointer) only — the native
 * cursor is kept on touch devices, and CSS hides the native pointer only once
 * this component signals that it is active (body.has-custom-cursor).
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add('has-custom-cursor');

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let dotX = targetX;
    let dotY = targetY;
    let ringX = targetX;
    let ringY = targetY;
    let shown = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!shown) {
        shown = true;
        dotX = ringX = targetX;
        dotY = ringY = targetY;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
      const el = e.target as Element | null;
      const interactive = el?.closest?.(
        'a, button, input, textarea, select, label, [role="button"], .toggle-switch, .work-item, .skill-card, .software-card, .web-project-card, .nav-link, .contact-btn'
      );
      ring.classList.toggle('cursor-ring--active', Boolean(interactive));
    };

    const onLeave = () => {
      shown = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const loop = () => {
      dotX += (targetX - dotX) * 0.55;
      dotY += (targetY - dotY) * 0.55;
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      dot.style.transform = `translate3d(${dotX.toFixed(1)}px, ${dotY.toFixed(1)}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" aria-hidden="true" ref={dotRef} />
      <div className="cursor-ring" aria-hidden="true" ref={ringRef} />
    </>
  );
}
