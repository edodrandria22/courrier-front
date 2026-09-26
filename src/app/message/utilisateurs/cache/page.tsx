// app/admin/cache/page.tsx
'use client';

import { useState, useTransition } from 'react';
import {
  revalidateEntites,
  revalidateEmployeurs,
  revalidateRoles,
  revalidateAll,
} from '@/features/config/services/revalidate';

type ActionKey = 'entites' | 'employeurs' | 'roles' | 'all';

export default function CachePage() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<ActionKey | null>(null);

  const handleRevalidate = (key: ActionKey, action: () => Promise<void>) => {
    setPendingAction(key);
    setMessage(null);

    startTransition(async () => {
      try {
        await action();
        setMessage(`✅ Cache "${key}" vidé avec succès`);
      } catch (error) {
        setMessage(`❌ Erreur lors de la revalidation de "${key}"`);
        console.error(error);
      }
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 480 }}>
      <h1>Gestion du cache</h1>
      <p>Purge manuelle des caches taggés côté serveur.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button
          disabled={isPending}
          onClick={() => handleRevalidate('entites', revalidateEntites)}
        >
          {isPending && pendingAction === 'entites' ? 'Purge en cours…' : 'Vider le cache des entités'}
        </button>

        <button
          disabled={isPending}
          onClick={() => handleRevalidate('employeurs', revalidateEmployeurs)}
        >
          {isPending && pendingAction === 'employeurs' ? 'Purge en cours…' : 'Vider le cache des employeurs'}
        </button>

        <button
          disabled={isPending}
          onClick={() => handleRevalidate('roles', revalidateRoles)}
        >
          {isPending && pendingAction === 'roles' ? 'Purge en cours…' : 'Vider le cache des rôles'}
        </button>

        <hr style={{ margin: '0.5rem 0' }} />

        <button
          disabled={isPending}
          onClick={() => handleRevalidate('all', revalidateAll)}
          style={{ fontWeight: 'bold' }}
        >
          {isPending && pendingAction === 'all' ? 'Purge en cours…' : 'Tout vider'}
        </button>
      </div>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}