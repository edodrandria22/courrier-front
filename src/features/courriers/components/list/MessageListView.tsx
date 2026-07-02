'use client'

import { 
  ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Plus, Lock, 
  UserIcon, Mail, Phone, Calendar, Clock, FileText, 
  Edit2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Courrier, MessageCourrier } from '../../types/courrier'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { formatDateTime } from '@/hooks/utils'
import { useMessagePermissions } from '@/hooks/useMessagePermissions'
           import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip" // Ajustez le chemin selon votre structure de projet
import { useState } from 'react'

// ... (dans votre composant)
interface Props {
  courrier: Courrier
  messages: MessageCourrier[]
  loading: boolean
  error: string | null
  currentUserId: string | null
  onSelect: (message: MessageCourrier) => void
  onBack: () => void
  isRecherche?: boolean,
  updateHistorique: (id: number, observation: string) => Promise<Courrier>
}

export const MessageListView = ({ courrier, messages, loading, error, currentUserId, onSelect, onBack, isRecherche = false, updateHistorique }: Props) => {
  const { isMessageVisible, isLastRecipient } = useMessagePermissions(messages, currentUserId)
  const statusLu = courrier.isReadAt ? 'lu' : 'non-lu'
  const status = courrier.cloturePar ? 'finalise' : statusLu;
  const isConfidentiel = courrier.isConfidentiel // Vérification de la confidentialité du courrier
  // console.log(courrier);
  // États pour la gestion du formulaire d'observation
  
  const [isEditingObs, setIsEditingObs] = useState(false)
  const [obsValue, setObsValue] = useState(courrier.observation || '')
  const [isUpdatingObs, setIsUpdatingObs] = useState(false)

  // Fonction de soumission de la nouvelle observation
  const handleUpdateObservation = async () => {
    if (!courrier.historiqueId) return;
    setIsUpdatingObs(true);
    try {
      const courrierVaovao = await updateHistorique(courrier.historiqueId, obsValue);
      courrier.observation = courrierVaovao.observation;
      setIsEditingObs(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'observation", error);
      // Gérer l'affichage de l'erreur si nécessaire (ex: toast)
    } finally {
      setIsUpdatingObs(false);
    }
  }
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

        {/* {isLastRecipient && !courrier.cloturePar && (
          <Link href={`/message/compose?courrierId=${courrier.id}&reference=${encodeURIComponent(courrier.reference || '')}&objet=${encodeURIComponent(courrier.object || '')}`}>
            <Button size="sm" className="shrink-0 gap-1.5 text-xs font-bold" style={{ color: '#ffffff' }}>
              <Plus className="w-3.5 h-3.5" />
              Transférer
            </Button>
          </Link>
        )} */}
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
                {courrier.numero !== undefined && (
                  <p className="flex items-center gap-2 text-foreground">
                    {/* <span className="font-semibold text-muted-foreground w-3.5 text-center">N°</span> */}
                    <span className="font-medium">Numéro :</span> {courrier.numero}
                  </p>
                )}
                {courrier.numRef !== undefined && (
                  <p className="flex items-center gap-2 text-foreground">
                    {/* <span className="font-semibold text-muted-foreground w-3.5 text-center">N°</span> */}
                    <span className="font-medium">Numéro de référence :</span> {courrier.numRef}
                  </p>
                )}
              </div>
            )}

            {/* Flux du Courrier (Expéditeur -> Destinataire initial) */}
 

          <TooltipProvider>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/20 p-3 rounded-md text-sm border">
              
              {/* Section Expéditeur */}
              <div>
                <span className="text-xs font-medium text-muted-foreground block mb-1">Expéditeur :</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-muted/40 p-1 rounded transition-colors">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        EX
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-xs truncate">
                          {courrier.expediteur?.nom} {courrier.expediteur?.prenom}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {courrier.expediteur?.adresse}
                        </p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="p-3 max-w-xs space-y-1">
                    <p className="font-semibold text-xs text-primary">Détails de l'expéditeur</p>
                    <p className="text-xs"><strong>Nom :</strong> {courrier.expediteur?.nom} {courrier.expediteur?.prenom}</p>
                    {courrier.expediteur?.email && <p className="text-xs"><strong>Email :</strong> {courrier.expediteur?.email}</p>}
                    <p className="text-xs"><strong>Adresse :</strong> {courrier.expediteur?.adresse}</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Section Destinataire */}
              <div className="border-t sm:border-t-0 sm:border-l pt-2 sm:pt-0 sm:pl-3 flex flex-col justify-center">
                <span className="text-xs font-medium text-muted-foreground block mb-1">Destinataire initial :</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-muted/40 p-1 rounded transition-colors">
                      <div className="h-7 w-7 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-bold text-secondary-foreground shrink-0">
                        DE
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-xs truncate">
                          {courrier.destinataire?.nom} {courrier.destinataire?.prenom}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {courrier.destinataire?.adresse}
                        </p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="p-3 max-w-xs space-y-1">
                    <p className="font-semibold text-xs text-secondary-foreground">Détails du destinataire</p>
                    <p className="text-xs"><strong>Nom :</strong> {courrier.destinataire?.nom} {courrier.destinataire?.prenom}</p>
                    {courrier.destinataire?.email && <p className="text-xs"><strong>Email :</strong> {courrier.destinataire?.email}</p>}
                    <p className="text-xs"><strong>Adresse :</strong> {courrier.destinataire?.adresse}</p>
                  </TooltipContent>
                </Tooltip>
              </div>

            </div>
          </TooltipProvider>
            

            {/* Infos sur le Demandeur */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Informations Demandeur{courrier.detailPersonnes && courrier.detailPersonnes.length > 1 ? 's' : ''}
              </h3>

              {/* On vérifie si la liste existe et contient des éléments */}
              {courrier.detailPersonnes && courrier.detailPersonnes.length > 0 ? (
                <div className="space-y-3"> {/* Conteneur pour espacer chaque bloc personne */}
                  {courrier.detailPersonnes.map((personne, index) => (
                    <div 
                      key={index} 
                      className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border rounded-md p-3 bg-background relative"
                    >
                      {/* Petit badge optionnel pour numéroter s'il y a plusieurs personnes */}
                      {courrier.detailPersonnes.length > 1 && (
                        <span className="absolute top-2 right-2 text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-medium">
                          #{index + 1}
                        </span>
                      )}

                      {/* Nom & Prénom */}
                      <p className="flex items-center gap-2 text-foreground sm:col-span-2">
                        <UserIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="font-medium">Nom :</span> {personne.name || "—"} {personne.prenom || ""}
                      </p>

                      {/* Email */}
                      <p className="flex items-center gap-2 text-foreground sm:col-span-2 border-t pt-2 mt-1">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="font-medium">Email :</span> 
                        {personne.email ? (
                          <a href={`mailto:${personne.email}`} className="text-primary hover:underline break-all">
                            {personne.email}
                          </a>
                        ) : "—"}
                      </p>

                      {/* Téléphone (Affiché uniquement s'il existe) */}
                      {personne.telephone && (
                        <p className="flex items-center gap-2 text-foreground sm:col-span-2 border-t pt-2">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="font-medium">Téléphone :</span> 
                          <a href={`tel:${personne.telephone}`} className="text-primary hover:underline">
                            {personne.telephone}
                          </a>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* Message de repli si aucune personne n'est enregistrée */
                <div className="text-xs text-muted-foreground italic p-3 border border-dashed rounded-md text-center bg-muted/30">
                  Aucun demandeur renseigné
                </div>
              )}
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
                  <span className="block font-medium text-[10px] text-muted-foreground/80">Date du message</span>
                  <span className="text-foreground">{courrier.dateMessage ? formatDateTime(courrier.dateMessage) : "—"}</span>
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
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <div>
                  <span className="block font-medium text-[10px] text-muted-foreground/80">Échéance</span>
                  <span className={`text-foreground ${courrier.dateFin ? "font-medium text-destructive" : ""}`}>
                    {courrier.dateFin ? formatDateTime(courrier.dateFin) : "Aucune"}
                  </span>
                </div>
              </div>
            </div>
            {/* Nouveau bloc pour l'Observation */}
            <div className="flex items-start gap-2 col-span-2 sm:col-span-3 border-t border-dashed pt-3 mt-2 group relative">
              <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <span className="block font-medium text-[10px] text-muted-foreground/80 uppercase tracking-wider">
                    Observation
                  </span>
                  {!isEditingObs && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-2"
                      onClick={() => setIsEditingObs(true)}
                    >
                      <Edit2 className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    </Button>
                  )}
                </div>

                {isEditingObs ? (
                  <div className="mt-2 flex flex-col gap-2">
                    <textarea 
                      value={obsValue}
                      onChange={(e) => setObsValue(e.target.value)}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Saisissez une nouvelle observation..."
                    />
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs"
                        onClick={() => {
                          setIsEditingObs(false);
                          setObsValue(courrier.observation || '');
                        }}
                        disabled={isUpdatingObs}
                      >
                        Annuler
                      </Button>
                      <Button 
                        size="sm" 
                        style={{ color: '#ffffff' }}
                        className="h-8 text-xs"
                        onClick={handleUpdateObservation}
                        disabled={isUpdatingObs}
                      >
                        {isUpdatingObs ? 'Enregistrement...' : 'Enregistrer'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <span className="text-foreground text-sm block mt-1 whitespace-pre-wrap">
                    {courrier.observation ? courrier.observation : <span className="text-muted-foreground italic text-xs">Aucune observation</span>}
                  </span>
                )}
              </div>
            </div>
            
            {/* ------------------------------------------- */}

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
            <div className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    
                    {/* En-tête du tableau */}
                    <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                      <tr>
                        <th className="px-4 py-3 font-medium w-12 text-center">#</th>
                        <th className="px-4 py-3 font-medium">Expéditeur</th>
                        <th className="px-4 py-3 font-medium">Destinataire</th>
                        <th className="px-4 py-3 font-medium">Statut</th>
                        {/* <th className="px-4 py-3 font-medium max-w-[250px]">Observation</th> */}
                        <th className="px-4 py-3 font-medium">Numero Expediteur</th>
                        <th className="px-4 py-3 font-medium">Numero Destinataire</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium w-10"></th>
                      </tr>
                    </thead>

                    {/* Corps du tableau */}
                    <tbody className="divide-y divide-border">
                      {messages.map((message, index) => {
                        const accessible = isMessageVisible(message)
                        const isRead = !!message.isReadAt

                        return (
                          <tr
                            key={message.id}
                            onClick={() => accessible && onSelect(message)}
                            className={cn(
                              'group transition-colors relative',
                              accessible ? 'cursor-pointer hover:bg-muted/50' : 'opacity-50 cursor-not-allowed grayscale-[0.5]',
                              !isRead ? 'bg-primary/[0.03]' : 'bg-transparent'
                            )}
                          >
                            {/* 1. Index & Indicateur Non Lu */}
                            <td className="px-4 py-3 relative text-center">
                              {!isRead && (
                                <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />
                              )}
                              <div className={cn(
                                'inline-flex w-6 h-6 rounded-full items-center justify-center text-[10px] font-bold',
                                isRead ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-primary/15 text-primary'
                              )}>
                                {index + 1}
                              </div>
                            </td>

                            {/* 2. Expéditeur */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={cn('text-sm', !isRead ? 'font-bold text-foreground' : 'font-medium text-foreground/80')}>
                                {message.expediteur.nom} {message.expediteur.prenom}
                              </span>
                            </td>

                            {/* 3. Destinataire */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={cn('text-sm', !isRead ? 'font-bold text-primary' : 'font-medium text-primary/80')}>
                                {message.destinataire.nom} {message.destinataire.prenom}
                              </span>
                            </td>

                            {/* 4. Statut */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              {isRead ? (
                                <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-medium">
                                  <CheckCircle2 className="w-3 h-3 mr-1" /> Lu
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border-primary/20 font-medium">
                                  Non lu
                                </Badge>
                              )}
                            </td>

                            {/* 5. Observation / Commentaire */}
                            {/* <td className="px-4 py-3 max-w-[200px] sm:max-w-[250px] truncate">
                              {accessible ? (
                                <span className={cn('text-sm truncate block', !isRead ? 'text-foreground/90 font-medium' : 'text-muted-foreground')}>
                                  {message.observation || <span className="italic opacity-70">Aucun commentaire</span>}
                                </span>
                              ) : (
                                <div className="flex items-center gap-1.5 text-muted-foreground/60">
                                  <Lock className="w-3 h-3" />
                                  <span className="text-xs font-medium italic">Confidentiel</span>
                                </div>
                              )}
                            </td> */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              {message.numeroExpediteur}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {message.numeroDestinataire}
                            </td>

                            {/* 6. Date */}
                            <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground tabular-nums">
                              {formatDateTime(message.createdAt)}
                            </td>

                            {/* 7. Action */}
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              {accessible && (
                                <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all inline-block" />
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                    
                  </table>
                </div>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}