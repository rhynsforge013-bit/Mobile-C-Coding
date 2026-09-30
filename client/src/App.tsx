import { useState, useCallback } from 'react';
import CodeEditor from './components/CodeEditor';
import OutputPanel from './components/OutputPanel';
import PlayCanvas2D from './components/PlayCanvas2D';
import PlayCanvas3D from './components/PlayCanvas3D';
import { runCode, type RunResult } from './lib/api';
import { samples, type Mode } from './lib/samples';

export default function App() {
  const [mode, setMode] = useState<Mode>('text');
  const [code, setCode] = useState(samples.text);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
    setCode(samples[m]);
    setResult(null);
    setError(undefined);
  }, []);

  const handleRun = useCallback(async () => {
    setRunning(true);
    setError(undefined);
    try {
      const r = await runCode(code);
      setResult(r);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRunning(false);
    }
  }, [code]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mobile C++ Coding</h1>
        <div className="controls">
          <div className="mode-tabs">
            {(['text', '2d', '3d'] as Mode[]).map((m) => (
              <button
                key={m}
                className={`tab ${mode === m ? 'active' : ''}`}
                onClick={() => switchMode(m)}
              >
                {m === 'text' ? 'Text' : m === '2d' ? '2D' : '3D'}
              </button>
            ))}
          </div>
          <button className="run-btn" onClick={handleRun} disabled={running}>
            {running ? 'Running…' : '▶ Run'}
          </button>
        </div>
      </header>
      <main className="app-main">
        <section className="editor-section">
          <CodeEditor value={code} onChange={setCode} />
        </section>
        <section className="output-section">
          {mode === 'text' && (
            <OutputPanel
              stdout={result?.stdout ?? ''}
              stderr={result?.stderr ?? ''}
              exitCode={result?.exitCode ?? -1}
              running={running}
              error={error}
            />
          )}
          {mode === '2d' && <PlayCanvas2D stdout={result?.stdout ?? ''} />}
          {mode === '3d' && <PlayCanvas3D stdout={result?.stdout ?? ''} />}
          {(mode === '2d' || mode === '3d') && (result?.stderr || error) && (
            <div className="error-bar">
              {error ?? result?.stderr}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
