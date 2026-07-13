import { useState, useCallback, useRef, useEffect } from 'react'
import { isPointInShape, findHoveredConnectionPoint } from '../modules/ShapeGeometry'

/**
 * useConnectionCreation - Manages connection creation interactions (drag-to-connect).
 * Handles connection start, hover detection, and completion.
 *
 * @param {Array} shapes - Array of shape objects
 * @param {Function} onAddConnector - Callback when connection is completed
 * @returns {Object} Connection state and handlers
 */
export function useConnectionCreation(shapes, onAddConnector) {
  const [connectionStart, setConnectionStart] = useState(null)
  const [connectionPointId, setConnectionPointId] = useState(null)
  const [dragEndpoint, setDragEndpoint] = useState(null)
  const [hoveredShapeId, setHoveredShapeId] = useState(null)
  const [hoveredConnectionPoint, setHoveredConnectionPoint] = useState(null)

  // Keep shapes reference stable for memoized callbacks
  const shapesRef = useRef(shapes)
  useEffect(() => {
    shapesRef.current = shapes
  }, [shapes])

  const handleConnectionPointMouseDown = useCallback((shapeId, pointId) => {
    setConnectionStart(shapeId)
    setConnectionPointId(pointId)
  }, [])

  const handleMouseMove = useCallback((endpoint) => {
    if (!connectionStart) return

    const currentShapes = shapesRef.current
    setDragEndpoint(endpoint)

    // Find which shape (if any) the cursor is over (excluding source shape)
    const hoveredShape = currentShapes.find(
      (shape) => shape.id !== connectionStart && isPointInShape(endpoint, shape)
    )
    setHoveredShapeId(hoveredShape?.id || null)

    // Check if hovering over a connection point on the target shape
    if (hoveredShape) {
      const pointId = findHoveredConnectionPoint(endpoint, hoveredShape.id, currentShapes)
      setHoveredConnectionPoint(pointId)
    } else {
      setHoveredConnectionPoint(null)
    }
  }, [connectionStart])

  const handleMouseUp = useCallback(() => {
    // Complete connection if valid
    if (
      connectionStart &&
      hoveredShapeId &&
      hoveredShapeId !== connectionStart &&
      hoveredConnectionPoint
    ) {
      onAddConnector(connectionStart, hoveredShapeId, connectionPointId, hoveredConnectionPoint)
    }

    // Clear all state
    setConnectionStart(null)
    setConnectionPointId(null)
    setDragEndpoint(null)
    setHoveredShapeId(null)
    setHoveredConnectionPoint(null)
  }, [connectionStart, hoveredShapeId, connectionPointId, hoveredConnectionPoint, onAddConnector])

  return {
    connectionStart,
    connectionPointId,
    dragEndpoint,
    hoveredShapeId,
    hoveredConnectionPoint,
    handleConnectionPointMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}
