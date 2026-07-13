# ADR-012: Extract Interaction Concerns into Custom Hooks

**Date:** 2026-07-13  
**Status:** Accepted  
**Owner:** Paul Woods

---

## Problem Statement

Canvas.jsx grew to 404 lines, mixing four distinct interaction concerns:
1. Shape dragging
2. Canvas panning
3. Connection creation
4. Label editing

This "god component" pattern made testing, reuse, and feature addition difficult.

---

## Solution

Extract each interaction into a custom hook returning state + memoized handlers. Canvas acts as a thin orchestrator routing events.

### Implemented Hooks

| Hook | Purpose | State | Tests |
|------|---------|-------|-------|
| `useShapeDragging` | Manage shape position updates | isDragging, draggedShapeId, dragStart | 20 |
| `useCanvasPanning` | Manage SVG transform | isPanning, panStart | 21 |
| `useConnectionCreation` | Manage connector state & hover | connectionStart, dragEndpoint, hoveredShapeId | 28 |
| `useEditingMode` | Manage label edit form | editingId, editingText, editingType | 37 |

### Key Design Patterns

**useRef + useEffect for stability:**
- Handlers memoized with `useCallback` (no deps)
- `useRef` stores latest dependencies
- `useEffect` updates ref without invalidating memoization

**Loose coupling in Canvas:**
- Hooks independent, don't know about each other
- Canvas routes events based on mode
- Easy to add/remove interactions

---

## Results

✅ **Backward Compatible**
- 100% of existing behavior preserved
- All 170 unit tests passing
- Visual behavior identical

✅ **Code Quality**
- Canvas: 404 → ~100 lines
- Each hook: ≤80 lines
- Clear separation of concerns

✅ **Testability**
- Each hook tested in isolation
- No rendering overhead
- 170 tests run in <2s

✅ **Extensibility**
- Pattern scales to new interactions
- No modifications to existing code to add features

---

**Status:** Implemented 2026-07-13
