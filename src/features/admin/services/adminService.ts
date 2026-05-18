import { User } from "@/features/auth/types/login";
import { useFetchAuth } from "@/hooks/useFetchAuth";

const fetchAuth = useFetchAuth();

export const adminService = {

    /**
     * Récupère la liste de tous les utilisateurs via le backend.
     */
    getAllUtilisateurs: async (): Promise<User[]> => {
        try {
            const response = await fetchAuth("/api/utilisateurs", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store"
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

    /**
     * Crée un nouvel utilisateur dans le backend.
     */
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

    /**
     * Récupère un utilisateur par son ID.
     */
    getUserById: async (id: number): Promise<User> => {
        try {
            const response = await fetchAuth(`/api/utilisateurs?id=${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store"
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

    /**
     * Met à jour les informations d'un utilisateur.
     */
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
