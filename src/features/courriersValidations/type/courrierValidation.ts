import { User } from "@/features/auth/types/login";
import { DetailPersonne, PieceJointe } from "@/features/courriers/types/courrier";
export interface CourrierValidation {
  id?: number;
  object: string;
  ville:string;
  dateDebut:string;
  dateFin:string;
  dateValidation?: string;
  observation?: string;
  observationSuperviseur?: string;
  numeroDepart:Number|null;
  originId:number|null;
  createdAt?: string;
  createur?: User;
  detailPersonnes: Array<DetailPersonne>;
  files:PieceJointe[]
}
