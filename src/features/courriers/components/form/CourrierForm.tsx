'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Send, X, User } from 'lucide-react'
import Link from 'next/link'
import { useCourrier } from '../../hooks/useCourrier'
import { Courrier } from '../../types/courrier'

export const CourrierForm = () => {
  const router = useRouter()
  const { createCourrier, loading, error } = useCourrier()

  const [formData, setFormData] = useState({
    email: '',
    object: '',
    description: '',
    nom: '',
    prenom: '',
    telephone: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }


  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const courrierData: Courrier = formData

    const result = await createCourrier(courrierData)

    if (result.success) {
      router.push('/message/courrier/select')
    }
  }

  return (
    <Card className="max-w-3xl mx-auto border-border bg-card shadow-none md:border md:shadow-sm">
      <form onSubmit={handleFormSubmit} className="p-6 space-y-6">

        <div className="border-b border-border pb-4">
          <h2 className="text-lg font-bold text-foreground">Nouveau Courrier</h2>
          <p className="text-sm text-muted-foreground">Enregistrement d'un nouveau courrier entrant.</p>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 flex items-center gap-2">
            <X className="w-4 h-4" /> {error}
          </div>
        )}

        {/* Section Identité */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <User className="w-3 h-3" /> Nom
            </label>
            <Input
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              // required
              placeholder="Nom du correspondant"
              className="bg-background/50 border-border"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Prénom</label>
            <Input
              name="prenom"
              value={formData.prenom}
              onChange={handleInputChange}
              placeholder="Prénom (optionnel)"
              className="bg-background/50 border-border"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Téléphone</label>
            <Input
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              placeholder="Téléphone (optionnel)"
              className="bg-background/50 border-border"
              disabled={loading}
            />
          </div>
        </div>

        {/* Email & Objet */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              // required
              placeholder="adresse@mail.com"
              className="bg-background/50 border-border"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Object</label>
            <Input
              name="object"
              value={formData.object}
              onChange={handleInputChange}
              required
              placeholder="Objet du courrier"
              className="bg-background/50 border-border"
              disabled={loading}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Description</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            // required
            rows={5}
            placeholder="Détails du courrier..."
            className="resize-none bg-background/50 border-border"
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
          <Link href="/message/courrier/receive">
            <button
              type="button"
              disabled={loading}
              style={{
                backgroundColor: 'transparent',
                color: '#374151',
                borderColor: '#d1d5db',
                borderWidth: '1px',
                borderStyle: 'solid',
                padding: '8px 16px',
                borderRadius: '6px',
                fontWeight: '500',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? '0.5' : '1',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#f9fafb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              Annuler
            </button>
          </Link>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderColor: '#2563eb',
              borderWidth: '1px',
              borderStyle: 'solid',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? '0.5' : '1',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#1d4ed8'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb'
            }}
          >
            {loading ? 'Traitement...' : <span className="flex items-center gap-2"><Send className="w-4 h-4" /> Créer le courrier</span>}
          </button>
        </div>
      </form>
    </Card>
  )
}
