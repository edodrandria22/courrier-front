'use client'

import { useState, useEffect, useCallback } from 'react'
import { ThemeConfig } from '../types/theme'
import { THEME_PRESETS, DEFAULT_PRESET_ID, deriveThemeVars, deriveLightPrimary } from '../constants/presets'

const STORAGE_KEY = 'espa-theme-config'

function loadConfig(): ThemeConfig {
  if (typeof window === 'undefined') return { presetId: DEFAULT_PRESET_ID }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as ThemeConfig
  } catch {}
  return { presetId: DEFAULT_PRESET_ID }
}

function saveConfig(config: ThemeConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

function applyVars(config: ThemeConfig) {
  let primary: string
  let secondary: string

  if (config.presetId === 'custom' && config.customPrimary && config.customSecondary) {
    primary = config.customPrimary
    secondary = config.customSecondary
  } else {
    const preset = THEME_PRESETS.find(p => p.id === config.presetId) ?? THEME_PRESETS[0]
    primary = preset.primary
    secondary = preset.secondary
  }

  const vars = deriveThemeVars(primary, secondary)
  const el = document.documentElement

  for (const [key, value] of Object.entries(vars)) {
    el.style.setProperty(key, value)
  }

  // Also set a light-adapted primary for the light mode
  const lightPrimary = deriveLightPrimary(primary)
  el.style.setProperty('--primary-light', lightPrimary)
}

export function useThemePreset() {
  const [config, setConfigState] = useState<ThemeConfig>(loadConfig)

  useEffect(() => {
    applyVars(config)
  }, [config])

  const setPreset = useCallback((presetId: string) => {
    const next: ThemeConfig = { presetId }
    saveConfig(next)
    setConfigState(next)
  }, [])

  const setCustomColors = useCallback((customPrimary: string, customSecondary: string) => {
    const next: ThemeConfig = { presetId: 'custom', customPrimary, customSecondary }
    saveConfig(next)
    setConfigState(next)
  }, [])

  return { config, setPreset, setCustomColors }
}
