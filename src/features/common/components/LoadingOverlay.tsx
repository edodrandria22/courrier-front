'use client'

import { useTheme } from 'next-themes'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

interface Props {
  isOpen: boolean
  message?: string
}

export const LoadingOverlay = ({ isOpen, message = 'Traitement en cours...' }: Props) => {
  const { theme } = useTheme()

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-lg bg-card border-border text-foreground" showCloseButton={false}>
        <VisuallyHidden>
          <DialogTitle>Chargement</DialogTitle>
        </VisuallyHidden>
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <img
            src={theme === 'dark' ? '/mesupresSombre.jpg' : '/mesupres.jpg'}
            alt="Logo Mesupress"
            className="h-12 w-auto"
          />
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <div className="space-y-2 w-full max-w-xs">
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              {message}
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{
                  width: '100%',
                  background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s infinite'
                }}
              />
            </div>
          </div>

        </div>

        <div className="flex items-center justify-center pt-4 border-border gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-lg">
            <p className="text-xs font-semibold text-primary whitespace-nowrap">Ministère de l'Enseignement Supérieur et de la Recherche Scientifique</p>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}
