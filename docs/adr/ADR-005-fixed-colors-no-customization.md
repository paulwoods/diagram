# ADR-005: Fixed Colors (No Customization)

**Status:** Proposed

## Context

Shapes and connectors can have fixed default colors, or users can customize them via color picker, themes, or preset palettes. Color customization adds visual richness but increases scope.

## Decision

We will use **fixed, predetermined colors**. All rectangles are the same color, all diamonds the same color, etc. No color picker or customization in MVP.

## Consequences

**Positive:**
- Zero UI complexity for color selection.
- Diagrams have consistent visual appearance.
- Faster development (no color picker component, no state management for colors).
- Reduces decision fatigue for users (some might debate colors instead of editing).
- Can always add customization in v2 if users request it.

**Negative:**
- Less expressiveness; users can't use color to encode meaning (e.g., different colors for different process types).
- Visual variety is limited.
- Some users may want personal aesthetic preferences.

## Alternatives Considered

- **Color picker:** Add color UI to toolbar or shape context menu. Out of scope for MVP due to complexity.
- **Preset themes:** Allow users to pick a diagram-wide color scheme. Moderate complexity, deferred to v2.
- **Gradient or styled shapes:** Increases visual polish but not essential for MVP.

## Implementation Notes

- Define a color palette constant (e.g., `SHAPE_COLORS = { rectangle: '#3b82f6', diamond: '#f59e0b', ... }`).
- Apply colors via SVG `fill` and `stroke` attributes.
- Default stroke color: dark gray or black (e.g., `#1f2937`).
- Default text color: white or dark (contrast with shape color).
- Keep palette accessible for quick v2 iteration if feedback arrives.

**Example palette:**
```
- Rectangle: Blue (#3b82f6)
- Diamond: Amber (#f59e0b)
- Oval: Green (#10b981)
- Parallelogram: Purple (#a855f7)
- Rounded Rectangle: Red (#ef4444)
- Circle: Cyan (#06b6d4)
```
