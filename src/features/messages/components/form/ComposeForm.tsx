'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Paperclip, Send, X, FileText, Loader2, FolderOpen, User, Hash, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useComposeMessage } from '../../hooks/useCompose'
import { useUtilisateurs } from '@/features/utilisateurs/hooks/useUtilisateurs'
import type { Attachment } from '../../types/compose'

interface ComposeFormProps {
  courrierId: number;
  courrierReference?: string;
  courrierObjet?: string;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

export const ComposeForm = ({ courrierId, courrierReference, courrierObjet }: ComposeFormProps) => {
  const router = useRouter()
  const { sendMessage, loading, error } = useComposeMessage()
  const { utilisateurs, loading: loadingUsers, fetchUtilisateurs } = useUtilisateurs()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [destId, setDestId] = useState<number | null>(null)
  const [observation, setObservation] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])

  useEffect(() => {
    fetchUtilisateurs()
  }, [fetchUtilisateurs])

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!destId) return

    const result = await sendMessage({ destId, courrierId, observation, attachments })
    if (result.success) {
      router.push('/message/courrier/receive')
    }
  }

  return (
    <Card className="border-border bg-card shadow-none md:border md:shadow-sm">
      <form onSubmit={handleFormSubmit}>

        {/* En-tête du formulaire */}
        <div className="px-6 py-4 border-b border-border">
          <h1 className="text-base font-bold text-foreground">Nouveau transfert</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Transférer ce courrier vers un autre agent</p>
        </div>

        <div className="p-6 space-y-5">

          {/* Erreur */}
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 flex items-center gap-2">
              <X className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* Contexte du courrier */}
          {(courrierReference || courrierObjet) && (
            <div className="p-4 rounded-xl bg-muted/20 border border-border space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Courrier concerné</p>
              {courrierReference && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Hash className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                  <span className="font-mono text-primary/80">{courrierReference}</span>
                </div>
              )}
              {courrierObjet && (
                <div className="flex items-center gap-2 text-xs text-foreground/80">
                  <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="font-medium">{courrierObjet}</span>
                </div>
              )}
            </div>
          )}

          {/* Destinataire */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              Destinataire <span className="text-destructive">*</span>
            </label>
            {loadingUsers ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Chargement des agents...
              </div>
            ) : utilisateurs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">Aucun agent disponible.</p>
            ) : (
              <Select disabled={loading} onValueChange={(val) => setDestId(Number(val))}>
                <SelectTrigger className="bg-background/50 border-border focus:ring-0 focus:border-muted-foreground">
                  <SelectValue placeholder="Choisir un agent destinataire..." />
                </SelectTrigger>
                <SelectContent>
                  {utilisateurs.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      <div className="flex flex-col">
                        <span className="font-semibold">{u.prenom} {u.nom}</span>
                        <span className="text-xs text-muted-foreground">{u.adresse} · {u.role}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Observation */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
              Observation
              <span className="text-xs font-normal text-muted-foreground">(optionnel)</span>
            </label>
            <Textarea
              placeholder="Ajouter une observation ou instruction pour le destinataire..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              disabled={loading}
              rows={3}
              className="bg-background/50 border-border resize-none focus-visible:ring-0 focus-visible:border-muted-foreground placeholder:text-muted-foreground/50 text-sm"
            />
          </div>

          {/* Pièces jointes */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
              Pièces jointes
              <span className="text-xs font-normal text-muted-foreground">(optionnel)</span>
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
              />
              <FolderOpen className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50 group-hover:text-primary/50 transition-colors" />
              <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Cliquez pour joindre des fichiers
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">PDF, images, documents...</p>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">
                  {attachments.length} fichier{attachments.length > 1 ? 's' : ''} sélectionné{attachments.length > 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-3 p-3 bg-muted/20 border border-border rounded-xl"
                    >
                      <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                        <FileText className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{att.file.name}</p>
                        <p className="text-[10px] text-muted-foreground">{formatFileSize(att.file.size)}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAttachment(att.id)}
                        className="h-7 w-7 shrink-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
          <Link href="/message/courrier/receive">
            <button
              type="button"
              disabled={loading}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--secondary)',
                borderColor: 'var(--secondary)',
                borderWidth: '1px',
                borderStyle: 'solid',
                padding: '8px 16px',
                borderRadius: '6px',
                fontWeight: '500',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? '0.5' : '1',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'scale(1.05)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              Annuler
            </button>
          </Link>
          <button
            type="submit"
            disabled={loading || !destId}
            style={{
              backgroundColor: (loading || !destId) ? 'var(--muted)' : 'var(--primary)',
              color: '#ffffff',
              borderColor: (loading || !destId) ? 'var(--muted)' : 'var(--primary)',
              borderWidth: '1px',
              borderStyle: 'solid',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: (loading || !destId) ? 'not-allowed' : 'pointer',
              opacity: (loading || !destId) ? '0.5' : '1',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!loading && destId) e.currentTarget.style.backgroundColor = 'var(--primary)'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = (loading || !destId) ? 'var(--muted)' : 'var(--primary)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Envoyer le message
              </>
            )}
          </button>
        </div>

      </form>
    </Card>
  )
}
