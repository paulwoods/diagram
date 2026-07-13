# Flowchart Editor

A web-based flowchart editor for creating and editing diagrams. Pick shapes from a toolbar, drag them onto the canvas, connect them with lines, and export your diagram as a JSON file.

## Features

- **Shape library**: Rectangle, Diamond, Oval, Parallelogram, Rounded Rectangle, Circle
- **Drag-and-drop**: Place shapes on canvas by clicking toolbar buttons and dragging
- **Curved connectors**: Connect shapes with smooth Bézier curves
- **Text labels**: Double-click shapes and connectors to add or edit labels
- **Drag-to-connect**: Click and drag from one shape to another to create connections
- **Pan and zoom**: Scroll to zoom, middle-click and drag to pan
- **Export/import**: Download diagrams as JSON files, re-upload to restore
- **Keyboard shortcuts**: Delete key to remove shapes/connectors

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

1. **Pick a shape**: Click a shape button in the top toolbar (Rectangle, Diamond, etc.)
2. **Place it**: Click anywhere on the canvas to place the shape at that position
3. **Add text**: Double-click a shape to edit its label
4. **Connect shapes**: Click and drag from one shape toward another shape to create a connection
5. **Edit connector label**: Double-click a connector line to add or edit its label
6. **Pan and zoom**: 
   - Scroll to zoom in/out
   - Middle-click and drag to pan around the canvas
7. **Delete**: Click a shape or connector, then press Delete
8. **Export**: Click the "Export" button to download your diagram as a JSON file
9. **Import**: Click the "Import" button to load a previously exported diagram

## Project Status

**Current:** MVP (Minimum Viable Product)

This is an MVP release with core diagram editing features. Known limitations:
- **No undo/redo**: Changes are permanent until you export. Plan accordingly.
- **No styling**: Shapes and lines have fixed colors (no customization).
- **Desktop only**: Best experienced on desktop; mobile support is not optimized.
- **No cloud sync**: Diagrams persist only as JSON files on your device.
- **No collaboration**: Single-user editor; no real-time sharing.
- **No auto-save**: Manually export to preserve your work.

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

- **ADR-001**: React + SVG rendering choice
- **ADR-002**: Top toolbar for shape selection
- **ADR-003**: SVG curved connector lines
- **ADR-004**: Drag-to-connect interaction model
- **ADR-005**: Fixed colors (no customization)
- **ADR-006**: Skip undo/redo in MVP
- **ADR-007**: Desktop-only (no mobile)
- **ADR-008**: JSON file import/export

Each ADR includes context, trade-offs, and implementation guidance.

## License

[Choose a license: MIT, Apache 2.0, etc.]
