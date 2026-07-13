# PRD-001: Flowchart Editor Architecture Refactoring

**Document Version:** 1.0  
**Last Updated:** July 12, 2024  
**Status:** Draft  
**Owner:** Paul Woods  

---

## Executive Summary

The Flowchart Editor MVP is feature-complete and stable, but the codebase shows signs of shallow modules and mixed concerns that create friction during development. This PRD outlines a phased refactoring initiative to deepen the architecture, improve testability, and enable faster feature development.

**Objective:** Transform Canvas.jsx from a 404-line god module into a clean, modular architecture with reusable interaction concerns, consolidated geometry logic, and centralized configuration.

**Expected Outcome:**
- ✅ Reduced bug surface area through single-source-of-truth geometry
- ✅ Testable interaction flows (shape dragging, panning, connection creation)
- ✅ Faster feature additions (new interactions no longer require editing Canvas)
- ✅ Better developer experience (clear module boundaries, self-documenting code)

**Timeline:** 2-3 weeks (3 phases)  
**Team:** 1 engineer (full-time on refactoring)  
**Risk Level:** Low (refactoring only; no new features or user-facing changes)

---

## Goals and Objectives

### Primary Goals

1. **Eliminate Duplicate Geometry Logic**
   - Consolidate connection point calculations from 3 files into 1 shared module
   - Reduce coordinate mismatch bugs by 100% (make them impossible via centralization)

2. **Improve Testability**
   - Extract interaction logic into isolated custom hooks
   - Enable unit testing of drag, pan, and connection flows without rendering Canvas
   - Increase test coverage from ~30% to >70% for interaction logic

3. **Improve Maintainability**
   - Reduce Canvas.jsx from 404 → ~100 lines
   - Create clear module boundaries (ShapeGeometry, CANVAS_CONFIG, useShapeDragging, etc.)
   - Make it obvious where to add new interaction features

4. **Enable Scaling**
   - Support future features (snap-to-grid, multi-select, undo/redo) without major refactoring
   - Reuse interaction hooks across multiple diagram tools (if needed in future)

### Secondary Goals

- Document why magic numbers exist (collision padding, curve offset) with inline comments
- Establish patterns for future feature development (all new interactions use custom hooks)
- Create a CONTEXT.md domain glossary for future contributors

---

## Scope

### In Scope (This PRD)

#### Phase 1: Geometry Consolidation
- Create `ShapeGeometry.js` module with:
  - `SHAPE_DIMENSIONS` constant
  - `getConnectionPointCoords(shape, pointId)` function
  - `getConnectionPoints(shape)` helper
  - Helper for shape boundary calculations (used in collision detection)
- Update Canvas.jsx, Connector.jsx, ShapeElement.jsx to import from ShapeGeometry
- Update tests to verify no behavior change

#### Phase 2: Configuration Centralization
- Create `constants/CANVAS_CONFIG.js` with:
  - `CANVAS` (width, height)
  - `SHAPE` (width, height, collision padding)
  - `CONNECTION_POINT` (hit radius, curve offset)
  - `CONNECTOR_LABEL` (box dimensions)
  - `COLORS` (selection, hover, path colors)
- Add JSDoc comments explaining the origin of each constant
- Replace all hardcoded numbers across 4 files with imports from CANVAS_CONFIG

#### Phase 3: Interaction Extraction
- Create custom hooks:
  - `useShapeDragging(shapes, onUpdateShape)` → returns handlers + state
  - `useCanvasPanning(svgRef)` → returns handlers + state
  - `useConnectionCreation(shapes, onAddConnector)` → returns handlers + state
  - `useEditingMode()` → returns state + handlers for label editing
- Refactor Canvas.jsx to compose these hooks
- Create EditingModal.jsx component to own edit UI
- Update tests for each hook in isolation

#### Phase 4: Shallow Module Consolidation (Optional in v2)
- Decide: inline `renderShapeGeometry` or create dedicated `ShapeRenderer` component
- This is lower priority; keep for future if time permits

### Out of Scope (Future PRDs)

- Adding new diagram features (snap-to-grid, multi-select, undo/redo)
- UI improvements or redesigns
- Performance optimization (not blocking)
- Mobile support (explicitly out of MVP scope)
- New shape types or connector styles
- Cloud persistence or collaboration

---

## User Stories & Use Cases

### Developer Stories (Internal)

**As a developer adding a new interaction (e.g., snap-to-grid),**
- I should be able to create a custom hook (e.g., `useGridSnapping`)
- that handles its own state and event listeners
- and composes cleanly into Canvas
- so I don't need to understand the entire Canvas interaction model

**As a developer debugging a coordinate mismatch,**
- I should look in ShapeGeometry.js
- not hunt across 3 files
- so I can fix it in < 5 minutes

**As a developer tuning hit detection,**
- I should change `CANVAS_CONFIG.CONNECTION_POINT.HIT_RADIUS`
- in one place
- and see the change reflected everywhere
- so I can A/B test without code search/replace

**As a contributor reviewing Canvas changes,**
- I should see a clear separation of concerns
- (shape dragging, panning, connections, editing are separate hooks)
- so I understand which logic was modified
- and can review confidently

### Testing Stories

**As a test author writing interaction tests,**
- I should be able to test `useShapeDragging` in isolation
- without rendering Canvas or ShapeElement
- with mock shapes and callbacks
- so tests run fast and are deterministic

**As a QA engineer,**
- I should have test coverage for all interaction flows
- (drag start → move → release = shape moves)
- (pan start → move → release = canvas translates)
- (connection start → hover → release = connector created)
- so I can confidently say "interaction logic didn't break"

---

## Requirements

### Functional Requirements

| Req ID | Requirement | Phase | Acceptance Criteria |
|--------|-------------|-------|-------------------|
| FR-1 | Consolidate connection point geometry | 1 | Canvas, Connector, ShapeElement all import from ShapeGeometry; no coordinate mismatches |
| FR-2 | Centralize magic numbers | 2 | All hardcoded numbers replaced with named constants; CANVAS_CONFIG.js is single source of truth |
| FR-3 | Extract shape dragging logic | 3 | useShapeDragging hook exists, handles mouseDown/Move/Up, returns state for Canvas to use |
| FR-4 | Extract panning logic | 3 | useCanvasPanning hook exists, manages SVG transform, is testable in isolation |
| FR-5 | Extract connection creation logic | 3 | useConnectionCreation hook exists, manages connection state, fires onAddConnector callback |
| FR-6 | Extract editing logic | 3 | useEditingMode hook + EditingModal component own all editing UI and state |
| FR-7 | Maintain 100% backward compatibility | All | All interactions work identically post-refactoring; no user-visible changes |
| FR-8 | Document geometry assumptions | 2 | Comments explain why collision padding is 5px, curve offset is 50px, etc. |

### Non-Functional Requirements

| Req ID | Requirement | Phase | Acceptance Criteria |
|--------|-------------|-------|-------------------|
| NFR-1 | Code maintainability | 3 | Canvas.jsx ≤ 150 lines; each hook ≤ 80 lines |
| NFR-2 | Test coverage | 3 | >70% coverage for interaction logic; each hook has unit tests |
| NFR-3 | Module locality | 1-3 | Related logic lives in one file; no circular dependencies |
| NFR-4 | No runtime performance impact | All | App loads in same time; interactions have same latency |
| NFR-5 | Type safety (if using TypeScript) | All | No new `any` types; existing types remain valid |
| NFR-6 | Browser compatibility | All | Works on Chrome, Firefox, Safari (existing support maintained) |

---

## Implementation Plan

### Phase 1: Geometry Consolidation (Week 1, ~4-6 hours)

**Deliverables:**
- [ ] Create `src/modules/ShapeGeometry.js` with connection point logic
- [ ] Update Canvas.jsx to import from ShapeGeometry
- [ ] Update Connector.jsx to import from ShapeGeometry
- [ ] Update ShapeElement.jsx to use ShapeGeometry
- [ ] Add unit tests for ShapeGeometry functions
- [ ] Verify all interaction tests pass (no behavior change)

**Key Files:**
- `app/src/modules/ShapeGeometry.js` (new)
- `app/src/components/Canvas.jsx` (modify: remove getConnectionPointCoords)
- `app/src/components/Connector.jsx` (modify: import from ShapeGeometry)
- `app/src/components/ShapeElement.jsx` (modify: use ShapeGeometry.getConnectionPoints)
- `app/src/modules/__tests__/ShapeGeometry.test.js` (new)

**Acceptance:**
- Canvas, Connector, ShapeElement render identically
- All existing tests pass
- Geometry tests have >90% coverage
- No coordinate-related bugs introduced

---

### Phase 2: Configuration Centralization (Week 1, ~2-3 hours)

**Deliverables:**
- [ ] Create `src/constants/CANVAS_CONFIG.js` with all magic numbers
- [ ] Add JSDoc comments explaining each constant's origin
- [ ] Replace all hardcoded numbers across 4 files with CANVAS_CONFIG imports
- [ ] Add unit tests for CANVAS_CONFIG constants
- [ ] Verify all tests pass

**Key Files:**
- `app/src/constants/CANVAS_CONFIG.js` (new)
- `app/src/components/Canvas.jsx` (modify: import constants)
- `app/src/components/Connector.jsx` (modify: import constants)
- `app/src/components/ShapeElement.jsx` (modify: import constants)
- `app/src/components/Toolbar.jsx` (modify: if using SHAPE dimensions)

**Acceptance:**
- No hardcoded numbers remain in component files (except dimensions in renderShapeGeometry)
- Hit radius, collision padding, curve offset are documented
- All tests still pass
- A/B testing is trivial (change constant, reload)

---

### Phase 3: Interaction Extraction (Week 2-3, ~8-10 hours)

**Deliverables:**
- [ ] Create `src/hooks/useShapeDragging.js`
- [ ] Create `src/hooks/useCanvasPanning.js`
- [ ] Create `src/hooks/useConnectionCreation.js`
- [ ] Create `src/hooks/useEditingMode.js`
- [ ] Create `src/components/EditingModal.jsx`
- [ ] Refactor Canvas.jsx to compose hooks (reduce to ~150 lines)
- [ ] Add unit tests for each hook
- [ ] Add integration tests for Canvas (if not already present)
- [ ] Update README with architecture notes

**Key Files:**
- `app/src/hooks/useShapeDragging.js` (new)
- `app/src/hooks/useCanvasPanning.js` (new)
- `app/src/hooks/useConnectionCreation.js` (new)
- `app/src/hooks/useEditingMode.js` (new)
- `app/src/components/EditingModal.jsx` (new, extracted from Canvas)
- `app/src/components/Canvas.jsx` (refactor: major simplification)
- `app/src/hooks/__tests__/useShapeDragging.test.js` (new)
- `app/src/hooks/__tests__/useCanvasPanning.test.js` (new)
- `app/src/hooks/__tests__/useConnectionCreation.test.js` (new)
- `app/src/hooks/__tests__/useEditingMode.test.js` (new)

**Acceptance:**
- Canvas.jsx ≤ 150 lines (down from 404)
- Each hook ≤ 80 lines
- Interaction tests have >70% coverage
- All existing tests pass
- Canvas behavior is identical (no visual/interaction changes)

---

### Phase 4: Documentation & Code Cleanup (Week 3, ~2 hours)

**Deliverables:**
- [ ] Create `CONTEXT.md` with domain glossary (Shape, Connector, Connection Point, etc.)
- [ ] Add ADR-012: "Extracted interaction concerns into custom hooks"
- [ ] Update README with new architecture overview
- [ ] Add JSDoc to all new modules/hooks
- [ ] Create a CONTRIBUTING.md section on adding new interactions

**Key Files:**
- `.claude/CONTEXT.md` (new or update)
- `docs/adr/ADR-012-interaction-extraction.md` (new)
- `README.md` (update Architecture section)

---

## Success Metrics

### Code Quality Metrics

| Metric | Target | Current | Success Threshold |
|--------|--------|---------|------------------|
| Canvas.jsx lines of code | < 150 | 404 | ✓ If ≤ 150 |
| Duplicate geometry instances | 1 | 3 | ✓ If = 1 (ShapeGeometry.js) |
| Magic number instances | 0 | 30+ | ✓ If < 5 (only in test data) |
| Module coupling (depth) | Deep | Shallow | ✓ If each module has focused interface |
| Test coverage (interaction logic) | > 70% | ~30% | ✓ If > 70% |

### Developer Experience Metrics

| Metric | Success Criteria |
|--------|------------------|
| Time to add new interaction | < 30 min to create hook + tests (down from 1-2 hours now) |
| Bug resolution time | Coordinate bugs take < 5 min to locate (currently 15-30 min) |
| Code review clarity | Reviewers can understand Canvas changes at a glance (currently need 10 min to understand all concerns) |
| New contributor onboarding | Can explain architecture in < 5 min (currently need 30 min to explain interactions) |

### No Regressions

- ✅ All existing tests pass
- ✅ No new bugs introduced (test against existing test suite + manual QA)
- ✅ No performance degradation (same load time, interaction latency)
- ✅ No user-visible changes (100% backward compatible)

---

## Risks and Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Refactoring introduces bugs | Medium | High | Comprehensive test coverage before merging; manual QA of all interactions |
| Hooks have unexpected dependencies | Low | Medium | Document hook interfaces clearly; test hooks in isolation first |
| Performance regression | Low | High | Benchmark load time and interaction latency before/after; use React DevTools Profiler |
| Incomplete refactoring (partial migration) | Medium | Medium | Complete all 3 phases before merging; don't merge partial changes to main |
| Merge conflicts with concurrent features | Low | Low | Coordinate with team; ideally refactor on a branch without other PRs in flight |
| Time estimate underrun | Low | Medium | Build in 20% buffer; prioritize Phases 1-3 over Phase 4 if time-pressed |

**Risk Mitigation Strategy:**
- Use a feature branch (`refactor/architecture-v1`) for all work
- Commit frequently with clear messages (each commit should be a logical step)
- Run full test suite after each phase
- Code review from peer before merging
- Manual QA checklist: test all interactions (drag, pan, connect, edit) after Phase 3

---

## Dependencies

### Internal Dependencies
- None (refactoring only; no new features depend on this)

### External Dependencies
- React (existing)
- Vitest (for unit tests; already installed)
- No new libraries required

### Team Dependencies
- None (1-person effort)
- Optional: code review from another engineer (recommended)

---

## Success Criteria & Approval

### Definition of Done

✅ Phase 1: Geometry Consolidation
- [ ] ShapeGeometry.js exists and exports all connection point helpers
- [ ] Canvas, Connector, ShapeElement all import from ShapeGeometry
- [ ] All tests pass (no behavior change)
- [ ] Code review approved

✅ Phase 2: Configuration Centralization
- [ ] CANVAS_CONFIG.js exists with all constants and JSDoc comments
- [ ] All hardcoded numbers replaced (except in renderShapeGeometry)
- [ ] All tests pass
- [ ] Code review approved

✅ Phase 3: Interaction Extraction
- [ ] All 4 hooks created and tested in isolation
- [ ] EditingModal.jsx extracted from Canvas
- [ ] Canvas.jsx refactored to compose hooks (≤ 150 lines)
- [ ] All tests pass (>70% coverage for interaction logic)
- [ ] Manual QA: all interactions (drag, pan, connect, edit) work identically
- [ ] Code review approved

✅ Phase 4: Documentation
- [ ] CONTEXT.md created with domain glossary
- [ ] ADR-012 written
- [ ] README Architecture section updated
- [ ] All modules have JSDoc

### Approval Checklist

- [ ] Tech lead approval (architecture sound, no performance issues)
- [ ] Code review approval (implementation quality)
- [ ] QA approval (no regressions, all interactions work)
- [ ] Merge to `develop` branch
- [ ] Squash commits or keep history? (decision before merge)

---

## Post-Launch

### Monitoring

- Monitor error logs for any coordinate-related bugs post-launch
- Track developer feedback on new architecture
- Measure time-to-implement for next feature using new patterns

### Future Work

- Phase 4: Consolidate renderShapeGeometry / create ShapeRenderer component
- Extend custom hooks pattern to other concerns (if new features emerge)
- Consider extracting Connector into separate module (lower priority)

### Communication Plan

- Notify team once branch is merged
- Brief team on new architecture at next sync (< 10 min overview)
- Link to this PRD + ADR-012 in team wiki

---

## Appendix A: Geometry Consolidation Example

### Before (3 copies of same logic)

```javascript
// Canvas.jsx
const getConnectionPointCoords = (shape, pointId) => {
  const cx = shape.x + 60;
  const cy = shape.y + 40;
  switch (pointId) {
    case 'left': return { x: shape.x, y: cy };
    // ...
  }
};

// Connector.jsx (duplicate)
const getConnectionPointCoords = (shape, pointId) => {
  const cx = shape.x + 60;
  const cy = shape.y + 40;
  // ... (identical)
};

// ShapeElement.jsx (hardcoded)
const connectionPoints = [
  { id: 'left', x: shape.x, y: cy },
  // ...
];
```

### After (single source of truth)

```javascript
// ShapeGeometry.js
export const SHAPE_DIMENSIONS = { width: 120, height: 80 };

export function getConnectionPointCoords(shape, pointId) {
  const cx = shape.x + SHAPE_DIMENSIONS.width / 2;
  const cy = shape.y + SHAPE_DIMENSIONS.height / 2;
  switch (pointId) {
    case 'left': return { x: shape.x, y: cy };
    // ...
  }
}

// Canvas.jsx, Connector.jsx, ShapeElement.jsx
import { getConnectionPointCoords } from '../modules/ShapeGeometry';
const coords = getConnectionPointCoords(shape, 'left');
```

---

## Appendix B: Interaction Hook Example

### Before (mixed in Canvas)

```javascript
// Canvas.jsx (404 lines)
const [isDraggingShape, setIsDraggingShape] = useState(false);
const [draggedShapeId, setDraggedShapeId] = useState(null);
const [dragShapeStart, setDragShapeStart] = useState(null);
const [isPanning, setIsPanning] = useState(false);
const [panStart, setPanStart] = useState(null);
// ... 10+ more state variables

const handleCanvasMouseDown = (e) => {
  // 70 lines mixing shape drag, pan, connection, editing logic
};

const handleCanvasMouseMove = (e) => {
  // 90 lines cascading updates across all concerns
};
```

### After (extracted hooks)

```javascript
// useShapeDragging.js
export function useShapeDragging(shapes, onUpdateShape) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedShapeId, setDraggedShapeId] = useState(null);
  const [dragStart, setDragStart] = useState(null);

  const handleMouseDown = (shapeId, point) => { /* ... */ };
  const handleMouseMove = (point) => { /* ... */ };
  const handleMouseUp = () => { /* ... */ };

  return { isDragging, draggedShapeId, handleMouseDown, handleMouseMove, handleMouseUp };
}

// Canvas.jsx (100 lines)
const dragging = useShapeDragging(shapes, onUpdateShape);
const panning = useCanvasPanning(svgRef);
const connection = useConnectionCreation(shapes, onAddConnector);

const handleCanvasMouseDown = (e) => {
  panning.handleMouseDown(e.clientX, e.clientY);
  // clear! each hook owns its logic
};
```

---

**End of PRD**
