'use client'

import { MessageItem } from '../types/message';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Hash, User, FileText, Mail, Archive, Trash2, Info } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';


interface MessageDetailProps {
  message: MessageItem;
}

export const MessageDetail = ({ message }: MessageDetailProps) => {
  return (
    <DialogContent className="sm:max-w-4xl w-[95vw] h-[85vh] flex flex-col p-0 overflow-hidden border-border bg-card shadow-2xl text-foreground">

      {/* Header - Style identique à CourrierDetailView */}
      <div className="p-4 md:p-8 border-b border-border bg-muted/20">
        <DialogHeader className="text-left space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-3 py-1 font-mono border bg-primary/10 text-primary border-primary/20">
                <Hash className="w-3.5 h-3.5 mr-1" />
                {message.courrier.reference}
              </Badge>
              <span className="text-[10px] text-muted-foreground/70 uppercase tracking-widest flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(message.createdAt), "PPP 'à' HH:mm", { locale: fr })}
              </span>
            </div>
            <Badge variant="outline" className="bg-muted/20 text-muted-foreground border-border px-3 py-1 uppercase text-[9px] tracking-tighter">
              Message Officiel
            </Badge>
          </div>

          <DialogTitle className="text-3xl font-black italic tracking-tighter leading-tight uppercase">
            {message.courrier.object}
          </DialogTitle>
        </DialogHeader>
      </div>

      {/* Zone de contenu scrollable */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Colonne Gauche: Identité */}
          <div className="md:col-span-1 space-y-6">
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-[0.2em] flex items-center gap-2">
                <User className="w-3 h-3" /> Expéditeur
              </h4>
              <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/20">
                <Avatar className="h-10 w-10 border border-primary/30">
                  <AvatarFallback className="bg-primary/10 text-sm font-black text-primary">
                    {message.expediteur.nom[0]}{message.expediteur.prenom[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-foreground">{message.expediteur.nom} {message.expediteur.prenom}</p>
                  <p className="text-[10px] uppercase font-black tracking-tighter opacity-70 text-primary">Polytechnique Vontovorona</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-[0.2em]">Destinataire</h4>
              <div className="p-3 bg-muted/20 border border-border rounded-lg text-xs font-medium text-muted-foreground">
                {message.destinataire.nom} {message.destinataire.prenom}
              </div>
            </div>
          </div>

          {/* Colonne Droite: Corps du Message */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-[0.2em] flex items-center gap-2">
              <FileText className="w-4 h-4" /> Détails du transfert
            </h4>
            <div className="bg-muted/20 p-4 md:p-6 rounded-2xl border border-border min-h-[200px] relative overflow-hidden group">
              {/* Filigrane décoratif en fond */}
              <Info className="absolute -right-4 -bottom-4 w-24 h-24 text-muted-foreground/5 -rotate-12" />

              <div className="relative z-10 text-foreground/80 leading-relaxed text-sm space-y-5 italic font-medium">
                <p>
                  Madame, Monsieur,
                </p>
                <p>
                  Nous vous informons par la présente du transfert du dossier référencé
                  <span className="font-bold mx-1 px-1 rounded bg-muted/20 text-primary">
                    {message.courrier.reference}
                  </span> pour traitement ou consultation.
                </p>
                <p>
                  Veuillez trouver ci-joint les détails relatifs à cette communication officielle de l'ESPA Polytechnique.
                </p>
                <div className="pt-4 border-t border-border text-[10px] uppercase tracking-widest text-muted-foreground/70 not-italic">
                  Fin de la transmission
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer fixe avec actions - Style identique */}
      <div className="p-4 border-t border-border bg-muted/20 flex justify-between items-center">
        <Button variant="ghost" className="text-red-500/70 hover:text-red-500 hover:bg-red-500/10 text-[10px] uppercase font-black">
          <Trash2 className="w-4 h-4 mr-2" /> Supprimer
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border text-muted-foreground hover:bg-accent/10 hover:text-foreground text-[10px] uppercase font-black">
            <Archive className="w-4 h-4 mr-2" /> Archiver
          </Button>
          <Button className="hover:opacity-90 text-black px-6 text-[10px] uppercase font-black bg-primary">
            <Mail className="w-4 h-4 mr-2 text-black" /> Répondre
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};