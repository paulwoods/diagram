/**
 * ShapeGeometry - Centralized geometry logic for shape and connection point calculations.
 * Single source of truth for shape dimensions, connection points, and hit detection.
 */

import { CANVAS_CONFIG } from '../constants/CANVAS_CONFIG'

// Shape dimensions - imported from CANVAS_CONFIG for consistency
export const SHAPE_DIMENSIONS = CANVAS_CONFIG.SHAPE

/**
 * Get the coordinates of a connection point on a shape.
 * Connection points are at the midpoints of each edge: left, top, right, bottom.
 *
 * @param {Object} shape - Shape object with x, y properties
 * @param {string} pointId - Connection point ID: 'left' | 'top' | 'right' | 'bottom'
 * @returns {Object} {x, y} coordinates of the connection point
 */
export function getConnectionPointCoords(shape, pointId) {
  const cx = shape.x + SHAPE_DIMENSIONS.width / 2
  const cy = shape.y + SHAPE_DIMENSIONS.height / 2

  switch (pointId) {
    case 'left':
      return { x: shape.x, y: cy }
    case 'top':
      return { x: cx, y: shape.y }
    case 'right':
      return { x: shape.x + SHAPE_DIMENSIONS.width, y: cy }
    case 'bottom':
      return { x: cx, y: shape.y + SHAPE_DIMENSIONS.height }
    default:
      return { x: cx, y: cy }
  }
}

/**
 * Check if a point is inside a shape using axis-aligned bounding box (AABB) collision.
 *
 * Uses collision padding (from CANVAS_CONFIG.SHAPE.collisionPadding) on all sides
 * to expand the selectable area slightly beyond the actual shape bounds. This makes
 * shapes easier to click on without requiring pixel-perfect accuracy.
 *
 * @param {Object} point - Point to test with shape { x: number, y: number }
 * @param {Object} shape - Shape object with { x, y, ... }
 * @returns {boolean} True if point is inside shape bounds + padding
 *
 * How it works:
 * - Treats shape as axis-aligned rectangle (x, y, width, height)
 * - Tests if point falls within (x ± padding) to (x + width ± padding)
 * - Used for: shape selection, hit detection, hover states
 *
 * Collision padding details:
 * - Value: CANVAS_CONFIG.SHAPE.collisionPadding (currently 5px)
 * - Applied equally on all sides (top, bottom, left, right)
 * - Makes shapes 10px larger in each dimension (5px on each side)
 * - Tuned for 13" laptop screens at 100% zoom
 *
 * Empirical tuning: 5px was found to balance clickability vs. overlap issues.
 * If users report shapes hard to click (shape too small?), try increasing padding.
 * If users report unintended selections (overlap?), try decreasing padding.
 * Test with actual end-users before adjusting.
 *
 * Example: Shape at (100, 100) with 5px padding matches points from (95, 95) to (125, 125)
 */
export function isPointInShape(point, shape) {
  const padding = CANVAS_CONFIG.SHAPE.collisionPadding

  return (
    point.x >= shape.x - padding &&
    point.x <= shape.x + CANVAS_CONFIG.SHAPE.width + padding &&
    point.y >= shape.y - padding &&
    point.y <= shape.y + CANVAS_CONFIG.SHAPE.height + padding
  )
}

/**
 * Find which connection point (if any) the cursor is hovering over.
 * Uses hit radius from CANVAS_CONFIG around each connection point.
 *
 * @param {Object} point - Current cursor position {x, y}
 * @param {string} targetShapeId - ID of the shape to check
 * @param {Array} shapes - Array of all shapes
 * @returns {string|null} Connection point ID ('left'|'top'|'right'|'bottom') or null
 */
export function findHoveredConnectionPoint(point, targetShapeId, shapes) {
  const shape = shapes.find((s) => s.id === targetShapeId)
  if (!shape) return null

  const pointIds = ['left', 'top', 'right', 'bottom']
  const hitRadius = CANVAS_CONFIG.CONNECTION_POINT.hitRadius

  for (const pointId of pointIds) {
    const coords = getConnectionPointCoords(shape, pointId)
    const distance = Math.sqrt((point.x - coords.x) ** 2 + (point.y - coords.y) ** 2)
    if (distance <= hitRadius) {
      return pointId
    }
  }
  return null
}

/**
 * Get all connection points for a shape.
 * Helper function for rendering or iteration.
 *
 * @param {Object} shape - Shape object
 * @returns {Array} Array of {id, x, y} for each connection point
 */
export function getConnectionPoints(shape) {
  const pointIds = ['left', 'top', 'right', 'bottom']
  return pointIds.map((pointId) => ({
    id: pointId,
    ...getConnectionPointCoords(shape, pointId),
  }))
}

/**
 * Get the bounding box of a shape (used for collision detection).
 * Returns the shape's bounds without padding.
 *
 * @param {Object} shape - Shape object
 * @returns {Object} {x, y, width, height} bounding box
 */
export function getShapeBounds(shape) {
  return {
    x: shape.x,
    y: shape.y,
    width: SHAPE_DIMENSIONS.width,
    height: SHAPE_DIMENSIONS.height,
  }
}
