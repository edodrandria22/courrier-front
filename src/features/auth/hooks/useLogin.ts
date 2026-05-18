import { useState } from 'react'
import { LoginCredentials } from '../types/login'
import { authService } from '../services/authService'

export const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const performLogin = async (credentials: LoginCredentials) => {
    setError('')
    setLoading(true)

    try {
      // 1. Se connecter
      await authService.login(credentials)
      
      // 2. Attendre un peu pour que le cookie soit bien défini
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // 3. Vérifier l'authentification côté serveur
      const authCheck = await authService.checkServerAuth()
      
      if (!authCheck) {
        throw new Error('Erreur d\'authentification serveur')
      }
      
      // 4. Rediriger avec window.location.href pour forcer le rechargement complet
      // Cela garantit que le middleware voit les cookies correctement
      window.location.href = '/message/courrier/receive'
      
      // Empêcher toute exécution ultérieure
      return
      
    } catch (err: any) {
      // console.error('Login error:', err)
      setError(err.message || 'Impossible de rejoindre le serveur')
    } finally {
      setLoading(false)
    }
  }

  return { performLogin, loading, error }
}