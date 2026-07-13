import './Toolbar.css'

const SHAPES = [
  { id: 'rectangle', label: 'Rectangle', icon: '▭' },
  { id: 'diamond', label: 'Diamond', icon: '◇' },
  { id: 'oval', label: 'Oval', icon: '◯' },
  { id: 'parallelogram', label: 'Parallelogram', icon: '▱' },
  { id: 'roundedRectangle', label: 'Rounded Rectangle', icon: '▬' },
  { id: 'circle', label: 'Circle', icon: '●' },
]

export default function Toolbar({ selectedShapeType, onShapeSelect, onExport, onImport }) {
  return (
    <div className="toolbar">
      <div className="shape-buttons">
        {SHAPES.map((shape) => (
          <button
            key={shape.id}
            className={`shape-btn ${selectedShapeType === shape.id ? 'active' : ''}`}
            onClick={() => onShapeSelect(selectedShapeType === shape.id ? null : shape.id)}
            title={shape.label}
          >
            {shape.icon}
          </button>
        ))}
      </div>

      <div className="file-buttons">
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
