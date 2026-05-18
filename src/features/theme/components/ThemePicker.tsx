'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Check, Pipette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useThemePresetContext } from './ThemePresetProvider'
import { THEME_PRESETS } from '../constants/presets'
import { hexToOklch, oklchToHex } from '../utils/colorConvert'
import { cn } from '@/lib/utils'

export function ThemePicker({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()
  const { config, setPreset, setCustomColors } = useThemePresetContext()

  const currentPrimary = config.presetId === 'custom' && config.customPrimary
    ? config.customPrimary
    : (THEME_PRESETS.find(p => p.id === config.presetId)?.primary ?? THEME_PRESETS[0].primary)

  const currentSecondary = config.presetId === 'custom' && config.customSecondary
    ? config.customSecondary
    : (THEME_PRESETS.find(p => p.id === config.presetId)?.secondary ?? THEME_PRESETS[0].secondary)

  const [customPrimary, setCustomPrimary] = useState(() => oklchToHex(currentPrimary))
  const [customSecondary, setCustomSecondary] = useState(() => oklchToHex(currentSecondary))

  const handleCustomApply = () => {
    setCustomColors(hexToOklch(customPrimary), hexToOklch(customSecondary))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold uppercase tracking-wider">Apparence</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Mode clair / sombre */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mode</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                style={{
                  width: '100%',
                  height: '40px',
                  backgroundColor: theme === 'light' ? '#1e40af' : 'transparent',
                  color: theme === 'light' ? '#ffffff' : '#1e40af',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: '#1e40af',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: theme === 'light' ? '0 10px 15px -3px rgba(30, 64, 175, 0.3), 0 4px 6px -2px rgba(30, 64, 175, 0.1)' : 'none',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (theme === 'light') {
                    e.currentTarget.style.backgroundColor = '#1e3a8a'
                    e.currentTarget.style.borderColor = '#1e3a8a'
                    e.currentTarget.style.transform = 'scale(0.98)'
                  } else {
                    e.currentTarget.style.backgroundColor = '#1e40af'
                    e.currentTarget.style.color = '#ffffff'
                    e.currentTarget.style.transform = 'scale(0.98)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (theme === 'light') {
                    e.currentTarget.style.backgroundColor = '#1e40af'
                    e.currentTarget.style.borderColor = '#1e40af'
                    e.currentTarget.style.transform = 'scale(1)'
                  } else {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#1e40af'
                    e.currentTarget.style.transform = 'scale(1)'
                  }
                }}
              >
                <Sun className="w-4 h-4" />
                Clair
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                style={{
                  width: '100%',
                  height: '40px',
                  backgroundColor: theme === 'dark' ? '#1e40af' : 'transparent',
                  color: theme === 'dark' ? '#ffffff' : '#1e40af',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: '#1e40af',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: theme === 'dark' ? '0 10px 15px -3px rgba(30, 64, 175, 0.3), 0 4px 6px -2px rgba(30, 64, 175, 0.1)' : 'none',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (theme === 'dark') {
                    e.currentTarget.style.backgroundColor = '#1e3a8a'
                    e.currentTarget.style.borderColor = '#1e3a8a'
                    e.currentTarget.style.transform = 'scale(0.98)'
                  } else {
                    e.currentTarget.style.backgroundColor = '#1e40af'
                    e.currentTarget.style.color = '#ffffff'
                    e.currentTarget.style.transform = 'scale(0.98)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (theme === 'dark') {
                    e.currentTarget.style.backgroundColor = '#1e40af'
                    e.currentTarget.style.borderColor = '#1e40af'
                    e.currentTarget.style.transform = 'scale(1)'
                  } else {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#1e40af'
                    e.currentTarget.style.transform = 'scale(1)'
                  }
                }}
              >
                <Moon className="w-4 h-4" />
                Sombre
              </button>
            </div>
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Theme</p>
            <div className="grid grid-cols-3 gap-2">
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setPreset(preset.id)}
                  className={cn(
                    'relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-colors',
                    config.presetId === preset.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent/10'
                  )}
                >
                  <div className="flex gap-1">
                    <div
                      className="w-5 h-5 rounded-full border border-border"
                      style={{ background: preset.primary }}
                    />
                    <div
                      className="w-5 h-5 rounded-full border border-border"
                      style={{ background: preset.secondary }}
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wide">{preset.name}</span>
                  {config.presetId === preset.id && (
                    <Check className="absolute top-1.5 right-1.5 w-3 h-3 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Couleurs custom */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Pipette className="w-3 h-3" /> Personnalise
            </p>
            <div className="flex gap-3">
              <label className="flex-1 space-y-1">
                <span className="text-[10px] text-muted-foreground font-medium">Primaire</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customPrimary}
                    onChange={(e) => setCustomPrimary(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-muted-foreground">{customPrimary}</span>
                </div>
              </label>
              <label className="flex-1 space-y-1">
                <span className="text-[10px] text-muted-foreground font-medium">Secondaire</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customSecondary}
                    onChange={(e) => setCustomSecondary(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-muted-foreground">{customSecondary}</span>
                </div>
              </label>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCustomApply}
              className="w-full text-xs"
            >
              Appliquer les couleurs
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
