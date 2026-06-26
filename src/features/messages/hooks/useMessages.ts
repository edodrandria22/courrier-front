import { useState, useCallback } from 'react';
import { MessageItem, MessageFolder } from '../types/message';
import { messageService } from '../services/messageService';
import { logger } from '@/lib/logger';

export const useMessages = (folder: MessageFolder = 'inbox') => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await messageService.getMessages(folder);
      setMessages(data);
    } catch (err: unknown) {
      logger.exception('useMessages.fetchMessages', err);
      setError(err instanceof Error ? err.message : 'Impossible de charger les messages');
    } finally {
      setLoading(false);
    }
  }, [folder]);

  const createMessage = useCallback(async (formData: FormData): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setError(null);
    try {
      const result = await messageService.createMessage(formData);
      if (!result.success) setError(result.error ?? 'Erreur lors de la création');
      return result;
    } catch (err: unknown) {
      logger.exception('useMessages.createMessage', err);
      const msg = err instanceof Error ? err.message : 'Erreur lors de la création';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const transfererMessage = useCallback(async (formData: FormData): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setError(null);
    try {
      const result = await messageService.transfererMessage(formData);
      if (!result.success) setError(result.error ?? 'Erreur lors du transfert');
      return result;
    } catch (err: unknown) {
      logger.exception('useMessages.transfererMessage', err);
      const msg = err instanceof Error ? err.message : 'Erreur lors du transfert';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const marquerLu = useCallback(async (id: number) => {
    const result = await messageService.marquerLu(id);
    if (result.success) {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, isReadAt: new Date().toISOString() } : m));
    }
    return result;
  }, []);

  const marquerNonLu = useCallback(async (id: number) => {
    const result = await messageService.marquerNonLu(id);
    if (result.success) {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, isReadAt: null } : m));
    }
    return result;
  }, []);
  const recupererExterne = useCallback(async (id: number): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setError(null);
    try {
      const result = await messageService.recupererExterne(id);
      if (!result.success) setError(result.error ?? 'Erreur lors du transfert');
      return result;
    } catch (err: unknown) {
      logger.exception('useMessages.transfererMessage', err);
      const msg = err instanceof Error ? err.message : 'Erreur lors du transfert';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    messages,
    loading,
    error,
    fetchMessages,
    createMessage,
    transfererMessage,
    marquerLu,
    marquerNonLu,
    recupererExterne,
  };
};