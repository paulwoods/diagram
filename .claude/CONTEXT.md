# Flowchart Editor - Domain Model & Glossary

**Last Updated:** July 12, 2024  
**Owner:** Paul Woods  

This document defines the ubiquitous language for the Flowchart Editor project. Use these terms consistently across code, documentation, and discussion to maintain clarity.

---

## Core Domain Concepts

### Shape
A visual element on the canvas (e.g., Rectangle, Diamond, Circle). Users create Shapes to represent concepts or steps in their diagram.

**Properties:**
- `id` (UUID): Unique identifier
- `type` (enum): 'rectangle', 'diamond', 'oval', 'parallelogram', 'roundedRectangle', 'circle'
- `x`, `y` (number): Top-left corner position in SVG coordinates
- `label` (string): Text displayed inside the shape (e.g., "Start", "Check condition")
- `color` (string): Hex color (fixed in MVP; customizable in v2)

**State:**
- Selected: User has clicked the shape; it shows a dashed blue border and connection points
- Hovering: Mouse is over the shape (triggers hover styling)
- Being Dragged: User is currently moving the shape via click-drag

**Related:** Connection Point, Canvas

---

### Connection Point
A small circle on the edge of a Shape where Connectors can attach. Each Shape has 4 Connection Points (left, top, right, bottom).

**Properties:**
- `id` (enum): 'left', 'top', 'right', 'bottom'
- `x`, `y` (number): Coordinates on the canvas
- `shapeId` (UUID): Which Shape this point belongs to

**Behavior:**
- Visible only when:
  - The Shape is **selected**, OR
  - A Connector **drag is in progress** (the feature added in this sprint)
- Hit detection: User must click within 8px of the point to activate a drag

**Related:** Shape, Connector

---

### Connector
A line that joins two Shapes, showing relationships or flow between them. Users create Connectors by dragging from one Shape's Connection Point to another Shape's Connection Point.

**Properties:**
- `id` (UUID): Unique identifier
- `fromShapeId` (UUID): Source Shape
- `toShapeId` (UUID): Target Shape
- `fromPointId` (enum): 'left', 'top', 'right', 'bottom' on source
- `toPointId` (enum): 'left', 'top', 'right', 'bottom' on target
- `label` (string): Optional text along the line (e.g., "Yes", "No")
- `path` (string): SVG path data for the curve (computed)

**Rendering:**
- SVG Bézier curve from source Connection Point to target Connection Point
- Arrow marker at the end (pointing toward target)
- Curve is smooth with control points offset by 50px perpendicular to the line

**State:**
- Selected: User has clicked the line; shows a dashed blue border

**Related:** Shape, Connection Point, Canvas

---

### Canvas
The main drawing surface where Shapes and Connectors are rendered. The Canvas owns:
- All Shape and Connector state
- Mouse event handling (drag, pan, zoom, click)
- Selection management
- Text editing mode

**Properties:**
- `width` (number): 4000px (SVG coordinate space)
- `height` (number): 3000px
- `transform` (CSS): Applied to SVG for panning (e.g., `translate(100px, 50px)`)
- `zoom` (number): Scale factor (0.5x to 2x typically; shows as percentage in toolbar)

**User Interactions:**
- **Click-drag on Shape:** Drag the shape to a new position
- **Click-drag on empty:** Pan the canvas (move view)
- **Scroll wheel:** Zoom in/out
- **Click Connection Point + drag to another Shape:** Create a Connector
- **Double-click Shape or Connector:** Edit its label
- **Press Delete:** Remove selected Shape or Connector
- **Click shape button + click canvas:** Place a new Shape

**Related:** Shape, Connector, Toolbar

---

### Diagram
The complete collection of Shapes and Connectors that the user has created. A Diagram can be:
- Exported to a JSON file for persistence
- Imported from a JSON file to restore previous work

**Data Structure:**
```json
{
  "shapes": [
    { "id": "shape-1", "type": "rectangle", "x": 100, "y": 200, "label": "Start", "color": "#3b82f6" },
    { "id": "shape-2", "type": "diamond", "x": 300, "y": 200, "label": "Condition?", "color": "#f59e0b" }
  ],
  "connectors": [
    { "id": "conn-1", "fromShapeId": "shape-1", "toShapeId": "shape-2", "fromPointId": "right", "toPointId": "left", "label": "" }
  ]
}
```

**Related:** Shape, Connector, Canvas

---

### Label
Text displayed within a Shape or along a Connector. Labels are optional; Shapes and Connectors render fine without them.

**Properties:**
- `text` (string): The label content (e.g., "Start", "Process", "Yes/No")
- `editable`: User can double-click to edit the text
- `Position`: Centered in Shape; positioned along Connector line

**Editing:**
- Double-click to enter edit mode
- Modal appears with input field
- Press Enter to save, Escape to cancel
- Empty labels are allowed

**Related:** Shape, Connector

---

## Interaction Concepts (New as of Sprint 1)

### Drag (Shape Dragging)
When a user clicks and holds on a Shape, then moves the mouse, the Shape follows the cursor.

**States:**
1. **Idle:** No shape is being dragged
2. **Dragging:** User's mouse is down on a shape; we track the offset between click point and shape origin
3. **Released:** User released the mouse; shape moves to final position

**Related Concepts:**
- Position delta: `(currentMouseX - clickX, currentMouseY - clickY)`
- Shape position update: `newShape.x = oldShape.x + deltaX`

**Implemented in:** `useShapeDragging` hook (future)

---

### Pan (Canvas Panning)
When a user clicks and holds on **empty canvas** (not on a Shape), then moves the mouse, the entire canvas view shifts.

**States:**
1. **Idle:** No panning
2. **Panning:** User's mouse is down on empty space; we apply CSS transform to SVG
3. **Released:** User released the mouse; transform is final

**Related Concepts:**
- Canvas transform: Applied to SVG element as CSS (`transform: translate(X, Y)`)
- Simulates moving the viewport, not the shapes

**Implemented in:** `useCanvasPanning` hook (future)

---

### Connection Creation
When a user clicks and holds on a Connection Point, drags across the canvas, and releases over another Shape's Connection Point, a Connector is created.

**States:**
1. **Idle:** No connection drag
2. **Dragging:** User's mouse is down on a Connection Point; we show a temporary dashed line from source to cursor
3. **Hovering over Shape:** Target shape shows all Connection Points; we highlight the one nearest the cursor
4. **Released:** If released over a Connection Point, create Connector; otherwise, discard

**Related Concepts:**
- Temporary line: Shows user's intent before Connector is created
- Hover detection: Which Shape and which Connection Point are we over?

**Implemented in:** `useConnectionCreation` hook (future)

---

### Selection
When a user clicks a Shape or Connector, it becomes **selected**. Only one element can be selected at a time (multi-select is a v2 feature).

**Visual Feedback:**
- Selected Shape: Dashed blue border + 4 Connection Points visible
- Selected Connector: Dashed blue border around the line

**Behavior:**
- Clicking empty canvas deselects the current element
- Pressing Delete removes the selected element
- Double-clicking enters edit mode for the label

**Related:** Shape, Connector, Canvas

---

### Editing Mode
When a user double-clicks a Shape or Connector, a modal appears with a text input for editing the label.

**States:**
1. **Not Editing:** Normal canvas interaction
2. **Editing:** Modal is open; user is typing in the input
3. **Submitting:** User pressed Enter or clicked "Done"; label is saved
4. **Cancelling:** User pressed Escape or clicked "Cancel"; no changes

**UI:**
- Modal overlay (semi-transparent background)
- Text input field (auto-focused)
- "Done" and "Cancel" buttons

**Related:** Shape, Connector, Label

---

## Architecture Concepts (Implementation Details)

### Module
A file or directory that owns a specific concern. Modules should have clear interfaces and minimal dependencies.

**Examples:**
- `ShapeGeometry.js` — Owns all Shape-related geometry calculations
- `CANVAS_CONFIG.js` — Owns all configuration constants
- `useShapeDragging.js` — Owns the shape dragging interaction

---

### Custom Hook
A reusable function (in React) that manages state and returns handlers and state values. Hooks make interactions testable in isolation.

**Pattern:**
```javascript
export function useInteractionName(dependencies, callbacks) {
  const [state, setState] = useState(...);
  
  const handleMouseDown = (point) => { /* ... */ };
  const handleMouseMove = (point) => { /* ... */ };
  const handleMouseUp = () => { /* ... */ };
  
  return {
    // Public state
    someState: state,
    // Event handlers
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
```

**Usage:**
```javascript
const interaction = useInteractionName(deps, callbacks);
svg.addEventListener('mousedown', interaction.handleMouseDown);
// etc.
```

**Related:** Canvas, Interaction

---

### Coordinate System
All positions in the diagram use **SVG coordinates**, not client coordinates.

**Conversion:**
- Client coordinates (from `event.clientX`, `event.clientY`) are relative to the browser viewport
- SVG coordinates are relative to the SVG element's own coordinate space
- Conversion uses `svg.createSVGPoint()` and `matrixTransform()` to handle zoom and pan

**Related:** Canvas, Shape, Connection Point

---

## Domain Events (Future)

These concepts may become explicit in the code as we add undo/redo or logging.

### ShapeCreated
User placed a new Shape on the canvas.

**Properties:**
- `shapeId`: ID of the new shape
- `type`: Shape type
- `position`: (x, y)
- `timestamp`: When it happened

---

### ShapeDeleted
User deleted a Shape.

**Properties:**
- `shapeId`: ID of the deleted shape
- `timestamp`: When it happened

---

### ConnectorCreated
User created a connection between two Shapes.

**Properties:**
- `connectorId`: ID of the new connector
- `fromShapeId`, `toShapeId`: Source and target
- `fromPointId`, `toPointId`: Which connection points
- `timestamp`: When it happened

---

### LabelEdited
User changed the label of a Shape or Connector.

**Properties:**
- `elementId`: Shape or Connector ID
- `oldLabel`, `newLabel`: Before and after text
- `timestamp`: When it happened

---

## Naming Conventions

### Variables & Functions

- **Shapes array:** `shapes` (not `shapeList`, `shapeData`)
- **Connectors array:** `connectors` (not `lines`, `connections`)
- **Selected element ID:** `selectedId` (not `selected`, `selectedShapeId` unless context is clear)
- **Position:** `{ x, y }` (not `left, top` or `position: [x, y]`)
- **Event handlers:** `handleMouseDown`, `handleMouseMove`, `handleMouseUp` (not `onMouseDown`, `onMouseMove`, `onMouseUp` for non-React handlers)
- **State setters:** `setShapes`, `setConnectors` (React convention)
- **Configuration:** `CANVAS_CONFIG`, `SHAPE_DIMENSIONS` (uppercase for constants)
- **Callbacks:** `onAddShape`, `onUpdateShape`, `onDeleteShape` (pass as props to components)

### File Structure

```
src/
├── components/
│   ├── Canvas.jsx          — Main canvas component
│   ├── ShapeElement.jsx    — Renders a single shape
│   ├── Connector.jsx       — Renders a single connector
│   ├── Toolbar.jsx         — Shape selection toolbar
│   └── EditingModal.jsx    — Label editing modal
├── hooks/
│   ├── useShapeDragging.js
│   ├── useCanvasPanning.js
│   ├── useConnectionCreation.js
│   └── useEditingMode.js
├── modules/
│   ├── ShapeGeometry.js
│   └── Connector-utils.js  (if needed)
├── constants/
│   └── CANVAS_CONFIG.js
└── __tests__/
    └── *.test.jsx
```

---

## Related Documents

- **PRD-001:** Architecture Refactoring (strategic overview)
- **ADR-012:** Interaction Extraction (architectural decision)
- **ADR-001 through ADR-011:** Historical decisions (tech stack, interactions, features)
- **README.md:** User documentation and getting started guide

---

**Version History:**

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-07-12 | Initial domain model; added interaction concepts and custom hook patterns |

---

**How to Update This Document:**

When you:
- Add a new concept or term, add it here with a clear definition
- Change how we refer to something, update all instances
- Deprecate a term, note it with a strikethrough and alternative

**Always keep this document in sync with the codebase.** If the code contradicts this glossary, the code is the source of truth—update this document to match.
