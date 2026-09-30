const express = require('express');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
app.use(express.json({ limit: '1mb' }));

const GRAPHICS_INCLUDE_DIR = path.join(__dirname, 'graphics');

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/compile', (req, res) => {
  const { code } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'No code provided' });
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cpp-'));
  const sourceFile = path.join(tmpDir, 'main.cpp');
  const binaryFile = path.join(tmpDir, 'main');

  fs.writeFileSync(sourceFile, code);

  // Compile
  execFile(
    'g++',
    ['-std=c++17', '-O2', '-w', `-I${GRAPHICS_INCLUDE_DIR}`, '-o', binaryFile, sourceFile],
    { timeout: 15000, maxBuffer: 1024 * 1024 },
    (compileErr, _compileStdout, compileStderr) => {
      if (compileErr) {
        cleanup(tmpDir);
        return res.json({ success: false, compileError: compileStderr || compileErr.message });
      }

      // Run with 5-second wall-clock timeout
      execFile(
        'timeout',
        ['5', binaryFile],
        { timeout: 8000, maxBuffer: 10 * 1024 * 1024 },
        (runErr, runStdout, runStderr) => {
          cleanup(tmpDir);
          const timedOut = runErr && (runErr.killed || runErr.signal === 'SIGTERM');
          res.json({
            success: true,
            output: runStdout || '',
            graphics: runStderr || '',
            timedOut,
          });
        }
      );
    }
  );
});

function cleanup(dir) {
  fs.rm(dir, { recursive: true, force: true }, () => {});
}

const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => console.log(`C++ server listening on ${PORT}`));
