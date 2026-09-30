import express from 'express';
import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

const execFileAsync = promisify(execFile);
const app = express();
const PORT = 8000;

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/run', async (req, res) => {
  const { code } = req.body;
  if (typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing "code" field' });
  }

  const tmpDir = path.join(os.tmpdir(), `cpp-${crypto.randomUUID()}`);
  const srcFile = path.join(tmpDir, 'main.cpp');
  const binFile = path.join(tmpDir, 'main');

  try {
    await fs.mkdir(tmpDir, { recursive: true });
    await fs.writeFile(srcFile, code);

    // Compile
    let compileResult;
    try {
      compileResult = await execFileAsync('g++', [
        '-std=c++17', '-O2', '-o', binFile, srcFile,
      ], { timeout: 10000, maxBuffer: 1024 * 1024 });
    } catch (err) {
      return res.json({
        stdout: '',
        stderr: err.stderr || err.message,
        exitCode: err.code ?? 1,
        compileError: true,
      });
    }

    // Run
    let runResult;
    try {
      runResult = await execFileAsync(binFile, [], {
        timeout: 5000,
        maxBuffer: 10 * 1024 * 1024,
        env: { ...process.env, HOME: tmpDir },
      });
    } catch (err) {
      return res.json({
        stdout: err.stdout || '',
        stderr: err.stderr || err.message,
        exitCode: err.code ?? 1,
      });
    }

    res.json({
      stdout: runResult.stdout,
      stderr: runResult.stderr,
      exitCode: 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`C++ compile server listening on port ${PORT}`);
});
