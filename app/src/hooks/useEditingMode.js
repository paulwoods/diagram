import { useState, useCallback } from 'react'

/**
 * useEditingMode - Manages edit mode for shape and connector labels.
 * Handles edit start, text changes, submit, and cancel.
 *
 * @param {Function} onUpdateShape - Callback to update shape label
 * @param {Function} onUpdateConnector - Callback to update connector label
 * @returns {Object} Edit state and handlers
 */
export function useEditingMode(onUpdateShape, onUpdateConnector) {
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [editingType, setEditingType] = useState(null)

  const handleShapeDoubleClick = useCallback((shapeId, currentLabel) => {
    setEditingId(shapeId)
    setEditingText(currentLabel)
    setEditingType('shape')
  }, [])

  const handleConnectorDoubleClick = useCallback((connectorId, currentLabel) => {
    setEditingId(connectorId)
    setEditingText(currentLabel)
    setEditingType('connector')
  }, [])

  const handleEditSubmit = useCallback(() => {
    if (editingType === 'shape') {
      onUpdateShape(editingId, { label: editingText })
    } else if (editingType === 'connector') {
      onUpdateConnector(editingId, { label: editingText })
    }
    setEditingId(null)
    setEditingText('')
    setEditingType(null)
  }, [editingId, editingText, editingType, onUpdateShape, onUpdateConnector])

  const handleEditCancel = useCallback(() => {
    setEditingId(null)
    setEditingText('')
    setEditingType(null)
  }, [])

  return {
    editingId,
    editingText,
    editingType,
    setEditingText,
    handleShapeDoubleClick,
    handleConnectorDoubleClick,
    handleEditSubmit,
    handleEditCancel,
  }
}
