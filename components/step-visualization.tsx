"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AStarStep } from "@/lib/astar"

interface StepVisualizationProps {
  steps: AStarStep[]
  grid: number[][]
  goal: [number, number]
  onStepChange?: (step: AStarStep | null) => void
}

export const StepVisualization = ({ steps, grid, goal, onStepChange }: StepVisualizationProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playSpeed, setPlaySpeed] = useState(500) // ms per step

  const currentStep = steps[currentStepIndex] || null

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !steps.length) return

    const timer = setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1)
      } else {
        setIsPlaying(false)
      }
    }, playSpeed)

    return () => clearTimeout(timer)
  }, [isPlaying, currentStepIndex, steps.length, playSpeed])

  // Notify parent of step change
  useEffect(() => {
    onStepChange?.(currentStep)
  }, [currentStep, onStepChange])

  if (!steps.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Step-by-Step Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No steps to visualize</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Step-by-Step Visualization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Step Info */}
        {currentStep && (
          <div className="bg-muted p-3 rounded space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Step:</span>
                <span className="ml-2 font-mono font-bold text-foreground">
                  {currentStep.iteration} / {steps.length}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Current:</span>
                <span className="ml-2 font-mono font-bold text-foreground">
                  [{currentStep.currentNode[0]}, {currentStep.currentNode[1]}]
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">f(n):</span>
                <span className="ml-2 font-mono font-bold text-foreground">{currentStep.fValue}</span>
              </div>
              <div>
                <span className="text-muted-foreground">g(n) + h(n):</span>
                <span className="ml-2 font-mono font-bold text-foreground">
                  {currentStep.gValue} + {currentStep.hValue}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Open Set:</span>
                <span className="ml-2 font-mono font-bold text-foreground">{currentStep.openSet.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Closed Set:</span>
                <span className="ml-2 font-mono font-bold text-foreground">{currentStep.closedSet.length}</span>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentStepIndex(0)}
              variant="outline"
              size="sm"
              disabled={currentStepIndex === 0}
            >
              First
            </Button>
            <Button
              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
              variant="outline"
              size="sm"
              disabled={currentStepIndex === 0}
            >
              Prev
            </Button>
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant={isPlaying ? "default" : "secondary"}
              size="sm"
              className="flex-1"
            >
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button
              onClick={() => setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
              variant="outline"
              size="sm"
              disabled={currentStepIndex === steps.length - 1}
            >
              Next
            </Button>
            <Button
              onClick={() => setCurrentStepIndex(steps.length - 1)}
              variant="outline"
              size="sm"
              disabled={currentStepIndex === steps.length - 1}
            >
              Last
            </Button>
          </div>

          {/* Speed Control */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Play Speed: {playSpeed}ms per step</label>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={playSpeed}
              onChange={(e) => setPlaySpeed(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-100"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Sets Info */}
        {currentStep && (
          <div className="space-y-2 text-xs">
            <div>
              <p className="font-medium mb-1 text-muted-foreground">Open Set (chờ xử lý):</p>
              <div className="flex flex-wrap gap-1">
                {currentStep.openSet.slice(0, 10).map((pos, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-2 py-0.5 rounded"
                  >
                    [{pos[0]},{pos[1]}]
                  </span>
                ))}
                {currentStep.openSet.length > 10 && (
                  <span className="text-muted-foreground">+{currentStep.openSet.length - 10} more</span>
                )}
              </div>
            </div>
            <div>
              <p className="font-medium mb-1 text-muted-foreground">Closed Set (đã xử lý):</p>
              <div className="flex flex-wrap gap-1">
                {currentStep.closedSet.slice(0, 10).map((pos, i) => (
                  <span
                    key={i}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-0.5 rounded"
                  >
                    [{pos[0]},{pos[1]}]
                  </span>
                ))}
                {currentStep.closedSet.length > 10 && (
                  <span className="text-muted-foreground">+{currentStep.closedSet.length - 10} more</span>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
