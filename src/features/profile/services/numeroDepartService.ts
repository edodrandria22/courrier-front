import { logger } from '@/lib/logger';
import { NumeroDepart } from '../../utilisateurs/types/numeroDepart';
import { useFetchAuth } from '@/hooks/useFetchAuth';
const fetchAuth = useFetchAuth();
// Helper pour extraire les erreurs de l'API proprement
const handleResponseError = async (response: Response) => {
  let errorMessage = `Erreur HTTP : ${response.status}`;
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || errorMessage;
  } catch {
    // Si la réponse n'est pas du JSON valide
  }
  throw new Error(errorMessage);
};

export const numeroDepartService = {
  getNumeroDeparts: async (isSend: boolean): Promise<NumeroDepart> => {
    try {
      const params = new URLSearchParams({ isSend: String(isSend) });
      const response = await fetchAuth(`/api/numeroDeparts?${params}`);
    
      if (!response.ok) {
        await handleResponseError(response);
      }
    
      const responseData = await response.json();
      return responseData.data || responseData;
    } catch (error: any) {
      logger.error("Erreur [getNumeroDeparts] :", error);
      throw error;
    }
  },

  createNumeroDepart: async ( numeroDepart: NumeroDepart): Promise<NumeroDepart> => {
    try {
      const response = await fetchAuth("/api/numeroDeparts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isSend: numeroDepart.isSend, numero: numeroDepart.numero })
      });

      if (!response.ok) {
        await handleResponseError(response);
      }

      const responseData = await response.json();
      return responseData.data || responseData;
    } catch (error: any) {
      logger.error("Erreur [createNumeroDepart] :", error);
      throw error;
    }
  },
};