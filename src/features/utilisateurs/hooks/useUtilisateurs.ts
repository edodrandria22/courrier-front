import { useState, useCallback } from 'react';
import { Utilisateur } from '../types/utilisateur';
import { utilisateurService } from '../services/utilisateurService';
import { logger } from '@/lib/logger';

export const useUtilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUtilisateurs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await utilisateurService.getUtilisateurs();
      setUtilisateurs(data);
    } catch (err: unknown) {
      logger.exception('useUtilisateurs.fetchUtilisateurs', err);
      setError(err instanceof Error ? err.message : 'Impossible de charger les utilisateurs');
    } finally {
      setLoading(false);
    }
  }, []);

  return { utilisateurs, loading, error, fetchUtilisateurs };
};
