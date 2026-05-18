'use client'

import React from 'react';
import { Mail } from 'lucide-react';
import { MessageItem } from '../../types/message';
import { MessageItemRow } from './MessageItemRow';

interface MessageListProps {
  messages: MessageItem[];
  selectedIds: Set<string>;
  onSelect: (id: string, checked: boolean) => void;
}

export const MessageList = ({ messages = [], selectedIds, onSelect }: MessageListProps) => {
  const safeMessages = Array.isArray(messages) ? messages : [];
  console.log(safeMessages);
  // Affichage si la liste est vide
  if (safeMessages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 md:px-6 bg-transparent">
        <div className="bg-primary/5 p-4 md:p-6 rounded-full mb-4 border border-primary/10">
          <Mail className="w-12 h-12 text-primary/30" />
        </div>
        <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-widest">Aucun message</h3>
        <p className="text-muted-foreground/70 text-xs text-center max-w-[200px] mt-1 font-medium">
          Votre boîte de réception est actuellement vide.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border border-t border-border">
      {safeMessages.map((message) => (
        <MessageItemRow
          key={message.id}
          message={message}
          isSelected={selectedIds.has(message.id.toString())}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
