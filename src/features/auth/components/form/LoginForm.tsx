'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useLogin } from '../../hooks/useLogin'

export const LoginForm = () => {
  const { performLogin, loading, error } = useLogin()
  const [credentials, setCredentials] = useState({
    email: 'admin@gmail.com',
    mdp: 'admin',
    rememberMe: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await performLogin(credentials)
  }

  return (
    /* Retour au style original : bg-card/50 + backdrop-blur */
    <Card className="border-border bg-card/50 backdrop-blur-sm shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">Connexion</CardTitle>
        <CardDescription className="text-muted-foreground">
          Accédez à votre messagerie universitaire
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-xs font-medium rounded-xl border border-destructive/20 animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Email Institutionnel
            </label>
            <Input
              type="email"
              placeholder="nom.prenom@espa-poly.mg"
              /* Retour au style original des inputs */
              className="h-12 bg-background/50 border-border focus:ring-primary/50 rounded-xl"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Mot de passe
              </label>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              className="h-12 bg-background/50 border-border focus:ring-primary/50 rounded-xl"
              value={credentials.mdp}
              onChange={(e) => setCredentials({ ...credentials, mdp: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={credentials.rememberMe}
                onChange={(e) => setCredentials({ ...credentials, rememberMe: e.target.checked })}
                className="w-4 h-4 border border-border rounded accent-primary"
              />
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              height: '48px',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: 'var(--primary)',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? '0.6' : '1',
              boxShadow: '0 10px 15px -3px rgba(30, 64, 175, 0.3), 0 4px 6px -2px rgba(30, 64, 175, 0.1)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = 'var(--secondary)'
                e.currentTarget.style.borderColor = 'var(--secondary)'
                e.currentTarget.style.transform = 'scale(0.98)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = 'var(--primary)'
                e.currentTarget.style.borderColor = 'var(--primary)'
                e.currentTarget.style.transform = 'scale(1)'
              }
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                Authentification...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        
      </CardContent>
    </Card>
  )
}
