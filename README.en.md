# MeCung-AStar — 3D Maze Solver & Visualizer (English)

Interactive visualization of pathfinding algorithms (A* and BFS) using React, Next.js, and react-three/fiber.

This project demonstrates algorithm behavior on randomly generated or custom mazes and visualizes
step-by-step state (open set, closed set) in both 3D and UI panels, along with performance comparison
between A* (heuristic-driven) and BFS.

---

## Features

- Visualize mazes in 3D with interactive camera controls (OrbitControls)
- A* implementation with detailed logs and step-by-step visualization
- BFS implementation for performance comparison
- Side-by-side algorithm comparison: path length, nodes visited, runtime
- Presets and random maze generator; customizable grid size
- Step-by-step playback control and speed slider
- Logs panel and result summary
- Vietnamese-friendly font support (Noto Sans)

---

## Demo / Screenshot

 ![alt](/demo/demo.png)

---

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- @react-three/fiber & @react-three/drei (3D render)
- TailwindCSS

---

## Getting Started

Requirements:
- Node.js >= 18
- pnpm / npm / yarn

Install & Run:

```powershell
# Install dependencies
npm install

# Start dev server
pnpm dev

# Build for production
npm build
npm start
```

(Or use `npm` / `yarn` if you prefer.)

---

## Usage

1. Open the app in a browser (default: `http://localhost:3000`).
2. In the Maze Configuration panel:
   - Generate a random maze or paste a JSON 2D grid (0 = empty, 1 = wall).
   - Set start and goal coordinates; use built-in presets.
3. Select algorithm: `A*`, `BFS` or `Compare`.
4. Click `Preview Maze` or `Solve Maze` to start visualization.
5. Use the Step Visualization panel to play/pause steps and inspect open/closed sets.

---

## Algorithms

- A*: Uses Manhattan distance for heuristic (suitable for 4-directional movement, no diagonals). Produces shortest path with step snapshots.
- BFS: Guaranteed shortest path for equal-cost steps; used as a reference/comparison.

---

## 3D Scene & Centering

The 3D grid uses a consistent cell size and spacing. Each cell is a box (`mesh`), and the grid
is centered using `(gridSize - 1) * (cellSize + spacing) / 2` on both axes, so rotations happen around the grid center.
`OrbitControls` target is set to the grid center to ensure an expected user rotation pivot.

---

## Fonts & Vietnamese Support

This project loads `Noto Sans` and `Roboto Mono` through `next/font/google`. Use `Noto Sans` (with `vietnamese` subset) for proper Vietnamese character rendering.

---

## Contributing

Contributions and improvements are welcome:
1. Fork the repo.
2. Create a feature branch.
3. Add tests (where applicable) and follow project style.
4. Open a PR with summary and motivation.

---

## License

MIT — see `LICENSE` for details.

---

© Tran Ba Dat
