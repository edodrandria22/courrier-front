import { useState } from 'react';
import { toast } from 'sonner'; // Ou votre bibliothèque de notification préférée

export const envoyerEmailSuivi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (reference: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/courriers/envoyer-email-suivre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'envoi de l'email");
      }

      toast.success("Email de suivi envoyé avec succès !");
      return { success: true, data };
    } catch (err: any) {
      const message = err.message || "Une erreur est survenue";
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { sendEmail, loading, error };
};