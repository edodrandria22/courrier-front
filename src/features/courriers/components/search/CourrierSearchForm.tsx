'use client'

import { useState } from 'react'
import { CourrierSearchCriteria } from '../../types/recherche'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  RotateCcw, 
  FileText, 
  User, 
  Hash, 
  Calendar, 
  SlidersHorizontal 
} from 'lucide-react'

interface CourrierSearchFormProps {
  onSearch: (criteria: CourrierSearchCriteria) => void
  loading?: boolean
  reinitialiser?: () => void,
  initialCriteria?: CourrierSearchCriteria | null // 👈 1. Ajouter la prop optionnelle
}


export const CourrierSearchForm = ({ onSearch, loading = false, reinitialiser,initialCriteria }: CourrierSearchFormProps) => {
  // 1. Définir les valeurs vides par défaut
const DEFAULT_CRITERIA: CourrierSearchCriteria = {
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
    statut: undefined,
    isConfidentiel: undefined,
    dateMessageDebut: '',
    dateMessageFin: '',
    dateReceptionDebut: '',
    dateReceptionFin: '',
    numeroExpediteur: undefined,
    numeroDestinataire: undefined
  }

  // 2. Fonction utilitaire pour assainir les critères reçus en props (remplace undefined par '')
  const sanitizeCriteria = (criteria?: CourrierSearchCriteria | null): CourrierSearchCriteria => ({
    reference: criteria?.reference ?? '',
    object: criteria?.object ?? '',
    nom: criteria?.nom ?? '',
    prenom: criteria?.prenom ?? '',
    email: criteria?.email ?? '',
    telephone: criteria?.telephone ?? '',
    utilisateurId: criteria?.utilisateurId,
    numero: criteria?.numero,
    dateDebut: criteria?.dateDebut ?? '',
    dateFin: criteria?.dateFin ?? '',
    statut: criteria?.statut,
    isConfidentiel: criteria?.isConfidentiel,
    dateMessageDebut: criteria?.dateMessageDebut ?? '',
    dateMessageFin: criteria?.dateMessageFin ?? '',
    dateReceptionDebut: criteria?.dateReceptionDebut ?? '',
    dateReceptionFin: criteria?.dateReceptionFin ?? '',
    numeroExpediteur: criteria?.numeroExpediteur,
    numeroDestinataire: criteria?.numeroDestinataire
  })
  const [criteria, setCriteria] = useState<CourrierSearchCriteria>(() => 
  sanitizeCriteria(initialCriteria)
)

  const handleInputChange = (field: keyof CourrierSearchCriteria, value: string | number | boolean | undefined) => {
    setCriteria(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const filteredCriteria = Object.fromEntries(
      Object.entries(criteria).filter(([_, value]) => 
        value !== '' && value !== undefined && value !== null
      )
    ) as CourrierSearchCriteria
    
    onSearch(filteredCriteria)
  }

  const handleReset = () => {
    // Vider complètement le formulaire
    setCriteria(DEFAULT_CRITERIA)

    if (reinitialiser) {
      reinitialiser()
    }
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-card text-card-foreground rounded-xl border border-border shadow-sm p-6 space-y-6 max-w-7xl mx-auto"
    >
      {/* En-tête */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Recherche de courriers</h2>
            <p className="text-xs text-muted-foreground">Filtrez vos courriers par critères précis</p>
          </div>
        </div>
      </div>

      {/* 1. Informations générales & Expéditeur */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <FileText className="w-4 h-4 text-primary" />
          <span>Informations générales & Contact</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
          <div>
            <label className="block text-xs font-medium mb-1.5 text-foreground">Référence</label>
            <input
              type="text"
              value={criteria.reference}
              onChange={(e) => handleInputChange('reference', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="ex: REF2024"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-foreground">Objet</label>
            <input
              type="text"
              value={criteria.object}
              onChange={(e) => handleInputChange('object', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Objet de la demande..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-foreground">Nom</label>
            <input
              type="text"
              value={criteria.nom}
              onChange={(e) => handleInputChange('nom', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="ex: MUPASA"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-foreground">Prénom</label>
            <input
              type="text"
              value={criteria.prenom}
              onChange={(e) => handleInputChange('prenom', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="ex: Jean"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-foreground">Email</label>
            <input
              type="email"
              value={criteria.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="exemple@mail.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-foreground">Téléphone</label>
            <input
              type="tel"
              value={criteria.telephone}
              onChange={(e) => handleInputChange('telephone', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="0340000000"
            />
          </div>
        </div>
      </div>

      {/* 2. Numérotation & Statuts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Numéros */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Hash className="w-4 h-4 text-primary" />
            <span>Numérotation</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-foreground">N° Général</label>
              <input
                type="number"
                value={criteria.numero || ''}
                onChange={(e) => handleInputChange('numero', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-foreground">N° Départ</label>
              <input
                type="number"
                value={criteria.numeroExpediteur || ''}
                onChange={(e) => handleInputChange('numeroExpediteur', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-foreground">N° Arrivée</label>
              <input
                type="number"
                value={criteria.numeroDestinataire || ''}
                onChange={(e) => handleInputChange('numeroDestinataire', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="10"
              />
            </div>
          </div>
        </div>

        {/* Attributs / États */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span>Filtres d'état</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-foreground">Statut</label>
              <select
                value={criteria.statut || ''}
                onChange={(e) => handleInputChange('statut', e.target.value || undefined)}
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Tous les statuts</option>
                <option value="en_cours">En cours</option>
                <option value="finalise">Finalisé</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-foreground">Confidentialité</label>
              <select
                value={criteria.isConfidentiel === undefined ? '' : String(criteria.isConfidentiel)}
                onChange={(e) => {
                  const val = e.target.value;
                  handleInputChange('isConfidentiel', val === '' ? undefined : val === 'true');
                }}
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Tous</option>
                <option value="false">Non confidentiel</option>
                <option value="true">Confidentiel</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Périodes & Dates (Regroupées par intervalle) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-primary" />
          <span>Filtres par dates</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
          {/* Période générale */}
          <div className="p-3 bg-background/60 rounded-md border border-border/60 space-y-2">
            <span className="text-xs font-medium text-muted-foreground block border-b pb-1">Date de création du courrier</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">Du</label>
                <input
                  type="date"
                  value={criteria.dateDebut}
                  onChange={(e) => handleInputChange('dateDebut', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">Au</label>
                <input
                  type="date"
                  value={criteria.dateFin}
                  onChange={(e) => handleInputChange('dateFin', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Date Message */}
          <div className="p-3 bg-background/60 rounded-md border border-border/60 space-y-2">
            <span className="text-xs font-medium text-muted-foreground block border-b pb-1">Date du message</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">Du</label>
                <input
                  type="date"
                  value={criteria.dateMessageDebut}
                  onChange={(e) => handleInputChange('dateMessageDebut', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">Au</label>
                <input
                  type="date"
                  value={criteria.dateMessageFin}
                  onChange={(e) => handleInputChange('dateMessageFin', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Date Réception */}
          <div className="p-3 bg-background/60 rounded-md border border-border/60 space-y-2">
            <span className="text-xs font-medium text-muted-foreground block border-b pb-1">Date de réception</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">Du</label>
                <input
                  type="date"
                  value={criteria.dateReceptionDebut}
                  onChange={(e) => handleInputChange('dateReceptionDebut', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">Au</label>
                <input
                  type="date"
                  value={criteria.dateReceptionFin}
                  onChange={(e) => handleInputChange('dateReceptionFin', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </Button>
        <Button
          type="submit"
          disabled={loading}
          style={{ color: 'white' }}
          className="flex items-center gap-2 min-w-[130px] justify-center transition-all active:scale-95"
        >
          <Search className="w-4 h-4" />
          {loading ? 'Recherche...' : 'Rechercher'}
        </Button>
      </div>
    </form>
  )
}