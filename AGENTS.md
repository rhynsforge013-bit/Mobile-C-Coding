# Mobile C++ Coding — Dev Environment

## Overview
Mobile-friendly in-browser C++ editor with server-side compilation (g++) and 2D/3D play modes.

## Architecture
- **client/** — Vite + React + TypeScript frontend. CodeMirror 6 editor, text/2D/3D output modes.
- **server/** — Express backend. Receives C++ code, compiles with g++, runs the binary, returns stdout/stderr.
- Single-origin: Vite dev server proxies `/api` to the backend (configured via `VITE_API_TARGET`).

## Running
```bash
docker compose -f docker-compose.base44.yml up -d --build
```
- Web (Vite) on host port 3000 → container 5173
- API (Express) on host port 8000

## How It Works
1. User edits C++ code in the CodeMirror editor.
2. Clicking Run POSTs code to `/api/run`.
3. Server writes to a temp file, compiles with `g++ -std=c++17 -O2`, runs with a 5s timeout.
4. stdout is returned to the client.
5. In text mode: stdout shown as text. In 2D mode: parsed as drawing commands (CLEAR, COLOR, CIRCLE, RECT, LINE, TEXT, etc.) and rendered on a canvas. In 3D mode: parsed as scene commands (CUBE, SPHERE, CAMERA, etc.) and rendered with Three.js.

## No External Secrets
This app is fully self-contained — no database, no external APIs, no credentials needed.
