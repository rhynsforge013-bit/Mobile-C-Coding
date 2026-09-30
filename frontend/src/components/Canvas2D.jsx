import { useEffect, useRef } from 'react';

export default function Canvas2D({ commands }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let color = { r: 1, g: 1, b: 1, a: 1 };

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const cmd of commands) {
      const rgba = `rgba(${Math.round(color.r * 255)},${Math.round(color.g * 255)},${Math.round(color.b * 255)},${color.a})`;

      switch (cmd.cmd) {
        case 'clear':
          ctx.fillStyle = `rgb(${Math.round(cmd.r * 255)},${Math.round(cmd.g * 255)},${Math.round(cmd.b * 255)})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          break;
        case 'color':
          color = { r: cmd.r, g: cmd.g, b: cmd.b, a: cmd.a ?? 1 };
          break;
        case 'circle':
          ctx.fillStyle = rgba;
          ctx.beginPath();
          ctx.arc(cmd.x, cmd.y, cmd.r, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'rect':
          ctx.fillStyle = rgba;
          ctx.fillRect(cmd.x, cmd.y, cmd.w, cmd.h);
          break;
        case 'line':
          ctx.strokeStyle = rgba;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cmd.x1, cmd.y1);
          ctx.lineTo(cmd.x2, cmd.y2);
          ctx.stroke();
          break;
        case 'point':
          ctx.fillStyle = rgba;
          ctx.beginPath();
          ctx.arc(cmd.x, cmd.y, cmd.s, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'text':
          ctx.fillStyle = rgba;
          ctx.font = `${cmd.s}px monospace`;
          ctx.fillText(cmd.t, cmd.x, cmd.y);
          break;
        default:
          break;
      }
    }
  }, [commands]);

  return (
    <div className="canvas-wrap">
      <canvas ref={canvasRef} width={400} height={400} className="graphics-canvas" />
    </div>
  );
}
