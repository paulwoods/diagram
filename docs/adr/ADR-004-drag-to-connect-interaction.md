# ADR-004: Drag-to-Connect Interaction Model

**Status:** Proposed

## Context

Users need to create connections between shapes. Interaction patterns include:
- Drag-to-connect: click and drag from one shape to another
- Two-click: select source, then click target
- Button mode: activate connect tool, then click two shapes

The choice affects UX feel and learnability.

## Decision

We will use **drag-to-connect**. Users click and drag from one shape toward another shape to create a line. Release over the target shape to connect; release elsewhere to cancel.

## Consequences

**Positive:**
- Feels modern and intuitive (similar to Figma, Miro, Lucidchart).
- Visual feedback during drag (line follows cursor).
- Natural affordance: dragging implies a motion/connection.
- Single gesture per connection (fast).

**Negative:**
- Requires detecting shape-to-shape interactions during drag (small complexity overhead).
- Users might drag accidentally; need to handle stray drags gracefully (cancel silently).
- Needs clear visual feedback (drag origin, line following cursor, target highlight).

## Alternatives Considered

- **Two-click:** Click source, click target. More discoverable but feels clunky.
- **Button mode:** Explicit "connect" tool activation. Too many steps.
- **Context menu:** Right-click shape, pick "connect to." Hidden UI, not intuitive.

## Implementation Notes

- State: `isConnecting` boolean, `connectionStart` (shape ID), `dragEndpoint` (current cursor position).
- On shape `mouseDown`: if a shape is clicked, set `isConnecting = true`, `connectionStart = shapeId`.
- On canvas `mouseMove` while connecting: update `dragEndpoint` to cursor position, draw temporary line.
- On shape `mouseUp`: if hovering a different shape, create connector. Otherwise, cancel.
- Visual feedback:
  - Highlight source shape during drag (e.g., glow effect, opacity change).
  - Highlight potential target shapes on hover (visual confirmation).
  - Draw temporary line from source to cursor.
- Arrowhead on connector should point toward target (ADR-003).
