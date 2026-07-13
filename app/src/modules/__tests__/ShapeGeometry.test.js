import { describe, it, expect } from 'vitest'
import {
  SHAPE_DIMENSIONS,
  getConnectionPointCoords,
  isPointInShape,
  findHoveredConnectionPoint,
} from '../ShapeGeometry'

describe('ShapeGeometry', () => {
  // Mock shape at (100, 100)
  // With SHAPE_DIMENSIONS: width=120, height=80
  // Center: (160, 140)
  // Connection points:
  //   left: (100, 140)
  //   top: (160, 100)
  //   right: (220, 140)
  //   bottom: (160, 180)
  const mockShape = {
    id: 'shape-1',
    x: 100,
    y: 100,
    label: 'Test Shape',
    type: 'rectangle',
    color: '#3b82f6',
  }

  describe('SHAPE_DIMENSIONS', () => {
    it('exports width of 120', () => {
      expect(SHAPE_DIMENSIONS.width).toBe(120)
    })

    it('exports height of 80', () => {
      expect(SHAPE_DIMENSIONS.height).toBe(80)
    })
  })

  describe('getConnectionPointCoords', () => {
    it('returns left connection point coordinates', () => {
      const coords = getConnectionPointCoords(mockShape, 'left')
      expect(coords).toEqual({ x: 100, y: 140 })
    })

    it('returns top connection point coordinates', () => {
      const coords = getConnectionPointCoords(mockShape, 'top')
      expect(coords).toEqual({ x: 160, y: 100 })
    })

    it('returns right connection point coordinates', () => {
      const coords = getConnectionPointCoords(mockShape, 'right')
      expect(coords).toEqual({ x: 220, y: 140 })
    })

    it('returns bottom connection point coordinates', () => {
      const coords = getConnectionPointCoords(mockShape, 'bottom')
      expect(coords).toEqual({ x: 160, y: 180 })
    })

    it('returns center for unknown point ID', () => {
      const coords = getConnectionPointCoords(mockShape, 'unknown')
      expect(coords).toEqual({ x: 160, y: 140 })
    })

    it('handles shape at origin (0, 0)', () => {
      const shapeAtOrigin = { ...mockShape, x: 0, y: 0 }
      const coords = getConnectionPointCoords(shapeAtOrigin, 'left')
      expect(coords).toEqual({ x: 0, y: 40 })
    })

    it('handles negative coordinates', () => {
      const shapeNegative = { ...mockShape, x: -100, y: -100 }
      const coords = getConnectionPointCoords(shapeNegative, 'right')
      expect(coords).toEqual({ x: 20, y: -60 })
    })

    it('handles decimal coordinates', () => {
      const shapeDecimal = { ...mockShape, x: 50.5, y: 75.5 }
      const coords = getConnectionPointCoords(shapeDecimal, 'top')
      expect(coords).toEqual({ x: 110.5, y: 75.5 })
    })
  })

  describe('isPointInShape', () => {
    it('returns true for point inside shape', () => {
      const point = { x: 160, y: 140 } // center
      expect(isPointInShape(point, mockShape)).toBe(true)
    })

    it('returns true for point at shape boundary', () => {
      const point = { x: 100, y: 140 } // left edge
      expect(isPointInShape(point, mockShape)).toBe(true)
    })

    it('returns true for point at right boundary', () => {
      const point = { x: 220, y: 140 } // right edge
      expect(isPointInShape(point, mockShape)).toBe(true)
    })

    it('returns true for point at top boundary', () => {
      const point = { x: 160, y: 100 } // top edge
      expect(isPointInShape(point, mockShape)).toBe(true)
    })

    it('returns true for point at bottom boundary', () => {
      const point = { x: 160, y: 180 } // bottom edge
      expect(isPointInShape(point, mockShape)).toBe(true)
    })

    it('returns true for point within collision padding', () => {
      // 5px padding on left side
      const point = { x: 95, y: 140 } // 5px outside shape, within padding
      expect(isPointInShape(point, mockShape)).toBe(true)
    })

    it('returns true for point within collision padding on top', () => {
      const point = { x: 160, y: 95 } // 5px above shape
      expect(isPointInShape(point, mockShape)).toBe(true)
    })

    it('returns false for point outside collision padding', () => {
      const point = { x: 50, y: 140 } // 50px to the left
      expect(isPointInShape(point, mockShape)).toBe(false)
    })

    it('returns false for point outside collision padding on right', () => {
      const point = { x: 250, y: 140 } // 30px to the right
      expect(isPointInShape(point, mockShape)).toBe(false)
    })

    it('returns false for point far outside shape', () => {
      const point = { x: 1000, y: 1000 }
      expect(isPointInShape(point, mockShape)).toBe(false)
    })

    it('handles shape at negative coordinates', () => {
      const shapeNegative = { ...mockShape, x: -100, y: -100 }
      const point = { x: -60, y: -60 } // inside the shape
      expect(isPointInShape(point, shapeNegative)).toBe(true)
    })

    it('handles point with decimal coordinates', () => {
      const point = { x: 160.5, y: 140.5 }
      expect(isPointInShape(point, mockShape)).toBe(true)
    })

    it('handles collision padding edge case (exactly 5px outside)', () => {
      const point = { x: 95, y: 140 } // exactly 5px outside left edge
      expect(isPointInShape(point, mockShape)).toBe(true)
    })

    it('handles collision padding edge case (just beyond 5px)', () => {
      const point = { x: 94.9, y: 140 } // just beyond 5px padding
      expect(isPointInShape(point, mockShape)).toBe(false)
    })
  })

  describe('findHoveredConnectionPoint', () => {
    it('returns "left" when point is near left connection point', () => {
      const point = { x: 100, y: 140 } // exactly on left point
      const shapes = [mockShape]
      const result = findHoveredConnectionPoint(point, mockShape.id, shapes)
      expect(result).toBe('left')
    })

    it('returns "top" when point is near top connection point', () => {
      const point = { x: 160, y: 100 } // exactly on top point
      const shapes = [mockShape]
      const result = findHoveredConnectionPoint(point, mockShape.id, shapes)
      expect(result).toBe('top')
    })

    it('returns "right" when point is near right connection point', () => {
      const point = { x: 220, y: 140 } // exactly on right point
      const shapes = [mockShape]
      const result = findHoveredConnectionPoint(point, mockShape.id, shapes)
      expect(result).toBe('right')
    })

    it('returns "bottom" when point is near bottom connection point', () => {
      const point = { x: 160, y: 180 } // exactly on bottom point
      const shapes = [mockShape]
      const result = findHoveredConnectionPoint(point, mockShape.id, shapes)
      expect(result).toBe('bottom')
    })

    it('returns connection point within hit radius (8px)', () => {
      // Hit radius is 8px, so 7px away should still hit
      const point = { x: 100 + 7, y: 140 } // 7px away from left point
      const shapes = [mockShape]
      const result = findHoveredConnectionPoint(point, mockShape.id, shapes)
      expect(result).toBe('left')
    })

    it('returns null when point is outside hit radius', () => {
      // More than 8px away from any connection point
      const point = { x: 160, y: 140 } // center, far from all points
      const shapes = [mockShape]
      const result = findHoveredConnectionPoint(point, mockShape.id, shapes)
      expect(result).toBeNull()
    })

    it('returns null when shape not found', () => {
      const point = { x: 100, y: 140 }
      const shapes = [mockShape]
      const result = findHoveredConnectionPoint(point, 'nonexistent-id', shapes)
      expect(result).toBeNull()
    })

    it('returns null when shapes array is empty', () => {
      const point = { x: 100, y: 140 }
      const result = findHoveredConnectionPoint(point, mockShape.id, [])
      expect(result).toBeNull()
    })

    it('prioritizes first matching connection point when multiple are in range', () => {
      // Place point very close to the left point (within 8px radius)
      // but still within hit detection
      const point = { x: 106, y: 140 } // 6px away from left point (100, 140)
      const shapes = [mockShape]
      const result = findHoveredConnectionPoint(point, mockShape.id, shapes)
      // Should hit the closest connection point
      expect(result).toBe('left')
    })

    it('handles multiple shapes, finds correct one', () => {
      const shape2 = { ...mockShape, id: 'shape-2', x: 400, y: 400 }
      const shapes = [mockShape, shape2]

      // Point near shape2's left point
      const point = { x: 400, y: 440 }
      const result = findHoveredConnectionPoint(point, 'shape-2', shapes)
      expect(result).toBe('left')
    })

    it('handles hit radius boundary (exactly 8px)', () => {
      // Point exactly 8px away should hit
      const point = { x: 100 + 8, y: 140 } // exactly 8px away horizontally
      const shapes = [mockShape]
      const result = findHoveredConnectionPoint(point, mockShape.id, shapes)
      expect(result).toBe('left')
    })

    it('handles hit radius boundary (just beyond 8px)', () => {
      // Point just beyond 8px should miss
      const point = { x: 100 + 8.1, y: 140 } // 8.1px away, outside hit radius
      const shapes = [mockShape]
      const result = findHoveredConnectionPoint(point, mockShape.id, shapes)
      expect(result).toBeNull()
    })

    it('handles diagonal distance calculation (Pythagorean)', () => {
      // Point at (104, 144) is sqrt(4^2 + 4^2) = sqrt(32) ≈ 5.66px from (100, 140)
      const point = { x: 104, y: 144 }
      const shapes = [mockShape]
      const result = findHoveredConnectionPoint(point, mockShape.id, shapes)
      expect(result).toBe('left') // should be within 8px
    })

    it('handles negative coordinates in shape', () => {
      const shapeNegative = { ...mockShape, id: 'neg-shape', x: -100, y: -100 }
      const shapes = [shapeNegative]
      const point = { x: -100, y: -60 } // near left point of negative shape
      const result = findHoveredConnectionPoint(point, 'neg-shape', shapes)
      expect(result).toBe('left')
    })
  })
})
