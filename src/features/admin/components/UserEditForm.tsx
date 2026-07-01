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
    prenom: z.string().min(2, "Le prénom doit faire au moins 2 caractères"),
    idRole: z.string().min(1, "Veuillez choisir un rôle"),
    adresse: z.string().min(2, "L'adresse doit faire au moins 2 caractères"),
    mdp: z.string().optional(),
    conf_mdp: z.string().optional(),
}).superRefine((data, ctx) => {
    const mdpFilled = data.mdp && data.mdp.trim() !== "";
    const confFilled = data.conf_mdp && data.conf_mdp.trim() !== "";

    // Si l'un est rempli mais pas l'autre
    if (mdpFilled && !confFilled) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Les mots de passe ne correspondent pas.",
            path: ["conf_mdp"],
        });
    } else if (!mdpFilled && confFilled) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Les mots de passe ne correspondent pas.",
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
    // console.log(user);
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
            prenom: user.prenom,
            adresse: user.adresse ?? "",
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
                    prenom: user.prenom,
                    adresse: user.adresse ?? "",
                    idRole: user.idRole ? user.idRole.toString() : "",
                    mdp: "",
                    conf_mdp: "",
                });
            } catch (err) {
                // console.error("Erreur chargement utilisateur", err);
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
                idRole: Number(data.idRole),
                mdp: mdpFilled ? data.mdp : undefined,
            });
            // Mettre à jour la liste des utilisateurs
            setUsers(users?.map(u => u.id === user.id ? updatedUser : u) || []);
            onSuccess();
        } catch (err: any) {
            setError(err.message || "Erreur lors de la modification");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="bg-white border border-slate-300 rounded-lg shadow-sm p-8 max-w-sm w-full flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-300 rounded-lg shadow-sm p-8 max-w-sm w-full animate-fade-in">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Modifier l'Utilisateur</h2>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">Édition du compte</p>
                </div>
                <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500">
                    ID #{user.id}
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block">Email</label>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="Entrer votre mail"
                        className={`w-full px-3 py-2 border rounded text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-1 focus:ring-slate-900 ${errors.email ? "border-red-500" : "border-slate-300"}`}
                    />
                    {errors.email && <p className="text-[10px] text-red-600 font-bold">{errors.email.message}</p>}
                </div>

                {/* Entité */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block">Nom</label>
                    <input
                        {...register("nom")}
                        type="text"
                        placeholder="Entrer votre nom"
                        className={`w-full px-3 py-2 border rounded text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-1 focus:ring-slate-900 ${errors.nom ? "border-red-500" : "border-slate-300"}`}
                    />
                    {errors.nom && <p className="text-[10px] text-red-600 font-bold">{errors.nom.message}</p>}
                </div>

                {/* Rang */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block">Prénom</label>
                    <input
                        {...register("prenom")}
                        type="text"
                        placeholder="Entrer votre prénom"
                        className={`w-full px-3 py-2 border rounded text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-1 focus:ring-slate-900 ${errors.prenom ? "border-red-500" : "border-slate-300"}`}
                    />
                    {errors.prenom && <p className="text-[10px] text-red-600 font-bold">{errors.prenom.message}</p>}
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block">Adresse</label>
                    <input
                        {...register("adresse")}
                        type="text"
                        placeholder="Entrer votre adresse"
                        className={`w-full px-3 py-2 border rounded text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-1 focus:ring-slate-900 ${errors.adresse ? "border-red-500" : "border-slate-300"}`}
                    />
                    {errors.adresse && <p className="text-[10px] text-red-600 font-bold">{errors.adresse.message}</p>}
                </div>

                {/* Rôle */}
                <RoleSelect
                    value={watch("idRole")}
                    onChange={(val) => setValue("idRole", val, { shouldValidate: true })}
                    error={errors.idRole?.message}
                />

                {/* Mot de passe */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 italic">
                        Laissez ces deux champs vides pour conserver le mot de passe actuel.
                    </p>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block">Nouveau mot de passe</label>
                        <input
                            {...register("mdp")}
                            type="password"
                            placeholder="••••••••"
                            className={`w-full px-3 py-2 border rounded text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-1 focus:ring-slate-900 ${errors.mdp ? "border-red-500" : "border-slate-300"}`}
                        />
                        {errors.mdp && <p className="text-[10px] text-red-600 font-bold">{errors.mdp.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block">Confirmer le mot de passe</label>
                        <input
                            {...register("conf_mdp")}
                            type="password"
                            placeholder="••••••••"
                            className={`w-full px-3 py-2 border rounded text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-1 focus:ring-slate-900 ${errors.conf_mdp ? "border-red-500" : "border-slate-300"}`}
                        />
                        {errors.conf_mdp && <p className="text-[10px] text-red-600 font-bold">{errors.conf_mdp.message}</p>}
                    </div>
                </div>

                {error && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded">
                        <p className="text-[10px] text-red-700 font-bold text-center">{error}</p>
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Enregistrement...
                            </>
                        ) : "Mettre à jour"}
                    </button>
                </div>
            </form>
        </div>
    );
};
