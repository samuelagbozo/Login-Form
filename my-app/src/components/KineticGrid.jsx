import { useEffect, useRef } from 'react';

const spacing = 42;

export default function KineticGrid({ theme = 'dark' }) {
  const fieldRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const field = fieldRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = { x: -1000, y: -1000 };
    let ripples = [];
    let frameId = 0;
    let width = 1;
    let height = 1;
    let pixelRatio = 1;

    const draw = (time) => {
      frameId = 0;
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;

      for (let x = 0; x <= width + spacing; x += spacing) {
        context.beginPath();
        for (let y = 0; y <= height; y += 8) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.hypot(dx, dy);
          let offsetX = distance < 190 ? (dx / (distance || 1)) * (1 - distance / 190) * -18 : 0;
          let offsetY = distance < 190 ? (dy / (distance || 1)) * (1 - distance / 190) * -18 : 0;

          for (const ripple of ripples) {
            const rippleDistance = Math.hypot(x - ripple.x, y - ripple.y);
            const rippleRadius = (time - ripple.started) * 0.42;
            const wave = Math.max(0, 1 - Math.abs(rippleDistance - rippleRadius) / 46);
            const displacement = Math.sin((rippleDistance - rippleRadius) / 7) * wave * 7;
            offsetX += ((x - ripple.x) / (rippleDistance || 1)) * displacement;
            offsetY += ((y - ripple.y) / (rippleDistance || 1)) * displacement;
          }

          const px = x + offsetX;
          const py = y + offsetY;
          if (y === 0) context.moveTo(px, py);
          else context.lineTo(px, py);
        }
        context.strokeStyle = theme === 'light' ? 'rgba(191, 219, 254, 0.24)' : 'rgba(160, 198, 255, 0.24)';
        context.stroke();
      }

      for (let y = 0; y <= height + spacing; y += spacing) {
        context.beginPath();
        for (let x = 0; x <= width; x += 8) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.hypot(dx, dy);
          let offsetX = distance < 190 ? (dx / (distance || 1)) * (1 - distance / 190) * -18 : 0;
          let offsetY = distance < 190 ? (dy / (distance || 1)) * (1 - distance / 190) * -18 : 0;

          for (const ripple of ripples) {
            const rippleDistance = Math.hypot(x - ripple.x, y - ripple.y);
            const rippleRadius = (time - ripple.started) * 0.42;
            const wave = Math.max(0, 1 - Math.abs(rippleDistance - rippleRadius) / 46);
            const displacement = Math.sin((rippleDistance - rippleRadius) / 7) * wave * 7;
            offsetX += ((x - ripple.x) / (rippleDistance || 1)) * displacement;
            offsetY += ((y - ripple.y) / (rippleDistance || 1)) * displacement;
          }

          const px = x + offsetX;
          const py = y + offsetY;
          if (x === 0) context.moveTo(px, py);
          else context.lineTo(px, py);
        }
        context.strokeStyle = theme === 'light' ? 'rgba(191, 219, 254, 0.24)' : 'rgba(160, 198, 255, 0.24)';
        context.stroke();
      }

      ripples = ripples.filter((ripple) => time - ripple.started < 1300);
      if (!motion.matches && !document.hidden) frameId = requestAnimationFrame(draw);
    };

    const schedule = () => {
      if (!frameId) frameId = requestAnimationFrame(draw);
    };

    const resize = () => {
      const bounds = field.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      schedule();
    };

    const updatePointer = (event) => {
      const bounds = field.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      schedule();
    };

    const addRipple = (event) => {
      updatePointer(event);
      const bounds = field.getBoundingClientRect();
      ripples.push({ x: event.clientX - bounds.left, y: event.clientY - bounds.top, started: performance.now() });
      ripples = ripples.slice(-4);
      schedule();
    };

    const handleVisibility = () => {
      if (document.hidden) cancelAnimationFrame(frameId);
      else schedule();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(field);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('click', addRipple);
    document.addEventListener('visibilitychange', handleVisibility);
    motion.addEventListener('change', schedule);
    resize();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('click', addRipple);
      document.removeEventListener('visibilitychange', handleVisibility);
      motion.removeEventListener('change', schedule);
    };
  }, [theme]);

  return (
    <div ref={fieldRef} className={`kinetic-grid kinetic-grid--${theme}`} aria-hidden="true">
      <canvas ref={canvasRef} className="kinetic-grid__canvas" />
    </div>
  );
}
