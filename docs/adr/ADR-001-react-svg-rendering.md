# ADR-001: React + SVG for Rendering

**Status:** Proposed

## Context

The flowchart editor needs a rendering technology to display shapes and connectors. The choice affects interaction patterns, performance characteristics, and development velocity. Key considerations:
- Ease of dragging interactive elements
- Support for styled, clickable shapes
- Vector graphics fidelity
- Learning curve and tooling

## Decision

We will use **React + SVG** for rendering the diagram canvas.

## Consequences

**Positive:**
- SVG elements are DOM nodes, making drag-and-drop trivial (native browser APIs).
- Shapes are inherently styleable (CSS + SVG attributes).
- Text labels within shapes work naturally.
- Fast development velocity for interactive features.
- SVG scales infinitely without pixelation.

**Negative:**
- Performance degrades with thousands of shapes (Canvas would handle this better).
- More verbose than Canvas for custom rendering.
- Browser paint events are more frequent (minor impact for typical diagrams).

## Alternatives Considered

- **Canvas:** Offers better performance at scale, but requires manual implementation of all interactions (dragging, clicking, hover states). Increases complexity for MVP.
- **Existing libraries (Excalidraw, Miro):** Skips implementation work but loses learning value and customization control.
- **Vanilla JS + SVG:** Possible but React handles state management and re-renders cleanly.

## Implementation Notes

- Use React for component state (selected shape, shapes array, connectors array).
- SVG groups (`<g>`) for each shape; position via `transform="translate(x, y)"`.
- Use `onMouseDown` / `onMouseMove` / `onMouseUp` on the SVG root to handle canvas-level interactions.
- Libraries to consider: `react-use-gesture` for drag handling (optional—native events work fine).
- Consider `react-zoom-pan-pinch` for zoom/pan (Q5 decision).
