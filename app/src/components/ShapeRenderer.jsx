import { CANVAS_CONFIG } from '../constants/CANVAS_CONFIG'
import { getConnectionPoints } from '../modules/ShapeGeometry'
import { useEditingContext } from '../contexts/EditingContext'

/* Shapes render as ink linework: the shape's color is its stroke, with a
   light tint fill so the drafting grid shows through like traced paper. */
function renderShapeGeometry(type, x, y, color) {
  const width = CANVAS_CONFIG.SHAPE.width
  const height = CANVAS_CONFIG.SHAPE.height
  const cx = x + width / 2
  const cy = y + height / 2
  const inkStyle = {
    fill: color,
    fillOpacity: 0.14,
    stroke: color,
    strokeWidth: 2,
  }

  switch (type) {
    case 'rectangle':
      return <rect x={x} y={y} width={width} height={height} rx="4" {...inkStyle} />
    case 'diamond':
      return (
        <polygon
          points={`${cx},${y} ${x + width},${cy} ${cx},${y + height} ${x},${cy}`}
          {...inkStyle}
        />
      )
    case 'oval':
      return <ellipse cx={cx} cy={cy} rx={width / 2} ry={height / 2} {...inkStyle} />
    case 'parallelogram':
      return (
        <polygon
          points={`${x + 20},${y} ${x + width},${y} ${x + width - 20},${y + height} ${x},${y + height}`}
          {...inkStyle}
        />
      )
    case 'roundedRectangle':
      return <rect x={x} y={y} width={width} height={height} rx="12" {...inkStyle} />
    case 'circle':
      return <circle cx={cx} cy={cy} r={Math.min(width, height) / 2} {...inkStyle} />
    default:
      return null
  }
}

export default function ShapeRenderer({
  shape,
  isSelected,
  isConnecting,
  isHovered,
  isDraggingConnector,
  onMouseDown,
  onDoubleClick,
  onConnectionPointMouseDown,
}) {
  const { id, type, x, y, label, color } = shape
  const connectionPoints = getConnectionPoints(shape)
  const cx = x + CANVAS_CONFIG.SHAPE.width / 2
  const cy = y + CANVAS_CONFIG.SHAPE.height / 2
  const editing = useEditingContext()

  return (
    <g
      key={id}
      onMouseDown={(e) => onMouseDown(id, e)}
      onDoubleClick={(e) => onDoubleClick(id, e, label)}
      style={{ cursor: 'pointer' }}
    >
      {renderShapeGeometry(type, x, y, color)}

      {/* Selection indicator */}
      {isSelected && (
        <rect
          x={x - 3}
          y={y - 3}
          width={CANVAS_CONFIG.SHAPE.width + 6}
          height={CANVAS_CONFIG.SHAPE.height + 6}
          fill="none"
          stroke={CANVAS_CONFIG.COLORS.selection}
          strokeWidth="2"
          strokeDasharray="4,4"
          pointerEvents="none"
        />
      )}

      {/* Hover indicator during connection */}
      {isHovered && (
        <rect
          x={x - 3}
          y={y - 3}
          width={CANVAS_CONFIG.SHAPE.width + 6}
          height={CANVAS_CONFIG.SHAPE.height + 6}
          fill="none"
          stroke={CANVAS_CONFIG.COLORS.hover}
          strokeWidth="3"
          pointerEvents="none"
        />
      )}

      {/* Connection origin indicator */}
      {isConnecting && (
        <circle
          cx={cx}
          cy={cy}
          r="5"
          fill="var(--hover-color)"
          pointerEvents="none"
        />
      )}

      {/* Label text */}
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="14"
        fill="var(--text-primary)"
        fontFamily="'IBM Plex Sans', sans-serif"
        fontWeight="500"
        pointerEvents="none"
        style={{ userSelect: 'none' }}
      >
        {label}
      </text>

      {/* Connection points */}
      {(isSelected || isDraggingConnector) &&
        connectionPoints.map((point) => (
          <circle
            key={`point-${point.id}`}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="var(--hover-color)"
            stroke="var(--canvas-bg)"
            strokeWidth="1.5"
            onMouseDown={(e) => {
              e.stopPropagation()
              onConnectionPointMouseDown(id, point.id, e)
            }}
            style={{ cursor: 'crosshair' }}
          />
        ))}
    </g>
  )
}
