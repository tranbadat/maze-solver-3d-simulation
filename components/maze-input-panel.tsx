'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MazeInputPanelProps {
  onSolve: (grid: number[][], start: [number, number], goal: [number, number]) => void;
  onPreview: (grid: number[][], start: [number, number], goal: [number, number]) => void;
  isLoading: boolean;
}

const PRESETS = {
  small: {
    grid: [
      [0, 0, 1, 0, 0],
      [1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ],
    start: [0, 0] as [number, number],
    goal: [4, 4] as [number, number],
  },
  medium: {
    grid: [
      [0, 0, 1, 0, 0, 0, 1, 0],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 1, 1, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
    ],
    start: [0, 0] as [number, number],
    goal: [7, 7] as [number, number],
  },
  complex: {
    grid: [
      [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      [0, 1, 1, 0, 1, 1, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    ],
    start: [0, 0] as [number, number],
    goal: [9, 9] as [number, number],
  },
};

export const MazeInputPanel = ({ onSolve, onPreview, isLoading }: MazeInputPanelProps) => {
  const [rows, setRows] = useState('8');
  const [cols, setCols] = useState('8');
  const [gridJson, setGridJson] = useState(JSON.stringify(PRESETS.small.grid));
  const [startRow, setStartRow] = useState('0');
  const [startCol, setStartCol] = useState('0');
  const [goalRow, setGoalRow] = useState('4');
  const [goalCol, setGoalCol] = useState('4');
  const [error, setError] = useState('');

  const generateRandomMaze = useCallback(() => {
    try {
      setError('');
      const r = parseInt(rows);
      const c = parseInt(cols);

      if (isNaN(r) || isNaN(c) || r < 3 || c < 3) {
        throw new Error('Rows and Cols must be >= 3');
      }

      const grid: number[][] = Array.from({ length: r }, () =>
        Array.from({ length: c }, () => Math.random() > 0.7 ? 1 : 0)
      );

      // Ensure start and goal are empty
      grid[0][0] = 0;
      grid[r - 1][c - 1] = 0;

      setGridJson(JSON.stringify(grid));
      setStartRow('0');
      setStartCol('0');
      setGoalRow((r - 1).toString());
      setGoalCol((c - 1).toString());

      // Preview maze
      onPreview(grid, [0, 0], [r - 1, c - 1]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
    }
  }, [rows, cols, onPreview]);

  const handlePreview = () => {
    try {
      setError('');
      const grid = JSON.parse(gridJson);

      if (!Array.isArray(grid) || grid.length === 0) {
        throw new Error('Grid must be a non-empty array');
      }

      if (!Array.isArray(grid[0])) {
        throw new Error('Grid must be a 2D array');
      }

      const rows = parseInt(startRow);
      const cols = parseInt(startCol);
      const gRows = parseInt(goalRow);
      const gCols = parseInt(goalCol);

      if (isNaN(rows) || isNaN(cols) || isNaN(gRows) || isNaN(gCols)) {
        throw new Error('Invalid coordinate values');
      }

      onPreview(grid, [rows, cols], [gRows, gCols]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
    }
  };

  const handleSolve = () => {
    try {
      setError('');
      const grid = JSON.parse(gridJson);

      if (!Array.isArray(grid) || grid.length === 0) {
        throw new Error('Grid must be a non-empty array');
      }

      if (!Array.isArray(grid[0])) {
        throw new Error('Grid must be a 2D array');
      }

      const rows = parseInt(startRow);
      const cols = parseInt(startCol);
      const gRows = parseInt(goalRow);
      const gCols = parseInt(goalCol);

      if (isNaN(rows) || isNaN(cols) || isNaN(gRows) || isNaN(gCols)) {
        throw new Error('Invalid coordinate values');
      }

      onSolve(grid, [rows, cols], [gRows, gCols]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
    }
  };

  const loadPreset = (preset: keyof typeof PRESETS) => {
    const data = PRESETS[preset];
    setGridJson(JSON.stringify(data.grid));
    setStartRow(data.start[0].toString());
    setStartCol(data.start[1].toString());
    setGoalRow(data.goal[0].toString());
    setGoalCol(data.goal[1].toString());
    setError('');
    onPreview(data.grid, data.start, data.goal);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Maze Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-3 rounded-lg space-y-3">
          <label className="text-sm font-semibold block">Generate Random Maze</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Rows</label>
              <Input
                type="number"
                value={rows}
                onChange={(e) => setRows(e.target.value)}
                min="3"
                max="20"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Cols</label>
              <Input
                type="number"
                value={cols}
                onChange={(e) => setCols(e.target.value)}
                min="3"
                max="20"
              />
            </div>
          </div>
          <Button
            onClick={generateRandomMaze}
            disabled={isLoading}
            variant="secondary"
            className="w-full"
          >
            Random Generate
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Grid (0=empty, 1=wall):</label>
          <textarea
            className="w-full p-2 border rounded font-mono text-xs h-24 resize-none bg-background text-foreground border-border"
            value={gridJson}
            onChange={(e) => setGridJson(e.target.value)}
            placeholder='[[0,1,0],[1,0,0],[0,0,0]]'
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1">Start Row</label>
            <Input
              type="number"
              value={startRow}
              onChange={(e) => setStartRow(e.target.value)}
              min="0"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Start Col</label>
            <Input
              type="number"
              value={startCol}
              onChange={(e) => setStartCol(e.target.value)}
              min="0"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Goal Row</label>
            <Input
              type="number"
              value={goalRow}
              onChange={(e) => setGoalRow(e.target.value)}
              min="0"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Goal Col</label>
            <Input
              type="number"
              value={goalCol}
              onChange={(e) => setGoalCol(e.target.value)}
              min="0"
            />
          </div>
        </div>

        {error && <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-2 rounded">{error}</div>}

        <div className="space-y-2">
          <Button onClick={handlePreview} disabled={isLoading} variant="secondary" className="w-full">
            Preview Maze
          </Button>
          <Button onClick={handleSolve} disabled={isLoading} className="w-full">
            {isLoading ? 'Solving...' : 'Solve Maze'}
          </Button>
          <div className="text-xs text-muted-foreground">Presets:</div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => loadPreset('small')}
              disabled={isLoading}
            >
              Small
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => loadPreset('medium')}
              disabled={isLoading}
            >
              Medium
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => loadPreset('complex')}
              disabled={isLoading}
            >
              Complex
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
