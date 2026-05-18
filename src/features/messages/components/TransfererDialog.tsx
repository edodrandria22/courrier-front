'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Forward, FileText, X, Paperclip } from 'lucide-react'
import { useUtilisateurs } from '@/features/utilisateurs/hooks/useUtilisateurs'
import { useTransferer } from '../hooks/useTransferer'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

interface Attachment {
  file: File
  id: string
}

interface Props {
  messageId: number
  onSuccess: () => void
}

export const TransfererDialog = ({ messageId, onSuccess }: Props) => {
  const [open, setOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [observation, setObservation] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { utilisateurs, loading: loadingUsers, fetchUtilisateurs } = useUtilisateurs()
  const { transferer, loading: transferring, error: transferError } = useTransferer()

  useEffect(() => {
    if (open) {
      fetchUtilisateurs()
    }
  }, [open, fetchUtilisateurs])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newAttachments = files.map((file) => ({
      file,
      // Remplace crypto.randomUUID() par cette ligne :
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    }))
    
    setAttachments((prev) => [...prev, ...newAttachments])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id))
  }

  const handleTransferer = async () => {
    if (!selectedUserId) return

    const files = attachments.map((att) => att.file)
    const result = await transferer(messageId, selectedUserId, observation, files)

    if (result.success) {
      setOpen(false)
      setSelectedUserId(null)
      setObservation('')
      setAttachments([])
      onSuccess()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Forward className="w-4 h-4" />
          Transférer
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card border-border text-foreground sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transférer le message</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Utilisateurs */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Sélectionner le destinataire
            </label>
            {loadingUsers ? (
              <div className="text-sm text-muted-foreground">Chargement...</div>
            ) : (
              <select
                value={selectedUserId ?? ''}
                onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
                disabled={transferring}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              >
                <option value="">-- Choisir un destinataire --</option>
                {utilisateurs.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nom} {user.prenom}{user.adresse ? ` — ${user.adresse}` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Observation */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Observation <span className="text-muted-foreground font-normal">(optionnel)</span>
            </label>
            <Textarea
              placeholder="Ajouter un commentaire..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              disabled={transferring}
              rows={3}
              className="resize-none bg-background/50 border-border text-foreground"
            />
          </div>

          {/* Fichiers */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Documents <span className="text-muted-foreground font-normal">(optionnel)</span>
            </label>
            <div
              onClick={() => !transferring && fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed border-border rounded-lg p-6 text-center transition-all group',
                transferring ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-accent/5'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                disabled={transferring}
              />
              <Paperclip className="w-6 h-6 mx-auto mb-2 text-muted-foreground group-hover:scale-110 transition-transform" />
              <p className="text-xs font-medium text-muted-foreground">
                Cliquez pour ajouter des fichiers
              </p>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-2 bg-muted/30 border border-border rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-2 truncate text-foreground">
                      <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="truncate max-w-[160px] sm:max-w-[300px]">{att.file.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="h-6 w-6 text-destructive hover:bg-destructive/10 shrink-0"
                      disabled={transferring}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Erreur */}
          {transferError && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
              {transferError}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={transferring}
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleTransferer}
            disabled={transferring || !selectedUserId || loadingUsers}
            className="bg-primary hover:opacity-90 text-primary-foreground min-w-[140px]"
          >
            {transferring ? 'Envoi...' : 'Transférer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
