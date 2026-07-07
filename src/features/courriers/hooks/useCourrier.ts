import { useState, useCallback } from 'react';
import {MessageCourrier, Courrier } from '../types/courrier';
import { courrierService } from '../services/courrierService';
import { logger } from '@/lib/logger';

export const useCourrier = () => {
  const [courriers, setCourriers] = useState<Courrier[]>([]);
  const [messages, setMessages] = useState<MessageCourrier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourriers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await courrierService.getCourriers();
      setCourriers(data);
    } catch (err: unknown) {
      logger.exception('useCourrier.fetchCourriers', err);
      setError(err instanceof Error ? err.message : 'Impossible de charger les courriers');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCourriersByUser = useCallback(async (dateCursor?: string,isTraiterAt?: boolean|null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await courrierService.getCourriersByUser(dateCursor,isTraiterAt);
      
      setCourriers((prev) => {
        // Si on n'a pas de curseur, c'est le chargement initial : on remplace tout.
        if (!dateCursor) {
          return data;
        }
        
        // Si on a un curseur, on filtre pour éviter les doublons et on ajoute à la suite.
        const existingIds = new Set(prev.map(c => c.id));
        const uniqueNewData = data.filter(c => !existingIds.has(c.id));
        
        return [...prev, ...uniqueNewData];
      });

      return data; // Important : retourner les données pour que le composant sache combien ont été reçues
    } catch (err: unknown) {
      logger.exception('useCourrier.fetchCourriersByUser', err);
      setError(err instanceof Error ? err.message : 'Impossible de charger vos courriers');
      return [];
    } finally {
      setLoading(false);
    }
  }, [setCourriers]);
  const fetchCourriersByUserSend = useCallback(async (dateCursor?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await courrierService.getCourriersByUserSend(dateCursor);
      
      setCourriers((prev) => {
        // Si on n'a pas de curseur, c'est le chargement initial : on remplace tout.
        if (!dateCursor) {
          return data;
        }
        
        // Si on a un curseur, on filtre pour éviter les doublons et on ajoute à la suite.
        const existingIds = new Set(prev.map(c => c.id));
        const uniqueNewData = data.filter(c => !existingIds.has(c.id));
        
        return [...prev, ...uniqueNewData];
      });

      return data; // Important : retourner les données pour que le composant sache combien ont été reçues
    } catch (err: unknown) {
      logger.exception('useCourrier.fetchCourriersByUserUser', err);
      setError(err instanceof Error ? err.message : 'Impossible de charger vos courriers send');
      return [];
    } finally {
      setLoading(false);
    }
  }, [setCourriers]);

  const fetchMessages = useCallback(async (idCourrier: number, dateCursor?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await courrierService.getMessagesByCourrier(idCourrier, dateCursor);
      
      setMessages((prev) => {
        // 1. Si c'est le chargement initial (pas de dateCursor), on remplace tout
        if (!dateCursor) {
          return data;
        }
        
        // 2. Si c'est une pagination, on fusionne en évitant les doublons
        // (Utile si un message arrive via Mercure entre-temps)
        const existingIds = new Set(prev.map(m => m.id));
        const uniqueNewData = data.filter(m => !existingIds.has(m.id));
        
        // On ajoute les anciens messages à la suite des messages actuels
        return [...prev, ...uniqueNewData];
      });

      return data; // Retourner les données pour que le composant puisse vérifier la longueur (hasMore)
    } catch (err: unknown) {
      logger.exception(`useCourrier.fetchMessages(${idCourrier}, ${dateCursor})`, err);
      setError(err instanceof Error ? err.message : 'Impossible de charger les messages');
      return [];
    } finally {
      setLoading(false);
    }
  }, [setMessages]);
  const createCourrier = useCallback(async (data: Courrier): Promise<{ success: boolean; error?: string , courrier?: Courrier}> => {
    setLoading(true);
    setError(null);
    try {
      const result = await courrierService.createCourrier(data);
      if (!result.success) setError(result.error ?? 'Erreur lors de la création');
      return result;
    } catch (err: unknown) {
      logger.exception('useCourrier.createCourrier', err);
      const msg = err instanceof Error ? err.message : 'Erreur lors de la création';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);
  const updateCourrier = useCallback(async (id: number, data: Courrier): Promise<{ success: boolean; error?: string , courrier?: Courrier}> => {
    setLoading(true);
    setError(null);
    try {
      const result = await courrierService.updateCourrier(id, data);
      if (!result.success) setError(result.error ?? 'Erreur lors de la mise à jour');
      return result;
    } catch (err: unknown) {
      logger.exception('useCourrier.updateCourrier', err);
      const msg = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);
  const updateHistorique = useCallback(async (id: number, observation: string): Promise<Courrier> => {
    setLoading(true);
    setError(null);
    try {
      const result = await courrierService.updateHistorique(id, observation);
      return result;
    } catch (err: unknown) {
      logger.exception('useCourrier.updateHistorique', err);
      const msg = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    courriers,
    messages,
    loading,
    error,
    fetchCourriers,
    fetchCourriersByUser,
    fetchMessages,
    createCourrier,
    setCourriers,
    setMessages,
    fetchCourriersByUserSend,
    updateCourrier,
    updateHistorique
  };
};
