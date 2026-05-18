'use client'

import React from 'react';
import { Star, MoreVertical, Archive, Trash2, FileText } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { MessageItem } from '../../types/message';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { MessageDetail } from '../MessageDetail';
import { Badge } from "@/components/ui/badge";

interface MessageItemRowProps {
  message: MessageItem;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
}

export const MessageItemRow = ({
  message,
  isSelected,
  onSelect
}: MessageItemRowProps) => {
  const isUnread = message.isReadAt === null;
  const fullName = message.expediteur.name;

  return (
    <div
      className={cn(
        "group px-4 md:px-6 py-3 flex items-center gap-4 transition-all border-b border-border bg-transparent",
        // Effet de survol identique
        "hover:bg-primary/5",
        // Style si sélectionné
        isSelected && "bg-primary/10 border-l-2 border-l-primary",
        // Style si non lu
        isUnread && "bg-muted/20"
      )}
    >
      {/* Checkbox */}
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(message.id.toString(), !!checked)}
          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </div>

      <Star className="w-4 h-4 text-muted-foreground/50 cursor-pointer hover:text-yellow-500 transition-colors" />

      {/* Zone cliquable pour ouvrir le détail */}
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex-1 flex items-center gap-4 min-w-0 cursor-pointer py-1">
            {/* Avatar stylé comme le CourrierItem */}
            <Avatar className="h-9 w-9 border border-border">
              <AvatarFallback className="bg-muted/20 text-xs font-bold text-primary">
                {message.expediteur.name}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 truncate">
              <div className="text-sm text-foreground truncate flex items-center gap-2">
                <span className={cn(
                  "uppercase tracking-tight",
                  isUnread ? "font-black" : "font-medium text-foreground/70"
                )}>
                  {fullName}
                </span>
                <Badge variant="outline" className="text-[10px] font-mono border bg-primary/10 text-primary border-primary/20">
                  {message.courrier.reference}
                </Badge>
              </div>
              <div className={cn(
                "text-xs truncate font-medium",
                isUnread ? "text-foreground" : "text-muted-foreground"
              )}>
                {message.courrier.object}
              </div>
            </div>

            {/* Date de création */}
           
          </div>
        </DialogTrigger>

        {/* Contenu du message */}
        <MessageDetail message={message} />
      </Dialog>

      {/* Menu d'actions */}
      
    </div>
  );
};
