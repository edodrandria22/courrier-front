'use client'

import { useState } from 'react'
// Ajout de l'icône 'Eye' à la place ou en plus de 'Download'
import { Inbox, AlertCircle, ArrowRight, Clock, CheckCircle2, Archive, Search, X, User, Hash, FileText, Eye } from 'lucide-react'
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
  { value: 'nom',         label: 'Nom',       icon: User,     placeholder: 'Rechercher par nom ou prenom...' },
  { value: 'reference',   label: 'Reference', icon: Hash,     placeholder: 'Ex: ESPA-2026-001' },
  { value: 'description', label: 'Description', icon: FileText, placeholder: 'Rechercher dans la description...' },
]

const STATUT_CONFIG: Record<any, { label: string; icon: React.ElementType; className: string }> = {
  en_cours:  { label: 'En cours',  icon: Clock,        className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  finalise:  { label: 'Finalise',  icon: CheckCircle2, className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  archive:   { label: 'Archive',   icon: Archive,      className: 'bg-muted/30 text-muted-foreground border-border' },
}

export const CourrierListView = ({ courriers, loading, error, onSelect }: Props) => {
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
    <div className="flex flex-col h-full">
      {/* Header titre + compteur */}
      <div className="px-4 md:px-6 py-3 border-b border-border flex items-center justify-between bg-muted/10">
        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
          Courriers
        </span>
        {!loading && !error && (
          <span className="text-[11px] font-mono text-muted-foreground/60 tabular-nums">
            {filtered.length > 0 ? `${filtered.length} résultat${filtered.length > 1 ? 's' : ''}` : ''}
          </span>
        )}
      </div>

      {/* Barre de recherche + selecteur de champ */}
      <div className="px-3 md:px-4 py-3 border-b border-border space-y-2">
        {/* Boutons de selection du champ */}
        <div className="flex flex-wrap gap-1">
          {SEARCH_FIELDS.map((field) => {
            const Icon = field.icon
            return (
              <button
                key={field.value}
                onClick={() => { setSearchField(field.value); setQuery('') }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-colors',
                  searchField === field.value
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'text-muted-foreground/60 hover:text-muted-foreground hover:bg-accent/10 border border-transparent'
                )}
              >
                <Icon className="w-3 h-3" />
                {field.label}
              </button>
            )
          })}
        </div>

        {/* Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
          <Input
            placeholder={activeField.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-9 h-9 bg-muted/20 border-border text-foreground/80 placeholder:text-muted-foreground/50 focus-visible:ring-ring/40 rounded-xl text-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Corps */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-4 md:p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card px-4 py-3 flex items-start gap-3">
                <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-24 rounded" />
                      <Skeleton className="h-4 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-14 rounded" />
                  </div>
                  <Skeleton className="h-3.5 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/3 rounded" />
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

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="bg-primary/5 p-6 rounded-full mb-4 border border-primary/10">
              <Inbox className="w-12 h-12 text-primary/30" />
            </div>
            <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-widest">
              {query ? 'Aucun resultat' : 'Registre vide'}
            </h3>
            <p className="text-muted-foreground/70 text-xs text-center max-w-[200px] mt-1 font-medium">
              {query
                ? `Aucun courrier ne correspond a "${query}"`
                : 'Aucun courrier ne vous concerne pour le moment.'}
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="p-4 md:p-6 space-y-3">
            {filtered.map((courrier) => {
              const statut = STATUT_CONFIG[courrier.cloturePar ? 'finalise' : 'en_cours']
              const StatutIcon = statut.icon
              const isFinalise = !!courrier.cloturePar

              return (
                <div
                  key={courrier.id}
                  className={cn(
                    'w-full text-left rounded-xl border transition-all duration-200 group relative overflow-hidden',
                    'bg-card border-border hover:border-border/80 hover:shadow-sm'
                  )}
                >
                  <span className={cn(
                    'absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl',
                    isFinalise ? 'bg-emerald-500' : 'bg-amber-400'
                  )} />

                  <div className="px-4 py-3 flex items-start gap-3">
                    <div className={cn(
                      'shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 border',
                      isFinalise
                        ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/25'
                        : 'bg-amber-400/15 text-amber-500 border-amber-400/25'
                    )}>
                      <StatutIcon className="w-3.5 h-3.5" />
                    </div>

                    <button
                      className="flex-1 min-w-0 text-left cursor-pointer"
                      onClick={() => onSelect(courrier)}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs font-mono text-primary/70 truncate min-w-0"> Ref : {courrier.reference}</span>
                          {courrier.numero && (
                            <span className="text-xs font-mono text-primary/70 truncate min-w-0"> Numéro : {courrier.numero}</span>
                          )}
                          <Badge variant="outline" className={cn('text-[9px] px-1.5 py-0 h-4 shrink-0', statut.className)}>
                            <StatutIcon className="w-2.5 h-2.5 mr-0.5" />
                            {statut.label}
                          </Badge>
                        </div>
                        <span className="text-[10px] text-muted-foreground/60 shrink-0 tabular-nums">
                          {formatDateTime(courrier.createdAt || new Date().toISOString())}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-foreground truncate">{courrier.object}</p>

                      <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">
                        {courrier.nom} {courrier.prenom}
                      </p>
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                      <Button
                        variant="outline"
                        size="icon"
                        title="Afficher le PDF" // <-- Changé ici
                        className="h-7 w-7 text-muted-foreground border-border hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-colors"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          // J'ai ajouté le paramètre 'view' pour indiquer à votre utilitaire de l'afficher
                          generateCourrierPDF(courrier, 'view') 
                        }}
                      >
                        <Eye className="w-3.5 h-3.5" /> {/* <-- Changé de Download à Eye */}
                      </Button>
                      <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary/50 group-hover:translate-x-0.5 transition-all" />
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