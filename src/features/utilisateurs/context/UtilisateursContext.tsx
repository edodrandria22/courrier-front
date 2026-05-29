"use client";

import React, { createContext, useContext, useEffect, ReactNode, Context } from 'react';
import { useUtilisateurs } from '../hooks/useUtilisateurs';
import { Utilisateur } from '../types/utilisateur';

// 1. Définition de la structure de ce que le Contexte va partager
interface UtilisateursContextType {
  utilisateurs: Utilisateur[];
  loading: boolean;
}

// 2. Création du contexte typé explicitement (évite les erreurs de parsing)
const UtilisateursContext = createContext<UtilisateursContextType | undefined>(undefined);
// 3. Type pour les props du Provider
interface UtilisateursProviderProps {
  children: ReactNode;
}

// 4. Le Provider avec son typage
export const UtilisateursProvider = ({ children }: UtilisateursProviderProps) => {
  const { utilisateurs, loading, fetchUtilisateurs } = useUtilisateurs();

  // Le useEffect s'exécute UNE SEULE FOIS au chargement initial
  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchUtilisateurs();
    }
  }, [fetchUtilisateurs]); 

  return (
    <UtilisateursContext.Provider value={{ utilisateurs, loading }}>
      {children}
    </UtilisateursContext.Provider>
  );
};

// 5. Hook personnalisé typé pour consommer le contexte avec sécurité
export const useUtilisateursContext = (): UtilisateursContextType => {
  const context = useContext(UtilisateursContext);
  if (!context) {
    throw new Error("useUtilisateursContext doit être utilisé au sein d'un UtilisateursProvider");
  }
  return context;
};