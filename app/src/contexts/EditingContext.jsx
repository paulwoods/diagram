import { createContext, useContext } from 'react'

/**
 * EditingContext - Provides global editing state for shapes and connectors.
 * Eliminates prop-drilling of editing state throughout the component tree.
 */
const EditingContext = createContext(null)

export function useEditingContext() {
  const context = useContext(EditingContext)
  if (!context) {
    throw new Error('useEditingContext must be used within EditingProvider')
  }
  return context
}

export function EditingProvider({ children, value }) {
  return (
    <EditingContext.Provider value={value}>
      {children}
    </EditingContext.Provider>
  )
}
