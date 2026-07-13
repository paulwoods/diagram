function getConnectionPointCoords(shape, pointId) {
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

function generateCurvedPath(x1, y1, x2, y2) {
  const cx = (x1 + x2) / 2
  const cy = (y1 + y2) / 2
  const offsetY = 50
  const controlY = cy + offsetY

  return `M ${x1} ${y1} Q ${cx} ${controlY} ${x2} ${y2}`
}

function getPathMidpoint(path) {
  // Approximate midpoint for label placement
  const parts = path.split(' ')
  const x1 = parseFloat(parts[1])
  const y1 = parseFloat(parts[2])
  const x2 = parseFloat(parts[5])
  const y2 = parseFloat(parts[6])

  return {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2,
  }
}

export default function Connector({
  connector,
  shapes,
  isSelected,
  onDoubleClick,
  onClick,
  onEditSubmit,
  isEditing,
  editingText,
  setEditingText,
}) {
  const sourceShape = shapes.find((s) => s.id === connector.source)
  const targetShape = shapes.find((s) => s.id === connector.target)

  if (!sourceShape || !targetShape) return null

  const sourceCoord = getConnectionPointCoords(sourceShape, connector.sourcePoint)
  const targetCoord = getConnectionPointCoords(targetShape, connector.targetPoint)
  const pathD = generateCurvedPath(sourceCoord.x, sourceCoord.y, targetCoord.x, targetCoord.y)
  const midpoint = getPathMidpoint(pathD)

  return (
    <g key={connector.id}>
      <path
        d={pathD}
        fill="none"
        stroke="#4b5563"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
        pointerEvents="stroke"
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      />

      {/* Selection indicator */}
      {isSelected && (
        <path
          d={pathD}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="4"
          opacity="0.3"
          pointerEvents="none"
          markerEnd="url(#arrowhead)"
        />
      )}

      {/* Label background and text */}
      {connector.label && (
        <>
          <rect
            x={midpoint.x - 35}
            y={midpoint.y - 14}
            width="70"
            height="28"
            fill="#fff"
            stroke="#d1d5db"
            strokeWidth="1"
            rx="4"
            pointerEvents="none"
          />
          <text
            x={midpoint.x}
            y={midpoint.y + 4}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            fill="#374151"
            fontWeight="500"
            pointerEvents="none"
            style={{ userSelect: 'none' }}
          >
            {connector.label}
          </text>
        </>
      )}

      {/* Hidden larger target for easier clicking */}
      <path
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth="10"
        pointerEvents="stroke"
        onClick={onClick}
        onDoubleClick={(e) => onDoubleClick(connector.id, e, connector.label)}
      />
    </g>
  )
}
