'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useThemePreset } from '../hooks/useThemePreset'

type ThemePresetContextValue = ReturnType<typeof useThemePreset>

const ThemePresetContext = createContext<ThemePresetContextValue | null>(null)

export function ThemePresetProvider({ children }: { children: ReactNode }) {
  const value = useThemePreset()
  return (
    <ThemePresetContext.Provider value={value}>
      {children}
    </ThemePresetContext.Provider>
  )
}

export function useThemePresetContext() {
  const ctx = useContext(ThemePresetContext)
  if (!ctx) throw new Error('useThemePresetContext must be used within ThemePresetProvider')
  return ctx
}
