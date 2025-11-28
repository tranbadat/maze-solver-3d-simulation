/**
 * ============================================================================
 * BREADTH-FIRST SEARCH (BFS) PATHFINDING ALGORITHM IMPLEMENTATION
 * ============================================================================
 *
 * THUẬT TOÁN: BFS (Breadth-First Search)
 *
 * ĐẶC ĐIỂM:
 * - Duyệt TOÀN BỘ cấp độ trước khi sang cấp độ tiếp theo
 * - Đảm bảo tìm được đường ngắn nhất (vì tất cả edge có trọng số = 1)
 * - KHÔNG sử dụng heuristic → duyệt vô hướng
 * - Thường chậm hơn A* vì duyệt nhiều ô không cần thiết
 *
 * SO SÁNH A* vs BFS:
 * ┌─────────────┬──────────────────┬──────────────────┐
 * │ Đặc điểm    │ A*               │ BFS              │
 * ├─────────────┼──────────────────┼──────────────────┤
 * │ Heuristic   │ Có (Manhattan)   │ Không            │
 * │ Tối ưu      │ Đường ngắn nhất  │ Đường ngắn nhất  │
 * │ Tốc độ      │ Nhanh hơn        │ Chậm hơn         │
 * │ Nodes visit │ Ít hơn           │ Nhiều hơn        │
 * │ Trường hợp  │ Hầu hết cases    │ Khó khăn         │
 * └─────────────┴──────────────────┴──────────────────┘
 *
 * ============================================================================
 */

import type { LogEntry } from "./astar"

interface BFSNode {
  row: number
  col: number
  parent: BFSNode | null
}

interface BFSStep {
  iteration: number
  currentNode: [number, number]
  queue: [number, number][]
  visited: [number, number][]
  pathToGoal: [number, number][]
}

export interface BFSResult {
  path: [number, number][]
  logs: LogEntry[]
  steps: BFSStep[]
  nodesVisited: number
}

class BFSLogger {
  private logs: LogEntry[] = []

  log(level: "INFO" | "DEBUG" | "ERROR", message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    }
    this.logs.push(entry)
    console.log(`[${level}] ${message}`, data || "")
  }

  getLogs(): LogEntry[] {
    return this.logs
  }

  clear() {
    this.logs = []
  }
}

const bfsLogger = new BFSLogger()

/**
 * BFS Algorithm - Breadth-First Search
 *
 * Các bước:
 * 1. Khởi tạo queue với START node
 * 2. Duyệt từng node trong queue (FIFO - First In First Out)
 * 3. Nếu tìm GOAL → truy vết từ cha
 * 4. Nếu chưa tìm → thêm các ô kề vào queue
 * 5. Tiếp tục đến khi queue rỗng
 */
export const bfsWithSteps = (grid: number[][], start: [number, number], goal: [number, number]): BFSResult => {
  bfsLogger.clear()
  const startTime = performance.now()
  const steps: BFSStep[] = []

  try {
    // ========== BƯỚC 1: INPUT VALIDATION ==========
    bfsLogger.log("INFO", "═══════════════════════════════════════════", {})
    bfsLogger.log("INFO", "BFS ALGORITHM STARTED", {})
    bfsLogger.log("INFO", "═══════════════════════════════════════════", {})

    bfsLogger.log("INFO", "BƯỚC 1: VALIDATION INPUT", {
      gridSize: `${grid.length} x ${grid[0]?.length || 0}`,
      startPosition: `[${start[0]}, ${start[1]}]`,
      goalPosition: `[${goal[0]}, ${goal[1]}]`,
    })

    if (!grid || grid.length === 0) {
      throw new Error("❌ Invalid grid: empty or null")
    }

    const [startRow, startCol] = start
    const [goalRow, goalCol] = goal

    if (startRow < 0 || startRow >= grid.length || startCol < 0 || startCol >= grid[0].length) {
      throw new Error(`❌ Invalid start position: [${startRow}, ${startCol}] - out of bounds`)
    }

    if (goalRow < 0 || goalRow >= grid.length || goalCol < 0 || goalCol >= grid[0].length) {
      throw new Error(`❌ Invalid goal position: [${goalRow}, ${goalCol}] - out of bounds`)
    }

    if (grid[startRow][startCol] === 1) {
      throw new Error(`❌ Start position [${startRow}, ${startCol}] is a wall (value = 1)`)
    }

    if (grid[goalRow][goalCol] === 1) {
      throw new Error(`❌ Goal position [${goalRow}, ${goalCol}] is a wall (value = 1)`)
    }

    bfsLogger.log("INFO", "✓ Input validation passed", {})

    // ========== BƯỚC 2: INITIALIZATION ==========
    bfsLogger.log("INFO", "", {})
    bfsLogger.log("INFO", "BƯỚC 2: KHỞI TẠO (Initialization)", {})
    bfsLogger.log("INFO", "- Tạo queue với START node", {})
    bfsLogger.log("INFO", "- Khởi tạo bảng visited", {})

    const queue: BFSNode[] = []
    const visited: Set<string> = new Set()
    const nodeMap: Map<string, BFSNode> = new Map()

    const startNode: BFSNode = {
      row: startRow,
      col: startCol,
      parent: null,
    }

    queue.push(startNode)
    visited.add(`${startRow},${startCol}`)
    nodeMap.set(`${startRow},${startCol}`, startNode)

    bfsLogger.log("INFO", "✓ Khởi tạo xong", {
      queueSize: queue.length,
    })

    let iterations = 0
    const maxIterations = grid.length * grid[0].length * 2

    // ========== BƯỚC 3: DUYỆT CHÍNH ==========
    bfsLogger.log("INFO", "", {})
    bfsLogger.log("INFO", "BƯỚC 3: DUYỆT (Main Loop)", {})
    bfsLogger.log("INFO", "Duyệt queue theo FIFO (First In First Out)", {})

    while (queue.length > 0) {
      iterations++

      if (iterations > maxIterations) {
        throw new Error(`❌ Maximum iterations exceeded (${maxIterations})`)
      }

      // Lấy node từ đầu queue
      const current = queue.shift()!

      const queueCopy: [number, number][] = queue.map((n) => [n.row, n.col])
      const visitedArray: [number, number][] = Array.from(visited).map((key) => {
        const [row, col] = key.split(",").map(Number)
        return [row, col]
      })

      // Truy vết path từ start
      let tempNode: BFSNode | null = current
      const pathToGoal: [number, number][] = []
      while (tempNode) {
        pathToGoal.unshift([tempNode.row, tempNode.col])
        tempNode = tempNode.parent
      }

      steps.push({
        iteration: iterations,
        currentNode: [current.row, current.col],
        queue: queueCopy,
        visited: visitedArray,
        pathToGoal,
      })

      if (iterations % 50 === 0) {
        bfsLogger.log("DEBUG", `Iteration ${iterations}: [${current.row},${current.col}]`, {
          queueSize: queue.length,
          visitedSize: visited.size,
        })
      }

      // Kiểm tra có phải GOAL không
      if (current.row === goalRow && current.col === goalCol) {
        bfsLogger.log("INFO", "", {})
        bfsLogger.log("INFO", "✓✓✓ GOAL FOUND! ✓✓✓", {})

        const path: [number, number][] = []
        let node: BFSNode | null = current
        let pathSteps = 0

        while (node) {
          path.unshift([node.row, node.col])
          node = node.parent
          pathSteps++
        }

        bfsLogger.log("INFO", "", {})
        bfsLogger.log("INFO", "BƯỚC 4: TÍNH TOÁN KẾT QUẢ CUỐI CÙNG", {})

        const endTime = performance.now()
        const runtime = (endTime - startTime).toFixed(2)

        bfsLogger.log("INFO", "═══════════════════════════════════════════", {})
        bfsLogger.log("INFO", "BFS ALGORITHM COMPLETED SUCCESSFULLY ✓", {})
        bfsLogger.log("INFO", "═══════════════════════════════════════════", {
          pathLength: path.length,
          totalIterations: iterations,
          nodesVisited: visited.size,
          runtimeMs: `${runtime} ms`,
        })

        return {
          path: path as [number, number][],
          logs: bfsLogger.getLogs(),
          steps,
          nodesVisited: visited.size,
        }
      }

      // Duyệt 4 ô kề
      const directions = [
        { row: current.row - 1, col: current.col },
        { row: current.row + 1, col: current.col },
        { row: current.row, col: current.col - 1 },
        { row: current.row, col: current.col + 1 },
      ]

      for (const dir of directions) {
        const newRow = dir.row
        const newCol = dir.col

        if (newRow < 0 || newRow >= grid.length || newCol < 0 || newCol >= grid[0].length) {
          continue
        }

        if (grid[newRow][newCol] === 1) {
          continue
        }

        const key = `${newRow},${newCol}`

        if (!visited.has(key)) {
          const newNode: BFSNode = {
            row: newRow,
            col: newCol,
            parent: current,
          }
          queue.push(newNode)
          visited.add(key)
          nodeMap.set(key, newNode)
        }
      }
    }

    const endTime = performance.now()
    const runtime = (endTime - startTime).toFixed(2)

    bfsLogger.log("INFO", "═══════════════════════════════════════════", {})
    bfsLogger.log("INFO", "⚠ NO PATH FOUND", {})
    bfsLogger.log("INFO", "═══════════════════════════════════════════", {
      totalIterations: iterations,
      nodesVisited: visited.size,
      runtimeMs: `${runtime} ms`,
    })

    return {
      path: [],
      logs: bfsLogger.getLogs(),
      steps,
      nodesVisited: visited.size,
    }
  } catch (error) {
    const endTime = performance.now()
    const runtime = (endTime - startTime).toFixed(2)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    bfsLogger.log("ERROR", "═══════════════════════════════════════════", {})
    bfsLogger.log("ERROR", "❌ ERROR OCCURRED", {
      error: errorMessage,
      runtimeMs: `${runtime} ms`,
    })

    return {
      path: [],
      logs: bfsLogger.getLogs(),
      steps,
      nodesVisited: 0,
    }
  }
}
