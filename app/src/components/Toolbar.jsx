import './Toolbar.css'

/* Stencil apertures: each icon is a true miniature of its canvas shape,
   drawn in the same outline language (24x18 viewBox, 1.5px stroke). */
const SHAPES = [
  {
    id: 'rectangle',
    label: 'Rectangle',
    icon: <rect x="1.5" y="1.5" width="21" height="15" rx="1" />,
  },
  {
    id: 'diamond',
    label: 'Diamond',
    icon: <polygon points="12,1 23,9 12,17 1,9" />,
  },
  {
    id: 'oval',
    label: 'Oval',
    icon: <ellipse cx="12" cy="9" rx="11" ry="7.5" />,
  },
  {
    id: 'parallelogram',
    label: 'Parallelogram',
    icon: <polygon points="6,1.5 23,1.5 18,16.5 1,16.5" />,
  },
  {
    id: 'roundedRectangle',
    label: 'Rounded Rectangle',
    icon: <rect x="1.5" y="1.5" width="21" height="15" rx="6" />,
  },
  {
    id: 'circle',
    label: 'Circle',
    icon: <circle cx="12" cy="9" r="7.5" />,
  },
]

export default function Toolbar({ selectedShapeType, onShapeSelect, onExport, onImport, zoomLevel = 100, isDarkMode = false, onToggleTheme }) {
  return (
    <div className="toolbar">
      <div className="wordmark">
        <span className="wordmark-title">Flowchart</span>
        <span className="wordmark-sub">Template N&ordm; 1</span>
      </div>

      <div className="shape-buttons">
        {SHAPES.map((shape) => (
          <button
            key={shape.id}
            className={`shape-btn ${selectedShapeType === shape.id ? 'active' : ''}`}
            onClick={() => onShapeSelect(selectedShapeType === shape.id ? null : shape.id)}
            title={shape.label}
          >
            <svg viewBox="0 0 24 18" width="24" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              {shape.icon}
            </svg>
          </button>
        ))}
      </div>

      <div className="file-buttons">
        <div className="zoom-indicator">Zoom: {zoomLevel}%</div>
        <button className="file-btn theme-btn" onClick={onToggleTheme} title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
          {isDarkMode ? 'Vellum' : 'Blueprint'}
        </button>
        <button className="file-btn" onClick={onExport} title="Export diagram as JSON">
          Export
        </button>
        <label className="file-btn" title="Import diagram from JSON">
          Import
          <input
            type="file"
            accept=".json"
            onChange={onImport}
            style={{ display: 'none' }}
          />
        </label>
      </div>
    </div>
  )
}
