"use client";

import { CourrierValidation } from "../type/courrierValidation";
import { AppTableSkeleton } from "@/features/common/components/ui/AppTableSkeleton";
import { ConfirmDialog } from "@/features/common/components/ui/ConfirmDialog";
import { useState } from "react";

interface CourrierValidationListProps {
    courriers: CourrierValidation[];
    isLoading: boolean;
    fetchCourriersPlus: () => void;
    hasMore: boolean;
    onAddCourrier: () => void;
    onEditCourrier: (courrier: CourrierValidation) => void;
    onValidate: (id: number) => void;
    validatingId: number | null;
    onRemarque: (id: number, remarque: string) => void;
    remarquingId: number | null;
}

export const CourrierValidationList: React.FC<CourrierValidationListProps> = ({
    courriers,
    isLoading,
    fetchCourriersPlus,
    hasMore,
    onAddCourrier,
    onEditCourrier,
    onValidate,
    validatingId,
    onRemarque,
    remarquingId,
}) => {
    const [courrierToValidate, setCourrierToValidate] = useState<CourrierValidation | null>(null);
    const [courrierToRemarque, setCourrierToRemarque] = useState<CourrierValidation | null>(null);

    const handleConfirmValidate = () => {
        if (courrierToValidate) {
            onValidate(courrierToValidate.id!);
            setCourrierToValidate(null);
        }
    };

    const handleConfirmRemarque = () => {
        if (courrierToRemarque) {
            const remarque = prompt("Entrez votre remarque :");
            if (remarque && remarque.trim()) {
                onRemarque(courrierToRemarque.id!, remarque);
            }
            setCourrierToRemarque(null);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const getStatutBadge = (courrier: CourrierValidation) => {
        if (courrier.dateValidation) {
            return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700">Validé</span>;
        }
        if (courrier.observationSuperviseur) {
            return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700">En attente</span>;
        }
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">Nouveau</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-foreground">
                        Courriers en Validation
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Liste des courriers en attente de validation.
                    </p>
                </div>
                <button
                    onClick={onAddCourrier}
                    style={{ color: "#ffffff" }}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold uppercase tracking-widest rounded transition-all shadow-sm flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouveau courrier
                </button>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 z-10 bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-[10px]">Objet</th>
                                <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-[10px]">Ville</th>
                                <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-[10px]">Date Début</th>
                                <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-[10px]">Date Fin</th>
                                <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-[10px]">N° Départ</th>
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
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-foreground">
                                                {courrier.object}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground font-medium">
                                            {courrier.ville}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground font-medium">
                                            {formatDate(courrier.dateDebut)}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground font-medium">
                                            {formatDate(courrier.dateFin)}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground font-medium">
                                            {courrier.numeroDepart ? String(courrier.numeroDepart) : "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatutBadge(courrier)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => onEditCourrier(courrier)}
                                                    className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                                                    title="Modifier le courrier"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>

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
        </div>
    );
};
