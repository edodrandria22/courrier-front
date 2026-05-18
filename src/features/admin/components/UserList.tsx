"use client";

import React, { useEffect, useState } from "react";
import { User } from "@/features/auth/types/login";
import { adminService } from "@/features/admin/services/adminService";
import { AppTableSkeleton } from "@/features/common/components/ui/AppTableSkeleton";

interface UserListProps {
    onAddUser: () => void;
    onEditUser: (user: User) => void;
    refreshKey: number;
}

export const UserList: React.FC<UserListProps> = ({ onAddUser, onEditUser, refreshKey }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const data = await adminService.getAllUtilisateurs();
                setUsers(data);
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
                    <h2 className="text-xl font-bold text-slate-900">Comptes Utilisateurs</h2>
                    <p className="text-sm text-slate-500 mt-1">Liste des agents et administrateurs enregistrés.</p>
                </div>
                <button
                    onClick={onAddUser}
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded transition-all shadow-sm flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter un utilisateur
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-bold text-slate-900 uppercase tracking-widest text-[10px]">Nom & Prénom</th>
                                <th className="px-6 py-4 font-bold text-slate-900 uppercase tracking-widest text-[10px]">Email</th>
                                <th className="px-6 py-4 font-bold text-slate-900 uppercase tracking-widest text-[10px]">Adresse</th>
                                <th className="px-6 py-4 font-bold text-slate-900 uppercase tracking-widest text-[10px]">Rôle</th>
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
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-slate-900">{user.nom} {user.prenom}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.adresse}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'Utilisateur' ? 'bg-purple-50 text-purple-700' :
                                                    user.role === 'Admin' ? 'bg-blue-50 text-blue-700' :
                                                        'bg-slate-100 text-slate-600'
                                                }`}>
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
                </div>
            </div>
        </div>
    );
};
