

# MeCung-AStar — Multilingual README

Choose a language:

- [English README](./README.en.md)
- [Tiếng Việt - README](./README.vi.md)

---

The project documentation is available in both English and Vietnamese. Click a link above to read the full documentation in your preferred language.


 ## Features

 - Visualize mazes in 3D with interactive OrbitControls
 - A* implementation with step-by-step debug logs and step visualization
 - BFS implementation for comparison/benchmarking
 - Side-by-side algorithm comparison (path length, nodes visited, runtime)
 - Presets and random maze generator with user-defined grid size
 - Play/pause step-by-step visualization, control speed
 - Logs panel and solution results
 - Proper Vietnamese font support (Noto Sans setup)

 ---

 ## Screenshot / Demo

 <!-- link to folder demo -->
 ![alt](/demo/demo.png)

 ---

 ## Tech Stack

 - Next.js (App router)
 - React
 - TypeScript
 - react-three/fiber & @react-three/drei (3D maze rendering)
 - Tailwind CSS for UI

 ---

 ## Installation & Running Locally

 Requirements:
 - Node.js >= 18
 - pnpm / npm / yarn

 Commands:

 ```powershell
 # Install dependencies
 npm install

 # Start dev server
 npm dev

 # Build (production)
 npm build
 npm start
 ```

 If you prefer npm/yarn, use `npm install` / `npm run dev` etc.

 ---

 ## Usage / How It Works

 1. Open the app in your browser (default: `http://localhost:3000`)
 2. In the Maze Configuration panel you can:
    - Generate a random maze (custom rows/cols)
    - Paste a JSON 2D array representing a maze (0 = empty, 1 = wall)
    - Set start and goal coordinates
    - Use grid presets (small/medium/complex)
 3. Choose algorithm in the Algorithm Selector (`A*`, `BFS` or `Compare`)
 4. Click `Preview Maze` to show the grid in the 3D scene, or `Solve Maze` to execute and visualize the algorithm
 5. While the algorithm runs you can: play/pause step-by-step visualization, inspect the open/closed sets,
    and read execution logs and result summaries in the Logs & Results panel.

 ---

 ## Project Structure

 - `app/` - Next.js pages and app layout
 - `components/` - Reusable UI and visual components (3D scene, controls, panels)
 - `lib/` - Algorithm implementations (A*, BFS) and utility functions
 - `styles/`, `app/globals.css` - Global styling
 - `public/` - Static assets

 ---

 ## Algorithms

 - A* (A-Star): Uses Manhattan distance heuristic (suitable for 4-directional movement, no diagonals) — returns shortest path with logs & step-by-step data.
 - BFS: Breadth-First Search — guaranteed shortest path but explores more nodes; included for comparison.

 The implementations provide detailed logs and step snapshots so the UI can display intermediate states.

 ---

 ## 3D Scene Details

 The 3D maze is rendered using `@react-three/fiber` with `mesh` boxes representing maze cells.
 - Each cell uses a consistent `cellSize` and small spacing
 - The scene uses `OrbitControls` with a centered `target` to ensure the user rotates around the maze center (fix applied so rotation pivot is centered)
 - The grid centering uses `(gridSize - 1) * (cellSize + spacing) / 2` so the pivot is at the center and rotations are balanced

 ---

 ## Fonts & Vietnamese Support

 The app uses Google Fonts (via `next/font/google`) and Tailwind CSS variables to ensure proper Vietnamese rendering:
 - `Noto Sans` (main, includes `vietnamese` subset)
 - `Roboto Mono` (monospace for grid/text areas)

 These are imported in `app/layout.tsx` and applied globally in `app/globals.css` and `styles/globals.css` as `--default-font-family` and `--default-mono-font-family`.

 ---

 ## Customization & Tips

 - To change camera start position, update `PerspectiveCamera` position in `components/maze-3d-scene.tsx`
 - To change the cell visuals (size/color), edit `CubeCell` in `components/maze-3d-scene.tsx`
 - To add additional algorithms, implement them under `lib/` and add UI to compare or run them

 ---

 ## Troubleshooting

 - If the maze appears off-center when rotating, verify you are using the latest branch: grid centering uses `(gridSize - 1)` in calculations and OrbitControls target is `[0, 0.3, 0]`.
 - If fonts don't update, clear Next.js build cache and restart the dev server:
 ```powershell
 pnpm build
 pnpm start
 ```
 - If you see runtime type errors, ensure Node version and dependencies match package.json

 ---

 ## Contributing

 Contributions are welcome! Suggested steps:
 1. Fork the repo
 2. Create a branch with a short descriptive name
 3. Add tests & follow project styles
 4. Open a pull request with clear motivation

 ---

 ## License

 MIT — see `LICENSE` for details.

---

© Tran Ba Dat
