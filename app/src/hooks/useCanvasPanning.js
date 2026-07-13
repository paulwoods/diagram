import { useState, useCallback } from 'react'

/**
 * useCanvasPanning - Manages canvas panning (drag-to-pan) interactions.
 * Updates SVG transform to pan the view during drag.
 *
 * @param {Object} svgRef - React ref to the SVG element
 * @returns {Object} { isPanning, handleMouseDown, handleMouseMove, handleMouseUp }
 */
export function useCanvasPanning(svgRef) {
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState(null)

  const handleMouseDown = useCallback((clientX, clientY) => {
    setIsPanning(true)
    setPanStart({ x: clientX, y: clientY })
  }, [])

  const handleMouseMove = useCallback(
    (clientX, clientY) => {
      if (!isPanning || !panStart || !svgRef.current) return

      const dx = clientX - panStart.x
      const dy = clientY - panStart.y

      // Parse existing transform to get cumulative offset
      const transform = svgRef.current.style.transform || ''
      const currentTranslate = transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/)
      const currentX = currentTranslate ? parseFloat(currentTranslate[1]) : 0
      const currentY = currentTranslate ? parseFloat(currentTranslate[2]) : 0

      const newX = currentX + dx
      const newY = currentY + dy

      svgRef.current.style.transform = `translate(${newX}px, ${newY}px)`
      setPanStart({ x: clientX, y: clientY })
    },
    [isPanning, panStart, svgRef]
  )

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
    setPanStart(null)
  }, [])

  return {
    isPanning,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}
