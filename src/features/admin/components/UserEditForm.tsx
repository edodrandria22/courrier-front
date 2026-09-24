"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { utilisateurService } from "@/features/utilisateurs/services/utilisateurService";
import { RoleSelect } from "../../config/components/RoleSelect";
import { User } from "@/features/auth/types/login";
import toast from "react-hot-toast";

const userEditSchema = z.object({
    email: z.string().email("Adresse email invalide"),
    nom: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
    prenom: z.string().optional(),
    idRole: z.string().min(1, "Veuillez choisir un rôle"),
    adresse: z.string().min(2, "L'adresse doit faire au moins 2 caractères"),
    sigle: z.string().optional(),
    mdp: z.string().optional(),
    conf_mdp: z.string().optional(),
}).superRefine((data, ctx) => {
    const mdpFilled = data.mdp && data.mdp.trim() !== "";
    const confFilled = data.conf_mdp && data.conf_mdp.trim() !== "";

    if (mdpFilled && !confFilled) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Veuillez confirmer le mot de passe.",
            path: ["conf_mdp"],
        });
    } else if (!mdpFilled && confFilled) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Veuillez saisir le nouveau mot de passe.",
            path: ["mdp"],
        });
    } else if (mdpFilled && confFilled && data.mdp !== data.conf_mdp) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Les mots de passe ne correspondent pas.",
            path: ["conf_mdp"],
        });
    }
});

type UserEditFormValues = z.infer<typeof userEditSchema>;

interface UserEditFormProps {
    user: User;
    users: User[];
    setUsers: (users: User[]) => void;
    onSuccess: () => void;
    onCancel: () => void;
}

export const UserEditForm: React.FC<UserEditFormProps> = ({ user, users, setUsers, onSuccess, onCancel }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<UserEditFormValues>({
        resolver: zodResolver(userEditSchema),
        defaultValues: {
            email: user.email,
            idRole: user.idRole?.toString() ?? "",
            nom: user.nom,
            prenom: user.prenom ?? "",
            adresse: user.adresse ?? "",
            sigle: user.sigle ?? "",
            mdp: "",
            conf_mdp: "",
        }
    });

    useEffect(() => {
        const loadUser = async () => {
            if (!user.id) {
                setIsFetching(false);
                return;
            }
            try {
                reset({
                    email: user.email,
                    nom: user.nom,
                    prenom: user.prenom ?? "",
                    adresse: user.adresse ?? "",
                    sigle: user.sigle ?? "",
                    idRole: user.idRole ? user.idRole.toString() : "",
                    mdp: "",
                    conf_mdp: "",
                });
            } catch (err) {
                toast.error("Impossible de charger les informations de l'utilisateur.");
                setError("Impossible de charger les informations de l'utilisateur.");
            } finally {
                setIsFetching(false);
            }
        };
        loadUser();
    }, [user.id, reset]);

    const onSubmit = async (data: UserEditFormValues) => {
        if (!user.id) return;
        setIsLoading(true);
        setError(null);

        const mdpFilled = data.mdp && data.mdp.trim() !== "";

        try {
            const updatedUser = await utilisateurService.updateUser(user.id, {
                email: data.email,
                nom: data.nom,
                prenom: data.prenom,
                adresse: data.adresse,
                sigle: data.sigle,
                idRole: Number(data.idRole),
                mdp: mdpFilled ? data.mdp : undefined,
            });
            
            setUsers(users?.map(u => u.id === user.id ? updatedUser : u) || []);
            onSuccess();
            toast.success("Utilisateur mis à jour avec succès");
        } catch (err: any) {
            const message = err.message || "Erreur lors de la modification";
            toast.error(message);
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    // Classe utilitaire pour uniformiser le style des inputs
    const inputBaseClass = "w-full px-4 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:outline-none transition-all";

    if (isFetching) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-8 max-w-2xl w-full mx-auto flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 sm:p-8 max-w-2xl w-full mx-auto animate-fade-in">
            
            {/* En-tête */}
            <div className="mb-8 border-b border-slate-100 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Modifier l'Utilisateur</h2>
                    <p className="text-sm text-slate-500 mt-1">Édition des informations du compte.</p>
                </div>
                <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                    ID #{user.id}
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Ligne 1 : Nom & Prénom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Nom</label>
                        <input
                            {...register("nom")}
                            type="text"
                            placeholder="Entrer le nom"
                            className={`${inputBaseClass} ${errors.nom ? "border-red-500 focus:ring-red-200 focus:border-red-500" : "border-slate-200 focus:ring-slate-900/10 focus:border-slate-900"}`}
                        />
                        {errors.nom && <p className="text-xs text-red-600 font-medium">{errors.nom.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Prénom</label>
                        <input
                            {...register("prenom")}
                            type="text"
                            placeholder="Entrer le prénom"
                            className={`${inputBaseClass} ${errors.prenom ? "border-red-500 focus:ring-red-200 focus:border-red-500" : "border-slate-200 focus:ring-slate-900/10 focus:border-slate-900"}`}
                        />
                        {errors.prenom && <p className="text-xs text-red-600 font-medium">{errors.prenom.message}</p>}
                    </div>
                </div>

                {/* Ligne 2 : Email & Sigle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Email</label>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="votre@email.com"
                            className={`${inputBaseClass} ${errors.email ? "border-red-500 focus:ring-red-200 focus:border-red-500" : "border-slate-200 focus:ring-slate-900/10 focus:border-slate-900"}`}
                        />
                        {errors.email && <p className="text-xs text-red-600 font-medium">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Sigle</label>
                        <input
                            {...register("sigle")}
                            type="text"
                            placeholder="Entrer le sigle"
                            className={`${inputBaseClass} ${errors.sigle ? "border-red-500 focus:ring-red-200 focus:border-red-500" : "border-slate-200 focus:ring-slate-900/10 focus:border-slate-900"}`}
                        />
                        {errors.sigle && <p className="text-xs text-red-600 font-medium">{errors.sigle.message}</p>}
                    </div>
                </div>

                {/* Ligne 3 : Adresse (Pleine largeur) */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Adresse</label>
                    <input
                        {...register("adresse")}
                        type="text"
                        placeholder="Entrer l'adresse complète"
                        className={`${inputBaseClass} ${errors.adresse ? "border-red-500 focus:ring-red-200 focus:border-red-500" : "border-slate-200 focus:ring-slate-900/10 focus:border-slate-900"}`}
                    />
                    {errors.adresse && <p className="text-xs text-red-600 font-medium">{errors.adresse.message}</p>}
                </div>

                {/* Ligne 4 : Rôle */}
                <div className="space-y-1.5 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <RoleSelect
                        value={watch("idRole")}
                        onChange={(val) => setValue("idRole", val, { shouldValidate: true })}
                        error={errors.idRole?.message}
                    />
                </div>

                {/* Section Sécurisée : Mots de passe */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="mb-4">
                        <h3 className="text-sm font-bold text-slate-800">Sécurité du compte</h3>
                        <p className="text-xs text-slate-500 mt-1">Laissez ces champs vides si vous ne souhaitez pas modifier le mot de passe.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Nouveau mot de passe</label>
                            <input
                                {...register("mdp")}
                                type="password"
                                placeholder="••••••••"
                                className={`${inputBaseClass} ${errors.mdp ? "border-red-500 focus:ring-red-200 focus:border-red-500" : "border-slate-200 focus:ring-slate-900/10 focus:border-slate-900"}`}
                            />
                            {errors.mdp && <p className="text-xs text-red-600 font-medium">{errors.mdp.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Confirmer le mot de passe</label>
                            <input
                                {...register("conf_mdp")}
                                type="password"
                                placeholder="••••••••"
                                className={`${inputBaseClass} ${errors.conf_mdp ? "border-red-500 focus:ring-red-200 focus:border-red-500" : "border-slate-200 focus:ring-slate-900/10 focus:border-slate-900"}`}
                            />
                            {errors.conf_mdp && <p className="text-xs text-red-600 font-medium">{errors.conf_mdp.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Gestion d'erreur globale */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                        <p className="text-sm text-red-700 font-semibold">{error}</p>
                    </div>
                )}

                {/* Boutons d'action */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-100 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-slate-200 outline-none"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:ml-auto sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:ring-4 focus:ring-slate-900/20 outline-none flex justify-center items-center"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Enregistrement...
                            </span>
                        ) : "Mettre à jour l'utilisateur"}
                    </button>
                </div>
            </form>
        </div>
    );
};