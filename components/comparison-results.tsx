"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ComparisonData {
  algorithm: string
  pathLength: number
  nodesVisited: number
  iterations: number
  runtime: number
  efficiency: string
}

interface ComparisonResultsProps {
  astarData?: ComparisonData
  bfsData?: ComparisonData
}

export const ComparisonResults = ({ astarData, bfsData }: ComparisonResultsProps) => {
  if (!astarData && !bfsData) {
    return null
  }

  const calculateImprovement = (astarVal: number, bfsVal: number): string => {
    if (bfsVal === 0) return "N/A"
    const improvement = (((bfsVal - astarVal) / bfsVal) * 100).toFixed(1)
    if (Number(improvement) > 0) {
      return `${improvement}% faster`
    } else if (Number(improvement) < 0) {
      return `${Math.abs(improvement)}% slower`
    }
    return "Equal"
  }

  return (
    <Card className="border-2 border-primary/50">
      <CardHeader>
        <CardTitle className="text-base">Algorithm Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2">Metric</th>
                {astarData && <th className="text-center py-2 px-2">A*</th>}
                {bfsData && <th className="text-center py-2 px-2">BFS</th>}
                {astarData && bfsData && <th className="text-center py-2 px-2">Difference</th>}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-2 font-medium">Path Length</td>
                {astarData && <td className="text-center py-2 px-2 font-mono">{astarData.pathLength}</td>}
                {bfsData && <td className="text-center py-2 px-2 font-mono">{bfsData.pathLength}</td>}
                {astarData && bfsData && (
                  <td className="text-center py-2 px-2 text-xs text-muted-foreground">
                    {astarData.pathLength === bfsData.pathLength ? "Same ✓" : "Different"}
                  </td>
                )}
              </tr>
              <tr className="border-b">
                <td className="py-2 px-2 font-medium">Nodes Visited</td>
                {astarData && <td className="text-center py-2 px-2 font-mono">{astarData.nodesVisited}</td>}
                {bfsData && <td className="text-center py-2 px-2 font-mono">{bfsData.nodesVisited}</td>}
                {astarData && bfsData && (
                  <td className="text-center py-2 px-2 text-xs text-green-600 dark:text-green-400 font-medium">
                    {calculateImprovement(astarData.nodesVisited, bfsData.nodesVisited)}
                  </td>
                )}
              </tr>
              <tr className="border-b">
                <td className="py-2 px-2 font-medium">Iterations</td>
                {astarData && <td className="text-center py-2 px-2 font-mono">{astarData.iterations}</td>}
                {bfsData && <td className="text-center py-2 px-2 font-mono">{bfsData.iterations}</td>}
                {astarData && bfsData && (
                  <td className="text-center py-2 px-2 text-xs text-green-600 dark:text-green-400 font-medium">
                    {calculateImprovement(astarData.iterations, bfsData.iterations)}
                  </td>
                )}
              </tr>
              <tr className="border-b">
                <td className="py-2 px-2 font-medium">Runtime (ms)</td>
                {astarData && <td className="text-center py-2 px-2 font-mono">{astarData.runtime.toFixed(2)}</td>}
                {bfsData && <td className="text-center py-2 px-2 font-mono">{bfsData.runtime.toFixed(2)}</td>}
                {astarData && bfsData && (
                  <td className="text-center py-2 px-2 text-xs text-green-600 dark:text-green-400 font-medium">
                    {calculateImprovement(astarData.runtime, bfsData.runtime)}
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        {astarData && bfsData && (
          <div className="bg-muted p-3 rounded space-y-2 text-sm">
            <p className="font-medium">Summary:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                <strong>Path Optimality:</strong> Both find the same shortest path (
                {astarData.pathLength === bfsData.pathLength ? "✓ Verified" : "✗ Different"})
              </li>
              <li>
                <strong>Efficiency:</strong> A* visits{" "}
                {(((bfsData.nodesVisited - astarData.nodesVisited) / bfsData.nodesVisited) * 100).toFixed(1)}% fewer
                nodes
              </li>
              <li>
                <strong>Speed:</strong> A* is {(bfsData.runtime / astarData.runtime).toFixed(1)}x faster than BFS
              </li>
              <li>
                <strong>Why A* Wins:</strong> Heuristic (Manhattan distance) guides search toward goal, eliminating
                unnecessary exploration
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
