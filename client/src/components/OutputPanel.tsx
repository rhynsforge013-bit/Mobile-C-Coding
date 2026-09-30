interface Props {
  stdout: string;
  stderr: string;
  exitCode: number;
  running: boolean;
  error?: string;
}

export default function OutputPanel({ stdout, stderr, exitCode, running, error }: Props) {
  return (
    <div className="output-panel">
      <div className="output-header">
        <span>Output</span>
        {running && <span className="badge running">Running…</span>}
        {!running && exitCode === 0 && stdout && <span className="badge ok">OK</span>}
        {!running && exitCode !== 0 && (stdout || stderr) && <span className="badge err">Exit {exitCode}</span>}
      </div>
      <pre className="output-body">
        {error && <span className="text-error">{error}</span>}
        {stdout && <span className="text-stdout">{stdout}</span>}
        {stderr && <span className="text-stderr">{stderr}</span>}
        {!stdout && !stderr && !error && !running && <span className="text-muted">Press Run to compile and execute.</span>}
      </pre>
    </div>
  );
}
