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

  useEffect(() => {
    fetchCourriers()
  }, [fetchCourriers])

  const handleEdit = (courrier: Courrier) => {
    setCourrierSelected(courrier)
    setOpenForm(true)
  }
  const handleCloseForm = () => {
    setOpenForm(false)
    setCourrierSelected(undefined)
  }

  const handleSelectCourrier = (courrier: Courrier) => {
    const params = new URLSearchParams({
      courrierId: String(courrier.id),
      reference: courrier.reference || '',
      objet: courrier.object || '',
    })

    router.push(`/message/compose?${params.toString()}`)
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
      <CourrierListView
        courriers={courriers}
        loading={loading}
        error={error}
        onSelect={handleSelectCourrier}
        onEdit={handleEdit}
        isUpdate={true}
      />
    )
}