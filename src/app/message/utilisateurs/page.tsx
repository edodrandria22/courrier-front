"use client";

import React, { useState } from "react";
import { UserList } from "@/features/admin/components/UserList";
import { UserAdminForm } from "@/features/admin/components/UserAdminForm";
import { UserEditForm } from "@/features/admin/components/UserEditForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authService } from "@/features/auth/services/authService";
import { User } from "@/features/auth/types/login";
import { utilisateurService } from "@/features/utilisateurs/services/utilisateurService";
import { toast } from "sonner";
export default function AdminUsersPage() {

    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

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
                // Garde la trace dans la console
                // console.error("Erreur chargement utilisateurs", error);

                // Vérifie si l'erreur est bien un objet Error standard (très utile en TypeScript)
                if (error instanceof Error) {
                    toast.error(error.message); // Affiche le vrai message d'erreur
                } else {
                    // Message de secours si l'erreur a un format inattendu
                    toast.error("Une erreur inconnue est survenue.");
                }
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
                    // Garde la trace dans la console
                    // console.error("Erreur chargement utilisateurs", error);

                    // Vérifie si l'erreur est bien un objet Error standard (très utile en TypeScript)
                    if (error instanceof Error) {
                        toast.error(error.message); // Affiche le vrai message d'erreur
                    } else {
                        // Message de secours si l'erreur a un format inattendu
                        toast.error("Une erreur inconnue est survenue.");
                    }
            } finally {
                setIsLoading(false);
            }
        };
    const login = process.env.NEXT_PUBLIC_LOGIN_URL || '/login';
    useEffect(() => {
        checkAuth();
        fetchUsers();
    }, []);

    const checkAuth = async () => {
        try {
            const user = await authService.checkAuth();
            setUser(user);
            if (user.role !== "Admin") {
                authService.logout();
                router.push(login);
            }
        } catch (err) {
            authService.logout();
            router.push(login);
        }
        finally {
            setLoading(false);
        }
        // Note: setLoading(false) est géré dans le finally de fetchEvents pour ne pas masquer le contenu
    };

    // Pendant le chargement, on n'affiche rien pour éviter le flash
    if (loading) {
        return (
            <header className="h-16 border-b border-border bg-card flex items-center justify-end px-6">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            </header>
        )
    }

    // Guard express : Seul l'ADMIN peut voir cette page
    if (user && user.role !== "Admin") {
        // router.push(login);
        return null;
    }

    if (!user) return null;

    const handleSuccess = () => {
        setShowForm(false);
        setUserToEdit(null);

    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border">
                <div className="space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">
                    Administration
                </span>

                <h1 className="text-4xl font-bold text-foreground tracking-tight">
                    Gestion des Utilisateurs
                </h1>
                </div>
            </div>


            {showForm ? (
                <div className="flex justify-center py-10">
                    <UserAdminForm
                        users={users}
                        setUsers={setUsers}
                        onSuccess={handleSuccess}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            ) : userToEdit ? (
                <div className="flex justify-center py-10">
                    <UserEditForm
                        user={userToEdit}
                        users={users}
                        setUsers={setUsers}
                        onSuccess={handleSuccess}
                        onCancel={() => setUserToEdit(null)}
                    />
                </div>
            ) : (
                <UserList
                    users={users}
                    isLoading={isLoading}
                    fetchUsersPlus={fetchUsersPlus}
                    hasMore={hasMore}
                    onAddUser={() => setShowForm(true)}
                    onEditUser={(u) => setUserToEdit(u)}
                />
            )}
        </div>
    );
}
