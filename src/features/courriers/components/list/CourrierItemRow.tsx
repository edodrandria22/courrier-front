'use client'

import React, { useState } from 'react';
import {
  Star,
  MoreVertical,
  Archive,
  Trash2,
  FileText,
  Calendar,
  Forward,
  Search
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Courrier } from '../../types/courrier';
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CourrierItemRowProps {
  courrier: Courrier;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: () => void; // Ajout de la prop pour la vue détaillée
}

export const CourrierItemRow = ({
  courrier,
  isSelected,
  onSelect,
  onArchive,
  onDelete,
  onClick
}: CourrierItemRowProps) => {
  const courrierId = courrier.id?.toString() || '';
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div
      onClick={onClick}
      className={cn(
        "group px-4 md:px-6 py-3 flex items-center gap-4 transition-all border-b border-border bg-transparent cursor-pointer",
        // Survol : fond sombre avec une touche de turquoise
        "hover:bg-primary/5",
        // Sélection : bordure gauche néon et fond plus marqué
        isSelected && "bg-primary/10 border-l-2 border-l-primary"
      )}
    >
      {/* Sélection - stopPropagation pour ne pas ouvrir le détail en cochant */}
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(courrierId, !!checked)}
          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </div>

      <Star className="w-4 h-4 text-muted-foreground/50 cursor-pointer hover:text-yellow-500 transition-colors" />

      {/* Contenu principal */}
      <div className="flex-1 flex items-center gap-4 min-w-0 py-1">
        {/* Icône de doc stylée */}
        <div className="h-9 w-9 rounded-lg flex items-center justify-center border bg-primary/10 border-primary/20">
          <FileText className="h-5 w-5 text-primary" />
        </div>

        <div className="flex-1 truncate">
          <div className="text-sm text-foreground truncate flex items-center gap-2">
            <span className="font-bold uppercase tracking-tight">{courrier.nom} {courrier.prenom}</span>
            <Badge variant="outline" className="text-[10px] font-mono border bg-primary/10 text-primary border-primary/20">
              {courrier.reference}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground truncate font-medium">
            {courrier.object}
          </div>
        </div>

        {/* Échéance si présente */}
        {courrier.dateFin && (
          <div className="flex items-center gap-1.5 text-[10px] text-orange-400 bg-orange-400/5 px-2 py-1 rounded-md border border-orange-400/10 whitespace-nowrap">
            <Calendar className="w-3 h-3" />
            {new Date(courrier.dateFin).toLocaleDateString('fr-FR')}
          </div>
        )}
      </div>

      {/* Boutons d'actions - stopPropagation pour ne pas ouvrir le détail au clic sur les actions */}
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        {/* Transfert */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
              <Forward className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border text-foreground sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 uppercase tracking-tighter italic font-black text-primary">
                <Forward className="w-5 h-5" /> Transférer
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                <Input
                  placeholder="Rechercher un destinataire..."
                  className="pl-9 bg-muted/20 border-border focus-visible:ring-ring/50 text-foreground"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-1 max-h-[250px] overflow-y-auto">
                {[
                  { id: 1, name: 'Directeur ESPA', role: 'Directeur' },
                  { id: 2, name: 'Chef de Service', role: 'Scolarité' },
                ].map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-accent/10 group/item cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-border">
                        <AvatarFallback className="bg-muted/20 text-primary text-xs font-bold">{contact.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold text-foreground">{contact.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{contact.role}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-[10px] uppercase font-black opacity-0 group-hover/item:opacity-100 text-primary">
                      Envoyer
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Menu More */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:bg-accent/20 transition-all">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border text-foreground">
            <DropdownMenuItem className="focus:bg-accent/10 focus:text-primary cursor-pointer" onClick={() => onArchive(courrierId)}>
              <Archive className="mr-2 h-4 w-4" /> Archiver
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-red-500/10 text-red-500 focus:text-red-500 cursor-pointer" onClick={() => onDelete(courrierId)}>
              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
