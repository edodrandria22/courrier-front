import { logger } from '@/lib/logger';
import { MessageFolder } from '../types/message';

export const messageService = {
  getMessages: async (folder: MessageFolder = 'inbox') => {
    try {
      const res = await fetch(`/api/message?folder=${folder}`);
      
      if (!res.ok) {
        await logger.error('messageService.getMessages', res);
        throw new Error('Impossible de charger les messages');
      }
      
      const data = await res.json();
      return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      // Relance l'erreur exacte, ou la convertit en objet Error si ce n'en est pas un
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  createMessage: async (formData: FormData): Promise<{ success: boolean; error?: string }> => {
    try {
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
    } catch (error) {
      // Extrait le message de l'erreur interceptée
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  },

  transfererMessage: async (formData: FormData): Promise<{ success: boolean; error?: string }> => {
    try {
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
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  },

  marquerLu: async (id: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/messages/${id}/lire`, { method: 'PATCH' });
      
      if (!res.ok) {
        await logger.error(`messageService.marquerLu(${id})`, res);
        const json = await res.json();
        return { success: false, error: json.error ?? json.message ?? 'Erreur lors du marquage' };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  },

  marquerNonLu: async (id: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/messages/${id}/non-lu`, { method: 'PATCH' });
      
      if (!res.ok) {
        await logger.error(`messageService.marquerNonLu(${id})`, res);
        const json = await res.json();
        return { success: false, error: json.error ?? json.message ?? 'Erreur lors du marquage' };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  },
  recupererExterne: async (id: number): Promise<{ success: boolean; error?: string }> => {
    try {
      // On crée un formulaire virtuel et on y ajoute l'ID
      const formData = new FormData();
      formData.append('id', String(id));

      const res = await fetch('/api/messages/recupererExterne', {
        method: 'POST',
        body: formData, // Pas besoin de Headers, fetch gère le multipart automatiquement
      });
      
      if (!res.ok) {
        await logger.error('messageService.recupererExterne', res);
        const json = await res.json();
        return { success: false, error: json.error ?? json.message ?? 'Erreur lors du transfert' };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  },

};