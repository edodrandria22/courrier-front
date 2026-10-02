"use client";

import React, { useState } from "react";
import { CourrierValidationList } from "@/features/courriersValidations/components/CourrierValidationList";
import { CourrierValidationForm } from "@/features/courriersValidations/components/form/CourrierValidationForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authService } from "@/features/auth/services/authService";
import { User } from "@/features/auth/types/login";
import { courrierValidationService } from "@/features/courriersValidations/service/courriersValidationsService";
import { toast } from "sonner";
import { CourrierValidation } from "@/features/courriersValidations/type/courrierValidation";
import { useMercureSubscription } from "@/hooks/useMercureSubscription";

export default function CourrierValidationsPage() {

    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [courrierToEdit, setCourrierToEdit] = useState<CourrierValidation | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [courriers, setCourriers] = useState<CourrierValidation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [date, setDate] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const nbLimit = Number(process.env.NEXT_PUBLIC_NB_LIMIT_COURRIERS) || 10;

    const fetchCourriers = async () => {
        setIsLoading(true);
        try {
            const data = await courrierValidationService.getCourriersValidationsByUser(statusFilter);
            if (data && data.length < nbLimit) setHasMore(false);
            setCourriers(data);
            setDate(data[data.length - 1]?.createdAt || "");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Une erreur inconnue est survenue.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCourriersPlus = async () => {
        setIsLoading(true);
        try {
            const data = await courrierValidationService.getCourriersValidationsByUser(statusFilter, date);
            if (data && data.length < nbLimit) setHasMore(false);
            setCourriers(prev => [...prev, ...data]);
            setDate(data[data.length - 1]?.createdAt || "");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Une erreur inconnue est survenue.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusFilterChange = (newStatus: string) => {
        setStatusFilter(newStatus);
        setDate(""); // Reset pagination when filter changes
        setHasMore(true);
    };
    // Mercure subscription for new courrier validations
    const validerDemande = (updatedCourrier: CourrierValidation) => {
        const exists = courriers?.some(c => c.originId === updatedCourrier.originId);
        setCourriers(courriers?.map(c => c.originId === updatedCourrier.originId ? updatedCourrier : c));
        if (exists) {
            toast.success("Demande validée pour " + updatedCourrier.object);
        }
    };
    const addRemarque = (updatedCourrier: CourrierValidation) => {
        const exists = courriers?.some(c => c.originId === updatedCourrier.originId);
        setCourriers(courriers?.map(c => c.originId === updatedCourrier.originId ? updatedCourrier : c));
        if (exists) {
            toast.success("Remarque ajoutée à la demande " + updatedCourrier.object);
        }
    };
    useMercureSubscription<CourrierValidation>(
        "courrierValidationValider",
        (newCourrier) => {
            validerDemande(newCourrier);
        }
    );
    useMercureSubscription<CourrierValidation>(
        "courrierValidationRemarque",
        (newCourrier) => {
            addRemarque(newCourrier);
        }
    );
    

    useEffect(() => {
        fetchCourriers();
    }, [statusFilter]);

    const login = process.env.NEXT_PUBLIC_LOGIN_URL || '/login';

    useEffect(() => {
        checkAuth();
        fetchCourriers();
    }, []);

    const handleValidate = async (id: number) => {
        try {
            const updatedCourrier = await courrierValidationService.validerCourrierValidation(id);
            setCourriers((prev) =>
                prev.map((c) => (c.id === id ? { ...c, dateValidation: updatedCourrier.dateValidation } : c))
            );
            toast.success("Courrier validé avec succès.");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Une erreur inconnue est survenue.");
            }
        } 
    };


    const handleRemarque = async (id: number, remarque: string) => {
        try {
            const updatedCourrier = await courrierValidationService.ajouterRemarque(id, remarque);
            setCourriers((prev) =>
                prev.map((c) => (c.id === id ? { ...c, observationSuperviseur: updatedCourrier.observationSuperviseur } : c))
            );
            toast.success("Remarque ajoutée avec succès.");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Une erreur inconnue est survenue.");
            }
        } 
    };

    const checkAuth = async () => {
        try {
            const user = await authService.checkAuth();
            if(user.role!="Om")
            {
                authService.logout();
                router.push(login);
            }
            setUser(user);
        } catch (err) {
            authService.logout();
            router.push(login);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <header className="h-16 border-b border-border bg-card flex items-center justify-end px-6">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            </header>
        )
    }

    if (!user) return null;

    const handleSuccess = () => {
        setShowForm(false);
        setCourrierToEdit(null);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border">
                <div className="space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">
                        Validation
                    </span>
                    <h1 className="text-4xl font-bold text-foreground tracking-tight">
                        Gestion des demandes
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground">Statut :</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => handleStatusFilterChange(e.target.value)}
                        className="px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        <option value="">Tous</option>
                        <option value="true">Validés</option>
                        <option value="false">Non validés</option>
                    </select>
                </div>
            </div>

            {showForm ? (
                <div className="flex justify-center py-10">
                    <CourrierValidationForm
                        onSuccess={handleSuccess}
                        courriersValidations={courriers}
                        setCourriersValidations={setCourriers}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            ) : courrierToEdit ? (
                <div className="flex justify-center py-10">
                    <CourrierValidationForm
                        courrierValidation={courrierToEdit}
                        courriersValidations={courriers}
                        setCourriersValidations={setCourriers}
                        onSuccess={handleSuccess}
                        onCancel={() => setCourrierToEdit(null)}
                    />
                </div>
            ) : (
                <CourrierValidationList
                    courriers={courriers}
                    isLoading={isLoading}
                    fetchCourriersPlus={fetchCourriersPlus}
                    hasMore={hasMore}
                    onAddCourrier={() => setShowForm(true)}
                    onEditCourrier={(c) => setCourrierToEdit(c)}
                    onValidate={handleValidate}
                    onRemarque={handleRemarque}
                />
            )}
        </div>
    );
}
