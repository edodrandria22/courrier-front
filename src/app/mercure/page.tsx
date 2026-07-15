'use client';

import { useEffect, useState } from 'react';

// On définit une interface pour typer proprement nos données reçues
interface CourrierData {
    id: number;
    courrier: {
        reference: string;
        object: string;
        description: string;
        nom: string;
        prenom: string;
        dateMessage: string;
    };
    expediteur: {
        nom: string;
        prenom: string;
        email: string;
    };
    destinataire: {
        nom: string;
        prenom: string;
        email: string;
    };
}

export default function MercureTestPage() {
    // On change l'état pour stocker un tableau d'objets CourrierData
    const [notifications, setNotifications] = useState<CourrierData[]>([]);
    const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

    const MERCURE_HUB_URL = 'http://'+`${process.env.NEXT_PUBLIC_IP_BACKEND}` + ':4000/.well-known/mercure'; 
    const TOPIC = 'message'; 
    
    useEffect(() => {
        const url = new URL(MERCURE_HUB_URL);
        url.searchParams.append('topic', TOPIC);

        const eventSource = new EventSource(url);

        eventSource.onopen = () => {
            // console.log("Connecté au Hub !");
            setStatus('connected');
        };

        eventSource.onmessage = (event) => {
            try {
                const data: CourrierData = JSON.parse(event.data);
                // console.log("Données reçues:", data);
                setNotifications((prev) => {
                    const exists = prev.find(n => n.id === data.id);
                    if (exists) return prev.map(n => n.id === data.id ? data : n);
                    return [data, ...prev];
                });
            } catch (e) {
                // console.error("Erreur de parsing JSON", e);
            }
        };

        eventSource.onerror = () => {
            // Si on est en train de reconnecter, on met 'connecting' plutôt que 'error'
            if (eventSource.readyState === EventSource.CONNECTING) {
                console.warn("Connexion perdue. Tentative de reconnexion automatique...");
                setStatus('connecting');
            } else if (eventSource.readyState === EventSource.CLOSED) {
                // console.error("Connexion fermée définitivement.");
                setStatus('error');
            }
        };

        return () => {
            eventSource.close();
        };
    }, [TOPIC]);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ borderBottom: '2px solid #0070f3', paddingBottom: '10px' }}>
                Gestion des Courriers (Live)
            </h1>
            
            <div style={{ marginBottom: '20px' }}>
                Statut de la connexion: 
                <span style={{ 
                    color: status === 'connected' ? '#2ecc71' : '#e74c3c',
                    fontWeight: 'bold', marginLeft: '10px'
                }}>
                    {status === 'connected' ? '● En ligne' : status}
                </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {notifications.length === 0 ? (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>Aucun nouveau courrier pour le moment...</p>
                ) : (
                    notifications.map((item) => (
                        <div key={item.id} style={{ 
                            border: '1px solid #ddd', 
                            borderRadius: '8px', 
                            padding: '15px', 
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <strong style={{ color: '#0070f3' }}>Réf: {item.courrier.reference}</strong>
                                <small style={{ color: '#999' }}>{item.courrier.dateMessage}</small>
                            </div>
                            
                            <h4 style={{ margin: '5px 0' }}>Objet: {item.courrier.object}</h4>
                            <p style={{ fontSize: '14px', color: '#444' }}>{item.courrier.description}</p>
                            
                            <hr style={{ border: '0', borderTop: '1px solid #eee' }} />
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                <span>
                                    <strong>De:</strong> {item.expediteur.nom} {item.expediteur.prenom} 
                                    <span style={{ color: '#666' }}> ({item.expediteur.email})</span>
                                </span>
                                <span>
                                    <strong>À:</strong> {item.destinataire.nom} {item.destinataire.prenom} 
                                    <span style={{ color: '#666' }}> ({item.destinataire.email})</span>
                                </span>
                                <span style={{ backgroundColor: '#e1f5fe', padding: '2px 8px', borderRadius: '10px' }}>
                                    Nouveau
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}