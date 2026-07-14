/**
 * CANVAS_CONFIG - Centralized configuration for all canvas and shape constants.
 * Single source of truth for magic numbers, dimensions, and styling.
 */

export const CANVAS_CONFIG = {
  /**
   * Canvas dimensions (SVG viewport size)
   */
  CANVAS: {
    width: 4000,
    height: 3000,
  },

  /**
   * Shape dimensions - used for all shapes in the diagram.
   * These values determine:
   * - Bounding box size for collision detection
   * - Connection point positions (centered on edges)
   * - Selection indicator size
   */
  SHAPE: {
    width: 120,
    height: 80,
    /** Collision padding: extends hit detection by 5px on all sides.
     * Makes shapes easier to select/hover without being pixel-perfect.
     */
    collisionPadding: 5,
  },

  /**
   * Connection points - endpoints for creating connections between shapes.
   * Located at midpoints of each edge (left, top, right, bottom).
   */
  CONNECTION_POINT: {
    /** Hit radius (8px) determines how close cursor must be to click a point.
     * Larger = easier to click. Used in findHoveredConnectionPoint.
     */
    hitRadius: 8,
    /** Curve offset for bezier path calculation (legacy, may be used in rendering).
     * Controls the curve of connection lines.
     */
    curveOffset: 50,
  },

  /**
   * Connector labels - text boxes that appear on connection lines.
   */
  CONNECTOR_LABEL: {
    width: 60,
    height: 24,
  },

  /**
   * Colors for various UI states.
   * Used for selection indicators, hover states, and connector paths.
   */
  COLORS: {
    /** Selection indicator (dashed redline border around selected shapes) */
    selection: 'var(--selection-color)',
    /** Hover state when over target during connection drag */
    hover: 'var(--hover-color)',
    /** Default connector path color */
    connectorPath: 'var(--connector-color)',
    /** Active/hovered connector path color */
    connectorPathActive: 'var(--hover-color)',
  },
}

/**
 * Export individual constants for backward compatibility and convenience.
 * These match the old magic numbers found throughout the codebase.
 */
export const SHAPE_DIMENSIONS = {
  width: CANVAS_CONFIG.SHAPE.width,
  height: CANVAS_CONFIG.SHAPE.height,
}

export const HIT_RADIUS = CANVAS_CONFIG.CONNECTION_POINT.hitRadius
export const COLLISION_PADDING = CANVAS_CONFIG.SHAPE.collisionPadding
