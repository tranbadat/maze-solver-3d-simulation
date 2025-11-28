"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AlgorithmSelectorProps {
  selectedAlgorithm: "astar" | "bfs" | "both"
  onSelect: (algorithm: "astar" | "bfs" | "both") => void
}

export const AlgorithmSelector = ({ selectedAlgorithm, onSelect }: AlgorithmSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Select Algorithm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          onClick={() => onSelect("astar")}
          variant={selectedAlgorithm === "astar" ? "default" : "outline"}
          className="w-full"
        >
          A* Only
        </Button>
        <Button
          onClick={() => onSelect("bfs")}
          variant={selectedAlgorithm === "bfs" ? "default" : "outline"}
          className="w-full"
        >
          BFS Only
        </Button>
        <Button
          onClick={() => onSelect("both")}
          variant={selectedAlgorithm === "both" ? "default" : "outline"}
          className="w-full"
        >
          Compare (A* vs BFS)
        </Button>
      </CardContent>
    </Card>
  )
}
