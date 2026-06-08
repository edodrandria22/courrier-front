'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Send, X, User, Lock } from 'lucide-react'
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
    telephone: '',
    isConfidentiel: false // 1. Ajout du champ booléen
  })

  // Gestionnaire classique pour les champs texte
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 2. Gestionnaire spécifique pour la case "Confidentiel"
  const handleConfidentialToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    setFormData((prev) => ({
      ...prev,
      isConfidentiel: isChecked,
      // Force l'objet à "Pli fermé" si coché, sinon vide (ou garde l'ancien)
      object: isChecked ? 'Pli fermé' : (prev.object === 'Pli fermé' ? '' : prev.object),
      // On vide les autres champs pour éviter d'envoyer des données cachées
      nom: isChecked ? '' : prev.nom,
      prenom: isChecked ? '' : prev.prenom,
      telephone: isChecked ? '' : prev.telephone,
      description: isChecked ? '' : prev.description,
    }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const courrierData: Courrier = formData
    const result = await createCourrier(courrierData)

    if (result.success) {
      router.push('/message/courrier/select')
    }
  }

  // Helper pour savoir si on doit bloquer un champ
  const isFieldDisabled = loading || formData.isConfidentiel;

  return (
    <Card className="max-w-3xl mx-auto border-border bg-card shadow-none md:border md:shadow-sm">
      <form onSubmit={handleFormSubmit} className="p-6 space-y-6">

        {/* En-tête avec Switch Confidentiel */}
        <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Nouveau Courrier</h2>
            <p className="text-sm text-muted-foreground">Enregistrement d'un nouveau courrier entrant.</p>
          </div>
          
          {/* 3. Checkbox Confidentiel */}
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
            <input 
              type="checkbox" 
              name="isConfidentiel"
              checked={formData.isConfidentiel}
              onChange={handleConfidentialToggle}
              disabled={loading}
              className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
            />
            <span className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
              <Lock className="w-4 h-4 text-amber-600" />
              Courrier Confidentiel
            </span>
          </label>
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
              placeholder="Nom du correspondant"
              className="bg-background/50 border-border disabled:opacity-50"
              disabled={isFieldDisabled}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Prénom</label>
            <Input
              name="prenom"
              value={formData.prenom}
              onChange={handleInputChange}
              placeholder="Prénom (optionnel)"
              className="bg-background/50 border-border disabled:opacity-50"
              disabled={isFieldDisabled}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Téléphone</label>
            <Input
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              placeholder="Téléphone (optionnel)"
              className="bg-background/50 border-border disabled:opacity-50"
              disabled={isFieldDisabled}
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
              placeholder="adresse@mail.com"
              className="bg-background/50 border-border"
              disabled={loading} // L'email reste toujours accessible (seul le loading le bloque)
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Objet</label>
            <Input
              name="object"
              value={formData.object}
              onChange={handleInputChange}
              required
              placeholder="Objet du courrier"
              className="bg-background/50 border-border disabled:opacity-50 disabled:font-semibold disabled:text-amber-600"
              disabled={isFieldDisabled} // Désactivé si confidentiel
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
            rows={5}
            placeholder="Détails du courrier..."
            className="resize-none bg-background/50 border-border disabled:opacity-50"
            disabled={isFieldDisabled}
          />
        </div>

        {/* Boutons d'actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
          <Link href="/message/courrier/receive">
            <button
              type="button"
              disabled={loading}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--secondary)',
                borderColor: 'var(--secondary)',
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
                if (!loading) {
                  e.currentTarget.style.backgroundColor = 'var(--secondary-light, rgba(0, 0, 0, 0.05))'
                  e.currentTarget.style.scale = '1.05'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.scale = '1'
              }}
            >
              Annuler
            </button>
          </Link>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              borderColor: 'var(--primary)',
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
              if (!loading) e.currentTarget.style.backgroundColor = 'var(--primary)'
              e.currentTarget.style.scale = '1.05'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary)'
              e.currentTarget.style.scale = '1'
            }}
          >
            {loading ? 'Traitement...' : <span className="flex items-center gap-2"><Send className="w-4 h-4" /> Créer le courrier</span>}
          </button>
        </div>
      </form>
    </Card>
  )
}