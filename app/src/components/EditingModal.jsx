export default function EditingModal({
  editingId,
  editingType,
  editingText,
  setEditingText,
  onSubmit,
  onCancel,
}) {
  if (!editingId || !editingType) return null

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSubmit()
    if (e.key === 'Escape') onCancel()
  }

  return (
    <div className="edit-modal-overlay" onClick={onCancel}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Label</h3>
        <input
          autoFocus
          type="text"
          value={editingText}
          onChange={(e) => setEditingText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter label"
        />
        <div className="modal-buttons">
          <button onClick={onSubmit}>Done</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
