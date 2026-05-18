'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Mail, ArrowLeft, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface EmailItem {
  id: string
  subject: string
  preview: string
  senderName: string
  senderEmail: string
  createdAt: string
  isRead: boolean
  hasAttachments: boolean
}

// 1. On crée un composant interne qui utilise useSearchParams
function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<EmailItem[]>([])
  const [loading, setLoading] = useState(false)

  // Mettre à jour le champ de texte si l'URL change (ex: bouton retour)
  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    const performSearch = async () => {
      if (initialQuery.length < 2) {
        setResults([])
        return
      }
      
      setLoading(true)
      try {
        const response = await fetch(
          `/api/emails/search?q=${encodeURIComponent(initialQuery)}`
        )
        if (response.ok) {
          const data = await response.json()
          setResults(data)
        }
      } catch (error) {
        // console.error('Error searching:', error)
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [initialQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/dashboard/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Recherche</h1>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Rechercher des messages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-border"
          />
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Rechercher
          </Button>
        </form>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            <div className="text-muted-foreground">Recherche en cours...</div>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <Mail className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {initialQuery.length < 2
                ? 'Entrez au moins 2 caractères'
                : 'Aucun résultat trouvé'}
            </h3>
            <p className="text-muted-foreground text-center">
              {initialQuery.length < 2
                ? 'Commencez à taper pour rechercher vos messages'
                : `Aucun message ne correspond à "${initialQuery}"`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {results.map((email) => (
              <Link key={email.id} href={`/dashboard/email/${email.id}`}>
                <div className="px-6 py-4 hover:bg-muted/50 transition-colors cursor-pointer flex items-center gap-4">
                  <Avatar className="h-8 w-8 flex-shrink-0 bg-primary">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground font-semibold">
                      {email.senderName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-semibold text-foreground truncate">
                        {email.senderName}
                      </span>
                      {email.hasAttachments && (
                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                          📎
                        </span>
                      )}
                    </div>
                    <div className="truncate text-sm text-muted-foreground">
                      {email.subject}
                    </div>
                  </div>

                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatDistanceToNow(new Date(email.createdAt), {
                      locale: fr,
                      addSuffix: false,
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// 2. Le composant principal exporté enveloppe le tout dans Suspense
export default function SearchPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}