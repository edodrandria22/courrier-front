'use client'

import { useState, useCallback } from 'react'
import { messageService } from '../services/messageService'

export const useTransferer = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const transferer = useCallback(
    async (messageId: number, destId: number, observation: string = '', bordureau: string = '' ,files: File[] = []) => {
      setLoading(true)
      setError(null)

      try {
        const formData = new FormData()
        formData.append('id', String(messageId))
        formData.append('destId', String(destId))

        if (observation.trim()) {
          formData.append('observation', observation)
        }
        if (bordureau.trim()) {
          formData.append('bordureau', bordureau)
        }
        

        files.forEach((file) => {
          formData.append('fichiers[]', file)
        })

        const result = await messageService.transfererMessage(formData);
        return result
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erreur lors du transfert'
        setError(errorMsg)
        throw err; // Laisser l'erreur se propager pour que TransfererDialog puisse la gérer
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { transferer, loading, error }
}
