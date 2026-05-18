'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck, Loader2, UserPlus } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Erreur lors de l'inscription")
        return
      }

      router.push('/dashboard')
    } catch (err) {
      setError('Une erreur réseau est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        
        {/* Header avec Logo ESPA */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block group">
            <div className="relative w-16 h-16 mx-auto mb-4 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(var(--primary),0.2)] group-hover:shadow-primary/40 transition-all duration-300 border border-border">
              <Image 
                src="/espa-logo.png" 
                alt="Logo Espa Courier"
                fill
                className="object-cover"
                priority
              />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors italic uppercase">
              ESPA COURIER
            </h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <ShieldCheck className="w-3 h-3 text-primary" />
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Inscription Polytechnique</p>
            </div>
          </Link>
        </div>

        <Card className="border-border bg-card/50 backdrop-blur-sm shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Créer un compte</CardTitle>
            <CardDescription className="text-muted-foreground">
              Rejoignez la plateforme de courrier de Vontovorona
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-xs font-medium rounded-xl border border-destructive/20 animate-in fade-in zoom-in-95">
                  {error}
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Nom Complet
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Rakoto Jean"
                  className="h-11 bg-background/50 border-border focus:ring-primary/50 rounded-xl"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Email Institutionnel
                </label>
                <Input
                  type="email"
                  placeholder="nom@espa-poly.mg"
                  className="h-11 bg-background/50 border-border focus:ring-primary/50 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Mot de passe
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-11 bg-background/50 border-border focus:ring-primary/50 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Confirmation
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-11 bg-background/50 border-border focus:ring-primary/50 rounded-xl"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-2"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Création du profil...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    S'inscrire
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center border-t border-border/50 pt-6">
              <p className="text-sm text-muted-foreground">
                Déjà inscrit à l'ESPA ?{' '}
                <Link href="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-medium">
          &copy; 2026 Ecole Polytechnique Vontovorona
        </p>
      </div>
    </div>
  )
}