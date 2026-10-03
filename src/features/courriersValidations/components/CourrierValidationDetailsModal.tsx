"use client";

import React, { useState } from "react";
import { PieceJointeCard } from "@/features/courriers/components/PieceJointeCard";
import { CourrierValidation } from "../type/courrierValidation";
import { ConfirmDialog } from "@/features/common/components/ui/ConfirmDialog";
import { Building, Hash, Mail, Phone, UserIcon } from "lucide-react";
interface CourrierValidationDetailsModalProps {
  courrier: CourrierValidation;
  onClose: () => void;
  isSupervisor?: boolean;
  onValidate?: (id: number) => void | Promise<void>;
  onRemarque?: (id: number, remarque: string) => void | Promise<void>;
}

export const CourrierValidationDetailsModal: React.FC<CourrierValidationDetailsModalProps> = ({
  courrier,
  onClose,
  isSupervisor = false,
  onValidate,
  onRemarque,
}) => {
  // États pour les dialogs et chargements
  const [showValidateConfirm, setShowValidateConfirm] = useState(false);
  const [showRemarqueModal, setShowRemarqueModal] = useState(false);
  const [remarqueText, setRemarqueText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  // Traitement de la validation
  const handleConfirmValidate = async () => {
    if (onValidate && courrier.id) {
      try {
        setIsLoading(true);
        await onValidate(courrier.id);
        setShowValidateConfirm(false);
        onClose();
      } catch (error) {
        console.error("Erreur lors de la validation :", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Traitement de l'ajout de remarque
  const handleConfirmRemarque = async () => {
    if (onRemarque && courrier.id && remarqueText.trim()) {
      try {
        setIsLoading(true);
        await onRemarque(courrier.id, remarqueText.trim());
        setShowRemarqueModal(false);
        setRemarqueText("");
        onClose();
      } catch (error) {
        console.error("Erreur lors de l'ajout de la remarque :", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
        <div className="bg-card text-card-foreground rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
            <h3 className="text-lg font-bold text-foreground">Détails du demande d'ordre de mission</h3>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Contenu principal */}
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Informations Générales */}
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <h4 className="font-semibold text-primary mb-3 uppercase tracking-wider text-xs">Informations Générales</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground block text-xs">Objet</span> <span className="font-medium">{courrier.object}</span></div>
                <div><span className="text-muted-foreground block text-xs">Pays de séjour</span> <span className="font-medium">{courrier.pays}</span></div>
                <div><span className="text-muted-foreground block text-xs">Ville de séjour</span> <span className="font-medium">{courrier.ville}</span></div>
                <div><span className="text-muted-foreground block text-xs">Période</span> <span className="font-medium">{formatDate(courrier.dateDebut)} - {formatDate(courrier.dateFin)}</span></div>
                <div><span className="text-muted-foreground block text-xs">N° Départ</span> <span className="font-medium">{courrier.numeroDepart ? String(courrier.numeroDepart) : "-"}</span></div>
                
                <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 pt-2 border-t border-border mt-2">
                  <div><span className="text-muted-foreground block text-xs">Créé le</span> <span className="font-medium">{formatDate(courrier.createdAt)}</span></div>
                  <div><span className="text-muted-foreground block text-xs">Date de validation</span> <span className="font-medium">{formatDate(courrier.dateValidation)}</span></div>
                </div>

                {courrier.observation && (
                  <div className="col-span-1 md:col-span-2 bg-card p-3 rounded border border-border">
                    <span className="text-muted-foreground block text-xs mb-1">Observation</span>
                    <p className="font-medium text-foreground">{courrier.observation}</p>
                  </div>
                )}
                {courrier.observationSuperviseur && (
                  <div className="col-span-1 md:col-span-2 bg-amber-500/10 p-3 rounded border border-amber-500/30 dark:bg-amber-900/20 dark:border-amber-700/30">
                    <span className="text-muted-foreground block text-xs mb-1 text-amber-700 dark:text-amber-400 font-semibold">Remarque</span>
                    <p className="font-medium text-amber-800 dark:text-amber-300">{courrier.observationSuperviseur}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Personnes associées */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Informations Demandeur{courrier.detailPersonnes && courrier.detailPersonnes.length > 1 ? 's' : ''}
              </h3>

              {/* On vérifie si la liste existe et contient des éléments */}
              {courrier.detailPersonnes && courrier.detailPersonnes.length > 0 ? (
                <div className="space-y-3"> {/* Conteneur pour espacer chaque bloc personne */}
                  {courrier.detailPersonnes.map((personne, index) => (
                    <div 
                      key={index} 
                      className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border rounded-md p-3 bg-background relative"
                    >
                      {/* Petit badge optionnel pour numéroter s'il y a plusieurs personnes */}
                      {courrier.detailPersonnes.length > 1 && (
                        <span className="absolute top-2 right-2 text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-medium">
                          #{index + 1}
                        </span>
                      )}
                      {/* Nom & Prénom */}
                      {personne.entite && (
                        <p className="flex items-center gap-2 text-foreground sm:col-span-2">
                          <Hash className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="font-medium">Entité :</span> 
                          <span className="text-foreground">{personne.entite}</span>
                        </p>
                      )}

                      {/* Nom & Prénom */}
                      <p className="flex items-center gap-2 text-foreground sm:col-span-2 border-t pt-2">
                        <UserIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="font-medium">Nom :</span> {personne.name || "—"} {personne.prenom || ""}
                      </p>
                      {/* Matricule (Affiché uniquement s'il existe) */}
                      {personne.matricule && (
                        <p className="flex items-center gap-2 text-foreground sm:col-span-2 border-t pt-2">
                          <Hash className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="font-medium">Matricule :</span> 
                          <span className="text-foreground">{personne.matricule}</span>
                        </p>
                      )}

                      {/* Employeur (Affiché uniquement s'il existe) */}
                      {personne.employeur && (
                        <p className="flex items-center gap-2 text-foreground sm:col-span-2 border-t pt-2">
                          <Building className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="font-medium">Employeur :</span> 
                          <span className="text-foreground">{personne.employeur}</span>
                        </p>
                      )}

                      {/* Email */}
                      <p className="flex items-center gap-2 text-foreground sm:col-span-2 border-t pt-2 mt-1">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="font-medium">Email :</span> 
                        {personne.email ? (
                          <a href={`mailto:${personne.email}`} className="text-primary hover:underline break-all">
                            {personne.email}
                          </a>
                        ) : "—"}
                      </p>

                      {/* Téléphone (Affiché uniquement s'il existe) */}
                      <p className="flex items-center gap-2 text-foreground sm:col-span-2 border-t pt-2">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="font-medium">Téléphone :</span>
                        {personne.telephone ? (
                          <a href={`tel:${personne.telephone}`} className="text-primary hover:underline">
                            {personne.telephone}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                /* Message de repli si aucune personne n'est enregistrée */
                <div className="text-xs text-muted-foreground italic p-3 border border-dashed rounded-md text-center bg-muted/30">
                  Aucun demandeur renseigné
                </div>
              )}
            </div>

            {/* Pièces Jointes */}
            <div>
              <h4 className="font-semibold border-b pb-2 mb-3 text-sm">Pièces Jointes</h4>
              {courrier.files && courrier.files.length > 0 ? (
                <div className="grid gap-2">
                  {courrier.files.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-md text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <PieceJointeCard pj={file} isCourrierValidation={true} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Aucune pièce jointe</p>
              )}
            </div>
          </div>
          
          {/* Footer avec actions */}
          <div className="p-4 border-t border-border bg-muted/30 flex justify-between items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded font-medium text-sm transition-colors"
            >
              Fermer
            </button>

            {/* Boutons réservés au superviseur */}
            {isSupervisor && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowRemarqueModal(true)}
                  className="px-4 py-2 bg-amber-500/20 text-amber-700 hover:bg-amber-500/30 border border-amber-500/30 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/40 dark:border-amber-700/30 rounded font-medium text-sm transition-colors flex items-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Ajouter une remarque
                </button>

                <button
                  type="button"
                  onClick={() => setShowValidateConfirm(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-sm transition-colors flex items-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Valider
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation de Validation via ConfirmDialog */}
      <ConfirmDialog
        open={showValidateConfirm}
        title="Valider ce courrier"
        description="Êtes-vous sûr de vouloir valider ce courrier ? Cette action confirmera sa prise en compte."
        confirmLabel="Valider"
        cancelLabel="Annuler"
        isLoading={isLoading}
        onConfirm={handleConfirmValidate}
        onCancel={() => setShowValidateConfirm(false)}
      />

      {/* Modal pour la Saisie d'une Remarque */}
      {showRemarqueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => !isLoading && setShowRemarqueModal(false)}
          />
          <div className="relative bg-card border border-border rounded-xl shadow-lg w-full max-w-md p-6 space-y-4 animate-fade-in">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">Ajouter une remarque</h3>
              <p className="text-sm text-muted-foreground">
                Saisissez votre observation ou remarque pour ce courrier.
              </p>
            </div>

            <textarea
              rows={4}
              value={remarqueText}
              onChange={(e) => setRemarqueText(e.target.value)}
              placeholder="Écrivez votre remarque ici..."
              disabled={isLoading}
              className="w-full p-2.5 text-sm border border-input rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none bg-background"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRemarqueModal(false)}
                disabled={isLoading}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest rounded text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmRemarque}
                disabled={isLoading || !remarqueText.trim()}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors disabled:opacity-50 flex items-center gap-2 dark:bg-amber-700 dark:hover:bg-amber-600"
              >
                {isLoading && (
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};