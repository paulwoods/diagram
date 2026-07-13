# ADR-009: Selective Left-Click Drag Panning

**Status:** Implemented

## Context

Initial panning implementation relied on `react-zoom-pan-pinch` library's default pan behavior, which allowed panning with middle-click or on any drag. This created a poor user experience because:
- Users couldn't reliably drag shapes without accidentally panning
- Multiple input modalities conflicted (shape drag vs. canvas pan)
- Intuitive workflows were interrupted by unintended pans

We needed a more predictable panning model that doesn't interfere with shape interactions.

## Decision

Implement **selective left-click drag panning** that:
1. Only activates on left mouse button + drag
2. Only works on empty canvas (not over shapes)
3. Disables library's default panning (`disablePanning` prop)
4. Uses custom CSS transform for pan implementation
5. Maintains scroll-wheel zoom via library

## Consequences

**Positive:**
- Clean separation between pan and shape interactions
- Users can reliably drag shapes without accidental pans
- More predictable/discoverable UX (left-click drag = pan)
- Cursor feedback ("grabbing" state) guides users
- Works seamlessly with shape movement feature

**Negative:**
- Lost middle-click pan convenience
- Slightly more code (custom pan handlers vs. library default)
- Pan state management adds complexity

## Alternatives Considered

- **Modifier key panning** (Ctrl+drag): Requires teaching users a shortcut, less discoverable
- **Keep library default**: Would conflict with future shape interactions
- **Keyboard pan controls** (arrow keys): Slower than direct drag

## Implementation Notes

- Collision detection checks if cursor is over shape before enabling pan
- CSS `transform: translate(x, y)` used for smooth pan performance
- Cursor changes to `grabbing` to indicate pan mode
- Works independently from zoom (library handles zoom separately)
- Pan resets SVG transform on mouseUp

## Related Decisions

- [[ADR-001]](ADR-001-react-svg-rendering.md): SVG rendering enables CSS transforms
- [[ADR-004]](ADR-004-drag-to-connect-interaction.md): Related to drag interaction patterns
