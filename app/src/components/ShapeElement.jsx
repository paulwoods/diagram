import { CANVAS_CONFIG } from '../constants/CANVAS_CONFIG'
import { getConnectionPoints } from '../modules/ShapeGeometry'

function renderShapeGeometry(type, x, y, color) {
  const width = CANVAS_CONFIG.SHAPE.width
  const height = CANVAS_CONFIG.SHAPE.height
  const cx = x + width / 2
  const cy = y + height / 2

  switch (type) {
    case 'rectangle':
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={color}
          stroke="#1f2937"
          strokeWidth="2"
          rx="4"
        />
      )
    case 'diamond':
      return (
        <polygon
          points={`${cx},${y} ${x + width},${cy} ${cx},${y + height} ${x},${cy}`}
          fill={color}
          stroke="#1f2937"
          strokeWidth="2"
        />
      )
    case 'oval':
      return (
        <ellipse
          cx={cx}
          cy={cy}
          rx={width / 2}
          ry={height / 2}
          fill={color}
          stroke="#1f2937"
          strokeWidth="2"
        />
      )
    case 'parallelogram':
      return (
        <polygon
          points={`${x + 20},${y} ${x + width},${y} ${x + width - 20},${y + height} ${x},${y + height}`}
          fill={color}
          stroke="#1f2937"
          strokeWidth="2"
        />
      )
    case 'roundedRectangle':
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={color}
          stroke="#1f2937"
          strokeWidth="2"
          rx="12"
        />
      )
    case 'circle':
      return (
        <circle
          cx={cx}
          cy={cy}
          r={Math.min(width, height) / 2}
          fill={color}
          stroke="#1f2937"
          strokeWidth="2"
        />
      )
    default:
      return null
  }
}

export default function ShapeElement({
  shape,
  isSelected,
  isConnecting,
  isHovered,
  isDraggingConnector,
  onMouseDown,
  onDoubleClick,
  onEditSubmit,
  isEditing,
  editingText,
  setEditingText,
  onConnectionPointMouseDown,
}) {
  const { id, type, x, y, label, color } = shape
  const connectionPoints = getConnectionPoints(shape)
  const cx = x + CANVAS_CONFIG.SHAPE.width / 2
  const cy = y + CANVAS_CONFIG.SHAPE.height / 2

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
          fill="#3b82f6"
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
        fill="#fff"
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
            fill="#3b82f6"
            stroke="#1f2937"
            strokeWidth="1"
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
