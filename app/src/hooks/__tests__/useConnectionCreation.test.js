import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useConnectionCreation } from '../useConnectionCreation'

describe('useConnectionCreation', () => {
  const mockShape1 = {
    id: 'shape-1',
    x: 100,
    y: 100,
    label: 'Shape 1',
  }

  const mockShape2 = {
    id: 'shape-2',
    x: 300,
    y: 300,
    label: 'Shape 2',
  }

  const mockShape3 = {
    id: 'shape-3',
    x: 500,
    y: 500,
    label: 'Shape 3',
  }

  describe('initial state', () => {
    it('initializes with connectionStart = null', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1], vi.fn())
      )

      expect(result.current.connectionStart).toBeNull()
    })

    it('initializes with dragEndpoint = null', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1], vi.fn())
      )

      expect(result.current.dragEndpoint).toBeNull()
    })

    it('initializes with hoveredShapeId = null', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1], vi.fn())
      )

      expect(result.current.hoveredShapeId).toBeNull()
    })

    it('initializes with hoveredConnectionPoint = null', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1], vi.fn())
      )

      expect(result.current.hoveredConnectionPoint).toBeNull()
    })
  })

  describe('handleConnectionPointMouseDown', () => {
    it('sets connectionStart when connection point is clicked', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1], vi.fn())
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'left')
      })

      expect(result.current.connectionStart).toBe('shape-1')
    })

    it('stores connectionPointId for rendering temp line', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1], vi.fn())
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'top')
      })

      // connectionPointId should be accessible for rendering
      expect(result.current.connectionPointId).toBe('top')
    })

    it('handles different connection points', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1], vi.fn())
      )

      const pointIds = ['left', 'top', 'right', 'bottom']

      pointIds.forEach((pointId) => {
        act(() => {
          result.current.handleConnectionPointMouseDown('shape-1', pointId)
        })

        expect(result.current.connectionPointId).toBe(pointId)
      })
    })
  })

  describe('handleMouseMove', () => {
    it('does nothing when not in connection mode', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1, mockShape2], vi.fn())
      )

      act(() => {
        result.current.handleMouseMove({ x: 200, y: 200 })
      })

      expect(result.current.dragEndpoint).toBeNull()
      expect(result.current.hoveredShapeId).toBeNull()
    })

    it('updates dragEndpoint when moving during connection', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1, mockShape2], vi.fn())
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'left')
      })

      act(() => {
        result.current.handleMouseMove({ x: 200, y: 200 })
      })

      expect(result.current.dragEndpoint).toEqual({ x: 200, y: 200 })
    })

    it('detects hovered shape during connection drag', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1, mockShape2], vi.fn())
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'left')
      })

      // Move to shape2's center
      act(() => {
        result.current.handleMouseMove({ x: 360, y: 360 })
      })

      expect(result.current.hoveredShapeId).toBe('shape-2')
    })

    it('does not hover over source shape during connection', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1, mockShape2], vi.fn())
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'left')
      })

      // Move to shape1's center (should not hover - can't connect to self)
      act(() => {
        result.current.handleMouseMove({ x: 160, y: 140 })
      })

      expect(result.current.hoveredShapeId).toBeNull()
    })

    it('clears hoveredShapeId when moving away from shapes', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1, mockShape2], vi.fn())
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'left')
      })

      // Move to shape2
      act(() => {
        result.current.handleMouseMove({ x: 360, y: 360 })
      })

      expect(result.current.hoveredShapeId).toBe('shape-2')

      // Move away from all shapes
      act(() => {
        result.current.handleMouseMove({ x: 1000, y: 1000 })
      })

      expect(result.current.hoveredShapeId).toBeNull()
    })

    it('detects connection point on hovered shape', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1, mockShape2], vi.fn())
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'left')
      })

      // Move to shape2's left connection point (300, 340)
      act(() => {
        result.current.handleMouseMove({ x: 300, y: 340 })
      })

      expect(result.current.hoveredShapeId).toBe('shape-2')
      expect(result.current.hoveredConnectionPoint).toBe('left')
    })

    it('clears hoveredConnectionPoint when not over a point', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1, mockShape2], vi.fn())
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'left')
      })

      // Move to shape2's connection point
      act(() => {
        result.current.handleMouseMove({ x: 300, y: 340 })
      })

      expect(result.current.hoveredConnectionPoint).toBe('left')

      // Move to shape2 center (no connection point)
      act(() => {
        result.current.handleMouseMove({ x: 360, y: 360 })
      })

      expect(result.current.hoveredConnectionPoint).toBeNull()
    })

    it('detects different connection points on target shape', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1, mockShape2], vi.fn())
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'left')
      })

      // Test all connection points on shape2 (x=300, y=300, center at 360,340)
      const connectionPoints = [
        { coords: { x: 300, y: 340 }, expected: 'left' },
        { coords: { x: 360, y: 300 }, expected: 'top' },
        { coords: { x: 420, y: 340 }, expected: 'right' },
        { coords: { x: 360, y: 380 }, expected: 'bottom' },
      ]

      connectionPoints.forEach(({ coords, expected }) => {
        act(() => {
          result.current.handleMouseMove(coords)
        })

        expect(result.current.hoveredConnectionPoint).toBe(expected)
      })
    })

    it('handles moving between multiple shapes', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1, mockShape2, mockShape3], vi.fn())
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'left')
      })

      // Over shape2
      act(() => {
        result.current.handleMouseMove({ x: 360, y: 360 })
      })

      expect(result.current.hoveredShapeId).toBe('shape-2')

      // Move to shape3
      act(() => {
        result.current.handleMouseMove({ x: 560, y: 560 })
      })

      expect(result.current.hoveredShapeId).toBe('shape-3')
    })
  })

  describe('handleMouseUp', () => {
    it('resets connectionStart on mouse up', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1], vi.fn())
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'left')
      })

      expect(result.current.connectionStart).toBe('shape-1')

      act(() => {
        result.current.handleMouseUp()
      })

      expect(result.current.connectionStart).toBeNull()
    })

    it('clears all state on mouse up (failed connection)', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1, mockShape2], vi.fn())
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'left')
      })

      act(() => {
        result.current.handleMouseMove({ x: 200, y: 200 })
      })

      expect(result.current.dragEndpoint).not.toBeNull()

      act(() => {
        result.current.handleMouseUp()
      })

      expect(result.current.dragEndpoint).toBeNull()
      expect(result.current.hoveredShapeId).toBeNull()
      expect(result.current.hoveredConnectionPoint).toBeNull()
    })

    it('calls onAddConnector when valid connection completed', () => {
      const onAddConnector = vi.fn()
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1, mockShape2], onAddConnector)
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'left')
      })

      // Move to shape2's right connection point
      act(() => {
        result.current.handleMouseMove({ x: 420, y: 340 })
      })

      act(() => {
        result.current.handleMouseUp()
      })

      expect(onAddConnector).toHaveBeenCalledWith(
        'shape-1',
        'shape-2',
        'left',
        'right'
      )
    })

    it('does not call onAddConnector if not over a connection point', () => {
      const onAddConnector = vi.fn()
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1, mockShape2], onAddConnector)
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'left')
      })

      // Move to shape2 center (not a connection point)
      act(() => {
        result.current.handleMouseMove({ x: 360, y: 360 })
      })

      act(() => {
        result.current.handleMouseUp()
      })

      expect(onAddConnector).not.toHaveBeenCalled()
    })

    it('does not call onAddConnector if not over a shape', () => {
      const onAddConnector = vi.fn()
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1, mockShape2], onAddConnector)
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'left')
      })

      // Move to empty space
      act(() => {
        result.current.handleMouseMove({ x: 1000, y: 1000 })
      })

      act(() => {
        result.current.handleMouseUp()
      })

      expect(onAddConnector).not.toHaveBeenCalled()
    })

    it('does not call onAddConnector when connecting to self', () => {
      const onAddConnector = vi.fn()
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1], onAddConnector)
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'left')
      })

      // Try to move to shape-1 (should not hover since it's the source)
      act(() => {
        result.current.handleMouseMove({ x: 160, y: 140 })
      })

      act(() => {
        result.current.handleMouseUp()
      })

      expect(onAddConnector).not.toHaveBeenCalled()
    })

    it('clears state even if connection fails validation', () => {
      const onAddConnector = vi.fn()
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1, mockShape2], onAddConnector)
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'left')
      })

      // Invalid connection (not over point)
      act(() => {
        result.current.handleMouseMove({ x: 1000, y: 1000 })
      })

      act(() => {
        result.current.handleMouseUp()
      })

      // State should be cleared
      expect(result.current.connectionStart).toBeNull()
      expect(result.current.hoveredShapeId).toBeNull()
    })
  })

  describe('multiple connection sequences', () => {
    it('allows multiple connections in sequence', () => {
      const onAddConnector = vi.fn()
      const { result } = renderHook(() =>
        useConnectionCreation(
          [mockShape1, mockShape2, mockShape3],
          onAddConnector
        )
      )

      // First connection: shape1 -> shape2
      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'left')
      })

      act(() => {
        result.current.handleMouseMove({ x: 300, y: 340 })
      })

      act(() => {
        result.current.handleMouseUp()
      })

      expect(onAddConnector).toHaveBeenCalledWith('shape-1', 'shape-2', 'left', 'left')

      // Second connection: shape2 -> shape3
      act(() => {
        result.current.handleConnectionPointMouseDown('shape-2', 'right')
      })

      act(() => {
        result.current.handleMouseMove({ x: 500, y: 540 })
      })

      act(() => {
        result.current.handleMouseUp()
      })

      expect(onAddConnector).toHaveBeenCalledWith('shape-2', 'shape-3', 'right', 'left')
    })
  })

  describe('edge cases', () => {
    it('handles non-existent shape gracefully', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1], vi.fn())
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('nonexistent', 'left')
      })

      expect(result.current.connectionStart).toBe('nonexistent')

      act(() => {
        result.current.handleMouseMove({ x: 160, y: 140 })
      })

      // Should still hover over real shapes (they're not the source)
      expect(result.current.hoveredShapeId).toBe('shape-1')
    })

    it('handles empty shapes array', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([], vi.fn())
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'left')
      })

      act(() => {
        result.current.handleMouseMove({ x: 200, y: 200 })
      })

      // Should not crash
      expect(result.current.hoveredShapeId).toBeNull()
    })

    it('handles decimal coordinates', () => {
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1, mockShape2], vi.fn())
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'left')
      })

      act(() => {
        result.current.handleMouseMove({ x: 300.5, y: 340.25 })
      })

      expect(result.current.dragEndpoint).toEqual({ x: 300.5, y: 340.25 })
    })

    it('passes correct arguments to onAddConnector', () => {
      const onAddConnector = vi.fn()
      const { result } = renderHook(() =>
        useConnectionCreation([mockShape1, mockShape2], onAddConnector)
      )

      act(() => {
        result.current.handleConnectionPointMouseDown('shape-1', 'top')
      })

      act(() => {
        result.current.handleMouseMove({ x: 300, y: 340 })
      })

      act(() => {
        result.current.handleMouseUp()
      })

      // Verify all 4 arguments
      expect(onAddConnector).toHaveBeenCalledWith(
        'shape-1', // connectionStart
        'shape-2', // hoveredShapeId
        'top',     // connectionPointId
        'left'     // hoveredConnectionPoint
      )
    })
  })
})
