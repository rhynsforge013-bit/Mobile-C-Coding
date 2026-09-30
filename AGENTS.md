# Mobile-C-Coding

Mobile-friendly in-browser C++ editor with server-side compilation and 2D/3D graphics play modes.

## Architecture

- **Frontend** (`frontend/`): React + Vite on port 5173 (host port 3000). CodeMirror editor, 2D canvas, Three.js 3D scene.
- **Backend** (`backend/`): Node.js + Express on port 8000. Compiles C++ with `g++`, runs with a 5s timeout via `timeout`.
- **Graphics protocol**: C++ programs `#include "mini_graphics.h"` and call drawing functions that emit JSON lines to **stderr**. The frontend parses these and renders them. Regular `stdout` is shown as text output.

## Running

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

The backend image installs `g++` via apt-get in its Dockerfile. The frontend uses a plain `node:22` image with bind-mounted source and `npm install` on startup.

## Key files

- `backend/server.js` — `/api/compile` endpoint (compile + run) and `/api/health`
- `backend/graphics/mini_graphics.h` — header-only C++ graphics library (2D + 3D commands)
- `frontend/src/App.jsx` — main app: editor + output + graphics
- `frontend/src/components/Canvas2D.jsx` — 2D canvas renderer
- `frontend/src/components/Canvas3D.jsx` — Three.js 3D renderer with OrbitControls
- `frontend/src/examples.js` — default 2D and 3D example programs

## How graphics work

1. C++ code calls `gfx::circle(200, 200, 50)` etc.
2. Each call writes a JSON line to stderr.
3. Backend captures stdout (text) and stderr (graphics) separately.
4. Frontend parses stderr lines as JSON and renders on the appropriate canvas.
