import { useState, useCallback } from 'react';
import { utilisateurService } from '../services/utilisateurService';
import { logger } from '@/lib/logger';
import { User } from '@/features/auth/types/login';

export const useUtilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUtilisateurs = useCallback(async (date?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await utilisateurService.getUtilisateurs(date);
      setUtilisateurs(data);
    } catch (err: unknown) {
      logger.exception('useUtilisateurs.fetchUtilisateurs', err);
      setError(err instanceof Error ? err.message : 'Impossible de charger les utilisateurs');
    } finally {
      setLoading(false);
    }
  }, []);
  const rechercheUtilisateurs = useCallback(async (nomComplet: string, date?: string): Promise<User[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await utilisateurService.rechercheUtilisateurs(nomComplet, date);
      return data;
    } catch (err: unknown) {
      logger.exception('useUtilisateurs.rechercheUtilisateurs', err);
      setError(err instanceof Error ? err.message : 'Impossible de charger les utilisateurs');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  return { utilisateurs, loading, error, fetchUtilisateurs, rechercheUtilisateurs };
};
