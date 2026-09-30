export default function OutputPanel({ output, error }) {
  return (
    <div className="output-panel">
      <div className="output-header">Output</div>
      {error && <pre className="error-msg">{error}</pre>}
      {output && <pre className="output-text">{output}</pre>}
      {!error && !output && (
        <div className="output-placeholder">Program output will appear here</div>
      )}
    </div>
  );
}
