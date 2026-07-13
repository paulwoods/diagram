import ShapeRenderer from './ShapeRenderer'

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
  return (
    <ShapeRenderer
      shape={shape}
      isSelected={isSelected}
      isConnecting={isConnecting}
      isHovered={isHovered}
      isDraggingConnector={isDraggingConnector}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      onConnectionPointMouseDown={onConnectionPointMouseDown}
    />
  )
}
