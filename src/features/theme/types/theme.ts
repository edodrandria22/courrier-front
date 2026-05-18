export interface ThemePreset {
  id: string
  name: string
  primary: string
  secondary: string
}

export interface ThemeConfig {
  presetId: string
  customPrimary?: string
  customSecondary?: string
}
