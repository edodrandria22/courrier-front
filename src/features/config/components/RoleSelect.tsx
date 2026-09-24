"use client";

import React from "react";
import { useRoles } from "../contexts/RoleContext";

interface RoleSelectProps {
    value?: string | number;
    onChange: (value: string) => void;
    error?: string;
}

export const RoleSelect: React.FC<RoleSelectProps> = ({ value, onChange, error }) => {
    const { roles, isLoading } = useRoles();

    return (
        <div className="space-y-1.5">
            {/* Label mis à jour pour le Dark Mode */}
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest block">
                Rôle
            </label>
            
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={isLoading}
                    className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none appearance-none transition-all focus:ring-2 border
                        bg-white text-slate-900 focus:bg-white
                        dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900
                        ${error 
                            ? "border-red-500 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/50" 
                            : "border-slate-200 dark:border-slate-700 focus:ring-slate-900/10 dark:focus:ring-slate-100/10 focus:border-slate-900 dark:focus:border-slate-400"
                        }`}
                    style={{
                        // L'icône de chevron existante est grise (#94a3b8 / slate-400), elle s'adapte très bien aux deux thèmes !
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center', // Décalé pour correspondre au nouveau padding (px-4)
                        backgroundSize: '1em'
                    }}
                >
                    <option value="">Choisir un rôle...</option>
                    {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                    ))}
                </select>

                {/* Spinner de chargement adapté pour le Dark Mode */}
                {isLoading && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2">
                        <div className="h-4 w-4 border-2 border-slate-300 dark:border-slate-600 border-t-slate-900 dark:border-t-white rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* Message d'erreur adapté pour le Dark Mode */}
            {error && <p className="text-[10px] text-red-600 dark:text-red-400 font-bold mt-1">{error}</p>}
        </div>
    );
};