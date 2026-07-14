import { useState, useRef } from 'react'
import Toolbar from './components/Toolbar'
import Canvas from './components/Canvas'
import './App.css'

/* Drafting-ink hues: mid-value so 2px linework reads on both vellum and blueprint */
const SHAPE_COLORS = {
  rectangle: '#3d6c9e',
  diamond: '#b0771f',
  oval: '#41805f',
  parallelogram: '#7c58a0',
  roundedRectangle: '#ad5140',
  circle: '#33808d',
}

export default function App() {
  const [shapes, setShapes] = useState([])
  const [connectors, setConnectors] = useState([])
  const [selectedShapeType, setSelectedShapeType] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme-mode')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const shapeIdRef = useRef(1)
  const connectorIdRef = useRef(1)

  const toggleTheme = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('theme-mode', newMode ? 'dark' : 'light')
  }

  const handleAddShape = (pos) => {
    if (!selectedShapeType) return

    const newShape = {
      id: `shape-${shapeIdRef.current++}`,
      type: selectedShapeType,
      x: pos.x,
      y: pos.y,
      label: '',
      color: SHAPE_COLORS[selectedShapeType],
    }

    setShapes([...shapes, newShape])
    setSelectedShapeType(null)
  }

  const handleAddConnector = (sourceId, targetId, sourcePointId, targetPointId) => {
    const source = shapes.find((s) => s.id === sourceId)
    const target = shapes.find((s) => s.id === targetId)

    if (!source || !target || sourceId === targetId) return

    const newConnector = {
      id: `connector-${connectorIdRef.current++}`,
      source: sourceId,
      target: targetId,
      sourcePoint: sourcePointId || 'right',
      targetPoint: targetPointId || 'left',
      label: '',
    }

    setConnectors([...connectors, newConnector])
  }

  const handleDeleteShape = (id) => {
    setShapes(shapes.filter((s) => s.id !== id))
    setConnectors(connectors.filter((c) => c.source !== id && c.target !== id))
    setSelectedId(null)
  }

  const handleDeleteConnector = (id) => {
    setConnectors(connectors.filter((c) => c.id !== id))
    setSelectedId(null)
  }

  const handleUpdateShape = (id, updates) => {
    setShapes(shapes.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }

  const handleUpdateConnector = (id, updates) => {
    setConnectors(connectors.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const handleExport = () => {
    const data = {
      version: '1.0',
      shapes,
      connectors,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `diagram-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result)
        const importedShapes = data.shapes || []
        const importedConnectors = (data.connectors || []).map((c) => ({
          ...c,
          sourcePoint: c.sourcePoint || 'right',
          targetPoint: c.targetPoint || 'left',
        }))
        setShapes(importedShapes)
        setConnectors(importedConnectors)
        shapeIdRef.current = Math.max(...(importedShapes?.map(s => parseInt(s.id.split('-')[1])) || [0])) + 1
        connectorIdRef.current = Math.max(...(importedConnectors?.map(c => parseInt(c.id.split('-')[1])) || [0])) + 1
      } catch (error) {
        alert('Failed to import diagram: ' + error.message)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Toolbar
        selectedShapeType={selectedShapeType}
        onShapeSelect={setSelectedShapeType}
        onExport={handleExport}
        onImport={handleImport}
        zoomLevel={zoomLevel}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />
      <Canvas
        shapes={shapes}
        connectors={connectors}
        selectedShapeType={selectedShapeType}
        selectedId={selectedId}
        onAddShape={handleAddShape}
        onAddConnector={handleAddConnector}
        onSelectShape={setSelectedId}
        onUpdateShape={handleUpdateShape}
        onDeleteShape={handleDeleteShape}
        onDeleteConnector={handleDeleteConnector}
        onUpdateConnector={handleUpdateConnector}
        onZoomChange={setZoomLevel}
      />
    </div>
  )
}
