'use client'

import { ArrowLeft, ArrowRight, Paperclip, CheckCircle2, MapPin, MessageSquare, User, Scissors, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Courrier, MessageCourrier } from '../types/courrier'
import { cn } from '@/lib/utils'
import { TransfererDialog } from '@/features/messages/components/TransfererDialog'
import { useMessagePermissions } from '@/hooks/useMessagePermissions'
import { PieceJointeCard } from './PieceJointeCard'
import { useMessages } from '@/features/messages/hooks/useMessages'
import { useEffect, useRef } from 'react'

interface Props {
  courrier: Courrier
  message: MessageCourrier
  messages: MessageCourrier[]
  currentUserId: string | null
  onBack: () => void,
  onMessageRead?: (id: number) => void
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const initials = (nom: string, prenom?: string) => {
  const first = prenom?.trim().charAt(0) || '';
  const last = nom?.trim().charAt(0) || '';
  const res = (first + last).toUpperCase();
  return res || '?';
};


export const MessageDetailView = ({ courrier, message, messages, currentUserId, onBack, onMessageRead }: Props) => {
  const { canTransfer, isLastMessage, isDestinataireOf } = useMessagePermissions(messages, currentUserId);
  const isDestinataire = isDestinataireOf(message);
  const { marquerLu, marquerNonLu, loading } = useMessages();
  const hasMarkedRef = useRef(false);

  const handleMarkAsUnread = async () => {
    const result = await marquerNonLu(message.id);
    if (result.success) {
      if (onMessageRead) onMessageRead(0);
      onBack();
    }
  };

  useEffect(() => {
    if (isDestinataire && !message.isReadAt && !hasMarkedRef.current) {
      hasMarkedRef.current = true;
      marquerLu(message.id)
        .then((result) => {
          if (result.success && onMessageRead) {
            onMessageRead(message.id);
          }
        })
        .catch((err) => {
          // console.error("Erreur lors du marquage comme lu:", err);
        });
    }
  }, [isDestinataire]);

  return (
    <Card className="border-border bg-card shadow-none md:border md:shadow-sm">

      {/* En-tête */}
      <div className="px-6 py-4 border-b border-border flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground -ml-2 mt-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs font-mono text-primary/70">{courrier.reference}</p>
            {message.isReadAt && (
              <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Lu
              </Badge>
            )}
          </div>
           {courrier.cloturePar && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-medium gap-1 bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle2 className="w-3 h-3" />
                Finalisé
              </Badge>
            )}
          <h2 className="text-base font-bold text-foreground mt-0.5 leading-tight">{courrier.object}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{formatDate(message.createdAt)}</p>
        </div>
      </div>

      <div className="p-6 space-y-5">

        {/* Expéditeur → Destinataire */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <User className="w-3.5 h-3.5 text-muted-foreground" />
            Transfert
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-muted/20 border border-border rounded-xl">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Avatar className="h-9 w-9 border border-border shrink-0">
                <AvatarFallback className="bg-muted/30 text-primary text-xs font-bold">
                  {initials(message.expediteur.nom)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground">{message.expediteur.nom}</p>
                {message.expediteur.adresse && (
                  <p className="text-[10px] text-muted-foreground/70 flex items-center gap-1 truncate">
                    <MapPin className="w-2.5 h-2.5 shrink-0" /> {message.expediteur.adresse}
                  </p>
                )}
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />

            <div className={cn('flex items-center gap-2 flex-1 min-w-0 justify-end', message.dateValidation ? 'text-emerald-400' : 'text-primary')}>
              <div className="min-w-0 text-right">
                <p className="text-xs font-bold">{message.destinataire.nom}</p>
                {message.destinataire.adresse && (
                  <p className="text-[10px] text-muted-foreground/70 flex items-center gap-1 justify-end truncate">
                    <MapPin className="w-2.5 h-2.5 shrink-0" /> {message.destinataire.adresse}
                  </p>
                )}
              </div>
              <Avatar className="h-9 w-9 border border-current/20 shrink-0">
                <AvatarFallback className={cn('text-xs font-bold bg-current/10')}>
                  {initials(message.destinataire.nom)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Contenu du message */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
            Observation
          </label>
          <div className="p-4 bg-background/50 border border-border rounded-xl text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap min-h-[100px]">
            {message.observation || <span className="text-muted-foreground/50 italic">Aucun commentaire</span>}
          </div>
        </div>

        {/* Pièces jointes */}
        {message.fichiers.length > 0 && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
              Pièces jointes
              <span className="text-xs font-normal text-muted-foreground">({message.fichiers.length})</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {message.fichiers.map((pj) => (
                <PieceJointeCard key={pj.id} pj={pj} />
              ))}
            </div>
          </div>
        )}
        </div>

      

      {/* Actions */}
      <div className="px-6 py-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
        <Button onClick={onBack} variant="outline" className="border-border hover:bg-accent text-xs shrink-0">
          Retour aux transferts
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          {message.isReadAt && isDestinataire && isLastMessage(message) && !courrier.cloturePar  && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAsUnread}
              disabled={loading}
              className="text-xs border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
            >
              Marquer comme non lu
            </Button>
          )}
          {canTransfer && isLastMessage(message) && !courrier.cloturePar && (
            <TransfererDialog messageId={message.id} onSuccess={onBack} />
          )}
        </div>
      </div>

    </Card>
  )
}
