import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * useShapeDragging - Manages shape dragging interactions.
 * Handles drag start, move, and end with delta calculations.
 *
 * @param {Array} shapes - Array of shape objects
 * @param {Function} onUpdateShape - Callback to update shape (shapeId, {x, y})
 * @returns {Object} { isDragging, draggedShapeId, handleMouseDown, handleMouseMove, handleMouseUp }
 */
export function useShapeDragging(shapes, onUpdateShape) {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedShapeId, setDraggedShapeId] = useState(null)
  const [dragStart, setDragStart] = useState(null)

  // Keep shapes reference stable for memoized callbacks
  const shapesRef = useRef(shapes)
  useEffect(() => {
    shapesRef.current = shapes
  }, [shapes])

  const handleMouseDown = useCallback((shapeId, point) => {
    const currentShapes = shapesRef.current
    const shape = currentShapes.find((s) => s.id === shapeId)

    setIsDragging(true)
    setDraggedShapeId(shapeId)
    setDragStart({
      x: point.x,
      y: point.y,
      shapeX: shape?.x || 0,
      shapeY: shape?.y || 0,
    })
  }, [])

  const handleMouseMove = useCallback(
    (point) => {
      if (!isDragging || !draggedShapeId || !dragStart) return

      const dx = point.x - dragStart.x
      const dy = point.y - dragStart.y

      const newX = dragStart.shapeX + dx
      const newY = dragStart.shapeY + dy

      onUpdateShape(draggedShapeId, { x: newX, y: newY })
    },
    [isDragging, draggedShapeId, dragStart, onUpdateShape]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setDraggedShapeId(null)
    setDragStart(null)
  }, [])

  return {
    isDragging,
    draggedShapeId,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}
