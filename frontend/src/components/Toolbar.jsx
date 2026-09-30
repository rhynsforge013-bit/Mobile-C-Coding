export default function Toolbar({ mode, onModeChange, onRun, running }) {
  return (
    <div className="toolbar">
      <div className="mode-toggle">
        <button
          className={mode === '2d' ? 'mode-btn active' : 'mode-btn'}
          onClick={() => onModeChange('2d')}
        >
          2D
        </button>
        <button
          className={mode === '3d' ? 'mode-btn active' : 'mode-btn'}
          onClick={() => onModeChange('3d')}
        >
          3D
        </button>
      </div>
      <h1 className="app-title">Mobile C++</h1>
      <button className="run-btn" onClick={onRun} disabled={running}>
        {running ? 'Running…' : '▶ Run'}
      </button>
    </div>
  );
}
