import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the app', () => {
    render(<App />)
    expect(screen.getByText(/Export/i)).toBeInTheDocument()
    expect(screen.getByText(/Import/i)).toBeInTheDocument()
  })

  it('toggles between light and dark mode', async () => {
    const user = userEvent.setup()
    render(<App />)

    const app = document.querySelector('.app')
    expect(app).toHaveClass('light-mode')

    const themeBtn = screen.getByTitle(/Switch to dark mode/i)
    await user.click(themeBtn)

    expect(app).toHaveClass('dark-mode')
  })

  it('persists theme preference in localStorage', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)

    const themeBtn = screen.getByTitle(/Switch to dark mode/i)
    await user.click(themeBtn)

    expect(localStorage.getItem('theme-mode')).toBe('dark')

    unmount()

    // Render again to verify saved preference
    render(<App />)
    const app = document.querySelector('.app')
    expect(app).toHaveClass('dark-mode')
  })

  it('displays zoom level in toolbar', () => {
    render(<App />)
    expect(screen.getByText('Zoom: 100%')).toBeInTheDocument()
  })

  it('renders toolbar and canvas', () => {
    render(<App />)

    // Check for toolbar elements
    expect(screen.getByTitle('Rectangle')).toBeInTheDocument()

    // Check for canvas container
    const canvasContainer = document.querySelector('.canvas-container')
    expect(canvasContainer).toBeInTheDocument()
  })
})
