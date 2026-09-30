import { useState, useCallback } from 'react';
import CodeEditor from './components/CodeEditor.jsx';
import OutputPanel from './components/OutputPanel.jsx';
import GraphicsView from './components/GraphicsView.jsx';
import Toolbar from './components/Toolbar.jsx';
import { compileCode } from './api.js';
import { defaultCode2D, defaultCode3D } from './examples.js';
import './styles.css';

export default function App() {
  const [code, setCode] = useState(defaultCode2D);
  const [mode, setMode] = useState('2d');
  const [output, setOutput] = useState('');
  const [graphics, setGraphics] = useState([]);
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);

  const handleRun = useCallback(async () => {
    setRunning(true);
    setError('');
    setOutput('');
    setGraphics([]);
    try {
      const result = await compileCode(code);
      if (!result.success) {
        setError(result.compileError || 'Compilation failed');
      } else {
        setOutput(result.output || '');
        if (result.timedOut) {
          setError('Execution timed out (5s limit)');
        }
        const cmds = (result.graphics || '')
          .split('\n')
          .filter((l) => l.trim())
          .map((l) => {
            try {
              return JSON.parse(l);
            } catch {
              return null;
            }
          })
          .filter((c) => c !== null);
        setGraphics(cmds);
      }
    } catch (e) {
      setError('Network error: ' + e.message);
    }
    setRunning(false);
  }, [code]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === '3d' && code === defaultCode2D) {
      setCode(defaultCode3D);
    } else if (newMode === '2d' && code === defaultCode3D) {
      setCode(defaultCode2D);
    }
  };

  return (
    <div className="app">
      <Toolbar mode={mode} onModeChange={handleModeChange} onRun={handleRun} running={running} />
      <div className="main-content">
        <div className="editor-section">
          <CodeEditor value={code} onChange={setCode} />
        </div>
        <div className="output-section">
          <GraphicsView commands={graphics} mode={mode} />
          <OutputPanel output={output} error={error} />
        </div>
      </div>
    </div>
  );
}
