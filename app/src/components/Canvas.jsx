import { useState, useRef, useEffect } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import ShapeElement from './ShapeElement'
import Connector from './Connector'
import './Canvas.css'

export default function Canvas({
  shapes,
  connectors,
  selectedShapeType,
  selectedId,
  onAddShape,
  onAddConnector,
  onSelectShape,
  onUpdateShape,
  onDeleteShape,
  onDeleteConnector,
  onUpdateConnector,
  onZoomChange,
}) {
  const svgRef = useRef(null)
  const [connectionStart, setConnectionStart] = useState(null)
  const [connectionPointId, setConnectionPointId] = useState(null)
  const [dragEndpoint, setDragEndpoint] = useState(null)
  const [hoveredShapeId, setHoveredShapeId] = useState(null)
  const [hoveredConnectionPoint, setHoveredConnectionPoint] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [editingType, setEditingType] = useState(null)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState(null)
  const [isDraggingShape, setIsDraggingShape] = useState(false)
  const [draggedShapeId, setDraggedShapeId] = useState(null)
  const [dragShapeStart, setDragShapeStart] = useState(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedId) {
        const isShape = shapes.some((s) => s.id === selectedId)
        const isConnector = connectors.some((c) => c.id === selectedId)

        if (isShape) onDeleteShape(selectedId)
        else if (isConnector) onDeleteConnector(selectedId)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId, shapes, connectors, onDeleteShape, onDeleteConnector])

  const isPointOverShapeOrConnector = (point) => {
    // Check if point is over any shape
    const isOverShape = shapes.some((shape) => isPointInShape(point, shape))
    if (isOverShape) return true

    // For now, consider all canvas as safe (connectors are harder to hit-test)
    return false
  }

  const getSVGCoordinates = (e) => {
    const svg = svgRef.current
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const screenCTM = svg.getScreenCTM()
    const coords = pt.matrixTransform(screenCTM.inverse())
    return { x: coords.x, y: coords.y }
  }

  const handleCanvasMouseDown = (e) => {
    // Left mouse button pan (only when not over a shape)
    if (e.button === 0 && !selectedShapeType && !connectionStart) {
      const point = getSVGCoordinates(e)

      if (!isPointOverShapeOrConnector(point)) {
        setIsPanning(true)
        setPanStart({ x: e.clientX, y: e.clientY })
      }
    }

    // Also handle canvas click for adding shapes
    if (selectedShapeType && e.button === 0) {
      const { x: clickX, y: clickY } = getSVGCoordinates(e)

      // Center shape on cursor (offset by half shape dimensions)
      const SHAPE_WIDTH = 120
      const SHAPE_HEIGHT = 80
      const x = clickX - SHAPE_WIDTH / 2
      const y = clickY - SHAPE_HEIGHT / 2

      onAddShape({ x, y })
    }
  }

  const handleCanvasMouseMove = (e) => {
    // Handle shape dragging
    if (isDraggingShape && draggedShapeId && dragShapeStart) {
      const { x: currentX, y: currentY } = getSVGCoordinates(e)

      const dx = currentX - dragShapeStart.x
      const dy = currentY - dragShapeStart.y

      const newX = dragShapeStart.shapeX + dx
      const newY = dragShapeStart.shapeY + dy

      onUpdateShape(draggedShapeId, { x: newX, y: newY })
    }

    if (isPanning && panStart) {
      const dx = e.clientX - panStart.x
      const dy = e.clientY - panStart.y

      // Pan by translating the SVG
      if (svgRef.current) {
        const transform = svgRef.current.style.transform || ''
        const currentTranslate = transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/)
        const currentX = currentTranslate ? parseFloat(currentTranslate[1]) : 0
        const currentY = currentTranslate ? parseFloat(currentTranslate[2]) : 0

        const newX = currentX + dx
        const newY = currentY + dy

        svgRef.current.style.transform = `translate(${newX}px, ${newY}px)`
        setPanStart({ x: e.clientX, y: e.clientY })
      }
    }

    // Handle drag-to-connect
    if (connectionStart) {
      const endpoint = getSVGCoordinates(e)
      setDragEndpoint(endpoint)

      // Find which shape (if any) the cursor is over
      const hoveredShape = shapes.find(
        (shape) => shape.id !== connectionStart && isPointInShape(endpoint, shape)
      )
      setHoveredShapeId(hoveredShape?.id || null)

      // Check if hovering over a connection point on the target shape
      if (hoveredShape) {
        const pointId = findHoveredConnectionPoint(endpoint, hoveredShape.id)
        setHoveredConnectionPoint(pointId)
      } else {
        setHoveredConnectionPoint(null)
      }
    }
  }

  const handleCanvasMouseUp = (e) => {
    if (isDraggingShape) {
      setIsDraggingShape(false)
      setDraggedShapeId(null)
      setDragShapeStart(null)
    }

    if (isPanning) {
      setIsPanning(false)
      setPanStart(null)
    }

    if (connectionStart && hoveredShapeId && hoveredShapeId !== connectionStart && hoveredConnectionPoint) {
      onAddConnector(connectionStart, hoveredShapeId, connectionPointId, hoveredConnectionPoint)
    }
    setConnectionStart(null)
    setConnectionPointId(null)
    setDragEndpoint(null)
    setHoveredShapeId(null)
    setHoveredConnectionPoint(null)
  }

  const handleShapeMouseDown = (shapeId, e) => {
    e.stopPropagation()
    onSelectShape(shapeId)

    // Left button = start shape drag
    if (e.button === 0) {
      const { x, y } = getSVGCoordinates(e)
      setIsDraggingShape(true)
      setDraggedShapeId(shapeId)
      setDragShapeStart({
        x,
        y,
        shapeX: shapes.find((s) => s.id === shapeId)?.x || 0,
        shapeY: shapes.find((s) => s.id === shapeId)?.y || 0,
      })
    }

    e.preventDefault()
  }

  const handleConnectionPointMouseDown = (shapeId, pointId, e) => {
    e.stopPropagation()
    setConnectionStart(shapeId)
    setConnectionPointId(pointId)
    e.preventDefault()
  }

  const getConnectionPointCoords = (shape, pointId) => {
    const cx = shape.x + 60
    const cy = shape.y + 40
    switch (pointId) {
      case 'left':
        return { x: shape.x, y: cy }
      case 'top':
        return { x: cx, y: shape.y }
      case 'right':
        return { x: shape.x + 120, y: cy }
      case 'bottom':
        return { x: cx, y: shape.y + 80 }
      default:
        return { x: cx, y: cy }
    }
  }

  const findHoveredConnectionPoint = (point, targetShapeId) => {
    const shape = shapes.find((s) => s.id === targetShapeId)
    if (!shape) return null

    const pointIds = ['left', 'top', 'right', 'bottom']
    const hitRadius = 8

    for (const pointId of pointIds) {
      const coords = getConnectionPointCoords(shape, pointId)
      const distance = Math.sqrt((point.x - coords.x) ** 2 + (point.y - coords.y) ** 2)
      if (distance <= hitRadius) {
        return pointId
      }
    }
    return null
  }

  const isPointInShape = (point, shape) => {
    const SHAPE_WIDTH = 120
    const SHAPE_HEIGHT = 80
    const cx = shape.x + SHAPE_WIDTH / 2
    const cy = shape.y + SHAPE_HEIGHT / 2

    // Simple AABB collision for now (works for rectangles)
    // For other shapes, use bounding box which is close enough
    return (
      point.x >= shape.x - 5 &&
      point.x <= shape.x + SHAPE_WIDTH + 5 &&
      point.y >= shape.y - 5 &&
      point.y <= shape.y + SHAPE_HEIGHT + 5
    )
  }



  const handleShapeDoubleClick = (shapeId, e, currentLabel) => {
    e.stopPropagation()
    setEditingId(shapeId)
    setEditingText(currentLabel)
    setEditingType('shape')
  }

  const handleConnectorDoubleClick = (connectorId, e, currentLabel) => {
    e.stopPropagation()
    setEditingId(connectorId)
    setEditingText(currentLabel)
    setEditingType('connector')
  }

  const handleEditSubmit = () => {
    if (editingType === 'shape') {
      onUpdateShape(editingId, { label: editingText })
    } else if (editingType === 'connector') {
      onUpdateConnector(editingId, { label: editingText })
    }
    setEditingId(null)
    setEditingText('')
    setEditingType(null)
  }

  const handleConnectorClick = (connectorId, e) => {
    e.stopPropagation()
    onSelectShape(connectorId)
  }

  return (
    <div className="canvas-container">
      <TransformWrapper
        disablePanning
        wheel={{ step: 10 }}
        onTransformed={(instance) => {
          if (onZoomChange) {
            onZoomChange(Math.round(instance.state.scale * 100))
          }
        }}
      >
        <TransformComponent>
          <svg
            ref={svgRef}
            className="canvas"
            width="4000"
            height="3000"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            style={{
              cursor: isPanning ? 'grabbing' : isDraggingShape ? 'grabbing' : 'default',
              userSelect: 'none',
            }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#1f2937" />
              </marker>
            </defs>

            {/* Connectors */}
            {connectors.map((connector) => (
              <Connector
                key={connector.id}
                connector={connector}
                shapes={shapes}
                isSelected={selectedId === connector.id}
                onDoubleClick={handleConnectorDoubleClick}
                onClick={handleConnectorClick}
                onEditSubmit={handleEditSubmit}
                isEditing={editingId === connector.id}
                editingText={editingText}
                setEditingText={setEditingText}
              />
            ))}

            {/* Temporary connection line during drag */}
            {connectionStart && dragEndpoint && (() => {
              const startShape = shapes.find((s) => s.id === connectionStart)
              if (!startShape) return null

              const startCoord = getConnectionPointCoords(startShape, connectionPointId)
              return (
                <line
                  x1={startCoord.x}
                  y1={startCoord.y}
                  x2={dragEndpoint.x}
                  y2={dragEndpoint.y}
                  stroke={hoveredConnectionPoint ? '#10b981' : '#9ca3af'}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  pointerEvents="none"
                />
              )
            })()}

            {/* Shapes */}
            {shapes.map((shape) => (
              <ShapeElement
                key={shape.id}
                shape={shape}
                isSelected={selectedId === shape.id}
                isConnecting={connectionStart === shape.id}
                isHovered={hoveredShapeId === shape.id}
                onMouseDown={handleShapeMouseDown}
                onDoubleClick={handleShapeDoubleClick}
                onEditSubmit={handleEditSubmit}
                isEditing={editingId === shape.id}
                editingText={editingText}
                setEditingText={setEditingText}
                onConnectionPointMouseDown={handleConnectionPointMouseDown}
              />
            ))}
          </svg>
        </TransformComponent>
      </TransformWrapper>

      {editingId && editingType && (
        <div className="edit-modal-overlay" onClick={() => setEditingId(null)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Label</h3>
            <input
              autoFocus
              type="text"
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEditSubmit()
                if (e.key === 'Escape') setEditingId(null)
              }}
              placeholder="Enter label"
            />
            <div className="modal-buttons">
              <button onClick={handleEditSubmit}>Done</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
