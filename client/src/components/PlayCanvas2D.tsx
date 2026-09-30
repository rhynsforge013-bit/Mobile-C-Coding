import { useEffect, useRef } from 'react';
import { parse2D, type DrawCmd2D } from '../lib/graphics';

interface Props {
  stdout: string;
}

export default function PlayCanvas2D({ stdout }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cmds = parse2D(stdout);
    let color = 'white';
    let bg = '#141428';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const cmd of cmds) {
      switch (cmd.type) {
        case 'CLEAR':
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          break;
        case 'BACKGROUND':
          bg = `rgb(${cmd.r},${cmd.g},${cmd.b})`;
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          break;
        case 'COLOR':
          color = `rgb(${cmd.r},${cmd.g},${cmd.b})`;
          break;
        case 'PIXEL':
          ctx.fillStyle = color;
          ctx.fillRect(cmd.x, cmd.y, 2, 2);
          break;
        case 'LINE':
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(cmd.x1, cmd.y1);
          ctx.lineTo(cmd.x2, cmd.y2);
          ctx.stroke();
          break;
        case 'RECT':
          ctx.strokeStyle = color;
          ctx.strokeRect(cmd.x, cmd.y, cmd.w, cmd.h);
          break;
        case 'CIRCLE':
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.arc(cmd.x, cmd.y, cmd.r, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case 'TEXT':
          ctx.fillStyle = color;
          ctx.font = '16px monospace';
          ctx.fillText(cmd.text, cmd.x, cmd.y);
          break;
      }
    }
  }, [stdout]);

  return (
    <div className="play-area">
      <div className="play-label">2D Canvas</div>
      <canvas ref={canvasRef} width={400} height={400} className="play-canvas" />
    </div>
  );
}
