'use client'

import { useState, useCallback } from 'react'
import { courrierService } from '../services/courrierService'

export const useCloturer = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cloturer = useCallback(async (courrierId: number) => {
    setLoading(true)
    setError(null)

    try {
      await courrierService.cloturerCourrier(courrierId)
      return { success: true }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la clôture'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [])

  return { cloturer, loading, error }
}
