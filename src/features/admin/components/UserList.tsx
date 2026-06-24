"use client";

import React, { useEffect, useState } from "react";
import { User } from "@/features/auth/types/login";
import { utilisateurService } from "@/features/utilisateurs/services/utilisateurService";
import { AppTableSkeleton } from "@/features/common/components/ui/AppTableSkeleton";

interface UserListProps {
    onAddUser: () => void;
    onEditUser: (user: User) => void;
    refreshKey: number;
}

export const UserList: React.FC<UserListProps> = ({ onAddUser, onEditUser, refreshKey }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [date, setDate] = useState<string>("");
     const nbLimit = Number(process.env.NEXT_PUBLIC_NB_LIMIT_UTILISATEURS) || 2;

    const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const data = await utilisateurService.getUtilisateurs();
                if (data && data.length < nbLimit) setHasMore(false);
                setUsers(data);
                setDate(data[data.length - 1]?.createdAt || "");
            } catch (error) {
                console.error("Erreur chargement utilisateurs", error);
            } finally {
                setIsLoading(false);
            }
        }; 
    const fetchUsersPlus = async () => {
            setIsLoading(true);
            try {
                const data = await utilisateurService.getUtilisateurs(date);
                if (data && data.length < nbLimit) setHasMore(false);
                setUsers(prev => [...prev, ...data]);
                setDate(data[data.length - 1]?.createdAt || "");
            } catch (error) {
                console.error("Erreur chargement utilisateurs", error);
            } finally {
                setIsLoading(false);
            }
        };
    useEffect(() => {
        fetchUsers();
    }, [refreshKey]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-foreground">
                    Comptes Utilisateurs
                    </h2>

                    <p className="text-sm text-muted-foreground mt-1">
                    Liste des agents et administrateurs enregistrés.
                    </p>
                </div>
                <button
                onClick={onAddUser}
                style={{ color: "#ffffff" }}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold uppercase tracking-widest rounded transition-all shadow-sm flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter un utilisateur
                </button>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 z-10 bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-[10px]">Nom & Prénom</th>
                                <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-[10px]">Email</th>
                                <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-[10px]">Adresse</th>
                                <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-[10px]">Rôle</th>
                                <th className="px-6 py-4 font-bold text-slate-900 uppercase tracking-widest text-[10px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="p-0">
                                        <AppTableSkeleton rows={8} cols={4} className="border-0 shadow-none rounded-none" />
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-foreground">
                                                {user.nom} {user.prenom}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground font-medium">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.adresse}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                user.role === "Utilisateur"
                                                ? "bg-secondary text-secondary-foreground"
                                                : user.role === "Admin"
                                                ? "bg-primary/10 text-primary"
                                                : "bg-muted text-muted-foreground"
                                            }`}
                                            >
                                            {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => onEditUser(user)}
                                                className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                                                title="Modifier l'utilisateur"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {hasMore && (
                <div className="flex justify-center px-4 pb-4 pt-2">
                  <button
                    onClick={fetchUsersPlus}
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
