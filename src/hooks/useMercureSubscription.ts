"use client";

import { useEffect, useRef } from "react";

const MERCURE_HUB_URL = `http://${process.env.NEXT_PUBLIC_IP_BACKEND}:4000/.well-known/mercure`;

export function useMercureSubscription<T>(
  topics: string | string[],
  onMessage: (data: T) => void
): void {
  const onMessageRef = useRef(onMessage);
  
  // On garde une référence à l'instance pour être sûr de la fermer
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    // 1. Fermer toute connexion existante avant d'en ouvrir une nouvelle
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url = new URL(MERCURE_HUB_URL);
    const topicsArray = Array.isArray(topics) ? topics : [topics];
    topicsArray.forEach(t => url.searchParams.append("topic", t));

    const es = new EventSource(url.toString());
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data: T = JSON.parse(event.data);
        // console.log(data)
        onMessageRef.current(data);
      } catch (err) {
        // console.error("Erreur parsing Mercure", err);
      }
    };

    es.onerror = () => {
      // Sur mobile, l'erreur arrive souvent quand on change de page ou d'onglet
      // On évite de polluer la console si la connexion est intentionnellement fermée
      if (es.readyState === EventSource.CLOSED) return;
      // console.error("[Mercure] Problème de connexion");
    };

    // 2. Nettoyage CRUCIAL lors du changement de page
    return () => {
      if (es) {
        es.close();
        eventSourceRef.current = null;
      }
    };
    // On utilise une clé stable pour les topics
  }, [JSON.stringify(topics)]); 
}