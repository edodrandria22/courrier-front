'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCourrier } from '../hooks/useCourrier'
import { Courrier } from '../types/courrier'
import { CourrierListView } from '../components/list/CourrierListView'
import { CourrierForm } from '../components/form/CourrierForm'
import { Search } from 'lucide-react'

export const CourrierSelectTemplate = () => {
  const router = useRouter()
  const { courriers, loading, error, fetchCourriers } = useCourrier()

  const [courrierSelected, setCourrierSelected] = useState<Courrier | undefined>()
  const [openForm, setOpenForm] = useState(false)

  const [hasMoreCourriers, setHasMoreCourriers] = useState(true);
  const nbLimitCourrier = process.env.NEXT_PUBLIC_NB_LIMIT_COURRIERS ? parseInt(process.env.NEXT_PUBLIC_NB_LIMIT_COURRIERS) : 2;
  const [reference, setReference] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  
  const handleSearch = () => {
    setReference(searchValue);
  };
  useEffect(() => {
    const initCourriers = async () => {
      const data = await fetchCourriers(reference || undefined);
      setHasMoreCourriers(true)
      if (data && data.length < nbLimitCourrier) setHasMoreCourriers(false);
    };
    initCourriers();
  }, [fetchCourriers, reference]);
  const loadMoreCourriers = async () => {
    if (loading || !hasMoreCourriers) return;
    let lastDate = courriers[courriers.length - 1]?.createdAt;
    if (lastDate) {
      const newItems = await fetchCourriers(reference || undefined, lastDate);
      setHasMoreCourriers(true);
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
      <div className="mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Rechercher par référence..."
              className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm hover:shadow-md"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
          >
            Rechercher
          </button>
        </div>
      </div>
        <CourrierListView
          courriers={courriers}
          loading={loading && courriers.length === 0}
          error={error}
          onSelect={handleSelectCourrier}
          onEdit={handleEdit}
          isUpdate={true}
          hasMoreCourriers={hasMoreCourriers}
          onLoadMore={loadMoreCourriers}
          loadingMore={loading}
        />
      </>
    )
}
