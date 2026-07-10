import { useState, useCallback } from 'react';
import { NumeroDepart } from '../../utilisateurs/types/numeroDepart';
import { numeroDepartService } from '../services/numeroDepartService';

export const useNumeroDeparts = () => {
  const [numeroDepart, setNumeroDepart] = useState<NumeroDepart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNumeroDepart = useCallback(async (isSend: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const data = await numeroDepartService.getNumeroDeparts(isSend);
      setNumeroDepart(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Impossible de charger les utilisateurs');
    } finally {
      setLoading(false);
    }
  }, []);
  const creerNumeroDepart = useCallback(async (numeroDepart: NumeroDepart): Promise<NumeroDepart> => {
    setLoading(true);
    setError(null);
    try {
      const data = await numeroDepartService.createNumeroDepart(numeroDepart);
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Impossible de créer le numéro de départ');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  return { numeroDepart, loading, error, fetchNumeroDepart, creerNumeroDepart };
};
