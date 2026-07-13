import { useRef, useEffect } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import ShapeElement from './ShapeElement'
import Connector from './Connector'
import EditingModal from './EditingModal'
import { useShapeDragging } from '../hooks/useShapeDragging'
import { useCanvasPanning } from '../hooks/useCanvasPanning'
import { useConnectionCreation } from '../hooks/useConnectionCreation'
import { useEditingMode } from '../hooks/useEditingMode'
import { isPointInShape, getConnectionPointCoords } from '../modules/ShapeGeometry'
import { CANVAS_CONFIG } from '../constants/CANVAS_CONFIG'
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

  // Initialize interaction hooks
  const dragging = useShapeDragging(shapes, onUpdateShape)
  const panning = useCanvasPanning(svgRef)
  const connection = useConnectionCreation(shapes, onAddConnector)
  const editing = useEditingMode(onUpdateShape, onUpdateConnector)

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

  const isPointOverShapeOrConnector = (point) =>
    shapes.some((shape) => isPointInShape(point, shape))

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
    const point = getSVGCoordinates(e)
    const isOverShapeOrConnector = isPointOverShapeOrConnector(point)

    // Left mouse button pan (only when not over a shape or connection)
    if (e.button === 0 && !selectedShapeType && !connection.connectionStart) {
      if (!isOverShapeOrConnector) {
        panning.handleMouseDown(e.clientX, e.clientY)
        onSelectShape(null)
      }
    }

    // Handle canvas click for adding shapes
    if (selectedShapeType && e.button === 0) {
      const { x: clickX, y: clickY } = point
      const x = clickX - CANVAS_CONFIG.SHAPE.width / 2
      const y = clickY - CANVAS_CONFIG.SHAPE.height / 2
      onAddShape({ x, y })
    }
  }

  const handleCanvasMouseMove = (e) => {
    const point = getSVGCoordinates(e)

    // Coordinate handlers based on mode
    if (dragging.isDragging) {
      dragging.handleMouseMove(point)
    } else if (panning.isPanning) {
      panning.handleMouseMove(e.clientX, e.clientY)
    } else if (connection.connectionStart) {
      connection.handleMouseMove(point)
    }
  }

  const handleCanvasMouseUp = (e) => {
    dragging.handleMouseUp()
    panning.handleMouseUp()
    connection.handleMouseUp()
  }

  const handleShapeMouseDown = (shapeId, e) => {
    e.stopPropagation()
    onSelectShape(shapeId)

    if (e.button === 0) {
      const { x, y } = getSVGCoordinates(e)
      dragging.handleMouseDown(shapeId, { x, y })
    }

    e.preventDefault()
  }

  const handleConnectionPointMouseDown = (shapeId, pointId, e) => {
    e.stopPropagation()
    connection.handleConnectionPointMouseDown(shapeId, pointId)
    e.preventDefault()
  }

  const handleShapeDoubleClick = (shapeId, e, currentLabel) => {
    e.stopPropagation()
    editing.handleShapeDoubleClick(shapeId, currentLabel)
  }

  const handleConnectorDoubleClick = (connectorId, e, currentLabel) => {
    e.stopPropagation()
    editing.handleConnectorDoubleClick(connectorId, currentLabel)
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
            width={CANVAS_CONFIG.CANVAS.width}
            height={CANVAS_CONFIG.CANVAS.height}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            style={{
              cursor: panning.isPanning ? 'grabbing' : dragging.isDragging ? 'grabbing' : 'default',
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
                <polygon points="0 0, 10 3, 0 6" fill="var(--arrowhead-color)" />
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
                onClick={(id, e) => {
                  e.stopPropagation()
                  onSelectShape(id)
                }}
                onEditSubmit={editing.handleEditSubmit}
                isEditing={editing.editingId === connector.id}
                editingText={editing.editingText}
                setEditingText={editing.setEditingText}
              />
            ))}

            {/* Temporary connection line during drag */}
            {connection.connectionStart && connection.dragEndpoint && (() => {
              const startShape = shapes.find((s) => s.id === connection.connectionStart)
              if (!startShape) return null

              const startCoord = getConnectionPointCoords(startShape, connection.connectionPointId)
              return (
                <line
                  x1={startCoord.x}
                  y1={startCoord.y}
                  x2={connection.dragEndpoint.x}
                  y2={connection.dragEndpoint.y}
                  stroke={connection.hoveredConnectionPoint ? CANVAS_CONFIG.COLORS.connectorPathActive : CANVAS_CONFIG.COLORS.connectorPath}
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
                isConnecting={connection.connectionStart === shape.id}
                isHovered={connection.hoveredShapeId === shape.id}
                isDraggingConnector={connection.connectionStart !== null}
                onMouseDown={handleShapeMouseDown}
                onDoubleClick={handleShapeDoubleClick}
                onEditSubmit={editing.handleEditSubmit}
                isEditing={editing.editingId === shape.id}
                editingText={editing.editingText}
                setEditingText={editing.setEditingText}
                onConnectionPointMouseDown={handleConnectionPointMouseDown}
              />
            ))}
          </svg>
        </TransformComponent>
      </TransformWrapper>

      <EditingModal
        editingId={editing.editingId}
        editingType={editing.editingType}
        editingText={editing.editingText}
        setEditingText={editing.setEditingText}
        onSubmit={editing.handleEditSubmit}
        onCancel={editing.handleEditCancel}
      />
    </div>
  )
}
