import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Toolbar from '../Toolbar'

describe('Toolbar', () => {
  it('renders shape buttons', () => {
    render(
      <Toolbar
        selectedShapeType={null}
        onShapeSelect={() => {}}
        onExport={() => {}}
        onImport={() => {}}
        zoomLevel={100}
        isDarkMode={false}
        onToggleTheme={() => {}}
      />
    )

    expect(screen.getByTitle('Rectangle')).toBeInTheDocument()
    expect(screen.getByTitle('Diamond')).toBeInTheDocument()
    expect(screen.getByTitle('Oval')).toBeInTheDocument()
  })

  it('displays zoom level', () => {
    render(
      <Toolbar
        selectedShapeType={null}
        onShapeSelect={() => {}}
        onExport={() => {}}
        onImport={() => {}}
        zoomLevel={150}
        isDarkMode={false}
        onToggleTheme={() => {}}
      />
    )

    expect(screen.getByText('Zoom: 150%')).toBeInTheDocument()
  })

  it('calls onShapeSelect when shape button is clicked', async () => {
    const user = userEvent.setup()
    const onShapeSelect = vi.fn()

    render(
      <Toolbar
        selectedShapeType={null}
        onShapeSelect={onShapeSelect}
        onExport={() => {}}
        onImport={() => {}}
        zoomLevel={100}
        isDarkMode={false}
        onToggleTheme={() => {}}
      />
    )

    const rectangleBtn = screen.getByTitle('Rectangle')
    await user.click(rectangleBtn)

    expect(onShapeSelect).toHaveBeenCalledWith('rectangle')
  })

  it('highlights active shape button', () => {
    render(
      <Toolbar
        selectedShapeType="rectangle"
        onShapeSelect={() => {}}
        onExport={() => {}}
        onImport={() => {}}
        zoomLevel={100}
        isDarkMode={false}
        onToggleTheme={() => {}}
      />
    )

    const rectangleBtn = screen.getByTitle('Rectangle')
    expect(rectangleBtn).toHaveClass('active')
  })

  it('calls onToggleTheme when theme button is clicked', async () => {
    const user = userEvent.setup()
    const onToggleTheme = vi.fn()

    render(
      <Toolbar
        selectedShapeType={null}
        onShapeSelect={() => {}}
        onExport={() => {}}
        onImport={() => {}}
        zoomLevel={100}
        isDarkMode={false}
        onToggleTheme={onToggleTheme}
      />
    )

    const themeBtn = screen.getByTitle('Switch to dark mode')
    await user.click(themeBtn)

    expect(onToggleTheme).toHaveBeenCalled()
  })

  it('shows moon icon in light mode and sun icon in dark mode', () => {
    const { rerender } = render(
      <Toolbar
        selectedShapeType={null}
        onShapeSelect={() => {}}
        onExport={() => {}}
        onImport={() => {}}
        zoomLevel={100}
        isDarkMode={false}
        onToggleTheme={() => {}}
      />
    )

    expect(screen.getByText('🌙')).toBeInTheDocument()

    rerender(
      <Toolbar
        selectedShapeType={null}
        onShapeSelect={() => {}}
        onExport={() => {}}
        onImport={() => {}}
        zoomLevel={100}
        isDarkMode={true}
        onToggleTheme={() => {}}
      />
    )

    expect(screen.getByText('☀️')).toBeInTheDocument()
  })

  it('renders Export and Import buttons', () => {
    render(
      <Toolbar
        selectedShapeType={null}
        onShapeSelect={() => {}}
        onExport={() => {}}
        onImport={() => {}}
        zoomLevel={100}
        isDarkMode={false}
        onToggleTheme={() => {}}
      />
    )

    expect(screen.getByText('Export')).toBeInTheDocument()
    expect(screen.getByText('Import')).toBeInTheDocument()
  })
})
