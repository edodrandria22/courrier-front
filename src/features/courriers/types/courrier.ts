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
}

// Kept for backward compatibility with CourrierForm
export interface Courrier {
  id?: number;
  reference?: string;
  object: string;
  description?: string;
  email?: string;
  nom?: string;
  numero?:number;
  prenom?: string;
  dateFin?: string;
  createdAt?: string;
  createur?: User;
  cloturePar?: User | null;
  statut?: string;
  telephone?: string;
}

