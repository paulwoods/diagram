import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useEditingMode } from '../useEditingMode'

describe('useEditingMode', () => {
  describe('initial state', () => {
    it('initializes with editingId = null', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      expect(result.current.editingId).toBeNull()
    })

    it('initializes with editingText = empty string', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      expect(result.current.editingText).toBe('')
    })

    it('initializes with editingType = null', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      expect(result.current.editingType).toBeNull()
    })
  })

  describe('handleShapeDoubleClick', () => {
    it('sets editingId when shape is double clicked', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Original Label')
      })

      expect(result.current.editingId).toBe('shape-1')
    })

    it('sets editingText to current label', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Current Label')
      })

      expect(result.current.editingText).toBe('Current Label')
    })

    it('sets editingType to "shape"', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Label')
      })

      expect(result.current.editingType).toBe('shape')
    })

    it('handles editing different shapes in sequence', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Label 1')
      })

      expect(result.current.editingId).toBe('shape-1')
      expect(result.current.editingText).toBe('Label 1')

      // Start editing different shape
      act(() => {
        result.current.handleShapeDoubleClick('shape-2', 'Label 2')
      })

      expect(result.current.editingId).toBe('shape-2')
      expect(result.current.editingText).toBe('Label 2')
    })

    it('handles empty label', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', '')
      })

      expect(result.current.editingText).toBe('')
      expect(result.current.editingId).toBe('shape-1')
    })

    it('handles special characters in label', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      const specialLabel = 'Label with <>&"\'`@#$%^&*()'
      act(() => {
        result.current.handleShapeDoubleClick('shape-1', specialLabel)
      })

      expect(result.current.editingText).toBe(specialLabel)
    })

    it('handles very long labels', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      const longLabel = 'A'.repeat(1000)
      act(() => {
        result.current.handleShapeDoubleClick('shape-1', longLabel)
      })

      expect(result.current.editingText).toBe(longLabel)
    })
  })

  describe('handleConnectorDoubleClick', () => {
    it('sets editingId when connector is double clicked', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      act(() => {
        result.current.handleConnectorDoubleClick('connector-1', 'Connector Label')
      })

      expect(result.current.editingId).toBe('connector-1')
    })

    it('sets editingText to current label', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      act(() => {
        result.current.handleConnectorDoubleClick('connector-1', 'Current Label')
      })

      expect(result.current.editingText).toBe('Current Label')
    })

    it('sets editingType to "connector"', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      act(() => {
        result.current.handleConnectorDoubleClick('connector-1', 'Label')
      })

      expect(result.current.editingType).toBe('connector')
    })

    it('distinguishes between shape and connector editing', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      // Edit shape
      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Shape Label')
      })

      expect(result.current.editingType).toBe('shape')

      // Switch to editing connector
      act(() => {
        result.current.handleConnectorDoubleClick('connector-1', 'Connector Label')
      })

      expect(result.current.editingType).toBe('connector')
      expect(result.current.editingId).toBe('connector-1')
    })
  })

  describe('setEditingText', () => {
    it('updates editing text during edit', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Initial')
      })

      act(() => {
        result.current.setEditingText('Updated')
      })

      expect(result.current.editingText).toBe('Updated')
    })

    it('handles incremental text changes', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', '')
      })

      act(() => {
        result.current.setEditingText('H')
      })

      expect(result.current.editingText).toBe('H')

      act(() => {
        result.current.setEditingText('He')
      })

      expect(result.current.editingText).toBe('He')

      act(() => {
        result.current.setEditingText('Hello')
      })

      expect(result.current.editingText).toBe('Hello')
    })

    it('handles clearing text', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Initial')
      })

      act(() => {
        result.current.setEditingText('')
      })

      expect(result.current.editingText).toBe('')
    })

    it('handles special characters in edited text', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', '')
      })

      const specialText = 'Text with <script>alert("xss")</script>'
      act(() => {
        result.current.setEditingText(specialText)
      })

      expect(result.current.editingText).toBe(specialText)
    })
  })

  describe('handleEditSubmit', () => {
    it('calls onUpdateShape for shape edits', () => {
      const onUpdateShape = vi.fn()
      const { result } = renderHook(() =>
        useEditingMode(onUpdateShape, vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Original')
      })

      act(() => {
        result.current.setEditingText('Updated Label')
      })

      act(() => {
        result.current.handleEditSubmit()
      })

      expect(onUpdateShape).toHaveBeenCalledWith('shape-1', {
        label: 'Updated Label',
      })
    })

    it('calls onUpdateConnector for connector edits', () => {
      const onUpdateConnector = vi.fn()
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), onUpdateConnector)
      )

      act(() => {
        result.current.handleConnectorDoubleClick('connector-1', 'Original')
      })

      act(() => {
        result.current.setEditingText('Updated Label')
      })

      act(() => {
        result.current.handleEditSubmit()
      })

      expect(onUpdateConnector).toHaveBeenCalledWith('connector-1', {
        label: 'Updated Label',
      })
    })

    it('clears editingId after submit', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Label')
      })

      expect(result.current.editingId).toBe('shape-1')

      act(() => {
        result.current.handleEditSubmit()
      })

      expect(result.current.editingId).toBeNull()
    })

    it('clears editingText after submit', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Label')
      })

      act(() => {
        result.current.setEditingText('New Text')
      })

      act(() => {
        result.current.handleEditSubmit()
      })

      expect(result.current.editingText).toBe('')
    })

    it('clears editingType after submit', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Label')
      })

      expect(result.current.editingType).toBe('shape')

      act(() => {
        result.current.handleEditSubmit()
      })

      expect(result.current.editingType).toBeNull()
    })

    it('handles submitting empty label', () => {
      const onUpdateShape = vi.fn()
      const { result } = renderHook(() =>
        useEditingMode(onUpdateShape, vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Original')
      })

      act(() => {
        result.current.setEditingText('')
      })

      act(() => {
        result.current.handleEditSubmit()
      })

      expect(onUpdateShape).toHaveBeenCalledWith('shape-1', { label: '' })
    })

    it('handles submitting unchanged label', () => {
      const onUpdateShape = vi.fn()
      const { result } = renderHook(() =>
        useEditingMode(onUpdateShape, vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Same Label')
      })

      // Don't change the text
      act(() => {
        result.current.handleEditSubmit()
      })

      expect(onUpdateShape).toHaveBeenCalledWith('shape-1', {
        label: 'Same Label',
      })
    })
  })

  describe('handleEditCancel', () => {
    it('clears editingId on cancel', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Label')
      })

      act(() => {
        result.current.handleEditCancel()
      })

      expect(result.current.editingId).toBeNull()
    })

    it('clears editingText on cancel', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Label')
      })

      act(() => {
        result.current.setEditingText('Modified')
      })

      act(() => {
        result.current.handleEditCancel()
      })

      expect(result.current.editingText).toBe('')
    })

    it('clears editingType on cancel', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Label')
      })

      act(() => {
        result.current.handleEditCancel()
      })

      expect(result.current.editingType).toBeNull()
    })

    it('does not call onUpdateShape on cancel', () => {
      const onUpdateShape = vi.fn()
      const { result } = renderHook(() =>
        useEditingMode(onUpdateShape, vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Original')
      })

      act(() => {
        result.current.setEditingText('Modified')
      })

      act(() => {
        result.current.handleEditCancel()
      })

      expect(onUpdateShape).not.toHaveBeenCalled()
    })

    it('does not call onUpdateConnector on cancel', () => {
      const onUpdateConnector = vi.fn()
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), onUpdateConnector)
      )

      act(() => {
        result.current.handleConnectorDoubleClick('connector-1', 'Original')
      })

      act(() => {
        result.current.setEditingText('Modified')
      })

      act(() => {
        result.current.handleEditCancel()
      })

      expect(onUpdateConnector).not.toHaveBeenCalled()
    })
  })

  describe('edit workflow', () => {
    it('handles complete edit-submit workflow for shape', () => {
      const onUpdateShape = vi.fn()
      const { result } = renderHook(() =>
        useEditingMode(onUpdateShape, vi.fn())
      )

      // Start editing
      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Original')
      })

      expect(result.current.editingId).toBe('shape-1')

      // Modify text
      act(() => {
        result.current.setEditingText('Modified')
      })

      expect(result.current.editingText).toBe('Modified')

      // Submit
      act(() => {
        result.current.handleEditSubmit()
      })

      expect(onUpdateShape).toHaveBeenCalledWith('shape-1', { label: 'Modified' })
      expect(result.current.editingId).toBeNull()
    })

    it('handles complete edit-cancel workflow', () => {
      const onUpdateShape = vi.fn()
      const { result } = renderHook(() =>
        useEditingMode(onUpdateShape, vi.fn())
      )

      // Start editing
      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Original')
      })

      // Modify text
      act(() => {
        result.current.setEditingText('Modified')
      })

      // Cancel
      act(() => {
        result.current.handleEditCancel()
      })

      expect(onUpdateShape).not.toHaveBeenCalled()
      expect(result.current.editingId).toBeNull()
      expect(result.current.editingText).toBe('')
    })

    it('allows editing different items consecutively', () => {
      const onUpdateShape = vi.fn()
      const onUpdateConnector = vi.fn()
      const { result } = renderHook(() =>
        useEditingMode(onUpdateShape, onUpdateConnector)
      )

      // Edit shape 1
      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Shape Label')
      })

      act(() => {
        result.current.setEditingText('Modified Shape')
      })

      act(() => {
        result.current.handleEditSubmit()
      })

      expect(onUpdateShape).toHaveBeenCalledWith('shape-1', {
        label: 'Modified Shape',
      })

      // Edit connector 1
      act(() => {
        result.current.handleConnectorDoubleClick('connector-1', 'Connector Label')
      })

      act(() => {
        result.current.setEditingText('Modified Connector')
      })

      act(() => {
        result.current.handleEditSubmit()
      })

      expect(onUpdateConnector).toHaveBeenCalledWith('connector-1', {
        label: 'Modified Connector',
      })
    })
  })

  describe('edge cases', () => {
    it('handles submit without double click first', () => {
      const onUpdateShape = vi.fn()
      const { result } = renderHook(() =>
        useEditingMode(onUpdateShape, vi.fn())
      )

      // Try to submit without starting edit
      act(() => {
        result.current.handleEditSubmit()
      })

      // Should not call onUpdateShape
      expect(onUpdateShape).not.toHaveBeenCalled()
    })

    it('handles cancel without double click first', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      // Should not crash
      act(() => {
        result.current.handleEditCancel()
      })

      expect(result.current.editingId).toBeNull()
    })

    it('handles rapid double clicks', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Label 1')
      })

      act(() => {
        result.current.handleShapeDoubleClick('shape-2', 'Label 2')
      })

      // Should be editing shape-2
      expect(result.current.editingId).toBe('shape-2')
      expect(result.current.editingText).toBe('Label 2')
    })

    it('handles switching between shapes and connectors', () => {
      const { result } = renderHook(() =>
        useEditingMode(vi.fn(), vi.fn())
      )

      act(() => {
        result.current.handleShapeDoubleClick('shape-1', 'Shape')
      })

      expect(result.current.editingType).toBe('shape')

      act(() => {
        result.current.handleConnectorDoubleClick('connector-1', 'Connector')
      })

      expect(result.current.editingType).toBe('connector')
      expect(result.current.editingId).toBe('connector-1')
    })
  })
})
