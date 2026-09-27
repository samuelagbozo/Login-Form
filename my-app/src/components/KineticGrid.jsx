import { useEffect, useRef } from 'react';

const spacing = 42;

export default function KineticGrid({ children }) {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: -1000, y: -1000 });
  const ripplesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frameId;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (time) => {
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      const pointer = pointerRef.current;
      const ripples = ripplesRef.current;

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
        context.strokeStyle = 'rgba(85, 142, 255, 0.17)';
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
        context.strokeStyle = 'rgba(85, 142, 255, 0.17)';
        context.stroke();
      }

      ripplesRef.current = ripples.filter((ripple) => time - ripple.started < 1300);
      if (!reducedMotion || ripplesRef.current.length) frameId = requestAnimationFrame(draw);
    };

    resize();
    frameId = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const updatePointer = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerRef.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  };

  const addRipple = (event) => {
    updatePointer(event);
    const bounds = event.currentTarget.getBoundingClientRect();
    ripplesRef.current.push({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      started: performance.now(),
      radius: 0,
    });
    ripplesRef.current = ripplesRef.current.slice(-4);
  };

  return (
    <main className="kinetic-grid" onPointerMove={updatePointer} onPointerLeave={() => { pointerRef.current = { x: -1000, y: -1000 }; }} onClick={addRipple}>
      <canvas ref={canvasRef} className="kinetic-grid__canvas" aria-hidden="true" />
      <div className="kinetic-grid__content">{children}</div>
    </main>
  );
}
