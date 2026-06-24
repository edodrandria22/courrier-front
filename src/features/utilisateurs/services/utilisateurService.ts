import { logger } from '@/lib/logger';
import { useFetchAuth } from "@/hooks/useFetchAuth";
import { User } from '@/features/auth/types/login';

const fetchAuth = useFetchAuth();
export const utilisateurService = {
  getUtilisateurs: async (date?: string): Promise<User[]> => {
    try {
      const nbLimit = Number(process.env.NEXT_PUBLIC_NB_LIMIT_UTILISATEURS) || 2;
      const params = new URLSearchParams({ limit: String(nbLimit), ...(date && { date }) });
      
      const res = await fetchAuth(`/api/utilisateurs?${params}`);
      
      if (!res.ok) {
        await logger.error('utilisateurService.getUtilisateurs - Réponse HTTP KO', res);
        throw res;
      }

      const { data } = await res.json();
      return Array.isArray(data) ? data : [];

    } catch (error) {
      throw error;
    }
  },
  rechercheUtilisateurs: async (nomComplet: string, date?: string): Promise<User[]> => {
    try {
      const response = await fetchAuth("/api/utilisateurs/recherche", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nomComplet, date })
      });
    
      if (!response.ok) {
        throw response;
      }
    
      const responseData = await response.json();
      return responseData.data || responseData;
    } catch (error) {
      throw error;
    }
  },
  createUser: async (data: any): Promise<User> => {
        try {
            const response = await fetchAuth("/api/utilisateurs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || errorData.error || `Erreur serveur: ${response.status}`);
            }

            const responseData = await response.json();
            return responseData.data || responseData;
        } catch (error) {
            throw error;
        }
    },
    updateUser: async (id: number, data: { email: string; nom: string; prenom: string; adresse: string; idRole: number; mdp?: string }): Promise<User> => {
        try {
            const payload: any = {
                email: data.email,
                nom: data.nom,
                prenom: data.prenom,
                adresse: data.adresse,
                idRole: Number(data.idRole),
            };

            if (data.mdp && data.mdp.trim() !== "") {
                payload.mdp = data.mdp;
            }

            const response = await fetchAuth(`/api/utilisateurs?id=${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || errorData.error || `Erreur serveur: ${response.status}`);
            }

            const responseData = await response.json();
            return responseData.data || responseData;
        } catch (error) {
            throw error;
        }
    },
      
};
