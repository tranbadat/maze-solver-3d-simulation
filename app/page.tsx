"use client"

import { useState, useCallback } from "react"
import { aStarWithSteps, type LogEntry, type AStarStep } from "@/lib/astar"
import { bfsWithSteps } from "@/lib/bfs"
import { Maze3DScene } from "@/components/maze-3d-scene"
import { MazeInputPanel } from "@/components/maze-input-panel"
import { LogsPanel } from "@/components/logs-panel"
import { StepVisualization } from "@/components/step-visualization"
import { AlgorithmSelector } from "@/components/algorithm-selector"
import { ComparisonResults } from "@/components/comparison-results"

export default function Home() {
  const [grid, setGrid] = useState<number[][]>([])
  const [path, setPath] = useState<[number, number][]>([])
  const [start, setStart] = useState<[number, number]>([0, 0])
  const [goal, setGoal] = useState<[number, number]>([4, 4])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [steps, setSteps] = useState<AStarStep[]>([])
  const [currentStep, setCurrentStep] = useState<AStarStep | null>(null)
  const [hidePathDuringVisualization, setHidePathDuringVisualization] = useState(false)

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<"astar" | "bfs" | "both">("astar")
  const [astarResult, setAstarResult] = useState<any>(null)
  const [bfsResult, setBfsResult] = useState<any>(null)

  const handlePreview = useCallback(
    (inputGrid: number[][], inputStart: [number, number], inputGoal: [number, number]) => {
      setGrid(inputGrid)
      setStart(inputStart)
      setGoal(inputGoal)
      setPath([])
      setLogs([])
      setSteps([])
      setCurrentStep(null)
      setAstarResult(null)
      setBfsResult(null)
    },
    [],
  )
  const handleStepChange = useCallback((step: AStarStep | null) => {
    console.log("Current Step:", step)
     console.log("Step iterator:",step!==null && step.iteration >= 2 && step.iteration < steps.length)
    setCurrentStep(step)
    setHidePathDuringVisualization(step!==null && step.iteration >= 2 && step.iteration < steps.length ? true : false)
  }, [])
  const handleSolve = useCallback(
    (inputGrid: number[][], inputStart: [number, number], inputGoal: [number, number]) => {
      setIsLoading(true)

      setTimeout(() => {
        setGrid(inputGrid)
        setStart(inputStart)
        setGoal(inputGoal)

        if (selectedAlgorithm === "astar" || selectedAlgorithm === "both") {
          const astarRes = aStarWithSteps(inputGrid, inputStart, inputGoal)
          setAstarResult({
            path: astarRes.path,
            logs: astarRes.logs,
            steps: astarRes.steps,
            nodesVisited: astarRes.steps.length,
          })
          setPath(astarRes.path)
          setLogs(astarRes.logs)
          setSteps(astarRes.steps)
        }

        if (selectedAlgorithm === "bfs" || selectedAlgorithm === "both") {
          const bfsRes = bfsWithSteps(inputGrid, inputStart, inputGoal)
          setBfsResult({
            path: bfsRes.path,
            logs: bfsRes.logs,
            steps: bfsRes.steps,
            nodesVisited: bfsRes.nodesVisited,
          })
          if (selectedAlgorithm === "bfs") {
            setPath(bfsRes.path)
            setLogs(bfsRes.logs)
          }
        }

        setCurrentStep(null)
        setIsLoading(false)
      }, 100)
    },
    [selectedAlgorithm],
  )

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="h-screen w-full flex flex-col md:flex-row gap-4 p-4">
        {/* 3D Scene */}
        <div className="flex-1 rounded-lg overflow-hidden border border-border">
          {grid.length > 0 ? (
            <Maze3DScene grid={grid} path={path} start={start} goal={goal} currentStep={currentStep} hidePathDuringVisualization={hidePathDuringVisualization} />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Load a maze to visualize</p>
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="w-full md:w-96 flex flex-col gap-4 overflow-y-auto">
          <AlgorithmSelector selectedAlgorithm={selectedAlgorithm} onSelect={setSelectedAlgorithm} />
          <MazeInputPanel onSolve={handleSolve} onPreview={handlePreview} isLoading={isLoading} />
          {steps.length > 0 && (
            <StepVisualization steps={steps} grid={grid} goal={goal} onStepChange={handleStepChange} />
          )}

          {selectedAlgorithm === "both" && (astarResult || bfsResult) && (
            <ComparisonResults
              astarData={
                astarResult && {
                  algorithm: "A*",
                  pathLength: astarResult.path.length,
                  nodesVisited: astarResult.nodesVisited,
                  iterations: astarResult.steps.length,
                  runtime: astarResult.logs[astarResult.logs.length - 1]?.data?.runtimeMs
                    ? Number.parseFloat(astarResult.logs[astarResult.logs.length - 1].data.runtimeMs)
                    : 0,
                  efficiency: "Optimized with heuristic",
                }
              }
              bfsData={
                bfsResult && {
                  algorithm: "BFS",
                  pathLength: bfsResult.path.length,
                  nodesVisited: bfsResult.nodesVisited,
                  iterations: bfsResult.steps.length,
                  runtime: bfsResult.logs[bfsResult.logs.length - 1]?.data?.runtimeMs
                    ? Number.parseFloat(bfsResult.logs[bfsResult.logs.length - 1].data.runtimeMs)
                    : 0,
                  efficiency: "No heuristic",
                }
              }
            />
          )}

          <LogsPanel logs={logs} pathLength={path.length} />
        </div>
      </div>
    </main>
  )
}
