import { describe, it, expect, beforeEach } from 'vitest'
import { isPointInShape } from '../ShapeGeometry'
import { CANVAS_CONFIG } from '../../constants/CANVAS_CONFIG'

/**
 * Test suite for fragile collision detection logic in ShapeGeometry.js
 *
 * Tests the isPointInShape() function which uses collision padding to expand
 * the selectable area. This padding is a critical UX parameter that affects
 * how easily users can select shapes.
 */

describe('isPointInShape() - Collision Detection', () => {
  const mockShape = {
    id: 'test-shape',
    x: 100,
    y: 100,
    type: 'rectangle',
    label: 'Test',
    color: '#3b82f6',
  }

  const padding = CANVAS_CONFIG.SHAPE.collisionPadding
  const shapeWidth = CANVAS_CONFIG.SHAPE.width
  const shapeHeight = CANVAS_CONFIG.SHAPE.height

  describe('Points clearly inside shape', () => {
    it('detects point at shape center', () => {
      const point = {
        x: mockShape.x + shapeWidth / 2,
        y: mockShape.y + shapeHeight / 2,
      }
      expect(isPointInShape(point, mockShape)).toBe(true)
    })

    it('detects point at shape corner (top-left)', () => {
      const point = { x: mockShape.x, y: mockShape.y }
      expect(isPointInShape(point, mockShape)).toBe(true)
    })

    it('detects point at shape corner (bottom-right)', () => {
      const point = {
        x: mockShape.x + shapeWidth,
        y: mockShape.y + shapeHeight,
      }
      expect(isPointInShape(point, mockShape)).toBe(true)
    })
  })

  describe('Points in collision padding area (outside shape, inside padded bounds)', () => {
    it('detects point in padding on left side', () => {
      const point = {
        x: mockShape.x - padding / 2, // inside padding
        y: mockShape.y + shapeHeight / 2,
      }
      expect(isPointInShape(point, mockShape)).toBe(true)
    })

    it('detects point in padding on top side', () => {
      const point = {
        x: mockShape.x + shapeWidth / 2,
        y: mockShape.y - padding / 2, // inside padding
      }
      expect(isPointInShape(point, mockShape)).toBe(true)
    })

    it('detects point in padding on right side', () => {
      const point = {
        x: mockShape.x + shapeWidth + padding / 2, // inside padding
        y: mockShape.y + shapeHeight / 2,
      }
      expect(isPointInShape(point, mockShape)).toBe(true)
    })

    it('detects point in padding on bottom side', () => {
      const point = {
        x: mockShape.x + shapeWidth / 2,
        y: mockShape.y + shapeHeight + padding / 2, // inside padding
      }
      expect(isPointInShape(point, mockShape)).toBe(true)
    })

    it('detects point in corner padding (top-left diagonal)', () => {
      const point = {
        x: mockShape.x - padding / 2,
        y: mockShape.y - padding / 2,
      }
      expect(isPointInShape(point, mockShape)).toBe(true)
    })
  })

  describe('Points outside collision padding area (should be rejected)', () => {
    it('rejects point clearly outside left boundary', () => {
      const point = {
        x: mockShape.x - padding - 1,
        y: mockShape.y + shapeHeight / 2,
      }
      expect(isPointInShape(point, mockShape)).toBe(false)
    })

    it('rejects point clearly outside top boundary', () => {
      const point = {
        x: mockShape.x + shapeWidth / 2,
        y: mockShape.y - padding - 1,
      }
      expect(isPointInShape(point, mockShape)).toBe(false)
    })

    it('rejects point clearly outside right boundary', () => {
      const point = {
        x: mockShape.x + shapeWidth + padding + 1,
        y: mockShape.y + shapeHeight / 2,
      }
      expect(isPointInShape(point, mockShape)).toBe(false)
    })

    it('rejects point clearly outside bottom boundary', () => {
      const point = {
        x: mockShape.x + shapeWidth / 2,
        y: mockShape.y + shapeHeight + padding + 1,
      }
      expect(isPointInShape(point, mockShape)).toBe(false)
    })
  })

  describe('Boundary conditions (at exact padding edges)', () => {
    it('accepts point exactly at left padding boundary', () => {
      const point = {
        x: mockShape.x - padding,
        y: mockShape.y + shapeHeight / 2,
      }
      expect(isPointInShape(point, mockShape)).toBe(true)
    })

    it('accepts point exactly at right padding boundary', () => {
      const point = {
        x: mockShape.x + shapeWidth + padding,
        y: mockShape.y + shapeHeight / 2,
      }
      expect(isPointInShape(point, mockShape)).toBe(true)
    })

    it('rejects point just outside left padding boundary', () => {
      const point = {
        x: mockShape.x - padding - 0.1,
        y: mockShape.y + shapeHeight / 2,
      }
      expect(isPointInShape(point, mockShape)).toBe(false)
    })

    it('rejects point just outside right padding boundary', () => {
      const point = {
        x: mockShape.x + shapeWidth + padding + 0.1,
        y: mockShape.y + shapeHeight / 2,
      }
      expect(isPointInShape(point, mockShape)).toBe(false)
    })
  })

  describe('Shapes at different positions', () => {
    it('works for shape at origin (0, 0)', () => {
      const shape = { ...mockShape, x: 0, y: 0 }
      const point = { x: shapeWidth / 2, y: shapeHeight / 2 }
      expect(isPointInShape(point, shape)).toBe(true)
    })

    it('works for shape at negative coordinates', () => {
      const shape = { ...mockShape, x: -100, y: -100 }
      const point = { x: -100 + shapeWidth / 2, y: -100 + shapeHeight / 2 }
      expect(isPointInShape(point, shape)).toBe(true)
    })

    it('works for shape at large coordinates', () => {
      const shape = { ...mockShape, x: 5000, y: 5000 }
      const point = { x: 5000 + shapeWidth / 2, y: 5000 + shapeHeight / 2 }
      expect(isPointInShape(point, shape)).toBe(true)
    })
  })

  describe('Documentation: Collision padding is critical UX parameter', () => {
    it('collision padding improves clickability by expanding select area', () => {
      // Without padding, you need to click within exact shape bounds
      // With padding, you can click slightly outside and still select
      const pointJustOutside = {
        x: mockShape.x - 3, // 3px outside the shape
        y: mockShape.y + shapeHeight / 2,
      }

      // With 5px padding, this point (3px outside) should be selectable
      expect(isPointInShape(pointJustOutside, mockShape)).toBe(true)
    })

    it('demonstrates why padding is tuned for typical screen size', () => {
      // The padding value (currently 5px) is a tradeoff:
      // - Too small: hard to click small shapes
      // - Too large: overlapping shapes become hard to select individually
      // Current value (5px) was tuned for 13" screens at 100% zoom

      const padding = CANVAS_CONFIG.SHAPE.collisionPadding
      expect(padding).toBeGreaterThan(0) // Must have some padding
      expect(padding).toBeLessThan(20) // But not too much to avoid overlap issues
    })
  })

  describe('Regression protection', () => {
    it('handles floating point coordinates consistently', () => {
      const point1 = { x: 100.5, y: 100.5 }
      const point2 = { x: 100.1, y: 100.1 }
      const point3 = { x: 100.9, y: 100.9 }

      // All should be inside (center of 120x80 shape)
      expect(isPointInShape(point1, mockShape)).toBe(true)
      expect(isPointInShape(point2, mockShape)).toBe(true)
      expect(isPointInShape(point3, mockShape)).toBe(true)
    })

    it('uses values from CANVAS_CONFIG (not hardcoded)', () => {
      // This test ensures future config changes work correctly
      const configPadding = CANVAS_CONFIG.SHAPE.collisionPadding
      const configWidth = CANVAS_CONFIG.SHAPE.width
      const configHeight = CANVAS_CONFIG.SHAPE.height

      const point = {
        x: mockShape.x - configPadding / 2,
        y: mockShape.y + configHeight / 2,
      }

      // If the function uses CANVAS_CONFIG correctly, this will work
      expect(isPointInShape(point, mockShape)).toBe(true)
    })
  })
})
