'use client'

import { useState, useCallback } from 'react'
import { Courrier } from '../types/courrier'
import { CourrierSearchCriteria } from '../types/recherche'
import { CourrierSearchForm } from '../components/search/CourrierSearchForm'
import { CourrierListView } from '../components/list/CourrierListView'
import { CourrierTemplate } from './CourrierTemplate'
import { courrierService } from '../services/courrierService'
import { toast } from 'sonner'
import { useMercureSubscription } from '@/hooks/useMercureSubscription'
import { User } from '@/features/auth/types/login'
import { Button } from '@/components/ui/button'
import { Search, ArrowLeft } from 'lucide-react'

interface CourrierSearchTemplateProps {
  onCourrierSelect?: (courrier: Courrier) => void
}

export const CourrierSearchTemplate = ({ onCourrierSelect }: CourrierSearchTemplateProps) => {
  const [searchResults, setSearchResults] = useState<Courrier[]>([])
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedCourrier, setSelectedCourrier] = useState<Courrier | null>(null)
  const [searchCriteria, setSearchCriteria] = useState<CourrierSearchCriteria | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [showForm, setShowForm] = useState(true)
  // Etape 1 = liste des courriers par référence unique (isRerchercheReferenceUnique=true)
  // Etape 2 = liste complète des courriers pour la référence sélectionnée (isRerchercheReferenceUnique=false)
  const [isReferenceUniqueView, setIsReferenceUniqueView] = useState(true)

  // On conserve l'état de l'étape 1 (référence unique) pour pouvoir y revenir sans refaire d'appel réseau
  const [referenceUniqueResults, setReferenceUniqueResults] = useState<Courrier[]>([])
  const [referenceUniqueCriteria, setReferenceUniqueCriteria] = useState<CourrierSearchCriteria | null>(null)
  const [referenceUniqueHasMore, setReferenceUniqueHasMore] = useState(true)

  const nbLimitCourrier = process.env.NEXT_PUBLIC_NB_LIMIT_COURRIERS ? parseInt(process.env.NEXT_PUBLIC_NB_LIMIT_COURRIERS) : 2;

  // Handler pour les mises à jour de lecture via Mercure
  const handleLecture = useCallback((data: { id: number; courrier: Courrier; isReadAt: string | null; numeroExpediteur: number; numeroDestinataire: number }) => {
    setSearchResults(prev => prev.map(m => Number(m.messageId) === data.id ? { ...m, isReadAt: data.isReadAt, numero: data.numeroDestinataire, numRef: data.numeroExpediteur } : m));
    setReferenceUniqueResults(prev => prev.map(m => Number(m.messageId) === data.id ? { ...m, isReadAt: data.isReadAt, numero: data.numeroDestinataire, numRef: data.numeroExpediteur } : m));
  }, []);
  

  // Handler pour les clôtures via Mercure
  const handleCloturer = useCallback((data: { id: number; cloturePar: User | null; dateValidation: string }) => {
    setSearchResults(prev => prev.map(m => m.id === data.id ? { ...m, cloturePar: data.cloturePar, dateValidation: data.dateValidation } : m));
    setReferenceUniqueResults(prev => prev.map(m => m.id === data.id ? { ...m, cloturePar: data.cloturePar, dateValidation: data.dateValidation } : m));    
  }, []);

  // Abonnement aux topics Mercure
  useMercureSubscription<{ id: number; courrier: Courrier; isReadAt: string | null; numeroExpediteur: number; numeroDestinataire: number }>('lectureMessage', handleLecture);
  useMercureSubscription<{ id: number; cloturePar: User | null; dateValidation: string }>('clotureCourrier', handleCloturer);

  const handleSearch = async (criteria: CourrierSearchCriteria) => {
    setLoading(true)
    setError(null)
    setHasSearched(true)
    setSearchCriteria(criteria)
    setHasMore(true)
    setIsReferenceUniqueView(true)

    try {
      const results = await courrierService.searchCourriersReference(criteria)
      setSearchResults(results)

      // On sauvegarde l'état de l'étape "référence unique" pour le bouton retour
      setReferenceUniqueResults(results)
      setReferenceUniqueCriteria(criteria)

      // Si moins de résultats que la limite, pas de "plus de résultats"
      const stillHasMore = results.length >= nbLimitCourrier
      setHasMore(stillHasMore)
      setReferenceUniqueHasMore(stillHasMore)

      // Masquer le formulaire après une recherche réussie
      setShowForm(false)
    } catch (err) {
      // setError('Erreur lors de la recherche')
      // console.error('Search error:', err)
      toast.error('Erreur lors de la recherche');
    } finally {
      setLoading(false)
    }
  }

    const loadMoreResults = async () => {
    if (loading || loadingMore || !hasMore || !searchCriteria) return
    
    setLoadingMore(true)
    
    try {
      // Ajouter un curseur basé sur le dernier résultat
      const lastResult = searchResults[searchResults.length - 1];
      const dateCursor = lastResult?.dateMessage
      
      const newResults = isReferenceUniqueView
        ? await courrierService.searchCourriersReference(searchCriteria, dateCursor)
        : await courrierService.searchCourriers(searchCriteria, dateCursor)

      // En vue "référence unique", on écarte les courriers dont la référence
      // est déjà présente dans la liste actuelle (évite les doublons de référence)
      const existingReferences = new Set(searchResults.map(c => c.reference))
      const filteredResults = isReferenceUniqueView
        ? newResults.filter(c => !existingReferences.has(c.reference))
        : newResults

      const stillHasMore = !(newResults.length === 0 || newResults.length < nbLimitCourrier)

      if (isReferenceUniqueView) {
        setReferenceUniqueResults(prev => [...prev, ...filteredResults])
        setReferenceUniqueHasMore(stillHasMore)
      }

      setHasMore(stillHasMore)
      setSearchResults(prev => [...prev, ...filteredResults])
    } catch (err) {
      // setError('Erreur lors du chargement des résultats supplémentaires')
      // console.error('Load more error:', err)
      toast.error('Erreur lors du chargement des résultats supplémentaires')
    } finally {
      setLoadingMore(false)
    }
  }

  const handleCourrierSelect = async (courrier: Courrier) => {
    // Etape 1 -> l'utilisateur clique sur un courrier de la liste "référence unique"
    // On relance une recherche complète filtrée sur cette référence
    if (isReferenceUniqueView) {
      const criteriaWithReference: CourrierSearchCriteria = {
        ...(searchCriteria || {}),
        reference: courrier.reference,
      }

      setLoading(true)
      setError(null)
      setHasMore(true)
      setSearchCriteria(criteriaWithReference)

      try {
        const results = await courrierService.searchCourriers(criteriaWithReference)
        setSearchResults(results)
        setHasMore(results.length >= nbLimitCourrier)
        setIsReferenceUniqueView(false)
      } catch (err) {
        toast.error('Erreur lors de la recherche');
      } finally {
        setLoading(false)
      }
      return
    }

    // Etape 2 -> sélection définitive du courrier
    if (onCourrierSelect) {
      onCourrierSelect(courrier)
    } else {
      // Afficher la template avec les messages du courrier sélectionné
      setSelectedCourrier(courrier)
    }
  }

  // Retour de l'étape "liste complète" vers l'étape "référence unique"
  const handleBackToReferenceUnique = () => {
    setSearchResults(referenceUniqueResults)
    setSearchCriteria(referenceUniqueCriteria)
    setHasMore(referenceUniqueHasMore)
    setIsReferenceUniqueView(true)
    setError(null)
  }
  
  const handleReset = () => {
    setSearchResults([])
    setHasSearched(false)
    setSearchCriteria(null)
    setHasMore(true)
    setIsReferenceUniqueView(true)
    setReferenceUniqueResults([])
    setReferenceUniqueCriteria(null)
    setReferenceUniqueHasMore(true)
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Formulaire de recherche */}
      {showForm && (
        <CourrierSearchForm 
          onSearch={handleSearch} 
          loading={loading} 
          reinitialiser={handleReset} 
          initialCriteria={searchCriteria}
          onCancel={() => setShowForm(false)}
          isListeVide={searchResults.length === 0}
        />
      )}

      {/* Résultats de recherche */}
      {!showForm && hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!isReferenceUniqueView && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToReferenceUnique}
                  title="Retour aux références"
                  className="h-8 w-8"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <h3 className="text-lg font-semibold">
                Résultats ({searchResults.length})
              </h3>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Modifier la recherche
            </Button>
          </div>

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
              <CourrierListView
                courriers={searchResults}
                loading={loading}
                error={error}
                onSelect={handleCourrierSelect}
                hasMoreCourriers={hasMore}
                onLoadMore={loadMoreResults}
                loadingMore={loadingMore}
                isRerchercheReferenceUnique={isReferenceUniqueView}
              />
          )}
        </div>
      )}
    </div>
  )
}