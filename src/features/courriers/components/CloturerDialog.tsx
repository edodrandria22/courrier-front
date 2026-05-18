'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import { useCloturer } from '../hooks/useCloturer'

interface Props {
  courrierId: number
  onSuccess: () => void
}

export const CloturerDialog = ({ courrierId, onSuccess }: Props) => {
  const [open, setOpen] = useState(false)
  const { cloturer, loading, error } = useCloturer()

  const handleCloturer = async () => {
    const result = await cloturer(courrierId)

    if (result.success) {
      setOpen(false)
      onSuccess()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10">
          <CheckCircle2 className="w-4 h-4" />
          Clôturer
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card border-border text-foreground sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Clôturer le courrier</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Êtes-vous sûr de vouloir clôturer ce courrier ? Cette action est définitive et changera son statut à "Finalisé".
          </p>

          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleCloturer}
            disabled={loading}
            className="bg-emerald-600 hover:opacity-90 text-white min-w-[140px]"
          >
            {loading ? 'Clôture en cours...' : 'Clôturer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
