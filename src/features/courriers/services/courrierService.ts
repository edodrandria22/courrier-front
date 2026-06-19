import { User } from '@/features/auth/types/login';
import { MessageCourrier, Courrier } from '../types/courrier';
import { CourrierSearchCriteria } from '../types/recherche';
import { logger } from '@/lib/logger';
import { useFetchAuth } from '@/hooks/useFetchAuth';

// ─── Types bruts de l'API ──────────────────────────────────────────────────


// ─── Fonctions de mapping ─────────────────────────────────────────────────

// function mapApiToCourrier(api: ApiCourrier): CourrierItem {
//   return {
//     id: api.id,
//     reference: api.reference,
//     objet: api.object,
//     description: api.description,
//     statut: api.cloturePar ? 'finalise' : 'en_cours',
//     dateCreation: api.dateMessage ?? new Date().toISOString(),
//     demandeur: {
//       nom: api.nom,
//       prenom: api.prenom,
//       email: api.email ?? '',
//     },
//   };
// }

// function mapApiToMessage(api: ApiMessage, idCourrier: number): MessageCourrier {
//   return {
//     id: api.id,
//     idCourrier,
//     contenu: api.observation ?? '',
//     dateCreation: api.dateValidation ?? api.isReadAt ?? new Date().toISOString(),
//     estFinalise: api.dateValidation !== null,
//     expediteur: {
//       id: api.expediteur.id,
//       nom: api.expediteur.role,
//       prenom: '',
//     },
//     destinataire: {
//       id: api.destinataire.id,
//       nom: api.destinataire.nom,
//       prenom: api.destinataire.prenom,
//       adresse: api.destinataire.adresse,
//     },
//     pieceJointes: (api.fichiers ?? []).map((f) => ({
//       id: f.id,
//       nom: f.nom ?? f.name ?? '',
//       taille: f.taille ?? f.size ?? 0,
//       type: f.type ?? '',
//       url: f.url ?? '',
//     })),
//   };
// }

// ─── Service ─────────────────────────────────────────────────────────────

export const courrierService = {
  // ─── Courriers ───────────────────────────────────────────────────────────

  getCourriers: async (): Promise<Courrier[]> => {
    try {
      const fetchWithAuth = useFetchAuth();
      // 1. Construire l'URL avec le paramètre de recherche si la date est fournie
      const url = '/api/courriers';

      const res = await fetchWithAuth(url);

      if (!res.ok) {
          // Optionnel : passer plus de détails au logger pour le débogage
          await logger.error('courrierService.getCourriers', res);
          throw new Error('Impossible de charger les courriers');
      }

      const json = await res.json();
      
      // On retourne json.data car votre backend Symfony utilise jsonSuccess($data)
      return json.data as Courrier[];
    } catch (error) {
      logger.exception('courrierService.getCourriers - Exception', error);
      throw error;
    }
  },

  getCourriersByUser: async (dateCursor?: string): Promise<Courrier[]> => {
    try {
      const fetchWithAuth = useFetchAuth();
      // 1. Construire l'URL avec le paramètre de recherche si la date est fournie
      const url = dateCursor 
          ? `/api/courriers/getAllbyUser?date=${encodeURIComponent(dateCursor)}` 
          : '/api/courriers/getAllbyUser';

      const res = await fetchWithAuth(url);

      if (!res.ok) {
          // Optionnel : passer plus de détails au logger pour le débogage
          await logger.error(`courrierService.getCourriersByUser (date: ${dateCursor})`, res);
          throw new Error('Impossible de charger vos courriers');
      }
      const json = await res.json();
      // console.log('📋 API getAllbyUser - premier courrier:', JSON.stringify(json.data?.[0], null, 2));
      return json.data as Courrier[];
    } catch (error) {
      logger.exception('courrierService.getCourriersByUser - Exception', error);
      throw error;
    }
  },
  getCourriersByUserSend: async (dateCursor?: string): Promise<Courrier[]> => {
    try {
      const fetchWithAuth = useFetchAuth();
      // 1. Construire l'URL avec le paramètre de recherche si la date est fournie
      const url = dateCursor 
          ? `/api/courriers/getAllbyUserSend?date=${encodeURIComponent(dateCursor)}` 
          : '/api/courriers/getAllbyUserSend';

      const res = await fetchWithAuth(url);

      if (!res.ok) {
          // Optionnel : passer plus de détails au logger pour le débogage
          await logger.error(`courrierService.getCourriersByUser (date: ${dateCursor})`, res);
          throw new Error('Impossible de charger vos courriers');
      }
      const json = await res.json();
      // console.log('📋 API getAllbyUser - premier courrier:', JSON.stringify(json.data?.[0], null, 2));
      return json.data as Courrier[];
    } catch (error) {
      logger.exception('courrierService.getCourriersByUser - Exception', error);
      throw error;
    }
  },

  getCourrierById: async (id: number): Promise<Courrier | null> => {
    try {
      const fetchWithAuth = useFetchAuth();
      const res = await fetchWithAuth(`/api/courriers/${id}`);
      if (!res.ok) {
        await logger.error(`courrierService.getCourrierById(${id})`, res);
        return null;
      }
      const json = await res.json();
      return json.data as Courrier;
    } catch (error) {
      logger.exception('courrierService.getCourrierById - Exception', error);
      throw error;
    }
  },

  createCourrier: async (data: Courrier): Promise<{ success: boolean; error?: string; courrier?: Courrier }> => {
    try {
      const fetchWithAuth = useFetchAuth();
      const res = await fetchWithAuth('/api/courriers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          object: data.object,
          description: data.description,
          email: data.email,
          nom: data.nom,
          prenom: data.prenom,
          telephone: data.telephone,
          isConfidentiel: data.isConfidentiel ?? false,
        }),
      });
      if (!res.ok) {
        await logger.error('courrierService.createCourrier', res);
        const json = await res.json();
        return { success: false, error: json.error ?? json.message ?? 'Erreur lors de la création' };
      }
      
      return { success: true, courrier: (await res.json()).data };
    } catch (error) {
      logger.exception('courrierService.createCourrier - Exception', error);
      return { success: false, error: 'Erreur lors de la création' };
    }
  },

  // ─── Messages d'un courrier ──────────────────────────────────────────────

  getMessagesByCourrier: async (idCourrier: number, dateCursor?: string): Promise<MessageCourrier[]> => {
    try {
      const fetchWithAuth = useFetchAuth();
      const url = dateCursor
        ? `/api/courriers/${idCourrier}/messages?date=${encodeURIComponent(dateCursor)}`
        : `/api/courriers/${idCourrier}/messages`;

      const res = await fetchWithAuth(url);
      if (!res.ok) {
        await logger.error(`courrierService.getMessagesByCourrier(${idCourrier}, ${dateCursor})`, res);
        throw new Error('Impossible de charger les messages');
      }
      const json = await res.json();
      return json.data as MessageCourrier[];
    } catch (error) {
      logger.exception('courrierService.getMessagesByCourrier - Exception', error);
      throw error;
    }
  },

  // ─── Fichiers ─────────────────────────────────────────────────────────────

  downloadFichier: async (id: number): Promise<{ blob: Blob; nom: string; type: string }> => {
    try {
      const fetchWithAuth = useFetchAuth();
      const res = await fetchWithAuth(`/api/fichiers/${id}/download`)
      if (!res.ok) throw new Error('Impossible de télécharger le fichier')
      const blob = await res.blob()
      const disposition = res.headers.get('content-disposition') ?? ''
      const nom = disposition.match(/filename="?([^"]+)"?/)?.[1] ?? 'fichier'
      const type = res.headers.get('content-type') ?? 'application/octet-stream'
      return { blob, nom, type }
    } catch (error) {
      logger.exception('courrierService.downloadFichier - Exception', error);
      throw error;
    }
  },

  // ─── Actions ──────────────────────────────────────────────────────────────

  cloturerCourrier: async (id: number): Promise<Courrier> => {
    try {
      const fetchWithAuth = useFetchAuth();
      const res = await fetchWithAuth(`/api/courriers/${id}/cloturer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        await logger.error(`courrierService.cloturerCourrier(${id})`, res);
        throw new Error('Impossible de clôturer le courrier');
      }
      const json = await res.json();
      return json.data as Courrier;
    } catch (error) {
      logger.exception('courrierService.cloturerCourrier - Exception', error);
      throw error;
    }
  },

  // ─── Recherche ─────────────────────────────────────────────────────────────

  searchCourriers: async (criteria: CourrierSearchCriteria, date?: string): Promise<Courrier[]> => {
    try {
      const fetchWithAuth = useFetchAuth();
      
      // Ajouter la date du jour par défaut si aucune date n'est fournie
      const searchCriteria = {
        ...criteria,
        dateDebut: criteria.dateDebut || '2026-01-01',
        dateFin: criteria.dateFin || '2050-01-01',
        date: date || null // Ajouter la date de pagination dans le DTO
      };

      const res = await fetchWithAuth('/api/courriers/recherche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchCriteria),
      });

      if (!res.ok) {
        // await logger.error('courrierService.searchCourriers', res);
        throw new Error('Impossible de rechercher les courriers');
      }
      const json = await res.json();
      return json.data as Courrier[];
    } catch (error) {
      // logger.exception('courrierService.searchCourriers - Exception', error);
      throw error;
    }
  },
  updateCourrier: async (id: number, data: Courrier): Promise<{ success: boolean; error?: string; courrier?: Courrier }> => {
   try {
      const fetchWithAuth = useFetchAuth();
      const res = await fetchWithAuth(`/api/courriers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          object: data.object,
          description: data.description,
          email: data.email,
          nom: data.nom,
          prenom: data.prenom,
          telephone: data.telephone,
          isConfidentiel: data.isConfidentiel ?? false,
        }),
      });
      if (!res.ok) {
        await logger.error('courrierService.updateCourrier', res);
        const json = await res.json();
        return { success: false, error: json.error ?? json.message ?? 'Erreur lors de la mise à jour' };
      }
      
      return { success: true, courrier: (await res.json()).data };
    } catch (error) {
      logger.exception('courrierService.updateCourrier - Exception', error);
      return { success: false, error: 'Erreur lors de la mise à jour' };
    }
  },
  updateHistorique: async (id: number, observation: string): Promise<Courrier> => {
   try {
      const fetchWithAuth = useFetchAuth();
      const res = await fetchWithAuth(`/api/courriers/historique/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          observation: observation,
        }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? json.message ?? 'Erreur lors de la mise à jour');
      }
      
      const json = await res.json();
      return json.data as Courrier;
    } catch (error) {
      logger.exception('courrierService.updateHistorique - Exception', error);
      throw error;
    }
  },
};
