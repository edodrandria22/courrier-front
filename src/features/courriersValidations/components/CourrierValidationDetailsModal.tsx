"use client";

import React, { useState } from "react";
import { PieceJointeCard } from "@/features/courriers/components/PieceJointeCard";
import { CourrierValidation } from "../type/courrierValidation";
import { ConfirmDialog } from "@/features/common/components/ui/ConfirmDialog";
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
                <div><span className="text-muted-foreground block text-xs">Ville</span> <span className="font-medium">{courrier.ville}</span></div>
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
                    <span className="text-muted-foreground block text-xs mb-1 text-amber-700 dark:text-amber-400 font-semibold">Observation secrétaire général</span>
                    <p className="font-medium text-amber-800 dark:text-amber-300">{courrier.observationSuperviseur}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Personnes associées */}
            <div>
              <h4 className="font-semibold border-b pb-2 mb-3 text-sm">Personnes associées</h4>
              {courrier.detailPersonnes && courrier.detailPersonnes.length > 0 ? (
                <div className="grid gap-3">
                  {courrier.detailPersonnes.map((personne, idx) => (
                    <div key={idx} className="p-3 bg-muted/50 border border-border rounded-md text-sm">
                      <div className="font-semibold text-foreground flex items-center gap-2 mb-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">
                          {personne.name?.charAt(0) || personne.prenom?.charAt(0) || "U"}
                        </div>
                        <span>{personne.name} {personne.prenom || ""}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs pl-8">
                        {personne.email && (
                          <div>
                            <span className="text-muted-foreground block text-[10px] uppercase">Email</span>
                            <span className="font-medium text-foreground">{personne.email}</span>
                          </div>
                        )}
                        {personne.telephone && (
                          <div>
                            <span className="text-muted-foreground block text-[10px] uppercase">Téléphone</span>
                            <span className="font-medium text-foreground">{personne.telephone}</span>
                          </div>
                        )}
                        {personne.matricule && (
                          <div>
                            <span className="text-muted-foreground block text-[10px] uppercase">Matricule</span>
                            <span className="font-medium text-foreground">{personne.matricule}</span>
                          </div>
                        )}
                        {personne.employeur && (
                          <div>
                            <span className="text-muted-foreground block text-[10px] uppercase">Employeur</span>
                            <span className="font-medium text-foreground">{personne.employeur}</span>
                          </div>
                        )}
                        {personne.entite && (
                          <div>
                            <span className="text-muted-foreground block text-[10px] uppercase">Entité</span>
                            <span className="font-medium text-foreground">{personne.entite}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Aucune personne associée</p>
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