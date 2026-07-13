# ADR-010: Shape Drag-to-Move

**Status:** Implemented

## Context

Shapes initially could only be placed via click-to-place. Users couldn't reposition shapes after placement without deleting and re-creating them. This severely limited editing capability and made the editor feel incomplete.

We needed an intuitive way to move shapes after they're placed on the canvas.

## Decision

Implement **shape drag-to-move** where:
1. Left mouse button down on a shape initiates drag
2. Mouse move updates shape position in real-time
3. Mouse up completes the move
4. Shape stays selected during and after drag
5. Cursor changes to "grabbing" for visual feedback

## Consequences

**Positive:**
- Intuitive drag-to-reposition UX (matches user expectations)
- Real-time visual feedback of shape movement
- Shapes remain selected for quick label editing after move
- Integrates seamlessly with click-to-select interaction
- No conflicts with other interactions (pan uses empty space)

**Negative:**
- Adds state tracking (isDraggingShape, draggedShapeId, dragShapeStart)
- Requires collision detection to distinguish shape drag from canvas pan
- Shape position updates frequently (performance consideration for many shapes)

## Alternatives Considered

- **Arrow keys for movement**: Slow for precise positioning
- **Separate "move tool" mode**: Requires tool switching, breaks flow
- **Click-drag on shape outline only**: Too precise, hard to hit target

## Implementation Notes

- State tracks: isDraggingShape (bool), draggedShapeId (string), dragShapeStart (coords + shape position)
- Collision detection via isPointInShape() AABB bounding box check
- Delta calculation: `new_position = start_position + (current_mouse - start_mouse)`
- onUpdateShape() called on every mousemove for real-time feedback
- Drag state cleaned up on mouseUp or mouseLeave

## Performance Considerations

- Real-time updates on mousemove could be expensive with hundreds of shapes
- Consider debouncing or throttling if shape count becomes large
- SVG re-renders efficiently due to React's virtual DOM

## Related Decisions

- [[ADR-009]](ADR-009-selective-left-click-panning.md): Pan only on empty space to avoid conflicts
- [[ADR-004]](ADR-004-drag-to-connect-interaction.md): Related to drag interaction patterns
