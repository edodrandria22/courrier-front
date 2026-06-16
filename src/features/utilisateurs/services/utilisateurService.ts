import { logger } from '@/lib/logger';
import { Utilisateur } from '../types/utilisateur';

export const utilisateurService = {
  getUtilisateurs: async (): Promise<Utilisateur[]> => {
    const res = await fetch('/api/utilisateurs');
    if (!res.ok) {
      await logger.error('utilisateurService.getUtilisateurs', res);
      throw new Error('Impossible de charger les utilisateurs');
    }
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  },
  getUtilisateursUtilisateur: async (): Promise<Utilisateur[]> => {
    const res = await fetch('/api/utilisateurs/utilisateur');
    if (!res.ok) {
      await logger.error('utilisateurService.getUtilisateursUtilisateur', res);
      throw new Error('Impossible de charger les utilisateurs');
    }
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  },
  rechercheUtilisateurs: async (nomComplet: string, date?: string): Promise<Utilisateur[]> => {
    try {
      const response = await fetch("/api/utilisateurs/recherche", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nomComplet, date })
      });
    
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Erreur serveur: ${response.status}`);
      }
    
      const responseData = await response.json();
      return responseData.data || responseData;
    } catch (error) {
      throw error;
    }
  },
      
};
