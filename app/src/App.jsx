import { useState, useRef } from 'react'
import Toolbar from './components/Toolbar'
import Canvas from './components/Canvas'
import './App.css'

const SHAPE_COLORS = {
  rectangle: '#3b82f6',
  diamond: '#f59e0b',
  oval: '#10b981',
  parallelogram: '#a855f7',
  roundedRectangle: '#ef4444',
  circle: '#06b6d4',
}

export default function App() {
  const [shapes, setShapes] = useState([])
  const [connectors, setConnectors] = useState([])
  const [selectedShapeType, setSelectedShapeType] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const shapeIdRef = useRef(1)
  const connectorIdRef = useRef(1)

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

  const handleAddConnector = (sourceId, targetId) => {
    const source = shapes.find((s) => s.id === sourceId)
    const target = shapes.find((s) => s.id === targetId)

    if (!source || !target || sourceId === targetId) return

    const newConnector = {
      id: `connector-${connectorIdRef.current++}`,
      source: sourceId,
      target: targetId,
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
        setShapes(data.shapes || [])
        setConnectors(data.connectors || [])
        shapeIdRef.current = Math.max(...(data.shapes?.map(s => parseInt(s.id.split('-')[1])) || [0])) + 1
        connectorIdRef.current = Math.max(...(data.connectors?.map(c => parseInt(c.id.split('-')[1])) || [0])) + 1
      } catch (error) {
        alert('Failed to import diagram: ' + error.message)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="app">
      <Toolbar
        selectedShapeType={selectedShapeType}
        onShapeSelect={setSelectedShapeType}
        onExport={handleExport}
        onImport={handleImport}
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
      />
    </div>
  )
}
