import { getConnectionPointCoords } from '../modules/ShapeGeometry'
import { CANVAS_CONFIG } from '../constants/CANVAS_CONFIG'

function generateCurvedPath(x1, y1, x2, y2) {
  const cx = (x1 + x2) / 2
  const cy = (y1 + y2) / 2
  const offsetY = CANVAS_CONFIG.CONNECTION_POINT.curveOffset
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
}) {
  const sourceShape = shapes.find((s) => s.id === connector.source)
  const targetShape = shapes.find((s) => s.id === connector.target)

  if (!sourceShape || !targetShape) return null

  const sourceCoord = getConnectionPointCoords(sourceShape, connector.sourcePoint)
  const targetCoord = getConnectionPointCoords(targetShape, connector.targetPoint)
  const pathD = generateCurvedPath(sourceCoord.x, sourceCoord.y, targetCoord.x, targetCoord.y)
  const midpoint = getPathMidpoint(pathD)

  return (
    <g
      key={connector.id}
      onMouseDown={(e) => onClick(connector.id, e)}
      onDoubleClick={(e) => onDoubleClick(connector.id, e, connector.label)}
      pointerEvents="bounding-box"
      style={{ cursor: 'pointer' }}
    >
      <path
        d={pathD}
        fill="none"
        stroke="var(--connector-color)"
        strokeWidth="2"
        strokeDasharray={isSelected ? '5,5' : 'none'}
        markerEnd="url(#arrowhead)"
      />

      {/* Selection indicator */}
      {isSelected && (
        <path
          d={pathD}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="5"
          opacity="0.5"
          pointerEvents="none"
          markerEnd="url(#arrowhead)"
        />
      )}

      {/* Label background and text */}
      {connector.label && (
        <>
          <rect
            x={midpoint.x - CANVAS_CONFIG.CONNECTOR_LABEL.width / 2}
            y={midpoint.y - CANVAS_CONFIG.CONNECTOR_LABEL.height / 2}
            width={CANVAS_CONFIG.CONNECTOR_LABEL.width}
            height={CANVAS_CONFIG.CONNECTOR_LABEL.height}
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
        strokeWidth="20"
        pointerEvents="auto"
      />
    </g>
  )
}
