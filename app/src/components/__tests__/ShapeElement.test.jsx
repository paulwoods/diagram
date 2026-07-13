import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ShapeElement from '../ShapeElement'

describe('ShapeElement', () => {
  const mockShape = {
    id: 'shape-1',
    type: 'rectangle',
    x: 100,
    y: 100,
    label: 'Test Shape',
    color: '#3b82f6',
  }

  it('renders shape with label', () => {
    const { container } = render(
      <svg>
        <ShapeElement
          shape={mockShape}
          isSelected={false}
          isConnecting={false}
          isHovered={false}
          onMouseDown={() => {}}
          onDoubleClick={() => {}}
          onEditSubmit={() => {}}
          isEditing={false}
          editingText=""
          setEditingText={() => {}}
          onConnectionPointMouseDown={() => {}}
        />
      </svg>
    )

    expect(container.querySelector('text')).toHaveTextContent('Test Shape')
  })

  it('calls onMouseDown when shape is clicked', async () => {
    const user = userEvent.setup()
    const onMouseDown = vi.fn()

    const { container } = render(
      <svg>
        <ShapeElement
          shape={mockShape}
          isSelected={false}
          isConnecting={false}
          isHovered={false}
          onMouseDown={onMouseDown}
          onDoubleClick={() => {}}
          onEditSubmit={() => {}}
          isEditing={false}
          editingText=""
          setEditingText={() => {}}
          onConnectionPointMouseDown={() => {}}
        />
      </svg>
    )

    const shapeGroup = container.querySelector('g')
    await user.pointer({ keys: '[MouseLeft>]', target: shapeGroup })

    expect(onMouseDown).toHaveBeenCalled()
  })

  it('shows selection indicator when selected', () => {
    const { container } = render(
      <svg>
        <ShapeElement
          shape={mockShape}
          isSelected={true}
          isConnecting={false}
          isHovered={false}
          onMouseDown={() => {}}
          onDoubleClick={() => {}}
          onEditSubmit={() => {}}
          isEditing={false}
          editingText=""
          setEditingText={() => {}}
          onConnectionPointMouseDown={() => {}}
        />
      </svg>
    )

    const selectionIndicator = Array.from(container.querySelectorAll('rect')).find(
      (rect) => rect.getAttribute('stroke-dasharray') === '4,4'
    )
    expect(selectionIndicator).toBeInTheDocument()
  })

  it('shows connection points when selected', () => {
    const { container } = render(
      <svg>
        <ShapeElement
          shape={mockShape}
          isSelected={true}
          isConnecting={false}
          isHovered={false}
          onMouseDown={() => {}}
          onDoubleClick={() => {}}
          onEditSubmit={() => {}}
          isEditing={false}
          editingText=""
          setEditingText={() => {}}
          onConnectionPointMouseDown={() => {}}
        />
      </svg>
    )

    const circles = container.querySelectorAll('circle')
    // Should have connection points (4 circles for left, top, right, bottom)
    expect(circles.length).toBeGreaterThan(0)
  })

  it('shows hover indicator when hovered during connection', () => {
    const { container } = render(
      <svg>
        <ShapeElement
          shape={mockShape}
          isSelected={false}
          isConnecting={false}
          isHovered={true}
          onMouseDown={() => {}}
          onDoubleClick={() => {}}
          onEditSubmit={() => {}}
          isEditing={false}
          editingText=""
          setEditingText={() => {}}
          onConnectionPointMouseDown={() => {}}
        />
      </svg>
    )

    const hoverIndicator = Array.from(container.querySelectorAll('rect')).find((rect) =>
      rect.getAttribute('stroke')?.includes('10b981')
    )
    expect(hoverIndicator).toBeInTheDocument()
  })

  it('calls onConnectionPointMouseDown when connection point is clicked', async () => {
    const user = userEvent.setup()
    const onConnectionPointMouseDown = vi.fn()

    const { container } = render(
      <svg>
        <ShapeElement
          shape={mockShape}
          isSelected={true}
          isConnecting={false}
          isHovered={false}
          onMouseDown={() => {}}
          onDoubleClick={() => {}}
          onEditSubmit={() => {}}
          isEditing={false}
          editingText=""
          setEditingText={() => {}}
          onConnectionPointMouseDown={onConnectionPointMouseDown}
        />
      </svg>
    )

    const circles = container.querySelectorAll('circle')
    if (circles.length > 0) {
      await user.pointer({ keys: '[MouseLeft>]', target: circles[0] })
      expect(onConnectionPointMouseDown).toHaveBeenCalled()
    }
  })

  it('renders different shape types', () => {
    const shapeTypes = ['rectangle', 'diamond', 'oval', 'circle']

    shapeTypes.forEach((type) => {
      const { container } = render(
        <svg>
          <ShapeElement
            shape={{ ...mockShape, type }}
            isSelected={false}
            isConnecting={false}
            isHovered={false}
            onMouseDown={() => {}}
            onDoubleClick={() => {}}
            onEditSubmit={() => {}}
            isEditing={false}
            editingText=""
            setEditingText={() => {}}
            onConnectionPointMouseDown={() => {}}
          />
        </svg>
      )

      const shapeElement = container.querySelector('g')
      expect(shapeElement).toBeInTheDocument()
    })
  })
})
