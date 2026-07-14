'use client'

import { useState, useCallback } from 'react'
import { courrierService } from '../services/courrierService'
import { Statistique } from '../types/courrier';

export const useStatistique = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statistique, setStatistique] = useState<Statistique|null>(null);

  const getStatistique = useCallback(async (dateDebut: string, dateFin: string) => {
    setLoading(true)
    setError(null)

    try {
      const stat =  await courrierService.getStatistique(dateDebut, dateFin);
      setStatistique(stat);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la recuperation statistique'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }, []);
  
  

  return { statistique, loading, error,getStatistique}
}
