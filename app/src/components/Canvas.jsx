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
}) {
  const svgRef = useRef(null)
  const [connectionStart, setConnectionStart] = useState(null)
  const [dragEndpoint, setDragEndpoint] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [editingType, setEditingType] = useState(null)

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

  const handleCanvasClick = (e) => {
    if (selectedShapeType && e.target === svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      onAddShape({ x, y })
    }
  }

  const handleShapeMouseDown = (shapeId, e) => {
    e.stopPropagation()
    onSelectShape(shapeId)
    setConnectionStart(shapeId)
    setDragEndpoint(null)
  }

  const handleSvgMouseMove = (e) => {
    if (connectionStart) {
      const rect = svgRef.current.getBoundingClientRect()
      setDragEndpoint({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleSvgMouseUp = (e) => {
    e.stopPropagation()
    setConnectionStart(null)
    setDragEndpoint(null)
  }

  const handleShapeMouseUp = (targetId, e) => {
    e.stopPropagation()
    if (connectionStart && connectionStart !== targetId) {
      onAddConnector(connectionStart, targetId)
    }
    setConnectionStart(null)
    setDragEndpoint(null)
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
      <TransformWrapper>
        <TransformComponent>
          <svg
            ref={svgRef}
            className="canvas"
            onClick={handleCanvasClick}
            onMouseMove={handleSvgMouseMove}
            onMouseUp={handleSvgMouseUp}
            onMouseLeave={handleSvgMouseUp}
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
              return (
                <line
                  x1={startShape.x + 60}
                  y1={startShape.y + 40}
                  x2={dragEndpoint.x}
                  y2={dragEndpoint.y}
                  stroke="#9ca3af"
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
                onMouseDown={handleShapeMouseDown}
                onMouseUp={handleShapeMouseUp}
                onDoubleClick={handleShapeDoubleClick}
                onEditSubmit={handleEditSubmit}
                isEditing={editingId === shape.id}
                editingText={editingText}
                setEditingText={setEditingText}
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
