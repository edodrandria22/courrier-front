"use client";

import { MessageCourrier } from "@/features/courriers/types/courrier";

interface MessagePermissions {
  // true si l'utilisateur connecté est le destinataire du DERNIER message
  isLastRecipient: boolean;
  // Peut transférer : seulement le destinataire du dernier message
  canTransfer: boolean;
  // Peut clôturer : seulement le destinataire du dernier message
  canCloturer: boolean;
  // Retourne true si l'utilisateur est concerné par ce message (expéditeur OU destinataire)
  isMessageVisible: (message: MessageCourrier) => boolean;
  // Retourne true si c'est le dernier message de la liste
  isLastMessage: (message: MessageCourrier) => boolean;
  // Retourne true si l'utilisateur est le destinataire de CE message précis
  isDestinataireOf: (message: MessageCourrier) => boolean;
}

/**
 * currentUserId doit être passé depuis un composant parent stable (ex: CourrierTemplate)
 * pour éviter les race conditions liées au chargement asynchrone de l'utilisateur.
 */
export function useMessagePermissions(
  messages: MessageCourrier[],
  currentUserId: string | null
): MessagePermissions {
  // Le dernier message = celui avec l'id le plus élevé
  const lastMessage =
    messages.length > 0
      ? messages.reduce((prev, curr) => (curr.id > prev.id ? curr : prev))
      : null;

  const isLastRecipient =
    !!currentUserId &&
    !!lastMessage &&
    String(lastMessage.destinataire.id) === String(currentUserId);

  const isLastMessage = (message: MessageCourrier): boolean =>
    !!lastMessage && message.id === lastMessage.id;

  // L'utilisateur ne voit que les messages où il est expéditeur OU destinataire
  const isMessageVisible = (message: MessageCourrier): boolean => {
    if (!currentUserId) return false;
    return (
      String(message.expediteur.id) === String(currentUserId) ||
      String(message.destinataire.id) === String(currentUserId)
    );
  };

  const isDestinataireOf = (message: MessageCourrier): boolean =>
    !!currentUserId && String(message.destinataire.id) === String(currentUserId);

  return {
    isLastRecipient,
    canTransfer: isLastRecipient,
    canCloturer: isLastRecipient,
    isMessageVisible,
    isLastMessage,
    isDestinataireOf,
  };
}
