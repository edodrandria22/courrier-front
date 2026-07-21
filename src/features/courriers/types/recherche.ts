export interface CourrierSearchCriteria {
  reference?: string;
  object?: string;
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  utilisateurId?: number;
  isSend?: boolean;
  numero?: number;
  dateDebut?: string;
  dateFin?: string;
  statut?: 'en_cours' | 'finalise';
  date?: string; // Pour la pagination (dans le DTO)
  isConfidentiel?: boolean;
  numeroExpediteur?: number;
  numeroDestinataire?: number;
  dateMessageDebut?: string;
  dateMessageFin?: string;
  dateReceptionDebut?: string;
  dateReceptionFin?: string;
}

