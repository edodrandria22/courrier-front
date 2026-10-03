'use client'

import { useRef, useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Send, X, User, Lock, CheckCircle, ArrowRight, Copy, Check, Plus, Trash2, Paperclip, FileText } from 'lucide-react'
import { DetailPersonne, Courrier, PieceJointe } from '@/features/courriers/types/courrier'
import { useEntites } from '@/features/courriers/contexts/EntitesContext'
import { CourrierValidation } from '../../type/courrierValidation'
import { courrierValidationService } from '../../service/courriersValidationsService'
import { toast } from 'sonner'
import { PieceJointeCard } from '@/features/courriers/components/PieceJointeCard'

interface Props {
  onSuccess: () => void,
  courrierValidation?: CourrierValidation,
  onCancel?: () => void,
  courriersValidations: CourrierValidation[],
  setCourriersValidations: (courriers: CourrierValidation[]) => void
}

export const CourrierValidationForm = ({ onSuccess, courrierValidation, onCancel, courriersValidations, setCourriersValidations }: Props) => {
  
  const { entites, loading: loadingEntites } = useEntites()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 1. Initialisation avec une liste au lieu de champs simples
  const defaultPersonne: DetailPersonne = { name: '', prenom: '', email: '', telephone: '', matricule: null, employeur: '', entiteId: null, employeurId: null};
  const initialPersonnes = courrierValidation?.detailPersonnes?.length
    ? courrierValidation.detailPersonnes
    : [defaultPersonne];

  // Formater les dates pour extraire seulement YYYY-MM-DD
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    return dateString.split(' ')[0]; // Extrait "2026-09-28" de "2026-09-28 00:00:00"
  };

  const [formData, setFormData] = useState({
    object: courrierValidation?.object || '',
    pays: courrierValidation?.pays || '',
    ville: courrierValidation?.ville || '',
    dateDebut: formatDateForInput(courrierValidation?.dateDebut),
    dateFin: formatDateForInput(courrierValidation?.dateFin),
    numeroDepart: courrierValidation?.numeroDepart?.toString() || '',
    observation: courrierValidation?.observation || '',
    detailPersonnes: initialPersonnes // Remplacement des champs plats par un tableau
  });

  // États pour les trois fichiers
  const [demande, setDemande] = useState<File | null>(null);
  const [lettreInvitation, setLettreInvitation] = useState<File | null>(null);
  const [planVol, setPlanVol] = useState<File | null>(null);

  // États pour les fichiers existants (depuis la base)
  const [existingDemande, setExistingDemande] = useState<PieceJointe | null>(null);
  const [existingLettre, setExistingLettre] = useState<PieceJointe | null>(null);
  const [existingPlanVol, setExistingPlanVol] = useState<PieceJointe | null>(null);

  // États pour les aperçus
  const [previewDemande, setPreviewDemande] = useState<string | null>(null);
  const [previewLettre, setPreviewLettre] = useState<string | null>(null);
  const [previewPlanVol, setPreviewPlanVol] = useState<string | null>(null);

  // Charger les fichiers existants depuis la base
  useEffect(() => {
    if (courrierValidation?.files && courrierValidation.files.length > 0) {
      const files = courrierValidation.files;

      // Identifier les fichiers par leur typeFichier
      const demandeFile = files.find(f => f.typeFichier === 'demande');
      const lettreFile = files.find(f => f.typeFichier === 'lettreInvitation');
      const planVolFile = files.find(f => f.typeFichier === 'planVol');

      if (demandeFile) {
        setExistingDemande(demandeFile);
      }
      if (lettreFile) {
        setExistingLettre(lettreFile);
      }
      if (planVolFile) {
        setExistingPlanVol(planVolFile);
      }
    }
  }, [courrierValidation]);

  const handleDemandeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDemande(file);
      setPreviewDemande(URL.createObjectURL(file));
    }
  };

  const handleLettreInvitationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLettreInvitation(file);
      setPreviewLettre(URL.createObjectURL(file));
    }
  };

  const handlePlanVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPlanVol(file);
      setPreviewPlanVol(URL.createObjectURL(file));
    }
  };

  // Gestion des champs simples (Objet, Description)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 2. Fonctions pour gérer le tableau de personnes
  const handlePersonneChange = (index: number, field: keyof DetailPersonne, value: string | number | null) => {
    const updatedPersonnes = [...formData.detailPersonnes]
    // Convertir matricule et entiteId en nombres si ce sont ces champs
    let processedValue = value
    if (field === 'matricule') {
      processedValue = typeof value === 'string' ? (value ? parseInt(value, 10) : null) : value
    } else if (field === 'entiteId') {
      processedValue = typeof value === 'string' ? (value ? parseInt(value, 10) : null) : value
    }
   
    updatedPersonnes[index] = { ...updatedPersonnes[index], [field]: processedValue }
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
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validation des fichiers requis lors de la création
        const fichiersManquants = [];
        if (!demande) fichiersManquants.push("Demande");
        if (!lettreInvitation) fichiersManquants.push("Lettre d'invitation");
        if (!planVol) fichiersManquants.push("Plan de vol");

        if (fichiersManquants.length > 0) {
          const errorMessage = `Les fichiers suivants sont requis : ${fichiersManquants.join(', ')}`;
          setError(errorMessage);
          toast.error(errorMessage, {
            description: "Veuillez sélectionner tous les fichiers requis avant de continuer.",
            duration: 5000,
          });
          setLoading(false);
          return;
        }
      

      // Convertir les matricules en nombres avant l'envoi
      const processedDetailPersonnes = formData.detailPersonnes.map((personne: DetailPersonne) => ({
        ...personne,
        matricule: personne.matricule ? (typeof personne.matricule === 'string' ? parseInt(personne.matricule, 10) : personne.matricule) : null
      }))

      const courrierData: CourrierValidation = {
        object: formData.object || '',
        pays: formData.pays || '',
        ville: formData.ville || '',
        dateDebut: formData.dateDebut || '',
        dateFin: formData.dateFin || '',
        numeroDepart: formData.numeroDepart ? parseInt(formData.numeroDepart, 10) : null,
        observation: formData.observation || '',
        detailPersonnes: processedDetailPersonnes,
        originId: courrierValidation?.originId || null,
        files: courrierValidation?.files || []
      }

      if (courrierValidation) {
        const result = await courrierValidationService.updateCourrierValidation(courrierValidation.id || 0, courrierData, demande!, lettreInvitation!, planVol!);
        setCourriersValidations(courriersValidations?.map(c => c.originId === result.originId ? result : c));
      } else {
        const result = await courrierValidationService.createCourrierValidation(courrierData, demande!, lettreInvitation!, planVol!);
        setCourriersValidations([result, ...courriersValidations]);
      }

      onSuccess()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("Une erreur est survenue")
      }
    } finally {
      setLoading(false)
    }
  }
  const isFieldDisabled = loading;
  return (
    <Card className="max-w-3xl mx-auto border-border bg-card shadow-none md:border md:shadow-sm">
      <form onSubmit={handleFormSubmit} className="p-6 space-y-8">

        {/* En-tête avec Switch Confidentiel */}
        <div className="pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {courrierValidation ? (
              <h2 className="text-lg font-bold text-foreground">
                Modifier la demande {courrierValidation?.id}
              </h2>
            ) : (
              <>
                <h2 className="text-lg font-bold text-foreground">Nouvelle demande</h2>
                <p className="text-sm text-muted-foreground">Enregistrement d'une nouvelle demande.</p>
              </>
            )}
          </div>
        </div>    
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 flex items-center gap-2">
            <X className="w-4 h-4" /> {error}
          </div>
        )}

        
        {/* Informations sur le courrier (Objet & Description) */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Détails du document</h3>
          
 
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Numero de départ (Optionnel)</label>
              <Input
                type="number"
                name="numeroDepart"
                value={formData.numeroDepart}
                onChange={handleInputChange}
                // required
                placeholder="Numero de depart"
                className="bg-background/50 border-border disabled:opacity-50 disabled:font-semibold disabled:text-amber-600"
              />
            </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Objet</label>
            <Input
              name="object"
              type="text"
              value={formData.object}
              onChange={handleInputChange}
              required
              placeholder="Objet du courrier"
              className="bg-background/50 border-border disabled:opacity-50 disabled:font-semibold disabled:text-amber-600"
              disabled={isFieldDisabled}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Pays de séjour</label>
            <Input
              name="pays"
              type="text"
              value={formData.pays}
              onChange={handleInputChange}
              placeholder="Pays de séjour"
              className="resize-none bg-background/50 border-border disabled:opacity-50"
              disabled={isFieldDisabled}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Ville de séjour</label>
            <Input
              name="ville"
              type="text"
              value={formData.ville}
              onChange={handleInputChange}
              placeholder="ville de séjour"
              className="resize-none bg-background/50 border-border disabled:opacity-50"
              disabled={isFieldDisabled}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Date de départ</label>
            <Input
              name="dateDebut"
              value={formData.dateDebut}
              onChange={handleInputChange}
              type="date"
              required
              placeholder="Date de debut"
              className="bg-background/50 border-border disabled:opacity-50 disabled:font-semibold disabled:text-amber-600"
              disabled={isFieldDisabled}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Date de retour</label>
            <Input
              name="dateFin"
              value={formData.dateFin}
              onChange={handleInputChange}
              type="date"
              required
              placeholder="Date fin"
              className="bg-background/50 border-border disabled:opacity-50 disabled:font-semibold disabled:text-amber-600"
              disabled={isFieldDisabled}
            />
          </div>
        </div>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Observation</label>
              <Textarea
                name="observation"
                value={formData.observation}
                onChange={handleInputChange}
                rows={5}
                placeholder="Remarque sur le demande (optionnel)"
                className="resize-none bg-background/50 border-border disabled:opacity-50"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Scan de votre demande en pdf ou image <span className="text-red-500">(5 Mo max)</span> <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                onChange={handleDemandeChange}
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                disabled={loading}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              {demande && (
                <div className="mt-2 p-3 bg-primary/10 border border-primary/20 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-foreground">{demande.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDemande(null);
                        setPreviewDemande(null);
                      }}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {previewDemande && (
                    <div className="mt-2">
                      <a
                        href={previewDemande}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Aperçu du fichier
                      </a>
                    </div>
                  )}
                </div>
              )}
              {!demande && existingDemande && (
                <PieceJointeCard
                  pj={existingDemande}
                  isCourrierValidation={true}
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Scan de votre lettre d'invitation en pdf ou image <span className="text-red-500">(5 Mo max)</span> <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                onChange={handleLettreInvitationChange}
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                disabled={loading}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              {lettreInvitation && (
                <div className="mt-2 p-3 bg-primary/10 border border-primary/20 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-foreground">{lettreInvitation.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setLettreInvitation(null);
                        setPreviewLettre(null);
                      }}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {previewLettre && (
                    <div className="mt-2">
                      <a
                        href={previewLettre}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Aperçu du fichier
                      </a>
                    </div>
                  )}
                </div>
              )}
              {!lettreInvitation && existingLettre && (
                <PieceJointeCard
                  pj={existingLettre}
                  isCourrierValidation={true}
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Scan de votre plan de vol en pdf ou image <span className="text-red-500">(5 Mo max)</span> <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                onChange={handlePlanVolChange}
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                disabled={loading}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              {planVol && (
                <div className="mt-2 p-3 bg-primary/10 border border-primary/20 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-foreground">{planVol.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPlanVol(null);
                        setPreviewPlanVol(null);
                      }}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {previewPlanVol && (
                    <div className="mt-2">
                      <a
                        href={previewPlanVol}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Aperçu du fichier
                      </a>
                    </div>
                  )}
                </div>
              )}
              {!planVol && existingPlanVol && (
                <PieceJointeCard
                  pj={existingPlanVol}
                  isCourrierValidation={true}
                />
              )}
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
              {formData.detailPersonnes.length > 1 && !isFieldDisabled && (
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
                  <label className="text-sm font-semibold text-foreground">Entité</label>
                  <select
                    value={personne.entiteId || ''}
                    onChange={(e) => handlePersonneChange(index, 'entiteId', e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                    disabled={isFieldDisabled || loadingEntites}
                  >
                    <option value="">Sélectionner...</option>
                    {loadingEntites ? (
                      <option value="" disabled>Chargement...</option>
                    ) : (
                      entites.map((entite) => (
                        <option key={entite.id} value={entite.id}>
                          {entite.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                    <User className="w-3 h-3" /> Nom
                  </label>
                  <Input
                    value={personne.name || ''}
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
                  <label className="text-sm font-semibold text-foreground">Matricule</label>
                  <Input
                    type="number"
                    value={personne.matricule || ''}
                    onChange={(e) => handlePersonneChange(index, 'matricule', e.target.value)}
                    placeholder="Matricule (optionnel)"
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
                    placeholder="Mail du correspondant (optionnel)"
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
        <div className="flex items-center justify-end gap-3 pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
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
            {loading ? 'Traitement...' : <span className="flex items-center gap-2"><Send className="w-4 h-4" /> {courrierValidation ? 'Enregistrer la modification' : 'Créer le demande'}</span>}
          </button>
        </div>
      </form>
    </Card>
  )
}