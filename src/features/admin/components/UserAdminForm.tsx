"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { utilisateurService } from "@/features/utilisateurs/services/utilisateurService";
import { RoleSelect } from "../../config/components/RoleSelect";
import { User } from "@/features/auth/types/login";
import { toast } from "sonner";

const userAdminSchema = z.object({
    nom: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
    prenom: z.string(),
    email: z.string().email("Adresse email invalide"),
    mdp: z.string().min(6, "6 caractères minimum"),
    confirmMdp: z.string().min(6, "6 caractères minimum"),
    idRole: z.string().min(1, "Veuillez choisir un rôle"),
    sigle: z.string().optional(),
    adresse: z.string().min(2, "L'adresse doit faire au moins 2 caractères"),
}).refine((data) => data.mdp === data.confirmMdp, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmMdp"],
});

type UserAdminFormValues = z.infer<typeof userAdminSchema>;

interface UserAdminFormProps {
    setUsers: (users: User[]) => void;
    users: User[];
    onSuccess: () => void;
    onCancel: () => void;
}

export const UserAdminForm: React.FC<UserAdminFormProps> = ({ setUsers, users, onSuccess, onCancel }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UserAdminFormValues>({
        resolver: zodResolver(userAdminSchema),
        defaultValues: {
            idRole: ""
        }
    });

    const onSubmit = async (data: UserAdminFormValues) => {
        setIsLoading(true);
        setError(null);

        const payload = {
            ...data,
            idRole: Number(data.idRole),
        };

        try {
            const user = await utilisateurService.createUser(payload);
            setUsers([user, ...users]);
            toast.success(`Utilisateur ${user.nom} ${user.prenom || ""} créé avec succès`);
            onSuccess();
        } catch (err: any) {
            const message = err.message || "Erreur lors de la création";
            toast.error(message);
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    // Classe utilitaire mise à jour pour gérer le Dark Mode
    const inputBaseClass = `w-full px-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 
        bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white
        dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-900 border`;

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-6 sm:p-8 max-w-2xl w-full mx-auto animate-fade-in">
            
            {/* En-tête */}
            <div className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-5">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Nouvel Utilisateur</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ajoutez un nouvel administrateur au système.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Ligne 1 : Nom & Prénom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nom</label>
                        <input
                            {...register("nom")}
                            type="text"
                            placeholder="Ex: Dupont"
                            className={`${inputBaseClass} ${errors.nom ? "border-red-500 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/50" : "focus:ring-slate-900/10 dark:focus:ring-slate-100/10 focus:border-slate-900 dark:focus:border-slate-400"}`}
                        />
                        {errors.nom && <p className="text-xs text-red-600 dark:text-red-400 font-medium">{errors.nom.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Prénom</label>
                        <input
                            {...register("prenom")}
                            type="text"
                            placeholder="Ex: Jean Paul"
                            className={`${inputBaseClass} ${errors.prenom ? "border-red-500 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/50" : "focus:ring-slate-900/10 dark:focus:ring-slate-100/10 focus:border-slate-900 dark:focus:border-slate-400"}`}
                        />
                        {errors.prenom && <p className="text-xs text-red-600 dark:text-red-400 font-medium">{errors.prenom.message}</p>}
                    </div>
                </div>

                {/* Ligne 2 : Email & Sigle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="votre@email.com"
                            className={`${inputBaseClass} ${errors.email ? "border-red-500 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/50" : "focus:ring-slate-900/10 dark:focus:ring-slate-100/10 focus:border-slate-900 dark:focus:border-slate-400"}`}
                        />
                        {errors.email && <p className="text-xs text-red-600 dark:text-red-400 font-medium">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sigle</label>
                        <input
                            {...register("sigle")}
                            type="text"
                            placeholder="Ex: JPD"
                            className={`${inputBaseClass} ${errors.sigle ? "border-red-500 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/50" : "focus:ring-slate-900/10 dark:focus:ring-slate-100/10 focus:border-slate-900 dark:focus:border-slate-400"}`}
                        />
                        {errors.sigle && <p className="text-xs text-red-600 dark:text-red-400 font-medium">{errors.sigle.message}</p>}
                    </div>
                </div>

                {/* Ligne 3 : Adresse (Pleine largeur) */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Adresse</label>
                    <input
                        {...register("adresse")}
                        type="text"
                        placeholder="Adresse complète"
                        className={`${inputBaseClass} ${errors.adresse ? "border-red-500 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/50" : "focus:ring-slate-900/10 dark:focus:ring-slate-100/10 focus:border-slate-900 dark:focus:border-slate-400"}`}
                    />
                    {errors.adresse && <p className="text-xs text-red-600 dark:text-red-400 font-medium">{errors.adresse.message}</p>}
                </div>

                {/* Ligne 4 : Mots de passe */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mot de passe</label>
                        <input
                            {...register("mdp")}
                            type="password"
                            placeholder="••••••••"
                            className={`${inputBaseClass} ${errors.mdp ? "border-red-500 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/50" : "focus:ring-slate-900/10 dark:focus:ring-slate-100/10 focus:border-slate-900 dark:focus:border-slate-400"}`}
                        />
                        {errors.mdp && <p className="text-xs text-red-600 dark:text-red-400 font-medium">{errors.mdp.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirmer mot de passe</label>
                        <input
                            {...register("confirmMdp")}
                            type="password"
                            placeholder="••••••••"
                            className={`${inputBaseClass} ${errors.confirmMdp ? "border-red-500 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/50" : "focus:ring-slate-900/10 dark:focus:ring-slate-100/10 focus:border-slate-900 dark:focus:border-slate-400"}`}
                        />
                        {errors.confirmMdp && <p className="text-xs text-red-600 dark:text-red-400 font-medium">{errors.confirmMdp.message}</p>}
                    </div>
                </div>

                {/* Ligne 5 : Rôle */}
                {/* Ligne 4 : Rôle */}
                <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <RoleSelect
                        value={watch("idRole")}
                        onChange={(val) => setValue("idRole", val, { shouldValidate: true })}
                        error={errors.idRole?.message}
                    />
                </div>
                {/* Gestion d'erreur globale */}
                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg text-center">
                        <p className="text-sm text-red-700 dark:text-red-400 font-semibold">{error}</p>
                    </div>
                )}

                {/* Boutons d'action */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 outline-none"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:ml-auto sm:w-auto px-6 py-2.5 bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:ring-4 focus:ring-slate-900/20 dark:focus:ring-white/20 outline-none flex justify-center items-center"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Enregistrement...
                            </span>
                        ) : "Créer l'utilisateur"}
                    </button>
                </div>
            </form>
        </div>
    );
};