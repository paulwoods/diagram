# ADR-002: Top Toolbar for Shape Selection

**Status:** Proposed

## Context

Users need to select which shape type to place on the canvas. Multiple UI patterns exist:
- Left sidebar (vertical list of shapes)
- Top toolbar (horizontal buttons)
- Context menu (right-click)
- Keyboard shortcuts

The choice affects screen real estate, discoverability, and workflow.

## Decision

We will use a **top toolbar with shape selection buttons**. Each shape type (Rectangle, Diamond, etc.) is a clickable button with an icon.

## Consequences

**Positive:**
- Horizontal toolbar doesn't consume precious width (valuable on typical monitor aspect ratios).
- Shapes and their icons are visible at a glance.
- Easy to add tooltips (hover text).
- Clean separation between toolbar area and canvas area.
- Scales well as we add more tools (undo/redo, export, etc.).

**Negative:**
- Toolbar height reduces vertical canvas space.
- Small button targets could be hard to click (mitigated with reasonable button padding).
- Horizontal space may be tight on very narrow screens (acceptable—desktop-only).

## Alternatives Considered

- **Left sidebar:** Uses vertical space instead; easier to label. Rejected because width is more valuable than height on typical monitors.
- **Context menu:** No persistent affordance; users must remember to right-click. Rejected—less discoverable for first-time users.
- **Keyboard shortcuts only:** Fast for power users but has steep learning curve. Use as secondary (e.g., 'R' for Rectangle).

## Implementation Notes

- Toolbar container: fixed row at top, full width, padding/height ~60px.
- Buttons: 40×40px icons with tooltips (title attribute or custom tooltip component).
- State: single selected shape type (e.g., `selectedShapeType = 'rectangle'`).
- On canvas click after a shape is selected: place the shape at click position, reset selection.
- Consider adding visual feedback (button highlight) when a shape type is selected.
