import { useFetchAuth } from '@/hooks/useFetchAuth';
import { CourrierValidation } from '../type/courrierValidation';
export const courrierService = {
  // ─── Courriers ───────────────────────────────────────────────────────────

  getCourriersValidationsByUser: async (dateCursor?: string): Promise<CourrierValidation[]> => {
    try {
      const fetchWithAuth = useFetchAuth();
      // 1. Construire l'URL avec le paramètre de recherche si la date est fournie
      const params = new URLSearchParams();

      params.set("limit", process.env.NEXT_PUBLIC_NB_LIMIT_COURRIERS || "10");

      if (dateCursor) {
        params.set("date", dateCursor);
      }
      const url = `/api/courriersValidations?${params.toString()}`;
      const res = await fetchWithAuth(url);

      if (!res.ok) {
          throw new Error('Impossible de charger les courriers');
      }

      const json = await res.json();
            return json.data as CourrierValidation[];
    } catch (error) {
      throw error;
    }
  },

    createCourrierValidation: async (
        data: CourrierValidation,
        files: File[] = []
    ): Promise<CourrierValidation> => {
        try {
            const fetchWithAuth = useFetchAuth();
            const REQUIRED_FIELDS = ['object', 'dateDebut', 'dateFin', 'ville'] as const;
            const OPTIONAL_FIELDS = ['observation', 'numeroDepart'] as const;

            const formData = new FormData();

            REQUIRED_FIELDS.forEach((key) => formData.append(key, data[key]));

            OPTIONAL_FIELDS.forEach((key) => {
            if (data[key]) formData.append(key, String(data[key]));
            });

            formData.append('detailPersonnes', JSON.stringify(data.detailPersonnes));
            files.forEach((file) => formData.append('fichiers[]', file));

            const res = await fetchWithAuth('/api/courriersValidations', {
            method: 'POST',
            body: formData,
            });

            const json = await res.json();

            if (!res.ok) {
            throw new Error(json.error ?? json.message ?? 'Erreur lors de la création');
            }

            return json.data as CourrierValidation;
        } catch (error) {
            throw error;
        }
    },


  downloadFichier: async (id: number): Promise<{ blob: Blob; nom: string; type: string }> => {
    try {
      const fetchWithAuth = useFetchAuth();
      const res = await fetchWithAuth(`/api/fichiersValidations/${id}/download`)
      if (!res.ok) throw new Error('Impossible de télécharger le fichier')
      const blob = await res.blob()
      const disposition = res.headers.get('content-disposition') ?? ''
      const nom = disposition.match(/filename="?([^"]+)"?/)?.[1] ?? 'fichier'
      const type = res.headers.get('content-type') ?? 'application/octet-stream'
      return { blob, nom, type }
    } catch (error) {
      throw error;
    }
  },

  // ─── Actions ──────────────────────────────────────────────────────────────

  validerCourrierValidation: async (id: number): Promise<CourrierValidation> => {
    try {
      const fetchWithAuth = useFetchAuth();
      const res = await fetchWithAuth(`/api/courriersValidations/${id}/valider`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? json.message ?? 'Impossible de clôturer le courrier');
      }
      const json = await res.json();
      return json.data as CourrierValidation;
    } catch (error) {
      throw error;
    }
  },
  ajouterRemarque: async (id: number, remarque:string): Promise<CourrierValidation> => {
    try {
      const fetchWithAuth = useFetchAuth();
      const res = await fetchWithAuth(`/api/courriersValidations/${id}/remarque`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remarque }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? json.message ?? 'Impossible d\'ajouter la remarque');
      }
      const json = await res.json();
      return json.data as CourrierValidation;
    } catch (error) {
      throw error;
    }
  },


};
