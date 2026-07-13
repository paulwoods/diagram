# Flowchart Editor

A web-based flowchart editor for creating and editing diagrams. Pick shapes from a toolbar, drag them onto the canvas, connect them with lines, and export your diagram as a JSON file.

## Features

- **Shape library**: Rectangle, Diamond, Oval, Parallelogram, Rounded Rectangle, Circle
- **Shape placement**: Click shape button, then click canvas to place shape centered on cursor
- **Move shapes**: Click and drag shapes to reposition them on the canvas
- **Pan canvas**: Left-click and drag on empty space to pan (hold left mouse button)
- **Zoom canvas**: Scroll wheel to zoom in/out
- **Text labels**: Double-click shapes and connectors to add or edit labels
- **Curved connectors**: Connect shapes with smooth Bézier curves (implementation in progress)
- **Export/import**: Download diagrams as JSON files, re-upload to restore
- **Delete shapes**: Press Delete key to remove selected shapes or connectors
- **Selection feedback**: Selected shapes show a dashed blue border

## Tech Stack

- **Frontend**: React
- **Rendering**: SVG
- **Styling**: CSS (or your choice; no framework required for MVP)
- **Build tool**: Vite (or CRA; adjust as needed)
- **Package manager**: npm or yarn

## Getting Started

### Prerequisites
- Node.js 16+ and npm (or yarn)

### Installation

```bash
git clone <repository-url>
cd diagram
npm install
```

### Running Locally

```bash
npm run dev
```

Opens the editor at `http://localhost:5173` (or your configured dev server port).

### Building for Production

```bash
npm run build
npm run preview  # Preview the production build locally
```

## How to Use

1. **Add shapes**: 
   - Click a shape button in the top toolbar (Rectangle, Diamond, etc.)
   - Click on the canvas where you want the shape - it will be centered on your cursor
2. **Move shapes**: Click and drag a shape to reposition it on the canvas
3. **Select shapes**: Click a shape to select it (shows a dashed blue border)
4. **Add text labels**: Double-click a shape to edit its label
5. **Connect shapes**: Click and drag from one shape toward another (connector rendering in progress)
6. **Edit connector labels**: Double-click a connector line to add or edit its label
7. **Pan the canvas**: Left-click and drag on empty space (away from shapes) to pan around
8. **Zoom the canvas**: Use your scroll wheel to zoom in and out
9. **Delete elements**: Select a shape or connector and press the Delete key
10. **Export diagram**: Click the "Export" button to download as JSON
11. **Import diagram**: Click the "Import" button to load a previously exported diagram

## Project Status

**Current:** MVP (Minimum Viable Product) - Feature Complete

This MVP includes most core diagram editing features. Status of key features:

### ✅ Working Features
- Shape placement (centered on cursor)
- Shape movement (drag to reposition)
- Canvas panning (left-click drag on empty space)
- Canvas zooming (scroll wheel)
- Shape selection with visual feedback
- Delete shapes/connectors
- JSON export/import
- Fixed color palette

### ⚠️ In Progress / Known Limitations
- **Connector rendering**: Geometric collision detection implemented but visual rendering needs debugging
- **No undo/redo**: Changes are permanent until you export. Plan accordingly.
- **No styling**: Shapes and lines have fixed colors (no customization).
- **Desktop only**: Best experienced on desktop; mobile support is not optimized.
- **No cloud sync**: Diagrams persist only as JSON files on your device.
- **No collaboration**: Single-user editor; no real-time sharing.
- **No auto-save**: Manually export to preserve your work.
- **No label editing**: Double-click label editing requires event handler refactoring

## Future Work (v2 and beyond)

The following features are candidates for future releases based on user feedback:

- **Undo/redo**: Ctrl+Z and Ctrl+Y support
- **Shape styling**: Color picker, line thickness, transparency
- **Advanced connectors**: Orthogonal (right-angle) lines, auto-routing, arrow options
- **Mobile support**: Touch-friendly interactions for tablets and phones
- **Cloud persistence**: Save diagrams to a backend server with accounts and sync
- **Collaboration**: Real-time multi-user editing
- **More shapes**: Extend library with specialized shapes (database, document, etc.)
- **Templates**: Start from preset diagram templates
- **Keyboard shortcuts**: Single-key shape selection (R for Rectangle, etc.)
- **Copy/paste**: Duplicate shapes and groups
- **Alignment tools**: Snap to grid, distribute shapes evenly
- **Comments and annotations**: Add notes to diagrams
- **Export formats**: SVG, PNG, PDF output (currently JSON only)

## Contributing

Contributions are welcome! The codebase follows the existing conventions—refer to the code style and structure as your guide. Before starting work on a new feature, consider opening an issue to discuss the approach.

Key areas for contribution:
- Bug fixes and performance improvements
- Feature implementations from the "Future Work" section
- Testing and QA
- Documentation improvements

For questions, open an issue or review the ADR documents in `docs/adr/` for design decisions and implementation guidance.

## Architecture

For detailed design decisions and implementation notes, see the Architecture Decision Records (ADRs) in `docs/adr/`:

### Core Decisions (MVP)
- **ADR-001**: React + SVG rendering choice
- **ADR-002**: Top toolbar for shape selection
- **ADR-003**: SVG curved connector lines
- **ADR-004**: Drag-to-connect interaction model
- **ADR-005**: Fixed colors (no customization)
- **ADR-006**: Skip undo/redo in MVP
- **ADR-007**: Desktop-only (no mobile)
- **ADR-008**: JSON file import/export

### Implementation Refinements
- **ADR-009**: Selective left-click drag panning
- **ADR-010**: Shape drag-to-move functionality
- **ADR-011**: Centered shape placement on cursor

Each ADR includes context, trade-offs, and implementation guidance.

## License

[Choose a license: MIT, Apache 2.0, etc.]
