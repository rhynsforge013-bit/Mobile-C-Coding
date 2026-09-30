export interface RunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  compileError?: boolean;
  error?: string;
}

export async function runCode(code: string): Promise<RunResult> {
  const resp = await fetch('/api/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${resp.status}`);
  }
  return resp.json();
}
