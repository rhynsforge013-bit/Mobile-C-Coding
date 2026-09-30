import Canvas2D from './Canvas2D.jsx';
import Canvas3D from './Canvas3D.jsx';

export default function GraphicsView({ commands, mode }) {
  return (
    <div className="graphics-view">
      {mode === '3d' ? (
        <Canvas3D commands={commands} />
      ) : (
        <Canvas2D commands={commands} />
      )}
    </div>
  );
}
