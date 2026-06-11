import { useState } from 'react'
import { LoginCredentials } from '../types/login'
import { authService } from '../services/authService'
import { useRouter } from 'next/navigation'
export const useLogin = () => {

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const performLogin = async (credentials: LoginCredentials) => {
    setError('')
    setLoading(true)

    try {
      // 1. Se connecter
      const user = await authService.login(credentials)
      
      // 2. Attendre un peu pour que le cookie soit bien défini
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // 3. Vérifier l'authentification côté serveur
      const authCheck = await authService.checkServerAuth()
      
      if (!authCheck) {
        throw new Error('Erreur d\'authentification serveur')
      }
      
      // 4. Rediriger avec window.location.href pour forcer le rechargement complet
      // Cela garantit que le middleware voit les cookies correctement
      if (user.role === 'Admin') {
        router.push('/message/courrier/recherche')
      } else {
        router.push('/message/courrier/receive')
      }
      
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