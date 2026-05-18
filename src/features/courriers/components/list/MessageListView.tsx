'use client'

import { ArrowLeft, ArrowRight, Paperclip, CheckCircle2, AlertCircle, Plus, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {  Courrier, MessageCourrier } from '../../types/courrier'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { formatDateTime } from '@/hooks/utils'
import { useMessagePermissions } from '@/hooks/useMessagePermissions'

interface Props {
  courrier: Courrier
  messages: MessageCourrier[]
  loading: boolean
  error: string | null
  currentUserId: string | null
  onSelect: (message: MessageCourrier) => void
  onBack: () => void,
  isRecherche?: boolean
}


export const MessageListView = ({ courrier, messages, loading, error, currentUserId, onSelect, onBack, isRecherche = false }: Props) => {
  const { isMessageVisible, isLastRecipient } = useMessagePermissions(messages, currentUserId)

  return (
    <div className="flex flex-col h-full">
      {/* Header du courrier */}
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-border flex items-start gap-3">
        {!isRecherche && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono text-primary/70 mb-0.5">{courrier.reference}</p>
          <h2 className="text-sm font-bold text-foreground leading-tight">{courrier.object}</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Demandeur : {courrier.nom} {courrier.prenom} · {courrier.email}
          </p>
        </div>
        {isLastRecipient && (
          <Link href={`/message/compose?courrierId=${courrier.id}&reference=${encodeURIComponent(courrier.reference || '')}&objet=${encodeURIComponent(courrier.object || '')}`}>
            <Button size="sm" className="shrink-0 gap-1.5 text-xs font-bold">
              <Plus className="w-3.5 h-3.5" />
              Nouveau message
            </Button>
          </Link>
        )}
      </div>

      {/* Corps */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-4 md:p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card px-4 py-3 flex items-start gap-3">
                <Skeleton className="shrink-0 w-7 h-7 rounded-full" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-20 rounded" />
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-3 w-20 rounded" />
                      <Skeleton className="h-4 w-10 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-16 rounded" />
                  </div>
                  <Skeleton className="h-3 w-3/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-destructive">
            <AlertCircle className="w-8 h-8" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="bg-primary/5 p-5 rounded-full mb-4 border border-primary/10">
              <ArrowRight className="w-10 h-10 text-primary/30" />
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Aucun transfert</p>
            <p className="text-muted-foreground/60 text-xs text-center mt-1">Ce courrier n'a pas encore été transféré.</p>
          </div>
        )}

        {!loading && !error && messages.length > 0 && (
          <div className="p-4 md:p-6 space-y-3">
            {messages.map((message, index) => {
              const accessible = isMessageVisible(message)
              const isRead = !!message.isReadAt
              return (
                <button
                  key={message.id}
                  onClick={() => accessible && onSelect(message)}
                  disabled={!accessible}
                  className={cn(
                    'w-full text-left rounded-xl border transition-all duration-200 group relative overflow-hidden',
                    accessible ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed',
                    isRead
                      ? 'bg-card border-border hover:border-border/80 hover:shadow-sm'
                      : 'bg-primary/5 border-primary/20 hover:border-primary/40 hover:shadow-sm hover:shadow-primary/5'
                  )}
                >
                  {/* Accent gauche pour les non lus */}
                  {!isRead && (
                    <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-l-xl" />
                  )}

                  <div className="px-4 py-3 flex items-start gap-3">
                    {/* Numero etape */}
                    <div className={cn(
                      'shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black mt-0.5',
                      isRead
                        ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/25'
                        : 'bg-primary/15 text-primary border border-primary/25'
                    )}>
                      {index + 1}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      {/* Ligne 1 : expediteur → destinataire + badge + date */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                          <span className={cn('text-xs truncate max-w-[70px] sm:max-w-[110px]', !isRead ? 'font-bold text-foreground' : 'font-semibold text-foreground/70')}>
                            {message.expediteur.nom}
                          </span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />
                          <span className={cn('text-xs truncate max-w-[70px] sm:max-w-[110px]', !isRead ? 'font-bold text-primary' : 'font-semibold text-primary/70')}>
                            {message.destinataire.nom}
                          </span>
                          {isRead ? (
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shrink-0">
                              <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Lu
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/20 shrink-0">
                              Non lu
                            </Badge>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground/60 shrink-0 tabular-nums">
                          {formatDateTime(message.createdAt)}
                        </span>
                      </div>

                      {/* Ligne 2 : aperçu du message ou verrou */}
                      {accessible ? (
                        <p className={cn(
                          'text-xs truncate leading-relaxed',
                          !isRead ? 'text-foreground/90 font-medium' : 'text-muted-foreground/70'
                        )}>
                          {message.observation || <span className="italic">Aucun commentaire</span>}
                        </p>
                      ) : (
                        <div className="flex items-center gap-1.5 text-muted-foreground/50">
                          <Lock className="w-3 h-3" />
                          <span className="text-xs">Contenu confidentiel</span>
                        </div>
                      )}
                    </div>

                    {/* Icone droite */}
                    {accessible && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary/50 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
