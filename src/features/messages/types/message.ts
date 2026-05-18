import { Courrier } from "@/features/courriers/types/courrier";
import { User } from "@prisma/client";

export interface MessageItem {
  id: number | string;
  courrier: Courrier;
  expediteur: User;
  destinataire: User;
  isReadAt?: string | null;
  observation?: string | null;
  dateValidation?: string | null;
}

export type MessageFolder = 'inbox' | 'sent' | 'received' | 'archive';