import { logger } from '@/lib/logger';
import { MessageFolder } from '../types/message';

export const messageService = {
  getMessages: async (folder: MessageFolder = 'inbox') => {
    const res = await fetch(`/api/message?folder=${folder}`);
    if (!res.ok) {
      await logger.error('messageService.getMessages', res);
      throw new Error('Impossible de charger les messages');
    }
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  },

  createMessage: async (formData: FormData): Promise<{ success: boolean; error?: string }> => {
    const res = await fetch('/api/messages', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      await logger.error('messageService.createMessage', res);
      const json = await res.json();
      return { success: false, error: json.error ?? json.message ?? 'Erreur lors de la création' };
    }
    return { success: true };
  },

  transfererMessage: async (formData: FormData): Promise<{ success: boolean; error?: string }> => {
    const res = await fetch('/api/messages/transferer', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      await logger.error('messageService.transfererMessage', res);
      const json = await res.json();
      return { success: false, error: json.error ?? json.message ?? 'Erreur lors du transfert' };
    }
    return { success: true };
  },

  marquerLu: async (id: number): Promise<{ success: boolean; error?: string }> => {
    const res = await fetch(`/api/messages/${id}/lire`, { method: 'PATCH' });
    if (!res.ok) {
      await logger.error(`messageService.marquerLu(${id})`, res);
      const json = await res.json();
      return { success: false, error: json.error ?? json.message ?? 'Erreur lors du marquage' };
    }
    return { success: true };
  },

  marquerNonLu: async (id: number): Promise<{ success: boolean; error?: string }> => {
    const res = await fetch(`/api/messages/${id}/non-lu`, { method: 'PATCH' });
    if (!res.ok) {
      await logger.error(`messageService.marquerNonLu(${id})`, res);
      const json = await res.json();
      return { success: false, error: json.error ?? json.message ?? 'Erreur lors du marquage' };
    }
    return { success: true };
  },
};
