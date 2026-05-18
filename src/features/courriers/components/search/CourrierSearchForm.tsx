'use client'

import { useState } from 'react'
import { CourrierSearchCriteria } from '../../types/recherche'
import { Button } from '@/components/ui/button'

interface CourrierSearchFormProps {
  onSearch: (criteria: CourrierSearchCriteria) => void
  loading?: boolean
}

export const CourrierSearchForm = ({ onSearch, loading = false }: CourrierSearchFormProps) => {
  const [criteria, setCriteria] = useState<CourrierSearchCriteria>({
    reference: '',
    object: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    utilisateurId: undefined,
    numero: undefined,
    dateDebut: '',
    dateFin: '',
    statut: undefined
  })

  const handleInputChange = (field: keyof CourrierSearchCriteria, value: string | number | boolean | undefined) => {
    setCriteria(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Filtrer les valeurs vides
    const filteredCriteria = Object.fromEntries(
      Object.entries(criteria).filter(([_, value]) => 
        value !== '' && value !== undefined && value !== null
      )
    ) as CourrierSearchCriteria
    
    onSearch(filteredCriteria)
  }

  const handleReset = () => {
    setCriteria({
      reference: '',
      object: '',
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      utilisateurId: undefined,
      numero: undefined,
      dateDebut: '',
      dateFin: '',
      statut: undefined
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-card rounded-lg border">
      <h2 className="text-lg font-semibold mb-4">Rechercher des courriers</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Référence */}
        <div>
          <label className="block text-sm font-medium mb-1">Référence</label>
          <input
            type="text"
            value={criteria.reference}
            onChange={(e) => handleInputChange('reference', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="REF2024"
          />
        </div>

        {/* Objet */}
        <div>
          <label className="block text-sm font-medium mb-1">Objet</label>
          <input
            type="text"
            value={criteria.object}
            onChange={(e) => handleInputChange('object', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="demande"
          />
        </div>

        {/* Nom */}
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            type="text"
            value={criteria.nom}
            onChange={(e) => handleInputChange('nom', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="MA"
          />
        </div>

        {/* Prénom */}
        <div>
          <label className="block text-sm font-medium mb-1">Prénom</label>
          <input
            type="text"
            value={criteria.prenom}
            onChange={(e) => handleInputChange('prenom', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Jean"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={criteria.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="test@mail.com"
          />
        </div>

        {/* Téléphone */}
        <div>
          <label className="block text-sm font-medium mb-1">Téléphone</label>
          <input
            type="tel"
            value={criteria.telephone}
            onChange={(e) => handleInputChange('telephone', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="0340000000"
          />
        </div>

        {/* Numéro */}
        <div>
          <label className="block text-sm font-medium mb-1">Numéro</label>
          <input
            type="number"
            value={criteria.numero || ''}
            onChange={(e) => handleInputChange('numero', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="10"
          />
        </div>

        {/* Date début */}
        <div>
          <label className="block text-sm font-medium mb-1">Date début</label>
          <input
            type="date"
            value={criteria.dateDebut}
            onChange={(e) => handleInputChange('dateDebut', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Date fin */}
        <div>
          <label className="block text-sm font-medium mb-1">Date fin</label>
          <input
            type="date"
            value={criteria.dateFin}
            onChange={(e) => handleInputChange('dateFin', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm font-medium mb-1">Statut</label>
          <select
            value={criteria.statut || ''}
            onChange={(e) => handleInputChange('statut', e.target.value || undefined)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tous</option>
            <option value="en_cours">En cours</option>
            <option value="finalise">Finalisé</option>
          </select>
        </div>

      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={loading}
          size="default"
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            borderColor: '#2563eb'
          }}
          className="
            hover:bg-blue-700 
            dark:hover:bg-blue-600
            shadow-sm
            hover:shadow-md
            transition-all
            duration-200
            border-2
            font-semibold
          "
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb'
          }}
        >
          {loading ? 'Recherche...' : 'Rechercher'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          size="default"
          style={{
            borderColor: '#9ca3af',
            color: '#1f2937'
          }}
          className="
            hover:bg-gray-100
            dark:hover:bg-gray-800
            font-medium
            transition-all
            duration-200
          "
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          Réinitialiser
        </Button>
      </div>
    </form>
  )
}
