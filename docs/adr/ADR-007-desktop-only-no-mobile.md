# ADR-007: Desktop-Only (No Mobile Support)

**Status:** Proposed

## Context

Applications can target desktop, mobile, or both. Supporting both requires:
- Touch event handling (touchstart, touchmove, touchend vs mouse events)
- Responsive UI (smaller screens, different layout)
- Gesture recognition (pinch-to-zoom, long-press)
- Testing on mobile devices

Flowchart editing is inherently desktop-centric (large canvas, precision dragging).

## Decision

We will build for **desktop only**. No mobile or tablet support in MVP. The site should not break on mobile, but interactions won't be optimized for touch.

## Consequences

**Positive:**
- Eliminates touch event complexity.
- No need for responsive layout or mobile UI patterns.
- Faster MVP delivery.
- Mouse events are simpler and more precise.
- Respects the nature of the task (diagram editing is desktop work).

**Negative:**
- Mobile users will have poor UX if they visit.
- Touch dragging will feel clunky (mouse events fire slowly on touch).
- Potential market is smaller (no mobile-first audience).
- Mobile support will be harder to add later (requires refactoring interactions).

## Alternatives Considered

- **Mobile-first:** Build for touch from day one. 20-30% more work for MVP; not justified.
- **Responsive but mouse-only:** Allow access on mobile but don't optimize. Current plan.
- **Separate mobile app:** Use React Native or Flutter. Out of scope.

## Implementation Notes

- Use mouse events (`mouseDown`, `mouseMove`, `mouseUp`) exclusively.
- No `touchstart` / `touchmove` handlers.
- No responsive breakpoints or mobile UI.
- CSS can use viewport units (vw, vh) but no mobile-specific layouts.
- Assume minimum viewport width of ~1200px (typical desktop).
- Consider adding a banner on mobile: "Best experienced on desktop" (optional, low effort).
- If users request mobile in v2, refactor interactions to handle both mouse and touch.

**Future v2 work:** If mobile becomes important, swap mouse events for a pointer event layer or use a library like `react-use-gesture`.
