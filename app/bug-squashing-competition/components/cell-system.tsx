"use client"

import { useState, useEffect, useRef } from "react"

// Cell interface for tracking cells in the background
export interface Cell {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  dividing: boolean
  dividingProgress: number
  stretchFactor: number
  angle: number
  burstParticles: Particle[]
  bursting: boolean
}

export interface Particle {
  x: number
  y: number
  size: number
  color: string
  angle: number
  speed: number
}

interface CellSystemProps {
  onBurstCountChange: (count: number) => void
  onCellCountChange: (count: number) => void
}

export default function CellSystem({ onBurstCountChange, onCellCountChange }: CellSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>(0)
  const cellsRef = useRef<Cell[]>([])
  const nextIdRef = useRef<number>(1)
  const lastDivisionTimeRef = useRef<number>(Date.now())
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [burstCount, setBurstCount] = useState(0)
  const MAX_CELLS = 50
  const DIVISION_INTERVAL = 5000 // 5 seconds

  // Initialize canvas and cells
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const width = window.innerWidth
        const height = Math.max(document.body.scrollHeight, window.innerHeight)
        setCanvasSize({ width, height })

        // If canvas exists, set its dimensions properly
        if (canvasRef.current) {
          canvasRef.current.width = width
          canvasRef.current.height = height
          canvasRef.current.style.width = `${width}px`
          canvasRef.current.style.height = `${height}px`
        }
      }
    }

    // Initial size
    updateCanvasSize()

    // Create initial cells (start with all 50)
    const initialCells: Cell[] = []
    for (let i = 0; i < MAX_CELLS; i++) {
      initialCells.push(createRandomCell(nextIdRef.current + i))
    }
    cellsRef.current = initialCells
    nextIdRef.current += initialCells.length

    // Handle resize
    window.addEventListener("resize", updateCanvasSize)

    // Disable text selection on the entire page
    document.body.style.userSelect = "none"

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      // Reset text selection when component unmounts
      document.body.style.userSelect = ""
    }
  }, [])

  // Set up canvas click handler
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleCanvasClick = (e: MouseEvent) => {
      // Get the click position in viewport coordinates
      const clickX = e.clientX
      const clickY = e.clientY

      // Add scroll position to convert to document coordinates
      const docX = clickX + window.scrollX
      const docY = clickY + window.scrollY

      // Find clicked cell - using document coordinates
      const clickedCellIndex = cellsRef.current.findIndex(
        (cell) => !cell.bursting && !cell.dividing && Math.hypot(cell.x - docX, cell.y - docY) <= cell.size / 2,
      )

      if (clickedCellIndex !== -1) {
        const cell = cellsRef.current[clickedCellIndex]
        burstCell(cell)
        const newCount = burstCount + 1
        setBurstCount(newCount)
        onBurstCountChange(newCount)
      }
    }

    // Use document-level click handler to ensure we catch all clicks
    document.addEventListener("click", handleCanvasClick)
    return () => {
      document.removeEventListener("click", handleCanvasClick)
    }
  }, [burstCount, onBurstCountChange])

  // Set up mouse move handler to change cursor when over cells
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return

      // Get mouse position in viewport coordinates
      const mouseX = e.clientX
      const mouseY = e.clientY

      // Add scroll position to convert to document coordinates
      const docX = mouseX + window.scrollX
      const docY = mouseY + window.scrollY

      // Check if mouse is over any cell using document coordinates
      const isOverCell = cellsRef.current.some(
        (cell) => !cell.bursting && Math.hypot(cell.x - docX, cell.y - docY) <= cell.size / 2,
      )

      // Change cursor style based on whether mouse is over a cell
      document.body.style.cursor = isOverCell ? "pointer" : "default"
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.body.style.cursor = "default" // Reset cursor on cleanup
    }
  }, [])

  // Animation loop using canvas
  useEffect(() => {
    if (!canvasRef.current || canvasSize.width === 0 || canvasSize.height === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ensure canvas dimensions match display dimensions
    if (canvas.width !== canvasSize.width || canvas.height !== canvasSize.height) {
      canvas.width = canvasSize.width
      canvas.height = canvasSize.height
      canvas.style.width = `${canvasSize.width}px`
      canvas.style.height = `${canvasSize.height}px`
    }

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Get current scroll position
      const scrollX = window.scrollX
      const scrollY = window.scrollY

      const now = Date.now()
      const timeSinceLastDivision = now - lastDivisionTimeRef.current

      // Count active (non-bursting) cells
      const activeCells = cellsRef.current.filter((cell) => !cell.bursting)
      const activeCount = activeCells.length

      // Update cell count for UI
      onCellCountChange(activeCount)

      // Check if it's time for a new cell to divide (once every 5 seconds)
      let shouldTriggerDivision = timeSinceLastDivision > DIVISION_INTERVAL && activeCount < MAX_CELLS
      let hasDivided = false

      // Filter out cells that are too small or have no more particles
      cellsRef.current = cellsRef.current.filter(
        (cell) => cell.size > 1 || (cell.bursting && cell.burstParticles.length > 0),
      )

      // Process each cell
      const newCells: Cell[] = []

      cellsRef.current.forEach((cell) => {
        // Move cells (if not bursting or dividing)
        if (!cell.bursting && !cell.dividing) {
          // Update position
          cell.x += cell.vx
          cell.y += cell.vy

          // Bounce off walls
          const radius = cell.size / 2
          if (cell.x - radius < 0) {
            cell.x = radius
            cell.vx = Math.abs(cell.vx)
          } else if (cell.x + radius > canvas.width) {
            cell.x = canvas.width - radius
            cell.vx = -Math.abs(cell.vx)
          }

          if (cell.y - radius < 0) {
            cell.y = radius
            cell.vy = Math.abs(cell.vy)
          } else if (cell.y + radius > canvas.height) {
            cell.y = canvas.height - radius
            cell.vy = -Math.abs(cell.vy)
          }
        }

        // Handle bursting cells
        if (cell.bursting) {
          // Update and draw burst particles
          cell.burstParticles = cell.burstParticles
            .map((particle) => {
              // Update particle position
              particle.x += Math.cos(particle.angle) * particle.speed
              particle.y += Math.sin(particle.angle) * particle.speed
              particle.size *= 0.98 // Slowly shrink

              // Draw particle - adjust for scroll
              ctx.beginPath()
              ctx.arc(particle.x - scrollX, particle.y - scrollY, particle.size / 2, 0, Math.PI * 2)
              ctx.fillStyle = particle.color
              ctx.fill()
              ctx.shadowBlur = 5
              ctx.shadowColor = "rgba(255, 255, 255, 0.5)"
              ctx.closePath()

              return particle
            })
            .filter((particle) => particle.size > 0.5) // Remove tiny particles
        } else if (cell.dividing) {
          // Increment division progress
          cell.dividingProgress += 0.01

          // Calculate stretch factor based on division progress
          if (cell.dividingProgress < 0.5) {
            // Stretching phase
            cell.stretchFactor = 1 + cell.dividingProgress * 1.5
          } else {
            // Splitting phase
            cell.stretchFactor = 2.5 - (cell.dividingProgress - 0.5) * 3
          }

          if (cell.dividingProgress >= 1) {
            // Only complete mitosis if we won't exceed the cell limit
            if (activeCount - 1 + 2 <= MAX_CELLS) {
              // -1 for the dividing cell, +2 for new cells
              // Mitosis complete, create two new cells
              const offset = cell.size * 0.8
              const angle = cell.angle

              newCells.push(
                {
                  ...createRandomCell(nextIdRef.current),
                  x: cell.x + Math.cos(angle) * offset,
                  y: cell.y + Math.sin(angle) * offset,
                  color: cell.color,
                  size: cell.size * 0.7,
                },
                {
                  ...createRandomCell(nextIdRef.current + 1),
                  x: cell.x - Math.cos(angle) * offset,
                  y: cell.y - Math.sin(angle) * offset,
                  color: cell.color,
                  size: cell.size * 0.7,
                },
              )
              nextIdRef.current += 2
            } else {
              // If we would exceed the limit, just keep the original cell
              cell.dividing = false
              cell.dividingProgress = 0
              cell.stretchFactor = 1
              drawNormalCell(ctx, cell, scrollX, scrollY)
              return
            }
            return // Skip drawing this cell
          }

          // Draw dividing cell - adjust for scroll
          drawDividingCell(ctx, cell, scrollX, scrollY)
        } else {
          // Only trigger a division if it's time and we haven't divided yet in this frame
          if (shouldTriggerDivision && !hasDivided && !cell.dividing) {
            // Only pick one random cell to divide
            // Use a random chance to decide if this particular cell should divide
            // This ensures only one cell will divide when the time comes
            const shouldThisCellDivide = Math.random() < 0.05 // Small chance for each cell

            if (shouldThisCellDivide) {
              hasDivided = true
              shouldTriggerDivision = false
              lastDivisionTimeRef.current = now

              // Start division for this cell
              cell.dividing = true
              cell.dividingProgress = 0
              cell.stretchFactor = 1
              cell.angle = Math.random() * Math.PI * 2

              // Once we've chosen a cell to divide, break out of checking other cells
              // by returning early from this iteration
            }
          }

          // Draw normal cell - adjust for scroll
          drawNormalCell(ctx, cell, scrollX, scrollY)
        }
      })

      // Add new cells from division (only if we won't exceed the limit)
      if (newCells.length > 0 && activeCount - 1 + newCells.length <= MAX_CELLS) {
        cellsRef.current = [...cellsRef.current, ...newCells]
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [canvasSize, onCellCountChange])

  // Draw a normal cell
  const drawNormalCell = (ctx: CanvasRenderingContext2D, cell: Cell, scrollX: number, scrollY: number) => {
    // Adjust cell position for scroll
    const x = cell.x - scrollX
    const y = cell.y - scrollY

    // Cell body
    ctx.beginPath()
    ctx.arc(x, y, cell.size / 2, 0, Math.PI * 2)
    ctx.fillStyle = cell.color
    ctx.fill()
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.closePath()

    // Cell nucleus
    ctx.beginPath()
    ctx.arc(x, y, cell.size * 0.15, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
    ctx.fill()
    ctx.closePath()
  }

  // Draw a dividing cell
  const drawDividingCell = (ctx: CanvasRenderingContext2D, cell: Cell, scrollX: number, scrollY: number) => {
    // Adjust cell position for scroll
    const x = cell.x - scrollX
    const y = cell.y - scrollY

    // Save context for rotation
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(cell.angle)

    // Cell body (stretched ellipse)
    ctx.beginPath()
    ctx.ellipse(
      0,
      0,
      (cell.size * cell.stretchFactor) / 2,
      cell.size / (2 * Math.sqrt(cell.stretchFactor)),
      0,
      0,
      Math.PI * 2,
    )
    ctx.fillStyle = cell.color
    ctx.fill()
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.closePath()

    // Dividing nuclei
    const nucleusOffset = cell.size * 0.25 * cell.dividingProgress

    // Left nucleus
    ctx.beginPath()
    ctx.arc(-nucleusOffset, 0, cell.size * 0.12, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
    ctx.fill()
    ctx.closePath()

    // Right nucleus
    ctx.beginPath()
    ctx.arc(nucleusOffset, 0, cell.size * 0.12, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
    ctx.fill()
    ctx.closePath()

    // Division membrane
    if (cell.dividingProgress > 0.5) {
      const opacity = (cell.dividingProgress - 0.5) * 2
      ctx.beginPath()
      ctx.moveTo(0, -cell.size / (2 * Math.sqrt(cell.stretchFactor)))
      ctx.lineTo(0, cell.size / (2 * Math.sqrt(cell.stretchFactor)))
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.closePath()
    }

    // Restore context
    ctx.restore()
  }

  // Burst a cell into particles
  const burstCell = (cell: Cell) => {
    // Create burst particles
    const particles: Particle[] = []
    const numParticles = Math.floor(Math.random() * 15) + 25 // 25-40 particles

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: cell.x,
        y: cell.y,
        size: cell.size * (Math.random() * 0.3 + 0.1), // Larger particles
        color: `hsla(${Math.random() * 360}, 80%, 70%, 0.8)`, // More opaque
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 8 + 3, // Faster particles
      })
    }

    // Update cell
    cell.size = 0 // Cell disappears
    cell.burstParticles = particles
    cell.bursting = true
  }

  // Create a random cell
  const createRandomCell = (id: number): Cell => {
    const containerWidth = typeof window !== "undefined" ? window.innerWidth : 1000
    const containerHeight = typeof window !== "undefined" ? document.body.scrollHeight : 2400
    const size = Math.random() * 60 + 40

    // Ensure cells start fully within the canvas
    const x = Math.random() * (containerWidth - size) + size / 2
    const y = Math.random() * (containerHeight - size) + size / 2

    // Random velocity (slow movement)
    const speed = Math.random() * 0.5 + 0.2
    const angle = Math.random() * Math.PI * 2

    return {
      id,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size,
      color: `hsla(${Math.random() * 360}, 70%, 80%, 0.4)`,
      dividing: false,
      dividingProgress: 0,
      stretchFactor: 1,
      angle: Math.random() * Math.PI * 2,
      burstParticles: [],
      bursting: false,
    }
  }

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 50, pointerEvents: "none" }}
      />
    </div>
  )
}
