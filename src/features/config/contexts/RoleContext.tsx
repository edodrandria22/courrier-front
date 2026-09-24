"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { roleService, Role } from "../services/roleService";

interface RoleContextType {
    roles: Role[];
    isLoading: boolean;
    error: string | null;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                // Vérifier si les rôles sont dans le localStorage
                const cachedRoles = localStorage.getItem('roles');
                if (cachedRoles) {
                    setRoles(JSON.parse(cachedRoles));
                    setIsLoading(false);
                    return;
                }

                // Sinon, faire l'appel API
                const data = await roleService.getAllRoles();
                setRoles(data);
                localStorage.setItem('roles', JSON.stringify(data));
            } catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                setError(message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRoles();
    }, []);

    return (
        <RoleContext.Provider value={{ roles, isLoading, error }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRoles = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error("useRoles must be used within RoleProvider");
    }
    return context;
};

