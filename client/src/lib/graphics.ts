// Graphics protocol: C++ programs output line-based commands to stdout.
// The frontend parses them and renders on a 2D canvas or 3D scene.

export type DrawCmd2D =
  | { type: 'CLEAR' }
  | { type: 'COLOR'; r: number; g: number; b: number }
  | { type: 'BACKGROUND'; r: number; g: number; b: number }
  | { type: 'PIXEL'; x: number; y: number }
  | { type: 'LINE'; x1: number; y1: number; x2: number; y2: number }
  | { type: 'RECT'; x: number; y: number; w: number; h: number }
  | { type: 'CIRCLE'; x: number; y: number; r: number }
  | { type: 'TEXT'; x: number; y: number; text: string };

export type DrawCmd3D =
  | { type: 'CLEAR' }
  | { type: 'COLOR'; r: number; g: number; b: number }
  | { type: 'CUBE'; x: number; y: number; z: number; size: number }
  | { type: 'SPHERE'; x: number; y: number; z: number; r: number }
  | { type: 'CAMERA'; x: number; y: number; z: number; lx: number; ly: number; lz: number };

function parseColor(parts: string[]): { r: number; g: number; b: number } {
  return {
    r: parseInt(parts[0]) || 0,
    g: parseInt(parts[1]) || 0,
    b: parseInt(parts[2]) || 0,
  };
}

export function parse2D(stdout: string): DrawCmd2D[] {
  const cmds: DrawCmd2D[] = [];
  for (const line of stdout.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toUpperCase();
    const args = parts.slice(1);
    switch (cmd) {
      case 'CLEAR': cmds.push({ type: 'CLEAR' }); break;
      case 'COLOR': cmds.push({ type: 'COLOR', ...parseColor(args) }); break;
      case 'BACKGROUND': cmds.push({ type: 'BACKGROUND', ...parseColor(args) }); break;
      case 'PIXEL': cmds.push({ type: 'PIXEL', x: +args[0] || 0, y: +args[1] || 0 }); break;
      case 'LINE': cmds.push({ type: 'LINE', x1: +args[0] || 0, y1: +args[1] || 0, x2: +args[2] || 0, y2: +args[3] || 0 }); break;
      case 'RECT': cmds.push({ type: 'RECT', x: +args[0] || 0, y: +args[1] || 0, w: +args[2] || 0, h: +args[3] || 0 }); break;
      case 'CIRCLE': cmds.push({ type: 'CIRCLE', x: +args[0] || 0, y: +args[1] || 0, r: +args[2] || 0 }); break;
      case 'TEXT': cmds.push({ type: 'TEXT', x: +args[0] || 0, y: +args[1] || 0, text: args.slice(2).join(' ') }); break;
      default: break;
    }
  }
  return cmds;
}

export function parse3D(stdout: string): DrawCmd3D[] {
  const cmds: DrawCmd3D[] = [];
  for (const line of stdout.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toUpperCase();
    const args = parts.slice(1);
    switch (cmd) {
      case 'CLEAR': cmds.push({ type: 'CLEAR' }); break;
      case 'COLOR': cmds.push({ type: 'COLOR', ...parseColor(args) }); break;
      case 'CUBE': cmds.push({ type: 'CUBE', x: +args[0] || 0, y: +args[1] || 0, z: +args[2] || 0, size: +args[3] || 1 }); break;
      case 'SPHERE': cmds.push({ type: 'SPHERE', x: +args[0] || 0, y: +args[1] || 0, z: +args[2] || 0, r: +args[3] || 1 }); break;
      case 'CAMERA': cmds.push({ type: 'CAMERA', x: +args[0] || 0, y: +args[1] || 0, z: +args[2] || 0, lx: +args[3] || 0, ly: +args[4] || 0, lz: +args[5] || 0 }); break;
      default: break;
    }
  }
  return cmds;
}
