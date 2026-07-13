import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCanvasPanning } from '../useCanvasPanning'

describe('useCanvasPanning', () => {
  let mockSvgRef

  beforeEach(() => {
    // Create a mock SVG ref with style property
    mockSvgRef = {
      current: {
        style: {
          transform: '',
        },
      },
    }
  })

  describe('initial state', () => {
    it('initializes with isPanning = false', () => {
      const { result } = renderHook(() => useCanvasPanning(mockSvgRef))

      expect(result.current.isPanning).toBe(false)
    })
  })

  describe('handleMouseDown', () => {
    it('sets isPanning to true on mouse down', () => {
      const { result } = renderHook(() => useCanvasPanning(mockSvgRef))

      act(() => {
        result.current.handleMouseDown(100, 100)
      })

      expect(result.current.isPanning).toBe(true)
    })

    it('captures starting client coordinates', () => {
      const { result } = renderHook(() => useCanvasPanning(mockSvgRef))

      act(() => {
        result.current.handleMouseDown(100, 100)
      })

      // We can't directly access panStart, but we can verify isPanning changed
      expect(result.current.isPanning).toBe(true)

      // Verify that moving immediately after sets the pan state
      act(() => {
        result.current.handleMouseMove(110, 110)
      })

      // If pan state was captured correctly, SVG transform should be updated
      expect(mockSvgRef.current.style.transform).toBe('translate(10px, 10px)')
    })

    it('handles pan starting from different points', () => {
      const { result } = renderHook(() => useCanvasPanning(mockSvgRef))

      act(() => {
        result.current.handleMouseDown(200, 200)
      })

      act(() => {
        result.current.handleMouseMove(250, 250)
      })

      expect(mockSvgRef.current.style.transform).toBe('translate(50px, 50px)')
    })
  })

  describe('handleMouseMove', () => {
    it('does not update SVG when not panning', () => {
      const { result } = renderHook(() => useCanvasPanning(mockSvgRef))

      act(() => {
        result.current.handleMouseMove(100, 100)
      })

      expect(mockSvgRef.current.style.transform).toBe('')
    })

    it('updates SVG transform when panning', () => {
      const { result } = renderHook(() => useCanvasPanning(mockSvgRef))

      act(() => {
        result.current.handleMouseDown(100, 100)
      })

      act(() => {
        result.current.handleMouseMove(150, 150)
      })

      expect(mockSvgRef.current.style.transform).toBe('translate(50px, 50px)')
    })

    it('calculates pan delta correctly (positive)', () => {
      const { result } = renderHook(() => useCanvasPanning(mockSvgRef))

      act(() => {
        result.current.handleMouseDown(0, 0)
      })

      act(() => {
        result.current.handleMouseMove(100, 200)
      })

      expect(mockSvgRef.current.style.transform).toBe('translate(100px, 200px)')
    })

    it('calculates pan delta correctly (negative)', () => {
      const { result } = renderHook(() => useCanvasPanning(mockSvgRef))

      act(() => {
        result.current.handleMouseDown(100, 100)
      })

      act(() => {
        result.current.handleMouseMove(50, 50)
      })

      expect(mockSvgRef.current.style.transform).toBe('translate(-50px, -50px)')
    })

    it('handles continuous pan movements', () => {
      const { result } = renderHook(() => useCanvasPanning(mockSvgRef))

      act(() => {
        result.current.handleMouseDown(0, 0)
      })

      // Move to 50, 50
      act(() => {
        result.current.handleMouseMove(50, 50)
      })

      expect(mockSvgRef.current.style.transform).toBe('translate(50px, 50px)')

      // Move to 100, 100 (cumulative from start)
      act(() => {
        result.current.handleMouseMove(100, 100)
      })

      expect(mockSvgRef.current.style.transform).toBe('translate(100px, 100px)')
    })

    it('preserves existing transform on subsequent pans', () => {
      const { result } = renderHook(() => useCanvasPanning(mockSvgRef))

      // First pan
      act(() => {
        result.current.handleMouseDown(0, 0)
      })

      act(() => {
        result.current.handleMouseMove(50, 50)
      })

      expect(mockSvgRef.current.style.transform).toBe('translate(50px, 50px)')

      // Release
      act(() => {
        result.current.handleMouseUp()
      })

      // Second pan from same start point (but SVG already has transform)
      act(() => {
        result.current.handleMouseDown(50, 50)
      })

      act(() => {
        result.current.handleMouseMove(100, 100)
      })

      // Second pan should be cumulative from previous position
      expect(mockSvgRef.current.style.transform).toBe('translate(100px, 100px)')
    })

    it('handles decimal coordinates', () => {
      const { result } = renderHook(() => useCanvasPanning(mockSvgRef))

      act(() => {
        result.current.handleMouseDown(0.5, 0.5)
      })

      act(() => {
        result.current.handleMouseMove(50.25, 75.75)
      })

      expect(mockSvgRef.current.style.transform).toBe('translate(49.75px, 75.25px)')
    })

    it('handles very large pan distances', () => {
      const { result } = renderHook(() => useCanvasPanning(mockSvgRef))

      act(() => {
        result.current.handleMouseDown(0, 0)
      })

      act(() => {
        result.current.handleMouseMove(5000, 5000)
      })

      expect(mockSvgRef.current.style.transform).toBe('translate(5000px, 5000px)')
    })
  })

  describe('handleMouseUp', () => {
    it('sets isPanning to false on mouse up', () => {
      const { result } = renderHook(() => useCanvasPanning(mockSvgRef))

      act(() => {
        result.current.handleMouseDown(100, 100)
      })

      expect(result.current.isPanning).toBe(true)

      act(() => {
        result.current.handleMouseUp()
      })

      expect(result.current.isPanning).toBe(false)
    })

    it('preserves SVG transform after pan ends', () => {
      const { result } = renderHook(() => useCanvasPanning(mockSvgRef))

      act(() => {
        result.current.handleMouseDown(0, 0)
      })

      act(() => {
        result.current.handleMouseMove(100, 100)
      })

      const transformAfterMove = mockSvgRef.current.style.transform

      act(() => {
        result.current.handleMouseUp()
      })

      // Transform should remain the same
      expect(mockSvgRef.current.style.transform).toBe(transformAfterMove)
      expect(mockSvgRef.current.style.transform).toBe('translate(100px, 100px)')
    })

    it('prevents further moves after mouse up', () => {
      const { result } = renderHook(() => useCanvasPanning(mockSvgRef))

      act(() => {
        result.current.handleMouseDown(0, 0)
      })

      act(() => {
        result.current.handleMouseMove(100, 100)
      })

      act(() => {
        result.current.handleMouseUp()
      })

      const transformAfterUp = mockSvgRef.current.style.transform

      act(() => {
        result.current.handleMouseMove(200, 200)
      })

      // Transform should not have changed
      expect(mockSvgRef.current.style.transform).toBe(transformAfterUp)
    })
  })

  describe('multiple pan sequences', () => {
    it('allows panning in different directions', () => {
      const { result } = renderHook(() => useCanvasPanning(mockSvgRef))

      // Pan right
      act(() => {
        result.current.handleMouseDown(0, 0)
      })

      act(() => {
        result.current.handleMouseMove(100, 0)
      })

      act(() => {
        result.current.handleMouseUp()
      })

      expect(mockSvgRef.current.style.transform).toBe('translate(100px, 0px)')

      // Pan down
      act(() => {
        result.current.handleMouseDown(100, 0)
      })

      act(() => {
        result.current.handleMouseMove(100, 100)
      })

      expect(mockSvgRef.current.style.transform).toBe('translate(100px, 100px)')
    })

    it('handles rapid pan sequences', () => {
      const { result } = renderHook(() => useCanvasPanning(mockSvgRef))

      // First pan
      act(() => {
        result.current.handleMouseDown(0, 0)
      })

      act(() => {
        result.current.handleMouseMove(50, 50)
      })

      act(() => {
        result.current.handleMouseUp()
      })

      // Second pan
      act(() => {
        result.current.handleMouseDown(50, 50)
      })

      act(() => {
        result.current.handleMouseMove(100, 100)
      })

      expect(mockSvgRef.current.style.transform).toBe('translate(100px, 100px)')
    })
  })

  describe('edge cases', () => {
    it('handles null svgRef gracefully', () => {
      const nullRef = { current: null }
      const { result } = renderHook(() => useCanvasPanning(nullRef))

      act(() => {
        result.current.handleMouseDown(0, 0)
      })

      // Should not crash
      expect(result.current.isPanning).toBe(true)

      act(() => {
        result.current.handleMouseMove(100, 100)
      })

      // Should handle null ref gracefully
      expect(() => {
        result.current.handleMouseMove(200, 200)
      }).not.toThrow()
    })

    it('handles SVG without transform initially', () => {
      mockSvgRef.current.style.transform = ''

      const { result } = renderHook(() => useCanvasPanning(mockSvgRef))

      act(() => {
        result.current.handleMouseDown(0, 0)
      })

      act(() => {
        result.current.handleMouseMove(50, 50)
      })

      expect(mockSvgRef.current.style.transform).toBe('translate(50px, 50px)')
    })

    it('handles zero delta (click without move)', () => {
      const { result } = renderHook(() => useCanvasPanning(mockSvgRef))

      act(() => {
        result.current.handleMouseDown(100, 100)
      })

      act(() => {
        result.current.handleMouseMove(100, 100)
      })

      expect(mockSvgRef.current.style.transform).toBe('translate(0px, 0px)')
    })

    it('handles very small pan distances', () => {
      const { result } = renderHook(() => useCanvasPanning(mockSvgRef))

      act(() => {
        result.current.handleMouseDown(0, 0)
      })

      act(() => {
        result.current.handleMouseMove(0.1, 0.1)
      })

      expect(mockSvgRef.current.style.transform).toBe('translate(0.1px, 0.1px)')
    })
  })
})
