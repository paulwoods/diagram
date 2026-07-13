# ADR-011: Centered Shape Placement

**Status:** Implemented

## Context

Initial shape placement positioned the top-left corner of the shape at the cursor location. This created poor UX because:
- Users couldn't visually predict where the shape's center would be
- Clicking at a position didn't feel like placing the shape there
- Workflows were less intuitive (expecting center, getting edge)
- Inconsistent with modern UI/UX patterns (most apps center on cursor)

## Decision

Change shape placement so that **the shape center is positioned at the cursor location**, not the top-left corner.

Implementation: When placing a shape at click position (x, y), offset by half the shape dimensions:
- `placement_x = click_x - (SHAPE_WIDTH / 2)` = `click_x - 60`
- `placement_y = click_y - (SHAPE_HEIGHT / 2)` = `click_y - 40`

This ensures the shape's visual center (calculated as `x + 60, y + 40`) aligns with the cursor.

## Consequences

**Positive:**
- Intuitive placement (users get what they expect)
- Visual feedback aligns with cursor position
- Matches standard UI/UX patterns
- Better spatial reasoning for users
- Shapes appear "under" the cursor conceptually

**Negative:**
- Offset calculation adds slight complexity
- None - this is purely an improvement

## Alternatives Considered

- **Keep top-left placement**: Inconsistent with user expectations
- **Parametric placement offset**: Over-engineered for simple case
- **Cursor anchor point selector**: Too much complexity for MVP

## Implementation Notes

- Constants defined: `SHAPE_WIDTH = 120`, `SHAPE_HEIGHT = 80`
- Applied in `handleCanvasClick()` when shape type is selected
- Works uniformly for all shape types
- Offset is consistent with how shapes are rendered (center at x+60, y+40)

## Testing

- Rectangle placed at (400, 300) → center at (400, 300) ✓
- Diamond placed at (700, 250) → center at (700, 250) ✓
- Verified visually with cursor alignment

## Related Decisions

- [[ADR-002]](ADR-002-top-toolbar-shape-selection.md): Shapes placed from toolbar selection
- [[ADR-010]](ADR-010-shape-drag-to-move.md): Drag-to-move operates on the same coordinate system
