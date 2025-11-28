"use client"

import { Canvas } from "@react-three/fiber"
import { PerspectiveCamera, OrbitControls, Environment } from "@react-three/drei"
import { useMemo } from "react"
import type { AStarStep } from "@/lib/astar"

interface Maze3DSceneProps {
  grid: number[][]
  path: [number, number][]
  start: [number, number]
  goal: [number, number]
  currentStep?: AStarStep | null // Added current step for visualization
  hidePathDuringVisualization?: boolean
}

const CubeCell = ({
  row,
  col,
  cellType,
  gridCols,
  gridRows,
}: {
  row: number
  col: number
  cellType: "empty" | "wall" | "start" | "goal" | "path" | "open" | "closed" | "current"
  gridCols: number
  gridRows: number
}) => {
  const cellSize = 1
  const spacing = 0.05
  const x = col * (cellSize + spacing) - ((gridCols - 1) * (cellSize + spacing)) / 2
  const z = row * (cellSize + spacing) - ((gridRows - 1) * (cellSize + spacing)) / 2

  let height = 0.3
  let color = "#888888"

  switch (cellType) {
    case "empty":
      height = 0.3
      color = "#e0e0e0"
      break
    case "wall":
      height = 1.5
      color = "#333333"
      break
    case "start":
      height = 0.5
      color = "#00ff00"
      break
    case "goal":
      height = 0.5
      color = "#ff0000"
      break
    case "path":
      height = 0.4
      color = "#ffff00"
      break
    case "open":
      height = 0.35
      color = "#87ceeb" // Sky blue
      break
    case "closed":
      height = 0.35
      color = "#dda0dd" // Plum
      break
    case "current":
      height = 0.45
      color = "#ff6347" // Tomato
      break
  }

  const y = height / 2

  return (
    <mesh position={[x, y, z]}>
      <boxGeometry args={[cellSize, height, cellSize]} />
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
    </mesh>
  )
}

export const Maze3DScene = ({ grid, path, start, goal, currentStep, hidePathDuringVisualization }: Maze3DSceneProps) => {
  const cubes = useMemo(() => {
    const elements = []
    const pathSet = hidePathDuringVisualization ? new Set() : new Set(path.map((p) => `${p[0]},${p[1]}`))

    const openSetKeys = new Set(currentStep?.openSet.map((p) => `${p[0]},${p[1]}`) || [])
    const closedSetKeys = new Set(currentStep?.closedSet.map((p) => `${p[0]},${p[1]}`) || [])

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const key = `${row},${col}`
        let cellType: "empty" | "wall" | "start" | "goal" | "path" | "open" | "closed" | "current" = "empty"

        if (row === start[0] && col === start[1]) {
          cellType = "start"
        } else if (row === goal[0] && col === goal[1]) {
          cellType = "goal"
        } else if (grid[row][col] === 1) {
          cellType = "wall"
        } else if (pathSet.has(key)) {
          cellType = "path"
        } else if (currentStep) {
          if (row === currentStep.currentNode[0] && col === currentStep.currentNode[1]) {
            cellType = "current"
          } else if (openSetKeys.has(key)) {
            cellType = "open"
          } else if (closedSetKeys.has(key)) {
            cellType = "closed"
          }
        }

        elements.push(
          <CubeCell key={key} row={row} col={col} cellType={cellType} gridCols={grid[0].length} gridRows={grid.length} />
        )
      }
    }

    return elements
  }, [grid, path, start, goal, currentStep, hidePathDuringVisualization])

  return (
    <Canvas className="w-full h-full" style={{ background: "#1a1a1a" }}>
      <PerspectiveCamera makeDefault position={[5, 8, 10]} />
      <OrbitControls autoRotate={false} target={[0, 0.3, 0]} />
      <Environment preset="city" />
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      {cubes}
    </Canvas>
  )
}
