import { useState } from 'react';
import { Attachment } from '../types/compose';
import { messageService } from '../services/messageService';

export interface ComposeFormData {
  destId: number;
  courrierId: number;
  observation: string;
  attachments: Attachment[];
}

export const useComposeMessage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (data: ComposeFormData): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('destId', String(data.destId));
      formData.append('courrierId', String(data.courrierId));
      if (data.observation.trim()) {
        formData.append('observation', data.observation);
      }

      data.attachments.forEach((att) => {
        formData.append('fichiers[]', att.file);
      });

      return await messageService.createMessage(formData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error, setError };
};
