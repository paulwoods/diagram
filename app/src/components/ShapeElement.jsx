const SHAPE_SIZE = 120

function renderShapeGeometry(type, x, y, color) {
  const width = 120
  const height = 80
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
  onMouseDown,
  onMouseUp,
  onDoubleClick,
  onEditSubmit,
  isEditing,
  editingText,
  setEditingText,
}) {
  const { id, type, x, y, label, color } = shape

  return (
    <g
      key={id}
      onMouseDown={(e) => onMouseDown(id, e)}
      onMouseUp={(e) => onMouseUp(id, e)}
      onDoubleClick={(e) => onDoubleClick(id, e, label)}
    >
      {renderShapeGeometry(type, x, y, color)}

      {/* Selection indicator */}
      {isSelected && (
        <rect
          x={x - 3}
          y={y - 3}
          width={120 + 6}
          height={80 + 6}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="4,4"
          pointerEvents="none"
        />
      )}

      {/* Connection origin indicator */}
      {isConnecting && (
        <circle
          cx={x + 60}
          cy={y + 40}
          r="5"
          fill="#3b82f6"
          pointerEvents="none"
        />
      )}

      {/* Label text */}
      <text
        x={x + 60}
        y={y + 45}
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
    </g>
  )
}
