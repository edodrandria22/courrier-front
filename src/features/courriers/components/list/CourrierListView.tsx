'use client'

import { useState } from 'react'
import { 
  Inbox, AlertCircle, Clock, CheckCircle2, Archive, Search, X, 
  User, Hash, FileText, Eye, MoreVertical, Lock, 
  ArrowUpRight, ArrowDownLeft // <-- Nouvelles icônes ajoutées
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Courrier } from '../../types/courrier'
import { formatDateTime } from '@/hooks/utils'
import { generateCourrierPDF } from '../../utils/generateCourrierPDF'

interface Props {
  courriers: Courrier[]
  loading: boolean
  error: string | null
  onSelect: (courrier: Courrier) => void
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

export const CourrierListView = ({ courriers, loading, error, onSelect}: Props) => {
  const [query, setQuery] = useState('')
  const [searchField, setSearchField] = useState<SearchField>('nom')

  const activeField = SEARCH_FIELDS.find(f => f.value === searchField)!

  const filtered = query.trim()
    ? courriers.filter((c) => {
        const q = query.toLowerCase()
        if (searchField === 'nom')
          return (c.nom || '').toLowerCase().includes(q) || (c.prenom || '').toLowerCase().includes(q)
        if (searchField === 'reference')
          return (c.reference || '').toLowerCase().includes(q)
        if (searchField === 'description')
          return (c.description || '').toLowerCase().includes(q) || (c.object || '').toLowerCase().includes(q)
        return false
      })
    : courriers

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
        <div className="flex flex-wrap gap-2 px-1">
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

              return (
                <div
                  key={courrier.id}
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
                  <div className="flex-none flex items-center justify-center w-8 mr-2">
                    <StatutIcon 
                      className={cn("w-4 h-4", courrier.cloturePar ? "text-emerald-500" : "text-muted-foreground/40")} 
                      title={statut.label}
                    />
                  </div>

                  {/* Expéditeur / Destinataire AVEC Indicateur Envoyé/Reçu */}
                  <div className={cn(
                      "flex-none w-32 md:w-48 pr-4 text-sm flex items-center gap-1.5",
                      isLu ? "text-foreground/70 font-normal" : "text-foreground font-bold"
                    )}>
                      {isSend ? (
                          <>
                            {/* Enveloppe span ajoutée pour le titre "Envoyé" */}
                            <span title="Envoyé" className="flex shrink-0">
                              <ArrowUpRight className="w-4 h-4 text-blue-500" />
                            </span>
                            <span className="truncate" title={`À: ${courrier.destinataire?.nom} ${courrier.destinataire?.prenom}`}>
                              <span className="text-muted-foreground font-normal mr-1">À:</span>
                              {courrier.destinataire?.nom} {courrier.destinataire?.prenom}
                            </span>
                          </>
                        ) : (
                          <>
                            {/* Enveloppe span ajoutée pour le titre "Reçu" */}
                            <span title="Reçu" className="flex shrink-0">
                              <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
                            </span>
                            <span className="truncate" title={`De: ${courrier.expediteur?.nom} ${courrier.expediteur?.prenom}`}>
                              <span className="text-muted-foreground font-normal mr-1">De:</span>
                              {courrier.expediteur?.nom} {courrier.expediteur?.prenom}
                            </span>
                          </>
                        )}
                    </div>

                  {/* Objet + Badges + Aperçu */}
                  <div className="flex-1 min-w-0 flex items-center pr-4">
                    <div className="truncate text-sm flex items-center gap-2 w-full">
                      
                      {/* Icône de cadenas si confidentiel */}
                      {isConfidentiel && (
                        <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      )}

                      <span className={cn(
                        "truncate shrink-0 max-w-[50%]",
                        isConfidentiel && "text-amber-600 font-semibold"
                      )}>
                        {courrier.object}
                      </span>
                      
                      {/* Badge de Référence */}
                      <Badge variant="secondary" className={cn('text-[10px] px-1.5 py-0 h-4 shrink-0 font-normal', statut.className)}>
                        {courrier.reference}
                      </Badge>

                      {/* Gestion de l'aperçu de la description */}
                      {isConfidentiel ? (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 shrink-0 font-normal border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
                          Confidentiel
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground font-normal truncate text-sm">
                          <span className="mx-1">-</span>
                          {courrier.description || "Aucune description supplémentaire..."}
                        </span>
                      )}
                      
                    </div>
                  </div>

                  {/* Date ET Actions au survol */}
                  <div className="flex-none w-24 flex items-center justify-end relative h-8">
                    {/* Date */}
                    <span className={cn(
                      "text-xs absolute right-0 group-hover:opacity-0 transition-opacity",
                      isLu ? "font-normal text-muted-foreground" : "font-bold text-foreground"
                    )}>
                      {formatDateTime(courrier.dateMessage || new Date().toISOString())}
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={(e) => { e.stopPropagation() }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
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