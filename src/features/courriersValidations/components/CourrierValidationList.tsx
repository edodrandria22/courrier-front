"use client";

import { CourrierValidation } from "../type/courrierValidation";
import { AppTableSkeleton } from "@/features/common/components/ui/AppTableSkeleton";
import { ConfirmDialog } from "@/features/common/components/ui/ConfirmDialog";
import { useState } from "react";
import { CourrierValidationDetailsModal } from "./CourrierValidationDetailsModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";

interface CourrierValidationListProps {
    courriers: CourrierValidation[];
    isLoading: boolean;
    fetchCourriersPlus: () => void;
    hasMore: boolean;
    onAddCourrier?: () => void;
    onEditCourrier?: (courrier: CourrierValidation) => void;
    onValidate: (id: number) => void;
    onRemarque: (id: number, remarque: string) => void;
    isSupervisor?: boolean;
}

export const CourrierValidationList: React.FC<CourrierValidationListProps> = ({
    courriers,
    isLoading,
    fetchCourriersPlus,
    hasMore,
    onAddCourrier,
    onEditCourrier,
    onValidate,
    onRemarque,
    isSupervisor = false
}) => {
    const [courrierToView, setCourrierToView] = useState<CourrierValidation | null>(null);

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const getStatutBadge = (courrier: CourrierValidation) => {
        if (courrier.dateValidation) {
            return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary/10 text-secondary border border-secondary/20 dark:bg-secondary/20 dark:border-secondary/30">Validé</span>;
        }
        if (courrier.observationSuperviseur) {
            return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border border-border whitespace-nowrap">Refusé</span>;
        }
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:border-primary/30">Nouveau</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-foreground">
                        Demande d'ordre de mission et/ou note de présentation
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Liste des demandes d'ordre de mission et/ou note de présentation.
                    </p>
                </div>
                {onAddCourrier && (
                <button
                    onClick={onAddCourrier}
                    style={{ color: "#ffffff" }}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold uppercase tracking-widest rounded transition-all shadow-sm flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouvelle demande
                </button>
                )}
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 z-10 bg-muted/50 border-b border-border">
                            <tr>
                                {isSupervisor &&(
                                    <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-[10px]">Demandeur</th>
                                )}
                                <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-[10px]">Objet</th>
                                <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-[10px]">Pays</th>
                                <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-[10px]">Date de départ</th>
                                <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-[10px]">Statut</th>
                                <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-[10px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading && courriers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-0">
                                        <AppTableSkeleton rows={8} cols={7} className="border-0 shadow-none rounded-none" />
                                    </td>
                                </tr>
                            ) : (
                                courriers.map((courrier) => (
                                    <tr key={courrier.id} className="hover:bg-muted/50 transition-colors">
                                        {isSupervisor && (
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <TooltipProvider>
                                                    <Tooltip delayDuration={200}>
                                                    <TooltipTrigger asChild>
                                                        {/* Conteneur interactif avec effet Hover doux */}
                                                        <div className="inline-flex items-center gap-3 p-1.5 pr-3 rounded-lg hover:bg-muted/60 border border-transparent hover:border-border transition-all cursor-pointer group">
                                                        
                                                        {/* Nom principal & Sous-texte (Email ou Adresse) */}
                                                        <div className="flex flex-col min-w-0 text-left">
                                                            <p className="font-medium text-xs text-foreground group-hover:text-primary transition-colors truncate">
                                                            {courrier.createur?.sigle || `${courrier.createur?.nom || ""} `.trim() || "U"}
                                                            </p>
                                                        </div>
                                                        </div>
                                                    </TooltipTrigger>

                                                    {/* Tooltip structuré et élégant */}
                                                    <TooltipContent side="top" className="p-3 max-w-xs space-y-2 shadow-lg border bg-popover text-popover-foreground">
                                                        <div className="flex items-center gap-2 border-b pb-1.5">
                                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                                        <p className="font-semibold text-xs text-foreground">Détails du demandeur</p>
                                                        </div>

                                                        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
                                                        <span className="text-muted-foreground">Nom :</span>
                                                        <span className="font-medium text-foreground">
                                                            {courrier.createur?.nom} {courrier.createur?.prenom}
                                                        </span>

                                                        {courrier.createur?.sigle && (
                                                            <>
                                                            <span className="text-muted-foreground">Sigle :</span>
                                                            <span className="font-medium text-foreground">{courrier.createur.sigle}</span>
                                                            </>
                                                        )}

                                                        {courrier.createur?.email && (
                                                            <>
                                                            <span className="text-muted-foreground">Email :</span>
                                                            <span className="font-medium text-foreground truncate">{courrier.createur.email}</span>
                                                            </>
                                                        )}

                                                        {courrier.createur?.adresse && (
                                                            <>
                                                            <span className="text-muted-foreground">Adresse :</span>
                                                            <span className="font-medium text-foreground">{courrier.createur.adresse}</span>
                                                            </>
                                                        )}
                                                        </div>
                                                    </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                </td>
                                        )}
                                        <td className="px-6 py-4">
                                            <TooltipProvider>
                                                <Tooltip delayDuration={200}>
                                                    <TooltipTrigger asChild>
                                                        <span className="font-semibold text-foreground truncate block max-w-[200px] cursor-pointer">
                                                            {courrier.object}
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-popover text-popover-foreground border border-border px-3 py-2 rounded-md shadow-md max-w-md">
                                                        <p className="text-sm">{courrier.object}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground font-medium">
                                            {courrier.pays}
                                        </td>
                                        {/* <td className="px-6 py-4 text-muted-foreground font-medium">
                                            {courrier.ville}
                                        </td> */}
                                        <td className="px-6 py-4 text-muted-foreground font-medium">
                                            {formatDate(courrier.dateDebut)}
                                        </td>
                                        {/* <td className="px-6 py-4 text-muted-foreground font-medium">
                                            {formatDate(courrier.dateFin)}
                                        </td> */}
                                        {/* <td className="px-6 py-4 text-muted-foreground font-medium">
                                            {formatDate(courrier.createdAt || new Date().toDateString())}
                                        </td> */}
                                        <td className="px-6 py-4">
                                            {getStatutBadge(courrier)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            
                                            <div className="flex items-center justify-end gap-1">
                                                {/* NOUVEAU BOUTON: Voir les détails */}
                                                <button
                                                    onClick={() => setCourrierToView(courrier)}
                                                    className="text-xs font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded px-2.5 py-1 transition-colors"
                                                    title="Voir les détails"
                                                >
                                                    Voir
                                                </button>

                                                {onEditCourrier && courrier.dateValidation === null && (
                                                    <button
                                                        onClick={() => onEditCourrier(courrier)}
                                                        className="text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded px-2.5 py-1 transition-colors"
                                                        title="Modifier le courrier"
                                                    >
                                                        Modifier
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {hasMore && (
                        <div className="flex justify-center px-4 pb-4 pt-2">
                            <button
                                onClick={fetchCourriersPlus}
                                disabled={isLoading}
                                className={[
                                    'group relative w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 border',
                                    isLoading
                                        ? 'bg-muted text-muted-foreground border-border cursor-not-allowed'
                                        : 'bg-card text-primary border-primary/30 hover:border-primary hover:bg-primary/5 hover:shadow-sm active:scale-95'
                                ].join(' ')}
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-4 w-4 text-muted-foreground" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                                <span>{isLoading ? 'Chargement...' : 'Afficher plus de résultats'}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {/* Rendu du composant modal s'il y a un courrier sélectionné */}
            {courrierToView && (
                <CourrierValidationDetailsModal
                courrier={courrierToView}
                onClose={() => setCourrierToView(null)}
                isSupervisor={isSupervisor}
                onValidate={onValidate}
                onRemarque={onRemarque}
                />
            )}
        </div>
    );
};
