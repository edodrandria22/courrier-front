'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { courrierService } from '../services/courrierService'
import { Employeur } from '../types/courrier'
import { getAllEmployeurs } from '@/features/config/services/constant'

interface EmployeurContextType {
  Employeur: Employeur[]
  loading: boolean
  error: string | null
  reloadEmployeur: () => Promise<void>
}

const EmployeursContext = createContext<EmployeurContextType | undefined>(undefined)

export const useEmployeur = () => {
  const context = useContext(EmployeursContext)
  if (context === undefined) {
    throw new Error('useEmployeur must be used within an EmployeurProvider')
  }
  return context
}

interface EmployeurProviderProps {
  children: ReactNode
}

export const EmployeurProvider: React.FC<EmployeurProviderProps> = ({ children }) => {
  const [Employeur, setEmployeur] = useState<Employeur[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadEmployeur = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllEmployeurs();
      const EmployeurArray = Array.isArray(data) ? data : []
      setEmployeur(EmployeurArray)
    } catch (err) {
      setError('Erreur lors du chargement des entités')
      console.error('Erreur chargement entités:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      loadEmployeur()
  }, [])

  const value: EmployeurContextType = {
    Employeur,
    loading,
    error,
    reloadEmployeur: loadEmployeur
  }

  return <EmployeursContext.Provider value={value}>{children}</EmployeursContext.Provider>
}
