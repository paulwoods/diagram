# ADR-003: SVG Curved Lines for Connectors

**Status:** Proposed

## Context

Connectors (lines between shapes) can be rendered as:
- Straight lines: simplest, can look cluttered
- Curved lines (Bézier): visually polished, moderate complexity
- Orthogonal (rectilinear): professional look but complex routing
- Auto-routed: intelligent path-finding, very complex

The choice affects visual polish and implementation effort.

## Decision

We will use **SVG Bézier curves** (quadratic or cubic) for connector lines. Curves will smoothly flow between source and target shapes.

## Consequences

**Positive:**
- Visually polished; curves look more professional than straight lines.
- SVG `<path>` elements with `Q` (quadratic) or `C` (cubic) commands are native and performant.
- Easier to position labels on curves (midpoint calculation).
- Users will find diagrams more readable.

**Negative:**
- Slightly more complex math to calculate control points.
- Curves can overlap shapes if control points aren't chosen well (mitigated with smart positioning).
- Harder to debug visually (less predictable than straight lines).

## Alternatives Considered

- **Straight lines:** Simplest to draw (`<line>` elements). Rejected—diagrams look cluttered, especially with many connectors.
- **Orthogonal lines:** Professional appearance but requires path-finding logic. Out of scope for MVP.
- **Auto-routed:** Would avoid connector overlaps but is complex. Rejected for MVP.

## Implementation Notes

- Use SVG `<path>` with quadratic Bézier (`Q` command) or cubic (`C` command).
- For a curve from shape A (center x1, y1) to shape B (center x2, y2):
  - Control point: midpoint between shapes, offset by a fixed amount (e.g., vertical offset of 50px).
  - Example: `M x1 y1 Q cx cy x2 y2` where `cx = (x1 + x2) / 2`, `cy = (y1 + y2) / 2 + offset`.
- Add arrowhead marker to target end (SVG `<marker>` with polygon).
- Connector is clickable: add `pointer-events: stroke` to `<path>` so clicks near the line register.
- For optional connector labels (ADR-008): position text at midpoint of curve.
