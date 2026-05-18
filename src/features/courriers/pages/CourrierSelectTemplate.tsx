'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCourrier } from '../hooks/useCourrier'
import { Courrier } from '../types/courrier'
import { CourrierListView } from '../components/list/CourrierListView'

export const CourrierSelectTemplate = () => {
  const router = useRouter()
  const { courriers, loading, error, fetchCourriers } = useCourrier()

  useEffect(() => {
    fetchCourriers()
  }, [fetchCourriers])

  const handleSelectCourrier = (courrier: Courrier) => {
    const params = new URLSearchParams({
      courrierId: String(courrier.id),
      reference: courrier.reference || '',
      objet: courrier.object || '',
    })
    router.push(`/message/compose?${params.toString()}`)
  }

  return (
    <CourrierListView
      courriers={courriers}
      loading={loading}
      error={error}
      onSelect={handleSelectCourrier}
    />
  )
}
