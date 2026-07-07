// ─── Entités de base ───────────────────────────────────────────────────────

import { User } from "@/features/auth/types/login";

export interface PieceJointe {
  id: number;
  nom: string;
  type: string;          // mime type (ex: application/pdf)
  dateFin: string | null;
  createdAt: string;
}

// ─── Courrier ──────────────────────────────────────────────────────────────

// export type CourrierStatut = 'en_cours' | 'finalise' | 'archive';


// export interface CourrierItem {
//   id: number;
//   reference: string;
//   email: string;
//   nom: string;
//   prenom: string;
//   telephone: string;
//   object: string;
//   description?: string;
//   createdAt?: string;
//   cloturePar: User

  
// }

// Utilisé pour le formulaire de création
export interface CourrierFormData {
  objet: string;
  description?: string;
  nomDemandeur: string;
  prenomDemandeur?: string;
  emailDemandeur: string;
  dateFin?: string;
}

// ─── Message (transfert d'un courrier) ────────────────────────────────────

export interface MessageCourrier {
  id: number;
  createdAt: string;
  isReadAt: string | null;
  observation: string | null;
  dateValidation: string | null;
  
  courrier: Courrier;
  
  // Relations utilisateurs
  expediteur: User;
  destinataire: User;

  fichiers: PieceJointe[];
  numeroExpediteur?: number;
  numeroDestinataire?: number;
}
export interface DetailPersonne {
  name: string;
  prenom: string|null;
  email: string|null;
  telephone: string|null;
}
// Kept for backward compatibility with CourrierForm
export interface Courrier {
  id?: number;
  reference?: string;
  object: string;
  description?: string;
  numero?:number;
  dateFin?: string;
  createdAt?: string;
  createur?: User;
  cloturePar?: User | null;
  statut?: string;
  isReadAt?: string | null;
  expediteur?: User | null;
  destinataire?: User | null;
  isSend?: boolean;
  dateMessage?: string;
  isConfidentiel?: boolean;
  historiqueId?: number;
  numRef?: number;
  observation?: string;
  detailPersonnes: Array<DetailPersonne>;
  isTraiterAt?: string | null;

}

