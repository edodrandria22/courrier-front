'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Send, X, User, Lock, CheckCircle, ArrowRight, Copy, Check, Plus, Trash2 } from 'lucide-react'
import { useCourrier } from '../../hooks/useCourrier'
import { Courrier, DetailPersonne } from '../../types/courrier'

interface Props {
  onSuccess: () => void,
  courrier?: Courrier,
  onClose?: () => void
}

export const CourrierForm = ({ onSuccess, courrier, onClose }: Props) => {
  const { createCourrier, updateCourrier, loading, error } = useCourrier()
  const [backupData, setBackupData] = useState<Partial<Courrier> | null>(null)
  const [createdReference, setCreatedReference] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  // 1. Initialisation avec une liste au lieu de champs simples
  const defaultPersonne: DetailPersonne = { name: '', prenom: '', email: '', telephone: '' };
  const initialPersonnes = courrier?.detailPersonnes?.length 
    ? courrier.detailPersonnes 
    : [];

  const [formData, setFormData] = useState({
    object: courrier?.object || '',
    description: courrier?.description || '',
    isConfidentiel: courrier?.isConfidentiel || false,
    detailPersonnes: initialPersonnes // Remplacement des champs plats par un tableau
  })

  // Gestion des champs simples (Objet, Description)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 2. Fonctions pour gérer le tableau de personnes
  const handlePersonneChange = (index: number, field: keyof DetailPersonne, value: string) => {
    const updatedPersonnes = [...formData.detailPersonnes]
    updatedPersonnes[index] = { ...updatedPersonnes[index], [field]: value }
    setFormData((prev) => ({ ...prev, detailPersonnes: updatedPersonnes }))
  }

  const addPersonne = () => {
    setFormData((prev) => ({
      ...prev,
      detailPersonnes: [...prev.detailPersonnes, { ...defaultPersonne }]
    }))
  }

  const removePersonne = (index: number) => {
    const updatedPersonnes = formData.detailPersonnes.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, detailPersonnes: updatedPersonnes }))
  }

  // 3. Mise à jour de la logique de confidentialité pour sauvegarder la liste
  const handleConfidentialToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked

    if (isChecked) {
      setBackupData({
        object: formData.object,
        description: formData.description,
        detailPersonnes: formData.detailPersonnes, // On sauvegarde la liste
      })

      setFormData((prev) => ({
        ...prev,
        isConfidentiel: true,
        object: 'Pli fermé',
        description: '',
        // detailPersonnes: formData.detailPersonnes,
        // detailPersonnes: [{ ...defaultPersonne }], // On vide la liste
        detailPersonnes: [],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        isConfidentiel: false,
        object: backupData?.object || '',
        description: backupData?.description || '',
        // On restaure la liste ou on met une liste vide par défaut
        detailPersonnes: backupData?.detailPersonnes || [{ ...defaultPersonne }],
      }))
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Adapté pour correspondre à votre type Courrier
    const courrierData = {
      ...formData,
      detailPersones: formData.detailPersonnes // Assurez-vous que la clé API correspond
    } as unknown as Courrier; 

    let result;
    if (courrier) {
      result = await updateCourrier(courrier.id || 0, courrierData);
    } else {
      result = await createCourrier(courrierData);
    }
    
    if (result.success) {
      setCreatedReference(result.courrier?.reference || "REF-" + Math.floor(100000 + Math.random() * 900000))
    }
  }

  const handleCopyReference = () => {
    if (createdReference) {
      navigator.clipboard.writeText(createdReference)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const isFieldDisabled = loading || formData.isConfidentiel

  {/* ÉCRAN DE SUCCÈS INTERMÉDIAIRE */}
  if (createdReference) {
    return (
      <Card className="max-w-md mx-auto border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 text-center space-y-6 shadow-lg rounded-2xl animate-fade-in mt-10">
        <div className="mx-auto w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shadow-inner">
          <CheckCircle className="w-10 h-10" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Courrier Enregistré !</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Le document a été indexé avec succès dans le système.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="text-left">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">Référence unique</span>
            <span className="text-base font-mono font-bold text-slate-800 dark:text-slate-200 tracking-wide">{createdReference}</span>
          </div>
          <button 
            type="button"
            onClick={handleCopyReference}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Copier la référence"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <Button
          onClick={onSuccess}
          type="button"
          style={{ color: '#ffffff' }}
          className="w-full h-11 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
        >
          Continuer
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Card>
    )
  }

  return (
    <Card className="max-w-3xl mx-auto border-border bg-card shadow-none md:border md:shadow-sm">
      <form onSubmit={handleFormSubmit} className="p-6 space-y-8">

        {/* En-tête avec Switch Confidentiel */}
        <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {courrier ? (
              <h2 className="text-lg font-bold text-foreground">
                Modifier le Courrier {courrier?.reference}
              </h2>
            ) : (
              <>
                <h2 className="text-lg font-bold text-foreground">Nouveau Courrier</h2>
                <p className="text-sm text-muted-foreground">Enregistrement d'un nouveau courrier entrant.</p>
              </>
            )}
          </div>
          
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

        
        {/* Informations sur le courrier (Objet & Description) */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Détails du document</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Objet</label>
            <Input
              name="object"
              value={formData.object}
              onChange={handleInputChange}
              required
              placeholder="Objet du courrier"
              className="bg-background/50 border-border disabled:opacity-50 disabled:font-semibold disabled:text-amber-600"
              disabled={isFieldDisabled}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              placeholder="Détails supplémentaires..."
              className="resize-none bg-background/50 border-border disabled:opacity-50"
              disabled={isFieldDisabled}
            />
          </div>
        </div>
        {/* 4. Boucle sur la liste des demandeurs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Informations Demandeurs</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addPersonne}
              disabled={isFieldDisabled}
              className="h-8 text-xs flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Ajouter
            </Button>
          </div>

          {formData.detailPersonnes.map((personne, index) => (
            <div key={index} className="relative border border-border bg-muted/20 p-4 rounded-xl space-y-4">
              
              {/* Bouton pour supprimer une personne (visible seulement s'il y en a plus d'1) */}
              {formData.detailPersonnes.length > 0 && !isFieldDisabled && (
                <button
                  type="button"
                  onClick={() => removePersonne(index)}
                  className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  title="Retirer ce demandeur"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                    <User className="w-3 h-3" /> Nom
                  </label>
                  <Input
                    value={personne.name}
                    onChange={(e) => handlePersonneChange(index, 'name', e.target.value)}
                    placeholder="Nom du correspondant (optionnel)"
                    className="bg-background border-border disabled:opacity-50"
                    disabled={isFieldDisabled}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Prénom</label>
                  <Input
                    value={personne.prenom || ''}
                    onChange={(e) => handlePersonneChange(index, 'prenom', e.target.value)}
                    placeholder="Prénom (optionnel)"
                    className="bg-background border-border disabled:opacity-50"
                    disabled={isFieldDisabled}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Email</label>
                  <Input
                    type="email"
                    value={personne.email || ''}
                    onChange={(e) => handlePersonneChange(index, 'email', e.target.value)}
                    placeholder="adresse@mail.com"
                    className="bg-background border-border disabled:opacity-50"
                    disabled={isFieldDisabled}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Téléphone</label>
                  <Input
                    value={personne.telephone || ''}
                    onChange={(e) => handlePersonneChange(index, 'telephone', e.target.value)}
                    placeholder="Téléphone (optionnel)"
                    className="bg-background border-border disabled:opacity-50"
                    disabled={isFieldDisabled}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Boutons d'actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-secondary text-secondary-foreground border border-secondary rounded-md font-semibold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Annuler
            </button>
          )}
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
          >
            {loading ? 'Traitement...' : <span className="flex items-center gap-2"><Send className="w-4 h-4" /> {courrier ? 'Modifier le courrier' : 'Créer le courrier'}</span>}
          </button>
        </div>
      </form>
    </Card>
  )
}