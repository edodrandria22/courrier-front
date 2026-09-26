'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Entites } from '../types/courrier'
import { getAllEntites } from '@/features/config/services/constant' 
interface EntitesContextType {
  entites: Entites[]
  loading: boolean
  error: string | null
  reloadEntites: () => Promise<void>
}

const EntitesContext = createContext<EntitesContextType | undefined>(undefined)

export const useEntites = () => {
  const context = useContext(EntitesContext)
  if (context === undefined) {
    throw new Error('useEntites must be used within an EntitesProvider')
  }
  return context
}

interface EntitesProviderProps {
  children: ReactNode
}

export const EntitesProvider: React.FC<EntitesProviderProps> = ({ children }) => {
  const [entites, setEntites] = useState<Entites[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadEntites = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllEntites();
      const entitesArray = Array.isArray(data) ? data : []
      setEntites(entitesArray)
    } catch (err) {
      setError('Erreur lors du chargement des entités')
      console.error('Erreur chargement entités:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEntites()
  }, [])

  const value: EntitesContextType = {
    entites,
    loading,
    error,
    reloadEntites: loadEntites
  }

  return <EntitesContext.Provider value={value}>{children}</EntitesContext.Provider>
}
