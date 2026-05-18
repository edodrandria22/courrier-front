'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Courrier } from '../types/courrier'
import { CourrierSearchCriteria } from '../types/recherche'
import { CourrierSearchForm } from '../components/search/CourrierSearchForm'
import { CourrierListView } from '../components/list/CourrierListView'
import { CourrierTemplate } from './CourrierTemplate'
import { courrierService } from '../services/courrierService'

interface CourrierSearchTemplateProps {
  onCourrierSelect?: (courrier: Courrier) => void
}

export const CourrierSearchTemplate = ({ onCourrierSelect }: CourrierSearchTemplateProps) => {
  const [searchResults, setSearchResults] = useState<Courrier[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedCourrier, setSelectedCourrier] = useState<Courrier | null>(null)
  const [searchCriteria, setSearchCriteria] = useState<CourrierSearchCriteria | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const router = useRouter()
  const nbLimit = process.env.NEXT_PUBLIC_NB_LIMIT ? parseInt(process.env.NEXT_PUBLIC_NB_LIMIT) : 2;

  const handleSearch = async (criteria: CourrierSearchCriteria) => {
    setLoading(true)
    setError(null)
    setHasSearched(true)
    setSearchCriteria(criteria)
    setHasMore(true)

    try {
      const results = await courrierService.searchCourriers(criteria)
      setSearchResults(results)
      // Si moins de résultats que la limite, pas de "plus de résultats"
      if (results.length < nbLimit) {
        setHasMore(false)
      }
    } catch (err) {
      setError('Erreur lors de la recherche')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadMoreResults = async () => {
    if (loading || !hasMore || !searchCriteria) return
    
    setLoading(true)
    
    try {
      // Ajouter un curseur basé sur le dernier résultat
      const lastResult = searchResults[searchResults.length - 1]
      const dateCursor = lastResult?.createdAt
      
      const newResults = await courrierService.searchCourriers(searchCriteria, dateCursor)
      
      if (newResults.length === 0 || newResults.length < nbLimit) {
        setHasMore(false)
      }
      
      setSearchResults(prev => [...prev, ...newResults])
    } catch (err) {
      setError('Erreur lors du chargement des résultats supplémentaires')
      // console.error('Load more error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCourrierSelect = (courrier: Courrier) => {
    if (onCourrierSelect) {
      onCourrierSelect(courrier)
    } else {
      // Afficher la template avec les messages du courrier sélectionné
      setSelectedCourrier(courrier)
    }
  }

  // Si un courrier est sélectionné, afficher la template avec les messages
  if (selectedCourrier) {
    return (
      <div>
        <div
          onClick={() => setSelectedCourrier(null)}
          className="mb-6 inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-200 hover:bg-muted/50 rounded-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Retour à la recherche
        </div>
        <CourrierTemplate initialCourrier={selectedCourrier} isRecherche={true} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Formulaire de recherche */}
      <CourrierSearchForm onSearch={handleSearch} loading={loading} />

      {/* Résultats de recherche */}
      {hasSearched && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Résultats ({searchResults.length})
          </h3>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}

          {!loading && !error && searchResults.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Aucun courrier trouvé pour ces critères
            </div>
          )}

          {searchResults.length > 0 && (
            <>
              <CourrierListView
                courriers={searchResults}
                loading={loading}
                error={error}
                onSelect={handleCourrierSelect}
              />
              
              {/* Bouton "Afficher plus de résultats" */}
              {hasMore && (
                <div className="flex justify-center px-4 pb-4 pt-2">
                  <button
                    onClick={loadMoreResults}
                    disabled={loading}
                    className={[
                      'group relative w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 border',
                      loading
                        ? 'bg-muted text-muted-foreground border-border cursor-not-allowed'
                        : 'bg-card text-primary border-primary/30 hover:border-primary hover:bg-primary/5 hover:shadow-sm active:scale-95'
                    ].join(' ')}
                  >
                    {loading ? (
                      <svg className="animate-spin h-4 w-4 text-muted-foreground" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    <span>{loading ? 'Chargement...' : 'Afficher plus de résultats'}</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
