'use client'

import { 
  ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Plus, Lock, 
  UserIcon, Mail, Phone, Calendar, Clock, FileText 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Courrier, MessageCourrier } from '../../types/courrier'
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
  onBack: () => void
  isRecherche?: boolean
}

export const MessageListView = ({ courrier, messages, loading, error, currentUserId, onSelect, onBack, isRecherche = false }: Props) => {
  const { isMessageVisible, isLastRecipient } = useMessagePermissions(messages, currentUserId)
  const statusLu = courrier.isReadAt ? 'lu' : 'non-lu'
  const status = courrier.cloturePar ? 'finalise' : statusLu;
  const isConfidentiel = courrier.isConfidentiel // Vérification de la confidentialité du courrier

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case 'non-lu':
        return {
          label: 'non-lu',
          icon: FileText,
          styles: 'text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-950/20 dark:text-slate-400 dark:border-slate-900',
        };
      case 'finalise':
        return {
          label: 'finalise',
          icon: CheckCircle2,
          styles: 'text-green-700 bg-green-50 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900',
        };
      case 'lu':
      default:
        return {
          label: status || 'lu', 
          icon: Clock,
          styles: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900',
        };
    }
  }

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="flex flex-col h-full bg-background">
      
      {/* 1. Barre d'actions supérieure (Retour + Transfert) */}
      <div className="px-4 md:px-6 py-3 border-b border-border flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="flex items-center gap-3">
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
          <h1 className="text-sm font-semibold hidden sm:block">Détails du courrier</h1>
        </div>

        {isLastRecipient && !courrier.cloturePar && (
          <Link href={`/message/compose?courrierId=${courrier.id}&reference=${encodeURIComponent(courrier.reference || '')}&objet=${encodeURIComponent(courrier.object || '')}`}>
            <Button size="sm" className="shrink-0 gap-1.5 text-xs font-bold">
              <Plus className="w-3.5 h-3.5" />
              Transférer
            </Button>
          </Link>
        )}
      </div>

      {/* Zone défilante : Détails + Liste des messages */}
      <div className="flex-1 overflow-y-auto">
        
        {/* 2. Détails complets du courrier */}
        <div className="p-4 md:p-6 pb-2">
          <div className="flex flex-col gap-4 p-4 sm:p-5 bg-card text-card-foreground rounded-xl border shadow-sm max-w-4xl mx-auto">
            
            {/* En-tête : Référence et Statuts */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
              <div className="space-y-1">
                <p className="text-xs font-mono text-primary/70">{courrier.reference || "Sans référence"}</p>
                <h2 className={cn(
                  "text-base font-bold text-foreground leading-tight flex items-center gap-1.5",
                  isConfidentiel && "text-amber-700 dark:text-amber-500"
                )}>
                  {isConfidentiel && <Lock className="w-4 h-4 shrink-0 text-amber-600" />}
                  {courrier.object}
                </h2>
              </div>
              
              <div className="flex gap-2 items-center">
                {/* Badge de confidentialité si actif */}
                {isConfidentiel && (
                  <Badge variant="outline" className="h-6 px-2 text-xs font-medium gap-1 border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
                    <Lock className="w-3 h-3" /> Confidentiel
                  </Badge>
                )}

                {courrier.cloturePar ? (
                  <Badge variant="secondary" className="h-6 px-2 text-xs font-medium gap-1 bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Finalisé par {courrier.cloturePar.nom || "un utilisateur"}
                  </Badge>
                ) : (
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "h-6 px-2 text-xs font-medium gap-1", 
                      statusConfig.styles
                    )}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig.label}
                  </Badge>
                )}
              </div>
            </div>

            {/* Description du courrier */}
            {courrier.description && (
              <div className={cn(
                "space-y-1.5 p-3 rounded-md border border-dashed",
                isConfidentiel 
                  ? "bg-amber-50/30 border-amber-200/60 dark:bg-amber-950/10 dark:border-amber-900/50" 
                  : "bg-muted/40 border-border"
              )}>
                <p className={cn(
                  "text-xs font-semibold flex items-center gap-1",
                  isConfidentiel ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"
                )}>
                  <FileText className="w-3.5 h-3.5" /> Description
                </p>
                <p className="text-sm text-foreground whitespace-pre-line">{courrier.description}</p>
              </div>
            )}

            {/* Flux du Courrier (Expéditeur -> Destinataire initial) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/20 p-3 rounded-md text-sm border">
              <div>
                <span className="text-xs font-medium text-muted-foreground block mb-1">Expéditeur :</span>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">EX</div>
                  <div>
                    <p className="font-medium text-xs">{courrier.expediteur?.nom || "Non spécifié"}</p>
                    <p className="text-[11px] text-muted-foreground">{courrier.expediteur?.email}</p>
                  </div>
                </div>
              </div>

              <div className="border-t sm:border-t-0 sm:border-l pt-2 sm:pt-0 sm:pl-3 flex flex-col justify-center">
                <span className="text-xs font-medium text-muted-foreground block mb-1">Destinataire initial :</span>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-bold text-secondary-foreground">DE</div>
                  <div>
                    <p className="font-medium text-xs">{courrier.destinataire?.nom || "Non spécifié"}</p>
                    <p className="text-[11px] text-muted-foreground">{courrier.destinataire?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Infos sur le Demandeur */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Informations Demandeur</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border rounded-md p-3 bg-background">
                <p className="flex items-center gap-2 text-foreground">
                  <UserIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="font-medium">Nom :</span> {courrier.nom || "—"} {courrier.prenom || ""}
                </p>
                {courrier.numero !== undefined && (
                  <p className="flex items-center gap-2 text-foreground">
                    <span className="font-semibold text-muted-foreground w-3.5 text-center">N°</span>
                    <span className="font-medium">Numéro :</span> {courrier.numero}
                  </p>
                )}
                <p className="flex items-center gap-2 text-foreground sm:col-span-2 border-t pt-2 mt-1">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="font-medium">Email :</span> 
                  {courrier.email ? <a href={`mailto:${courrier.email}`} className="text-primary hover:underline">{courrier.email}</a> : "—"}
                </p>
                {courrier.telephone && (
                  <p className="flex items-center gap-2 text-foreground sm:col-span-2 border-t pt-2">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="font-medium">Téléphone :</span> 
                    <a href={`tel:${courrier.telephone}`} className="text-primary hover:underline">{courrier.telephone}</a>
                  </p>
                )}
              </div>
            </div>

            {/* Traçabilité & Dates */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t pt-3 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <div>
                  <span className="block font-medium text-[10px] text-muted-foreground/80">Créé le</span>
                  <span className="text-foreground">{courrier.createdAt ? formatDateTime(courrier.createdAt) : "—"}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <div>
                  <span className="block font-medium text-[10px] text-muted-foreground/80">Échéance</span>
                  <span className={`text-foreground ${courrier.dateFin ? "font-medium text-destructive" : ""}`}>
                    {courrier.dateFin ? formatDateTime(courrier.dateFin) : "Aucune"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <div>
                  <span className="block font-medium text-[10px] text-muted-foreground/80">Lu le</span>
                  <span className="text-foreground">
                    {courrier.isReadAt ? formatDateTime(courrier.isReadAt) : "Non lu"}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Liste des Messages / Transferts */}
        <div className="p-4 md:p-6 max-w-4xl mx-auto w-full">
          <h3 className="text-sm font-semibold mb-4 px-1 text-foreground/80 flex items-center gap-2">
            Historique des transferts
            <Badge variant="secondary" className="h-5 px-1.5">{messages.length}</Badge>
          </h3>

          {loading && (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card px-4 py-3 flex items-start gap-3">
                  <Skeleton className="shrink-0 w-7 h-7 rounded-full" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-20 rounded" />
                        <Skeleton className="h-3 w-3 rounded-full" />
                        <Skeleton className="h-3 w-20 rounded" />
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
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-destructive bg-destructive/5 rounded-xl border border-destructive/20">
              <AlertCircle className="w-8 h-8" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-6 border border-dashed rounded-xl bg-muted/10">
              <div className="bg-primary/5 p-4 rounded-full mb-3 border border-primary/10">
                <ArrowRight className="w-8 h-8 text-primary/30" />
              </div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Aucun transfert</p>
              <p className="text-muted-foreground/60 text-xs text-center mt-1">Ce courrier n'a pas encore été transféré.</p>
            </div>
          )}

          {!loading && !error && messages.length > 0 && (
            <div className="space-y-3">
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
                      accessible ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed grayscale-[0.5]',
                      isRead
                        ? 'bg-card border-border hover:border-border/80 hover:shadow-sm'
                        : 'bg-primary/5 border-primary/20 hover:border-primary/40 hover:shadow-sm hover:shadow-primary/5'
                    )}
                  >
                    {!isRead && (
                      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-l-xl" />
                    )}

                    <div className="px-4 py-3 flex items-start gap-3">
                      <div className={cn(
                        'shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black mt-0.5',
                        isRead ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/25' : 'bg-primary/15 text-primary border border-primary/25'
                      )}>
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                            <span className={cn('text-xs truncate max-w-[90px] sm:max-w-[130px]', !isRead ? 'font-bold text-foreground' : 'font-semibold text-foreground/70')}>
                              {message.expediteur.nom}
                            </span>
                            <ArrowRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />
                            <span className={cn('text-xs truncate max-w-[90px] sm:max-w-[130px]', !isRead ? 'font-bold text-primary' : 'font-semibold text-primary/70')}>
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

                        {accessible ? (
                          <p className={cn('text-xs truncate leading-relaxed', !isRead ? 'text-foreground/90 font-medium' : 'text-muted-foreground/70')}>
                            {message.observation || <span className="italic">Aucun commentaire</span>}
                          </p>
                        ) : (
                          <div className="flex items-center gap-1.5 text-muted-foreground/50">
                            <Lock className="w-3 h-3" />
                            <span className="text-xs font-medium">Contenu confidentiel</span>
                          </div>
                        )}
                      </div>

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
    </div>
  )
}