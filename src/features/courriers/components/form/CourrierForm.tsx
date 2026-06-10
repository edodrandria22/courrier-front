'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button' // Importation du bouton UI si présent
import { Send, X, User, Lock, CheckCircle, ArrowRight, Copy, Check } from 'lucide-react'
import { useCourrier } from '../../hooks/useCourrier'
import { Courrier } from '../../types/courrier'

interface Props {
  onSuccess: () => void,
  courrier?: Courrier,
  onClose?: () => void
}

export const CourrierForm = ({ onSuccess, courrier, onClose }: Props) => {
  const { createCourrier, updateCourrier,loading, error } = useCourrier()
  const [backupData, setBackupData] = useState<Partial<Courrier> | null>(null)
  // 1. État pour stocker la référence après création réussie
  const [createdReference, setCreatedReference] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  const [formData, setFormData] = useState({
    email: courrier?.email || '',
    object: courrier?.object || '',
    description: courrier?.description || '',
    nom: courrier?.nom || '',
    prenom: courrier?.prenom || '',
    telephone: courrier?.telephone || '',
    isConfidentiel: courrier?.isConfidentiel || false 
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleConfidentialToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked

    if (isChecked) {
      setBackupData({
        object: formData.object,
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        description: formData.description,
      })

      setFormData((prev) => ({
        ...prev,
        isConfidentiel: true,
        object: 'Pli fermé',
        nom: '',
        prenom: '',
        telephone: '',
        description: '',
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        isConfidentiel: false,
        object: backupData?.object || '',
        nom: backupData?.nom || '',
        prenom: backupData?.prenom || '',
        telephone: backupData?.telephone || '',
        description: backupData?.description || '',
      }))
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const courrierData: Courrier = formData;
    var result;
    if (courrier) {
      result = await updateCourrier(courrier.id||0,courrierData);
    }
    else{
      result = await createCourrier(courrierData);
    }
    // console.log(result)
    if (result.success) {
      // 2. On récupère la référence générée par votre API (ex: result.reference ou result.data.reference)
      // Ajustez "result.reference" selon la structure exacte renvoyée par votre hook useCourrier
      // console.log(result)
      setCreatedReference(result.courrier?.reference || "REF-" + Math.floor(100000 + Math.random() * 900000))
    }
  }

  // Fonction utilitaire pour copier la référence dans le presse-papier
  const handleCopyReference = () => {
    if (createdReference) {
      navigator.clipboard.writeText(createdReference)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const isFieldDisabled = loading || formData.isConfidentiel

  {/* 3. ÉCRAN DE SUCCÈS INTERMÉDIAIRE : Affiché avant d'appeler onSuccess */}
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

        {/* Bloc d'affichage de la Référence */}
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

        {/* Bouton de validation finale qui déclenche le onSuccess externe */}
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

  {/* LE FORMULAIRE RESTE IDENTIQUE EN DESSOUS */}
  return (
    <Card className="max-w-3xl mx-auto border-border bg-card shadow-none md:border md:shadow-sm">
      <form onSubmit={handleFormSubmit} className="p-6 space-y-6">

        {/* En-tête avec Switch Confidentiel */}
        <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {courrier ? (
              <>
                <h2 className="text-lg font-bold text-foreground">
                  Modifier le Courrier {courrier?.reference}
                </h2>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-foreground">
                  Nouveau Courrier
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enregistrement d'un nouveau courrier entrant.
                </p>
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
              disabled={loading}
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
              disabled={isFieldDisabled}
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
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                backgroundColor: 'var(--secondary)',
                color: '#ffffff',
                borderColor: 'var(--secondary)',
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