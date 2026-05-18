import { ThemePreset } from '../types/theme'

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'cyan',
    name: 'Cyan',
    primary: 'oklch(0.75 0.15 190)',
    secondary: 'oklch(0.86 0.22 126)',
  },
  {
    id: 'indigo',
    name: 'Indigo',
    primary: 'oklch(0.65 0.15 270)',
    secondary: 'oklch(0.75 0.15 50)',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    primary: 'oklch(0.70 0.17 155)',
    secondary: 'oklch(0.75 0.15 45)',
  },
]

export const DEFAULT_PRESET_ID = 'cyan'

/**
 * Derive all CSS variable overrides from a primary + secondary color pair.
 * Returns an object of CSS variable name → value mappings.
 */
export function deriveThemeVars(primary: string, secondary: string): Record<string, string> {
  return {
    '--primary': primary,
    '--primary-foreground': primary,
    '--ring': primary,
    '--sidebar-primary': primary,
    '--chart-1': primary,
    '--secondary': secondary,
    '--chart-2': secondary,
  }
}

/**
 * Light mode needs slightly darker primary for contrast on white backgrounds.
 * This adjusts the lightness component of an oklch color.
 */
export function deriveLightPrimary(primary: string): string {
  const match = primary.match(/oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/)
  if (!match) return primary
  const l = parseFloat(match[1])
  const c = match[2]
  const h = match[3]
  const lightL = Math.max(0.35, l - 0.20)
  return `oklch(${lightL.toFixed(2)} ${c} ${h})`
}
