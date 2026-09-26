// app/actions/courrierActions.ts
'use server'
import { logger } from '@/lib/logger'
import { Entites, Employeur } from '@/features/courriers/types/courrier'
export interface Role {
    id: string;
    name: string;
}
const BASE_URL = process.env.NEXT_PUBLIC_API_URL // ex: 'https://votre-domaine.com'

export const getAllEntites = async (): Promise<Entites[]> => {
  try {
      const res = await fetch(`${BASE_URL}/api/entites`, {
      cache: 'force-cache',
      next: { tags: ['liste-entites'] }
    })

    if (!res.ok) {
      const json = await res.json()
      throw new Error(json.error ?? json.message ?? 'Erreur lors de la récupération des entités')
    }

    const json = await res.json()
    return json.data
  } catch (error) {
    logger.exception('courrierActions.getAllEntites - Exception', error)
    throw error
  }
}

export const getAllEmployeurs = async (): Promise<Employeur[]> => {
  try {
    const res = await fetch(`${BASE_URL}/api/employeurs`, {
      cache: 'force-cache',
      next: { tags: ['liste-employeurs'] }
    })

    if (!res.ok) {
      const json = await res.json()
      throw new Error(json.error ?? json.message ?? 'Erreur lors de la récupération des employeurs')
    }

    const json = await res.json()
    return json.data
  } catch (error) {
    logger.exception('courrierActions.getAllEmployeurs - Exception', error)
    throw error
  }
}
export const getAllRole = async (): Promise<Role[]> => {
  try {
    const res = await fetch(`${BASE_URL}/api/roles`, {
      cache: 'force-cache',
      next: { tags: ['liste-employeurs'] }
    })

    if (!res.ok) {
      const json = await res.json()
      throw new Error(json.error ?? json.message ?? 'Erreur lors de la récupération des employeurs')
    }

    const json = await res.json()
    return json.data
  } catch (error) {
    logger.exception('courrierActions.getAllRole - Exception', error)
    throw error
  }
}