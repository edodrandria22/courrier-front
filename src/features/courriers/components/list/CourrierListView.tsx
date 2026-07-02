'use client'

import { useState } from 'react'
import { 
  Inbox, AlertCircle, Clock, CheckCircle2, Archive, Search, X, 
  User, Hash, FileText, Eye, MoreVertical, Lock, 
  ArrowUpRight, ArrowDownLeft, Pencil, 
  CheckSquare,
  Square
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Courrier } from '../../types/courrier'
import { formatDateTime } from '@/hooks/utils'
import { generateCourrierPDF } from '../../utils/generateCourrierPDF'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  courriers: Courrier[]
  loading: boolean
  error: string | null
  onSelect: (courrier: Courrier) => void,
  onEdit?: (courrier: Courrier) => void
  isUpdate?: boolean,
  isReadAt?: boolean | null
  setIsReadAt?: (isReadAt: boolean | null) => void,
  setHasMoreCourriers?: (hasMore: boolean) => void
}

type SearchField = 'nom' | 'reference' | 'description'

const SEARCH_FIELDS: { value: SearchField; label: string; icon: React.ElementType; placeholder: string }[] = [
  { value: 'nom',         label: 'Nom',       icon: User,     placeholder: 'Rechercher par nom ou prénom...' },
  { value: 'reference',   label: 'Référence', icon: Hash,     placeholder: 'Ex: ESPA-2026-001' },
  { value: 'description', label: 'Contenu',   icon: FileText, placeholder: 'Rechercher dans l\'objet ou description...' },
]

const STATUT_CONFIG: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  en_cours:  { label: 'En cours',  icon: Clock,        className: 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 border-transparent' },
  finalise:  { label: 'Finalisé',  icon: CheckCircle2, className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border-transparent' },
  archive:   { label: 'Archivé',   icon: Archive,      className: 'bg-gray-100 text-gray-800 dark:bg-muted/30 dark:text-muted-foreground border-transparent' },
}

export const CourrierListView = ({ courriers, loading, error, onSelect,  onEdit, isUpdate = false, isReadAt, setIsReadAt, setHasMoreCourriers}: Props) => {
  const [query, setQuery] = useState('')
  const [searchField, setSearchField] = useState<SearchField>('nom')

  const activeField = SEARCH_FIELDS.find(f => f.value === searchField)!
  
  const filtered = query.trim()
  ? courriers.filter((c) => {
      const q = query.toLowerCase();

      if (searchField === 'nom') {
        // On vérifie si au moins une personne dans le tableau correspond à la recherche
        return c.detailPersonnes?.some((personne) => {
          const nom = personne.name || '';
          const prenom = personne.prenom || '';
          // On combine les deux pour permettre une recherche sur le nom complet
          const nomComplet = `${nom} ${prenom}`.toLowerCase();
          
          return nomComplet.includes(q);
        });
      }

      if (searchField === 'reference') {
        return (c.reference || '').toLowerCase().includes(q);
      }

      if (searchField === 'description') {
        return (
          (c.description || '').toLowerCase().includes(q) ||
          (c.object || '').toLowerCase().includes(q)
        );
      }

      return false;
    })
  : courriers;
  

  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      
      {/* HEADER TYPE GMAIL (Barre de recherche intégrée en haut) */}
      <div className="p-2 md:p-4 border-b border-border bg-background flex flex-col gap-3">
        <div className="relative max-w-3xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            placeholder={activeField.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 py-6 w-full bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-background focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary shadow-sm rounded-full text-base transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Puces de filtrage (Chips) type Gmail */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex flex-wrap gap-2">
            {SEARCH_FIELDS.map((field) => {
              const Icon = field.icon
              const isActive = searchField === field.value
              return (
                <button
                  key={field.value}
                  onClick={() => { setSearchField(field.value); setQuery('') }}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                    isActive
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-background text-muted-foreground border-border hover:bg-muted/50'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {field.label}
                </button>
              )
            })}
          </div>

          {/* SÉLECTEUR TRI-STATE POUR ISREADAT (null, true, false) */}
          {setIsReadAt !== undefined && (
            <div className="flex items-center gap-1 border border-border rounded-lg p-0.5 bg-muted/20 sm:ml-auto">
              <button
                type="button"
                onClick={() => { setIsReadAt(null); setHasMoreCourriers?.(true); }}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                  isReadAt === null
                    ? "bg-background text-foreground shadow-sm border border-border/50"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Tous
              </button>
              <button
                type="button"
                onClick={() => { setIsReadAt(true); setHasMoreCourriers?.(true); }}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5",
                  isReadAt === true
                    ? "bg-background text-primary shadow-sm border border-border/50"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                Lus
              </button>
              <button
                type="button"
                onClick={() => { setIsReadAt(false); setHasMoreCourriers?.(true); }}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5",
                  isReadAt === false
                    ? "bg-background text-foreground font-semibold shadow-sm border border-border/50"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Square className="w-3.5 h-3.5" />
                Non lus
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Barre d'outils secondaire (Nombre de résultats) */}
      <div className="px-4 py-2 border-b border-border flex items-center justify-between bg-background">
        {!loading && !error && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {filtered.length > 0 ? `${filtered.length} courrier(s)` : '0 courrier'}
          </span>
        )}
      </div>

      {/* LISTE DES COURRIERS */}
      <div className="flex-1 overflow-y-auto bg-background">
        {loading && (
          <div className="flex flex-col">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-border">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-32 md:w-48" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-16" />
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

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-20">
            <Inbox className="w-16 h-16 text-muted-foreground/20 mb-4" />
            <h3 className="text-base font-medium text-foreground">
              {query ? 'Aucun courrier trouvé' : 'Votre boîte est vide'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
              {query 
                ? `Essayez de modifier vos critères de recherche pour "${query}".` 
                : 'Les nouveaux courriers apparaîtront ici.'}
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="flex flex-col">
            {filtered.map((courrier) => {
              const statut = STATUT_CONFIG[courrier.cloturePar ? 'finalise' : 'en_cours']
              const StatutIcon = statut.icon
              const isLu = !!courrier.isReadAt
              const isSend = courrier.isSend ?? false
              const isConfidentiel = courrier.isConfidentiel
              const cible = isSend ? courrier.destinataire : courrier.expediteur;
              // On génère le nom complet proprement sans risquer d'afficher "undefined"
              const nomComplet = cible ? `${cible.nom || ''} ${cible.prenom || ''}`.trim() : "";

              return (
                <div
                  key={courrier.historiqueId||courrier.id}
                  onClick={() => onSelect(courrier)}
                  className={cn(
                    'group flex items-center px-4 py-2.5 border-b border-border cursor-pointer transition-all',
                    'hover:shadow-[inset_1px_0_0_#dadce0,inset_-1px_0_0_#dadce0,0_1px_2px_0_rgba(60,64,67,.3),0_1px_3px_1px_rgba(60,64,67,.1)] hover:z-10',
                    isLu 
                      ? 'bg-slate-50 text-muted-foreground dark:bg-muted/30 hover:bg-slate-100/80 dark:hover:bg-muted/40' 
                      : 'bg-white text-foreground font-semibold dark:bg-background hover:bg-slate-50 dark:hover:bg-muted/10'
                  )}
                >
                  {/* Marqueur de statut */}
              {/* Le parent passe en colonne sur mobile (items-start) et en ligne sur grand écran (sm:flex-row sm:items-center) */}
                  <div className="flex flex-col items-start sm:flex-row sm:items-center w-full min-w-0 gap-3 sm:gap-4">

                      {/* Statut */}
                      <div className="flex-none flex items-center justify-start sm:justify-center w-8">
                        <StatutIcon
                          className={cn(
                            "w-4 h-4",
                            courrier.cloturePar
                              ? "text-emerald-500"
                              : "text-muted-foreground/40"
                          )}
                          title={statut.label}
                        />
                      </div>

                      {/* Expéditeur / Destinataire (w-full sur mobile, w-52 sur grand écran) */}
                      {cible && nomComplet && (
                        <div className="flex-none w-full sm:w-52 min-w-0">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="truncate cursor-pointer">
                                  <span className="text-muted-foreground mr-1">
                                    {isSend ? "À :" : "De :"}
                                  </span>

                                  <span
                                    className={cn(
                                      isLu
                                        ? "font-normal text-foreground/80"
                                        : "font-semibold text-foreground"
                                    )}
                                  >
                                    {nomComplet}
                                  </span>
                                </div>
                              </TooltipTrigger>

                              <TooltipContent className="max-w-xs">
                                <div className="space-y-1">
                                  <p className="font-semibold">
                                    {isSend ? "Destinataire" : "Expéditeur"}
                                  </p>

                                  <p>{nomComplet}</p>

                                  {/* L'email ne s'affiche QUE s'il existe et n'est pas undefined */}
                                  {cible.email && (
                                    <p className="text-muted-foreground">
                                      {cible.email}
                                    </p>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}

                      {/* Objet + Aperçu (w-full sur mobile pour occuper tout l'espace textuel disponible, et flex-wrap pour éviter que le texte disparaisse) */}
                      <div className="flex-1 w-full min-w-0 flex flex-wrap items-center gap-2">

                        {isConfidentiel && (
                          <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        )}

                        <span
                          className={cn(
                            "truncate shrink-0",
                            isConfidentiel
                              ? "text-amber-600 font-semibold"
                              : isLu
                              ? "font-normal"
                              : "font-semibold"
                          )}
                        >
                          {courrier.object}
                        </span>

                        {/* <span className="text-muted-foreground shrink-0">
                          —
                        </span> */}

                        {/* {isConfidentiel ? (
                          <Badge
                            variant="outline"
                            className="shrink-0 border-amber-200 text-amber-700"
                          >
                            Confidentiel
                          </Badge>
                        ) : (
                          <span className="truncate text-muted-foreground">
                            {courrier.description ||
                              "Aucune description supplémentaire"}
                          </span>
                        )} */}
                      </div>

                      {/* Référence (S'aligne sagement à la fin ou en dessous) */}
                      <div className="flex-none">
                        <Badge
                          variant="secondary"
                          className="text-[10px]"
                        >
                          {courrier.reference}
                        </Badge>
                      </div>

                  </div>

                  {/* Date ET Actions au survol */}
                  <div className="flex-none w-24 flex items-center justify-end relative h-8">
                    {/* Date */}
                    <span className={cn(
                      "text-xs absolute right-0 group-hover:opacity-0 transition-opacity",
                      isLu ? "font-normal text-muted-foreground" : "font-bold text-foreground"
                    )}>
                      {formatDateTime(courrier.dateMessage ||courrier.createdAt || new Date().toISOString())}
                    </span>

                    {/* Actions au survol */}
                    <div className="absolute right-0 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Afficher le PDF"
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={(e) => { 
                          e.stopPropagation() 
                          generateCourrierPDF(courrier, 'view') 
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {isUpdate && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Modifier"
                          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEdit?.(courrier)
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}