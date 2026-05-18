'use client'

import React, { useState } from 'react';
import { Inbox } from 'lucide-react';
import { Courrier } from '../../types/courrier';
import { CourrierItemRow } from './CourrierItemRow';
import { CourrierDetailView } from '../CourrierView'; // Import de la vue détail

interface CourrierListProps {
  courriers: Courrier[];
  selectedIds: Set<string>;
  onSelect: (id: string, checked: boolean) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CourrierList = ({
  courriers,
  selectedIds,
  onSelect,
  onArchive,
  onDelete
}: CourrierListProps) => {
  // État pour suivre quel courrier est en cours de lecture
  const [viewingCourrier, setViewingCourrier] = useState<Courrier | null>(null);

  // Si l'utilisateur a cliqué sur un courrier, on affiche le détail
  if (viewingCourrier) {
    return (
      <div className="p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <CourrierDetailView
          courrier={viewingCourrier}
          onBack={() => setViewingCourrier(null)}
        />
      </div>
    );
  }

  // Design "Registre vide" (Inchangé)
  if (courriers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 md:px-6 bg-transparent">
        <div className="bg-primary/5 p-4 md:p-6 rounded-full mb-4 border border-primary/10">
          <Inbox className="w-12 h-12 text-primary/30" />
        </div>
        <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-widest">Registre vide</h3>
        <p className="text-muted-foreground/70 text-xs text-center max-w-[200px] mt-1 font-medium">
          Aucun courrier n'est enregistré pour le moment.
        </p>
      </div>
    );
  }

  // Liste des courriers (Design inchangé)
  return (
    <div className="divide-y divide-border bg-transparent overflow-hidden">
      {courriers.map((courrier) => (
        <CourrierItemRow
          key={courrier.id}
          courrier={courrier}
          isSelected={selectedIds.has(courrier.id?.toString() || '')}
          onSelect={onSelect}
          onArchive={onArchive}
          onDelete={onDelete}
          onClick={() => setViewingCourrier(courrier)} // Ouvre la vue détail au clic
        />
      ))}
    </div>
  );
};
