"use client";
import { PieceJointeCard } from "@/features/courriers/components/PieceJointeCard";
import { CourrierValidation } from "../type/courrierValidation";


export const CourrierValidationDetailsModal: React.FC<{
  courrier: CourrierValidation;
  onClose: () => void;
}> = ({ courrier, onClose }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
      <div className="bg-card text-card-foreground rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col bg-white">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
          <h3 className="text-lg font-bold text-foreground">Détails du Courrier</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Informations Générales */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h4 className="font-semibold text-primary mb-3 uppercase tracking-wider text-xs">Informations Générales</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground block text-xs">Objet</span> <span className="font-medium">{courrier.object}</span></div>
              <div><span className="text-muted-foreground block text-xs">Ville</span> <span className="font-medium">{courrier.ville}</span></div>
              <div><span className="text-muted-foreground block text-xs">Période</span> <span className="font-medium">{formatDate(courrier.dateDebut)} - {formatDate(courrier.dateFin)}</span></div>
              <div><span className="text-muted-foreground block text-xs">N° Départ / Origin ID</span> <span className="font-medium">{courrier.numeroDepart ? String(courrier.numeroDepart) : "-"} / {courrier.originId ?? "-"}</span></div>
              
              <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 mt-2">
                <div><span className="text-muted-foreground block text-xs">Créé le</span> <span className="font-medium">{formatDate(courrier.createdAt)}</span></div>
                <div><span className="text-muted-foreground block text-xs">Date de validation</span> <span className="font-medium">{formatDate(courrier.dateValidation)}</span></div>
              </div>

              {courrier.observation && (
                <div className="col-span-1 md:col-span-2 bg-white p-3 rounded border border-slate-200">
                  <span className="text-muted-foreground block text-xs mb-1">Observation</span>
                  <p className="font-medium text-slate-700">{courrier.observation}</p>
                </div>
              )}
              {courrier.observationSuperviseur && (
                <div className="col-span-1 md:col-span-2 bg-orange-50 p-3 rounded border border-orange-100">
                  <span className="text-muted-foreground block text-xs mb-1 text-orange-700">Observation Superviseur</span>
                  <p className="font-medium text-orange-800">{courrier.observationSuperviseur}</p>
                </div>
              )}
            </div>
          </div>

          {/* Personnes impliquées */}
          <div>
            <h4 className="font-semibold border-b pb-2 mb-3 text-sm">Personnes associées</h4>
            {courrier.detailPersonnes && courrier.detailPersonnes.length > 0 ? (
              <div className="grid gap-3">
                {courrier.detailPersonnes.map((personne, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-md text-sm">
                    {/* Nom et Prénom en évidence */}
                    <div className="font-semibold text-slate-800 flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">
                        {personne.name?.charAt(0) || personne.prenom?.charAt(0) || "U"}
                      </div>
                      <span>
                        {personne.name} {personne.prenom || ""}
                      </span>
                    </div>

                    {/* Grille pour les détails de contact et professionnels */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs pl-8">
                      {personne.email && (
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase">Email</span>
                          <span className="font-medium text-slate-700">{personne.email}</span>
                        </div>
                      )}
                      
                      {personne.telephone && (
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase">Téléphone</span>
                          <span className="font-medium text-slate-700">{personne.telephone}</span>
                        </div>
                      )}

                      {personne.matricule && (
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase">Matricule</span>
                          <span className="font-medium text-slate-700">{personne.matricule}</span>
                        </div>
                      )}

                      {personne.employeur && (
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase">Employeur</span>
                          <span className="font-medium text-slate-700">{personne.employeur}</span>
                        </div>
                      )}

                      {personne.entite && (
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase">Entité</span>
                          <span className="font-medium text-slate-700">{personne.entite}</span>
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
                  <div key={idx} className="flex items-center gap-2 p-2 bg-blue-50/50 border border-blue-100 rounded-md text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    {/* Remplacez ces clés par les propriétés réelles de votre interface PieceJointe */}
                    <PieceJointeCard pj={file} isCourrierValidation={true} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Aucune pièce jointe</p>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-border bg-muted/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-medium text-sm transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};