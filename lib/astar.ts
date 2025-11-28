/**
 * ============================================================================
 * A* PATHFINDING ALGORITHM IMPLEMENTATION
 * ============================================================================
 *
 * THUẬT TOÁN: A* (A-Star)
 *
 * TẠI SAO CHỌN A*?
 * - Đảm bảo tìm được đường đi TỐI ƯU (ngắn nhất)
 * - Nhanh hơn BFS nhờ sử dụng Heuristic để hướng dẫn tìm kiếm
 * - BFS: O(V + E) - duyệt vô hướng
 * - A*: Duyệt ưu tiên ô gần goal → tìm nhanh hơn
 *
 * ============================================================================
 * CÔNG THỨC ĐÁNH GIÁ: f(n) = g(n) + h(n)
 * ============================================================================
 *
 * f(n) = Tổng chi phí đánh giá của ô n
 *
 * g(n) = Số bước di chuyển từ điểm bắt đầu (S) đến trạng thái n
 *        - Tính từ START đến hiện tại
 *        - Ví dụ: từ (0,0) đến (2,3) = 5 bước → g(n) = 5
 *
 * h(n) = Heuristic - Ước lượng khoảng cách còn lại từ n đến GOAL (G)
 *        - Không biết chính xác, dùng heuristic để ước lượng
 *        - Ví dụ: từ (2,3) đến GOAL (5,5) → h(n) = |2-5| + |3-5| = 5
 *
 * ============================================================================
 * HEURISTIC: MANHATTAN DISTANCE
 * ============================================================================
 *
 * h(n) = |x_current - x_goal| + |y_current - y_goal|
 *
 * - Thích hợp vì chỉ di chuyển 4 hướng (lên/xuống/trái/phải)
 * - Không thể đi chéo, nên Manhattan perfect
 * - Ví dụ: h(2,3 -> 5,5) = |2-5| + |3-5| = 3 + 2 = 5
 *
 * ============================================================================
 * CÁC BƯỚC THUẬT TOÁN A*
 * ============================================================================
 *
 * BƯỚC 1: KHỞI TẠO (Initialization)
 * - Tạo hàng đợi ưu tiên (openSet) chứa ô START
 * - Khởi tạo bảng "cha" (parent) để truy vết đường đi
 * - Bảng đóng (closedSet) để theo dõi ô đã xử lý
 *
 * BƯỚC 2: DUYỆT (Traversal)
 * - WHILE openSet không rỗng:
 *   a) Chọn ô có f(n) nhỏ nhất từ openSet
 *   b) Nếu ô này = GOAL → tìm được đường, return
 *   c) Di chuyển ô từ openSet sang closedSet (đã xử lý)
 *
 * BƯỚC 3: CẬP NHẬT HÀNG XÓMS (Update Neighbors)
 * - Duyệt 4 ô kề (up, down, left, right)
 * - Bỏ qua: ngoài biên, tường, ô trong closedSet
 * - Tính g(n_mới) = g(hiện_tại) + 1
 * - Tính h(n_mới) = Manhattan distance đến GOAL
 * - Tính f(n_mới) = g(n_mới) + h(n_mới)
 * - Nếu ô kề chưa có hoặc tìm đường tốt hơn → cập nhật
 *
 * BƯỚC 4: KẾT THÚC (Termination)
 * - Khi lấy GOAL từ openSet → tìm được đường ngắn nhất
 * - openSet rỗng mà chưa tìm GOAL → không có đường
 *
 * BƯỚC 5: TRUY VẾT (Path Reconstruction)
 * - Dựa vào bảng "cha" (parent)
 * - Từ GOAL → lần ngược về START
 * - Đảo ngược danh sách → được path từ START → GOAL
 *
 * ============================================================================
 */

export interface LogEntry {
  timestamp: string
  level: "INFO" | "DEBUG" | "ERROR"
  message: string
  data?: any
}

export interface AStarStep {
  iteration: number
  currentNode: [number, number]
  openSet: [number, number][]
  closedSet: [number, number][]
  fValue: number
  gValue: number
  hValue: number
  pathToGoal: [number, number][]
}

export interface AStarResult {
  path: [number, number][]
  logs: LogEntry[]
  steps: AStarStep[] // Return all steps for visualization
}

class Logger {
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

export const logger = new Logger()

interface Node {
  row: number
  col: number
  g: number // g(n): cost from start to current node
  h: number // h(n): heuristic cost from current node to goal
  f: number // f(n): total cost = g(n) + h(n)
  parent: Node | null // parent node for path reconstruction
}

/**
 * Heuristic function: Manhattan Distance
 * Calculates the estimated distance from current position to goal
 * Suitable for 4-directional movement (no diagonals)
 */
const heuristic = (row: number, col: number, goalRow: number, goalCol: number): number => {
  // Manhattan distance: |x1 - x2| + |y1 - y2|
  return Math.abs(row - goalRow) + Math.abs(col - goalCol)
}

export const aStar = (
  grid: number[][],
  start: [number, number],
  goal: [number, number],
): { path: [number, number][]; logs: LogEntry[] } => {
  logger.clear()
  const startTime = performance.now()

  try {
    // ========== BƯỚC 1: INPUT VALIDATION ==========
    logger.log("INFO", "A* ALGORITHM STARTED", {})

    logger.log("INFO", "BƯỚC 1: VALIDATION INPUT", {
      gridSize: `${grid.length} x ${grid[0]?.length || 0}`,
      startPosition: `[${start[0]}, ${start[1]}]`,
      goalPosition: `[${goal[0]}, ${goal[1]}]`,
    })

    if (!grid || grid.length === 0) {
      throw new Error("❌ Invalid grid: empty or null")
    }

    const [startRow, startCol] = start
    const [goalRow, goalCol] = goal

    // Validate start coordinates
    if (startRow < 0 || startRow >= grid.length || startCol < 0 || startCol >= grid[0].length) {
      throw new Error(`❌ Invalid start position: [${startRow}, ${startCol}] - out of bounds`)
    }

    // Validate goal coordinates
    if (goalRow < 0 || goalRow >= grid.length || goalCol < 0 || goalCol >= grid[0].length) {
      throw new Error(`❌ Invalid goal position: [${goalRow}, ${goalCol}] - out of bounds`)
    }

    // Check if start is a wall
    if (grid[startRow][startCol] === 1) {
      throw new Error(`❌ Start position [${startRow}, ${startCol}] is a wall (value = 1)`)
    }

    // Check if goal is a wall
    if (grid[goalRow][goalCol] === 1) {
      throw new Error(`❌ Goal position [${goalRow}, ${goalCol}] is a wall (value = 1)`)
    }

    logger.log("INFO", "✓ Input validation passed", {})

    // ========== BƯỚC 2: INITIALIZATION ==========
    logger.log("INFO", "", {})
    logger.log("INFO", "BƯỚC 2: KHỞI TẠO (Initialization)", {})
    logger.log("INFO", "- Tạo hàng đợi ưu tiên (openSet) chứa START", {})
    logger.log("INFO", "- Khởi tạo bảng đóng (closedSet)", {})
    logger.log("INFO", "- Khởi tạo bảng chi phí (nodeMap)", {})

    const openSet: Node[] = [] // Hàng đợi ưu tiên: chứa ô cần xử lý
    const closedSet: Set<string> = new Set() // Bảng đóng: ô đã xử lý
    const nodeMap: Map<string, Node> = new Map() // Lưu trữ info từng ô

    // Tạo START node
    const startNode: Node = {
      row: startRow,
      col: startCol,
      g: 0, // Bước 0 (tại chính nó)
      h: heuristic(startRow, startCol, goalRow, goalCol), // Ước lượng đến GOAL
      f: 0, // Sẽ tính ở dòng tiếp theo
      parent: null, // START không có parent
    }
    startNode.f = startNode.g + startNode.h // f = 0 + h

    openSet.push(startNode)
    nodeMap.set(`${startRow},${startCol}`, startNode)

    logger.log("INFO", "✓ Khởi tạo xong", {
      startNodeF: startNode.f,
      startNodeG: startNode.g,
      startNodeH: startNode.h,
    })

    let iterations = 0
    const maxIterations = grid.length * grid[0].length * 2

    // ========== BƯỚC 3: DUYỆT CHÍNH ==========
    logger.log("INFO", "", {})
    logger.log("INFO", "BƯỚC 3: DUYỆT VÀ CẬP NHẬT (Main Loop)", {})

    while (openSet.length > 0) {
      iterations++

      if (iterations > maxIterations) {
        throw new Error(`❌ Maximum iterations exceeded (${maxIterations}) - possible infinite loop`)
      }

      // === 3a: Chọn ô có f(n) nhỏ nhất ===
      let current = openSet[0]
      let currentIndex = 0

      // Tìm ô với f nhỏ nhất
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < current.f) {
          current = openSet[i]
          currentIndex = i
        }
      }

      // Log iteration chi tiết mỗi 50 bước (tránh log quá nhiều)
      if (iterations % 50 === 0) {
        logger.log("DEBUG", `Iteration ${iterations}: Xử lý ô [${current.row},${current.col}]`, {
          f: current.f,
          g: current.g,
          h: current.h,
          openSetSize: openSet.length,
          closedSetSize: closedSet.size,
        })
      }

      // === 3b: Kiểm tra đã đến GOAL chưa ===
      if (current.row === goalRow && current.col === goalCol) {
        logger.log("INFO", "", {})
        logger.log("INFO", "✓✓✓ GOAL FOUND! ✓✓✓", {})
        logger.log("INFO", `Đã tìm thấy GOAL tại [${goalRow}, ${goalCol}]`, {
          afterIteration: iterations,
        })

        // ========== BƯỚC 4: TRUY VẾT ĐƯỜNG ĐI ==========
        logger.log("INFO", "", {})
        logger.log("INFO", "BƯỚC 4: TRUY VẾT ĐƯỜNG ĐI (Path Reconstruction)", {})
        logger.log("INFO", '- Từ GOAL → lần ngược về START dùng bảng "parent"', {})

        const path: [number, number][] = []
        let node: Node | null = current
        let steps = 0

        while (node) {
          path.unshift([node.row, node.col])
          node = node.parent
          steps++
        }

        logger.log("INFO", `✓ Truy vết xong (${steps} nút)`, {
          pathLength: path.length,
        })

        // ========== BƯỚC 5: KẾT QUẢ CUỐI CÙNG ==========
        logger.log("INFO", "", {})
        logger.log("INFO", "BƯỚC 5: TÍNH TOÁN KẾT QUẢ CUỐI CÙNG", {})

        const endTime = performance.now()
        const runtime = (endTime - startTime).toFixed(2)

        logger.log("INFO", "A* ALGORITHM COMPLETED SUCCESSFULLY ✓", {})
        logger.log("INFO", "═══════════════════════════════════════════", {
          pathLength: path.length,
          totalIterations: iterations,
          runtimeMs: `${runtime} ms`,
          openSetFinal: openSet.length,
          closedSetFinal: closedSet.size,
          totalNodeVisited: closedSet.size + 1,
        })

        return { path: path as [number, number][], logs: logger.getLogs() }
      }

      // === 3c: Di chuyển ô từ openSet sang closedSet ===
      openSet.splice(currentIndex, 1)
      closedSet.add(`${current.row},${current.col}`)

      // === 3d: Duyệt 4 ô kề (Up, Down, Left, Right) ===
      const directions = [
        { name: "↑ UP", row: current.row - 1, col: current.col },
        { name: "↓ DOWN", row: current.row + 1, col: current.col },
        { name: "← LEFT", row: current.row, col: current.col - 1 },
        { name: "→ RIGHT", row: current.row, col: current.col + 1 },
      ]

      for (const dir of directions) {
        const newRow = dir.row
        const newCol = dir.col

        // Kiểm tra ngoài biên
        if (newRow < 0 || newRow >= grid.length || newCol < 0 || newCol >= grid[0].length) {
          continue // Bỏ qua ô ngoài biên
        }

        // Kiểm tra có phải tường không
        if (grid[newRow][newCol] === 1) {
          continue // Bỏ qua ô tường
        }

        const key = `${newRow},${newCol}`

        // Kiểm tra đã xử lý chưa
        if (closedSet.has(key)) {
          continue // Bỏ qua ô trong closedSet
        }

        // Tính chi phí cho ô kề
        const g = current.g + 1 // g_new = g_current + 1 bước
        const h = heuristic(newRow, newCol, goalRow, goalCol) // ước lượng đến goal
        const f = g + h // f = g + h

        const existingNode = nodeMap.get(key)

        if (!existingNode) {
          // Ô mới chưa thăm
          const newNode: Node = {
            row: newRow,
            col: newCol,
            g,
            h,
            f,
            parent: current, // Ghi nhớ cha để truy vết
          }
          nodeMap.set(key, newNode)
          openSet.push(newNode)
        } else if (g < existingNode.g) {
          // Tìm được đường tốt hơn đến ô này
          logger.log("DEBUG", `Cập nhật đường tốt hơn đến [${newRow},${newCol}]`, {
            oldG: existingNode.g,
            newG: g,
            oldF: existingNode.f,
            newF: f,
          })

          existingNode.g = g
          existingNode.f = g + existingNode.h
          existingNode.parent = current
        }
      }
    }

    // ========== KHÔNG TÌM THẤY ĐƯỜNG ==========
    const endTime = performance.now()
    const runtime = (endTime - startTime).toFixed(2)

    logger.log("INFO", "", {})
    logger.log("INFO", "═══════════════════════════════════════════", {})
    logger.log("INFO", "⚠ NO PATH FOUND", {})
    logger.log("INFO", "═══════════════════════════════════════════", {
      totalIterations: iterations,
      runtimeMs: `${runtime} ms`,
      closedSetSize: closedSet.size,
      message: "openSet rỗng mà chưa tìm GOAL → không có đường hợp lệ",
    })

    return { path: [], logs: logger.getLogs() }
  } catch (error) {
    // ========== XỬ LÝ LỖI ==========
    const endTime = performance.now()
    const runtime = (endTime - startTime).toFixed(2)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    logger.log("ERROR", "", {})
    logger.log("ERROR", "═══════════════════════════════════════════", {})
    logger.log("ERROR", "❌ ERROR OCCURRED", {})
    logger.log("ERROR", "═══════════════════════════════════════════", {
      error: errorMessage,
      runtimeMs: `${runtime} ms`,
    })

    return { path: [], logs: logger.getLogs() }
  }
}

export const aStarWithSteps = (grid: number[][], start: [number, number], goal: [number, number]): AStarResult => {
  logger.clear()
  const startTime = performance.now()
  const steps: AStarStep[] = [] // Collect all steps

  try {
    // ========== BƯỚC 1: INPUT VALIDATION ==========
    logger.log("INFO", "A* ALGORITHM STARTED (WITH STEP TRACKING)", {})

    logger.log("INFO", "BƯỚC 1: VALIDATION INPUT", {
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

    logger.log("INFO", "✓ Input validation passed", {})

    // ========== BƯỚC 2: INITIALIZATION ==========
    logger.log("INFO", "", {})
    logger.log("INFO", "BƯỚC 2: KHỞI TẠO (Initialization)", {})
    logger.log("INFO", "- Tạo hàng đợi ưu tiên (openSet) chứa START", {})
    logger.log("INFO", "- Khởi tạo bảng đóng (closedSet)", {})
    logger.log("INFO", "- Khởi tạo bảng chi phí (nodeMap)", {})

    const openSet: Node[] = [] // Hàng đợi ưu tiên: chứa ô cần xử lý
    const closedSet: Set<string> = new Set() // Bảng đóng: ô đã xử lý
    const nodeMap: Map<string, Node> = new Map() // Lưu trữ info từng ô

    // Tạo START node
    const startNode: Node = {
      row: startRow,
      col: startCol,
      g: 0, // Bước 0 (tại chính nó)
      h: heuristic(startRow, startCol, goalRow, goalCol), // Ước lượng đến GOAL
      f: 0, // Sẽ tính ở dòng tiếp theo
      parent: null, // START không có parent
    }
    startNode.f = startNode.g + startNode.h // f = 0 + h

    openSet.push(startNode)
    nodeMap.set(`${startRow},${startCol}`, startNode)

    logger.log("INFO", "✓ Khởi tạo xong", {})

    let iterations = 0
    const maxIterations = grid.length * grid[0].length * 2

    // ========== BƯỚC 3: DUYỆT CHÍNH ==========
    logger.log("INFO", "", {})
    logger.log("INFO", "BƯỚC 3: DUYỆT VÀ CẬP NHẬT (Main Loop)", {})

    while (openSet.length > 0) {
      iterations++

      if (iterations > maxIterations) {
        throw new Error(`❌ Maximum iterations exceeded (${maxIterations})`)
      }

      // Find node with minimum f value
      let current = openSet[0]
      let currentIndex = 0

      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < current.f) {
          current = openSet[i]
          currentIndex = i
        }
      }

      const openSetCopy: [number, number][] = openSet.map((n) => [n.row, n.col])
      const closedSetArray: [number, number][] = Array.from(closedSet).map((key) => {
        const [row, col] = key.split(",").map(Number)
        return [row, col]
      })

      // Reconstruct path to goal for visualization
      let tempNode: Node | null = current
      const pathToGoal: [number, number][] = []
      while (tempNode) {
        pathToGoal.unshift([tempNode.row, tempNode.col])
        tempNode = tempNode.parent
      }

      steps.push({
        iteration: iterations,
        currentNode: [current.row, current.col],
        openSet: openSetCopy,
        closedSet: closedSetArray,
        fValue: current.f,
        gValue: current.g,
        hValue: current.h,
        pathToGoal,
      })

      if (iterations % 50 === 0) {
        logger.log("DEBUG", `Iteration ${iterations}: [${current.row},${current.col}]`, {
          f: current.f,
          g: current.g,
          h: current.h,
          openSetSize: openSet.length,
          closedSetSize: closedSet.size,
        })
      }

      // Check if goal found
      if (current.row === goalRow && current.col === goalCol) {
        logger.log("INFO", "", {})
        logger.log("INFO", "✓✓✓ GOAL FOUND! ✓✓✓", {})

        const path: [number, number][] = []
        let node: Node | null = current
        let pathSteps = 0

        while (node) {
          path.unshift([node.row, node.col])
          node = node.parent
          pathSteps++
        }

        logger.log("INFO", "", {})
        logger.log("INFO", "BƯỚC 4: TÍNH TOÁN KẾT QUẢ CUỐI CÙNG", {})

        const endTime = performance.now()
        const runtime = (endTime - startTime).toFixed(2)

        logger.log("INFO", "A* ALGORITHM COMPLETED SUCCESSFULLY ✓", {})
        logger.log("INFO", "═══════════════════════════════════════════", {
          pathLength: path.length,
          totalIterations: iterations,
          totalSteps: steps.length,
          runtimeMs: `${runtime} ms`,
        })

        return { path: path as [number, number][], logs: logger.getLogs(), steps }
      }

      openSet.splice(currentIndex, 1)
      closedSet.add(`${current.row},${current.col}`)

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

        if (closedSet.has(key)) {
          continue
        }

        const g = current.g + 1
        const h = heuristic(newRow, newCol, goalRow, goalCol)
        const f = g + h

        const existingNode = nodeMap.get(key)

        if (!existingNode) {
          const newNode: Node = {
            row: newRow,
            col: newCol,
            g,
            h,
            f,
            parent: current,
          }
          nodeMap.set(key, newNode)
          openSet.push(newNode)
        } else if (g < existingNode.g) {
          existingNode.g = g
          existingNode.f = g + existingNode.h
          existingNode.parent = current
        }
      }
    }

    const endTime = performance.now()
    const runtime = (endTime - startTime).toFixed(2)

    logger.log("INFO", "═══════════════════════════════════════════", {})
    logger.log("INFO", "⚠ NO PATH FOUND", {})
    logger.log("INFO", "═══════════════════════════════════════════", {
      totalIterations: iterations,
      totalSteps: steps.length,
      runtimeMs: `${runtime} ms`,
    })

    return { path: [], logs: logger.getLogs(), steps }
  } catch (error) {
    const endTime = performance.now()
    const runtime = (endTime - startTime).toFixed(2)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    logger.log("ERROR", "═══════════════════════════════════════════", {})
    logger.log("ERROR", "❌ ERROR OCCURRED", {
      error: errorMessage,
      runtimeMs: `${runtime} ms`,
    })

    return { path: [], logs: logger.getLogs(), steps }
  }
}
