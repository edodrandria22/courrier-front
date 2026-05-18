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
};
