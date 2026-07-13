import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Connector from '../Connector'

describe('Connector', () => {
  const mockConnector = {
    id: 'connector-1',
    source: 'shape-1',
    target: 'shape-2',
    sourcePoint: 'right',
    targetPoint: 'left',
    label: 'Test Connection',
  }

  const mockShapes = [
    {
      id: 'shape-1',
      type: 'rectangle',
      x: 100,
      y: 100,
      label: 'Shape 1',
      color: '#3b82f6',
    },
    {
      id: 'shape-2',
      type: 'rectangle',
      x: 300,
      y: 100,
      label: 'Shape 2',
      color: '#10b981',
    },
  ]

  it('renders connector path', () => {
    const { container } = render(
      <svg>
        <Connector
          connector={mockConnector}
          shapes={mockShapes}
          isSelected={false}
          onDoubleClick={() => {}}
          onClick={() => {}}
          onEditSubmit={() => {}}
          isEditing={false}
          editingText=""
          setEditingText={() => {}}
        />
      </svg>
    )

    const path = container.querySelector('path')
    expect(path).toBeInTheDocument()
  })

  it('renders connector label when present', () => {
    const { container } = render(
      <svg>
        <Connector
          connector={mockConnector}
          shapes={mockShapes}
          isSelected={false}
          onDoubleClick={() => {}}
          onClick={() => {}}
          onEditSubmit={() => {}}
          isEditing={false}
          editingText=""
          setEditingText={() => {}}
        />
      </svg>
    )

    const text = container.querySelector('text')
    expect(text).toHaveTextContent('Test Connection')
  })

  it('does not render if source or target shape is missing', () => {
    const { container } = render(
      <svg>
        <Connector
          connector={{ ...mockConnector, source: 'invalid-id' }}
          shapes={mockShapes}
          isSelected={false}
          onDoubleClick={() => {}}
          onClick={() => {}}
          onEditSubmit={() => {}}
          isEditing={false}
          editingText=""
          setEditingText={() => {}}
        />
      </svg>
    )

    const path = container.querySelector('path')
    expect(path).not.toBeInTheDocument()
  })

  it('calls onClick when connector is clicked', () => {
    const onClick = vi.fn()

    const { container } = render(
      <svg>
        <Connector
          connector={mockConnector}
          shapes={mockShapes}
          isSelected={false}
          onDoubleClick={() => {}}
          onClick={onClick}
          onEditSubmit={() => {}}
          isEditing={false}
          editingText=""
          setEditingText={() => {}}
        />
      </svg>
    )

    const path = container.querySelector('path')
    if (path) {
      fireEvent.click(path)
      expect(onClick).toHaveBeenCalled()
    }
  })

  it('shows selection indicator when selected', () => {
    const { container } = render(
      <svg>
        <Connector
          connector={mockConnector}
          shapes={mockShapes}
          isSelected={true}
          onDoubleClick={() => {}}
          onClick={() => {}}
          onEditSubmit={() => {}}
          isEditing={false}
          editingText=""
          setEditingText={() => {}}
        />
      </svg>
    )

    const paths = container.querySelectorAll('path')
    // Should have main path and selection indicator path
    expect(paths.length).toBeGreaterThan(1)
  })

  it('does not render label when label is empty', () => {
    const { container } = render(
      <svg>
        <Connector
          connector={{ ...mockConnector, label: '' }}
          shapes={mockShapes}
          isSelected={false}
          onDoubleClick={() => {}}
          onClick={() => {}}
          onEditSubmit={() => {}}
          isEditing={false}
          editingText=""
          setEditingText={() => {}}
        />
      </svg>
    )

    const text = container.querySelector('text')
    expect(text).not.toBeInTheDocument()
  })

  it('handles different connection point combinations', () => {
    const pointCombinations = [
      { sourcePoint: 'left', targetPoint: 'right' },
      { sourcePoint: 'top', targetPoint: 'bottom' },
      { sourcePoint: 'right', targetPoint: 'left' },
      { sourcePoint: 'bottom', targetPoint: 'top' },
    ]

    pointCombinations.forEach(({ sourcePoint, targetPoint }) => {
      const { container } = render(
        <svg>
          <Connector
            connector={{ ...mockConnector, sourcePoint, targetPoint }}
            shapes={mockShapes}
            isSelected={false}
            onDoubleClick={() => {}}
            onClick={() => {}}
            onEditSubmit={() => {}}
            isEditing={false}
            editingText=""
            setEditingText={() => {}}
          />
        </svg>
      )

      const path = container.querySelector('path')
      expect(path).toBeInTheDocument()
    })
  })
})
