'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCourrier } from '../hooks/useCourrier'
import { Courrier } from '../types/courrier'
import { CourrierListView } from '../components/list/CourrierListView'
import { CourrierForm } from '../components/form/CourrierForm'

export const CourrierSelectTemplate = () => {
  const router = useRouter()
  const { courriers, loading, error, fetchCourriers } = useCourrier()

  const [courrierSelected, setCourrierSelected] = useState<Courrier | undefined>()
  const [openForm, setOpenForm] = useState(false)

  const [hasMoreCourriers, setHasMoreCourriers] = useState(true);
  const nbLimitCourrier = process.env.NEXT_PUBLIC_NB_LIMIT_COURRIERS ? parseInt(process.env.NEXT_PUBLIC_NB_LIMIT_COURRIERS) : 2;
  useEffect(() => {
    const initCourriers = async () => {
      const data = await fetchCourriers(undefined);
      if (data && data.length < nbLimitCourrier) setHasMoreCourriers(false);
    };
    initCourriers();
  }, [fetchCourriers]);
  const loadMoreCourriers = async () => {
    if (loading || !hasMoreCourriers) return;
    let lastDate = courriers[courriers.length - 1]?.createdAt;
    if (lastDate) {
      const newItems = await fetchCourriers(lastDate);
      if (!newItems || newItems.length < nbLimitCourrier) setHasMoreCourriers(false);
    }
  };

  const handleEdit = (courrier: Courrier) => {
    setCourrierSelected(courrier)
    setOpenForm(true)
  }
  const handleCloseForm = () => {
    setOpenForm(false)
    setCourrierSelected(undefined)
  }

  const handleSelectCourrier = (courrier: Courrier) => {
    // const params = new URLSearchParams({
    //   courrierId: String(courrier.id),
    //   reference: courrier.reference || '',
    //   objet: courrier.object || '',
    // })

    // router.push(`/message/compose?${params.toString()}`)
  }

  const handleSuccess = async () => {
    setOpenForm(false)
    setCourrierSelected(undefined)
    await fetchCourriers()
  }

  return openForm ? (
      <CourrierForm
        courrier={courrierSelected}
        onSuccess={handleSuccess}
        onClose={handleCloseForm}
      />
    ) : (
      <>
        <CourrierListView
          courriers={courriers}
          loading={loading && courriers.length === 0}
          error={error}
          onSelect={handleSelectCourrier}
          onEdit={handleEdit}
          isUpdate={true}
        />
        {hasMoreCourriers && courriers.length > 0 && (
          <div className="flex justify-center px-4 pb-4 pt-2">
            <button
              onClick={loadMoreCourriers}
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
              <span>{loading ? 'Chargement...' : 'Afficher plus de courriers'}</span>
            </button>
          </div>
        )}
      </>
    )
}
