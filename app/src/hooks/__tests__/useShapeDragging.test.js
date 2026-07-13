import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useShapeDragging } from '../useShapeDragging'

describe('useShapeDragging', () => {
  const mockShape1 = {
    id: 'shape-1',
    x: 100,
    y: 100,
    label: 'Shape 1',
    type: 'rectangle',
  }

  const mockShape2 = {
    id: 'shape-2',
    x: 300,
    y: 300,
    label: 'Shape 2',
    type: 'rectangle',
  }

  describe('initial state', () => {
    it('initializes with isDragging = false', () => {
      const { result } = renderHook(() =>
        useShapeDragging([mockShape1], vi.fn())
      )

      expect(result.current.isDragging).toBe(false)
    })

    it('initializes with draggedShapeId = null', () => {
      const { result } = renderHook(() =>
        useShapeDragging([mockShape1], vi.fn())
      )

      expect(result.current.draggedShapeId).toBeNull()
    })
  })

  describe('handleMouseDown', () => {
    it('sets isDragging to true when mouse down on shape', () => {
      const { result } = renderHook(() =>
        useShapeDragging([mockShape1], vi.fn())
      )

      act(() => {
        result.current.handleMouseDown('shape-1', { x: 100, y: 100 })
      })

      expect(result.current.isDragging).toBe(true)
    })

    it('sets draggedShapeId when mouse down on shape', () => {
      const { result } = renderHook(() =>
        useShapeDragging([mockShape1], vi.fn())
      )

      act(() => {
        result.current.handleMouseDown('shape-1', { x: 100, y: 100 })
      })

      expect(result.current.draggedShapeId).toBe('shape-1')
    })

    it('handles drag starting at different shapes', () => {
      const { result } = renderHook(() =>
        useShapeDragging([mockShape1, mockShape2], vi.fn())
      )

      act(() => {
        result.current.handleMouseDown('shape-2', { x: 300, y: 300 })
      })

      expect(result.current.draggedShapeId).toBe('shape-2')
    })

    it('handles starting drag from different points on same shape', () => {
      const onUpdateShape = vi.fn()
      const { result } = renderHook(() =>
        useShapeDragging([mockShape1], onUpdateShape)
      )

      act(() => {
        result.current.handleMouseDown('shape-1', { x: 150, y: 150 })
      })

      expect(result.current.isDragging).toBe(true)

      act(() => {
        result.current.handleMouseMove({ x: 160, y: 160 })
      })

      // Move by (10, 10), so new position should be (110, 110)
      expect(onUpdateShape).toHaveBeenCalledWith('shape-1', {
        x: 110,
        y: 110,
      })
    })
  })

  describe('handleMouseMove', () => {
    it('does not call onUpdateShape when not dragging', () => {
      const onUpdateShape = vi.fn()
      const { result } = renderHook(() =>
        useShapeDragging([mockShape1], onUpdateShape)
      )

      act(() => {
        result.current.handleMouseMove({ x: 200, y: 200 })
      })

      expect(onUpdateShape).not.toHaveBeenCalled()
    })

    it('calls onUpdateShape with correct delta when dragging', () => {
      const onUpdateShape = vi.fn()
      const { result } = renderHook(() =>
        useShapeDragging([mockShape1], onUpdateShape)
      )

      act(() => {
        result.current.handleMouseDown('shape-1', { x: 100, y: 100 })
      })

      act(() => {
        result.current.handleMouseMove({ x: 150, y: 150 })
      })

      // Move by (50, 50), so new position should be (150, 150)
      expect(onUpdateShape).toHaveBeenCalledWith('shape-1', {
        x: 150,
        y: 150,
      })
    })

    it('handles drag with negative delta', () => {
      const onUpdateShape = vi.fn()
      const { result } = renderHook(() =>
        useShapeDragging([mockShape1], onUpdateShape)
      )

      act(() => {
        result.current.handleMouseDown('shape-1', { x: 100, y: 100 })
      })

      act(() => {
        result.current.handleMouseMove({ x: 50, y: 50 })
      })

      // Move by (-50, -50), so new position should be (50, 50)
      expect(onUpdateShape).toHaveBeenCalledWith('shape-1', {
        x: 50,
        y: 50,
      })
    })

    it('handles continuous drag movements', () => {
      const onUpdateShape = vi.fn()
      const { result } = renderHook(() =>
        useShapeDragging([mockShape1], onUpdateShape)
      )

      act(() => {
        result.current.handleMouseDown('shape-1', { x: 100, y: 100 })
      })

      // First move
      act(() => {
        result.current.handleMouseMove({ x: 110, y: 110 })
      })

      expect(onUpdateShape).toHaveBeenLastCalledWith('shape-1', {
        x: 110,
        y: 110,
      })

      // Second move (from same initial point)
      act(() => {
        result.current.handleMouseMove({ x: 120, y: 120 })
      })

      expect(onUpdateShape).toHaveBeenLastCalledWith('shape-1', {
        x: 120,
        y: 120,
      })
    })

    it('handles drag with decimal coordinates', () => {
      const onUpdateShape = vi.fn()
      const { result } = renderHook(() =>
        useShapeDragging([mockShape1], onUpdateShape)
      )

      act(() => {
        result.current.handleMouseDown('shape-1', { x: 100.5, y: 100.5 })
      })

      act(() => {
        result.current.handleMouseMove({ x: 150.75, y: 150.75 })
      })

      expect(onUpdateShape).toHaveBeenCalledWith('shape-1', {
        x: 150.25,
        y: 150.25,
      })
    })

    it('handles drag from shape at negative coordinates', () => {
      const onUpdateShape = vi.fn()
      const negativeShape = { ...mockShape1, x: -100, y: -100 }
      const { result } = renderHook(() =>
        useShapeDragging([negativeShape], onUpdateShape)
      )

      act(() => {
        result.current.handleMouseDown('shape-1', { x: 0, y: 0 })
      })

      act(() => {
        result.current.handleMouseMove({ x: 50, y: 50 })
      })

      // Initial shape at (-100, -100), move by (50, 50) = (-50, -50)
      expect(onUpdateShape).toHaveBeenCalledWith('shape-1', {
        x: -50,
        y: -50,
      })
    })
  })

  describe('handleMouseUp', () => {
    it('sets isDragging to false on mouse up', () => {
      const { result } = renderHook(() =>
        useShapeDragging([mockShape1], vi.fn())
      )

      act(() => {
        result.current.handleMouseDown('shape-1', { x: 100, y: 100 })
      })

      expect(result.current.isDragging).toBe(true)

      act(() => {
        result.current.handleMouseUp()
      })

      expect(result.current.isDragging).toBe(false)
    })

    it('clears draggedShapeId on mouse up', () => {
      const { result } = renderHook(() =>
        useShapeDragging([mockShape1], vi.fn())
      )

      act(() => {
        result.current.handleMouseDown('shape-1', { x: 100, y: 100 })
      })

      expect(result.current.draggedShapeId).toBe('shape-1')

      act(() => {
        result.current.handleMouseUp()
      })

      expect(result.current.draggedShapeId).toBeNull()
    })

    it('prevents further moves after mouse up', () => {
      const onUpdateShape = vi.fn()
      const { result } = renderHook(() =>
        useShapeDragging([mockShape1], onUpdateShape)
      )

      act(() => {
        result.current.handleMouseDown('shape-1', { x: 100, y: 100 })
      })

      act(() => {
        result.current.handleMouseMove({ x: 150, y: 150 })
      })

      expect(onUpdateShape).toHaveBeenCalledTimes(1)

      act(() => {
        result.current.handleMouseUp()
      })

      act(() => {
        result.current.handleMouseMove({ x: 200, y: 200 })
      })

      // Should not have been called again after mouse up
      expect(onUpdateShape).toHaveBeenCalledTimes(1)
    })
  })

  describe('multiple drag sequences', () => {
    it('allows dragging shape A, then shape B', () => {
      const onUpdateShape = vi.fn()
      const { result } = renderHook(() =>
        useShapeDragging([mockShape1, mockShape2], onUpdateShape)
      )

      // Drag shape 1
      act(() => {
        result.current.handleMouseDown('shape-1', { x: 100, y: 100 })
      })

      act(() => {
        result.current.handleMouseMove({ x: 110, y: 110 })
      })

      expect(result.current.draggedShapeId).toBe('shape-1')

      // Release
      act(() => {
        result.current.handleMouseUp()
      })

      expect(result.current.isDragging).toBe(false)

      // Drag shape 2
      act(() => {
        result.current.handleMouseDown('shape-2', { x: 300, y: 300 })
      })

      act(() => {
        result.current.handleMouseMove({ x: 320, y: 320 })
      })

      expect(result.current.draggedShapeId).toBe('shape-2')

      // Verify both shapes were updated
      expect(onUpdateShape).toHaveBeenCalledWith('shape-1', { x: 110, y: 110 })
      expect(onUpdateShape).toHaveBeenCalledWith('shape-2', { x: 320, y: 320 })
    })

    it('handles clicking different shape while dragging (cancels previous drag)', () => {
      const onUpdateShape = vi.fn()
      const { result } = renderHook(() =>
        useShapeDragging([mockShape1, mockShape2], onUpdateShape)
      )

      // Start dragging shape 1
      act(() => {
        result.current.handleMouseDown('shape-1', { x: 100, y: 100 })
      })

      expect(result.current.draggedShapeId).toBe('shape-1')

      // Click on shape 2 (this would normally trigger handleMouseUp first in real usage)
      act(() => {
        result.current.handleMouseUp()
      })

      act(() => {
        result.current.handleMouseDown('shape-2', { x: 300, y: 300 })
      })

      expect(result.current.draggedShapeId).toBe('shape-2')
    })
  })

  describe('edge cases', () => {
    it('handles dragging non-existent shape gracefully', () => {
      const onUpdateShape = vi.fn()
      const { result } = renderHook(() =>
        useShapeDragging([mockShape1], onUpdateShape)
      )

      // Try to drag non-existent shape
      act(() => {
        result.current.handleMouseDown('nonexistent', { x: 100, y: 100 })
      })

      act(() => {
        result.current.handleMouseMove({ x: 150, y: 150 })
      })

      // onUpdateShape should be called, but with default x/y of 0
      expect(onUpdateShape).toHaveBeenCalledWith('nonexistent', {
        x: 50,
        y: 50,
      })
    })

    it('handles empty shapes array', () => {
      const onUpdateShape = vi.fn()
      const { result } = renderHook(() => useShapeDragging([], onUpdateShape))

      act(() => {
        result.current.handleMouseDown('shape-1', { x: 100, y: 100 })
      })

      // Should set isDragging even if shape not found
      expect(result.current.isDragging).toBe(true)
    })

    it('handles zero delta (click without move)', () => {
      const onUpdateShape = vi.fn()
      const { result } = renderHook(() =>
        useShapeDragging([mockShape1], onUpdateShape)
      )

      act(() => {
        result.current.handleMouseDown('shape-1', { x: 100, y: 100 })
      })

      act(() => {
        result.current.handleMouseMove({ x: 100, y: 100 })
      })

      // Should call with same position (no movement)
      expect(onUpdateShape).toHaveBeenCalledWith('shape-1', { x: 100, y: 100 })
    })
  })
})
