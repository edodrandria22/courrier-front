'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  FileText,
  User,
  ArrowLeft,
  Mail,
  Info,
  Paperclip,
  Forward,
  Search,
  ExternalLink
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Courrier } from '../types/courrier'

interface CourrierDetailViewProps {
  courrier: Courrier;
  onBack: () => void;
}

export const CourrierDetailView = ({ courrier, onBack }: CourrierDetailViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');


  // Fonction pour ouvrir/voir le fichier
  const handleViewFile = (file: any) => {
    if (typeof file === 'string') {
      window.open(file, '_blank');
    } else if (file instanceof File) {
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <Card className="max-w-3xl mx-auto border-border bg-card shadow-none md:border md:shadow-sm">
      <div className="p-4 md:p-6 space-y-6">

        {/* Header avec bouton retour et bouton transférer */}
        <div className="border-b border-border pb-4 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-lg font-bold text-foreground">Détails du Courrier</h2>
              <p className="text-sm text-muted-foreground">
                Référence : <span className="font-mono font-bold text-primary">{courrier.reference}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bouton Transférer */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-border hover:bg-primary/5 text-primary">
                  <Forward className="w-4 h-4" /> Transférer
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border text-foreground sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 uppercase tracking-tighter italic font-black text-primary">
                    <Forward className="w-5 h-5" /> Transférer ce courrier
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
                        <Button size="sm" variant="ghost" className="text-[10px] uppercase font-black text-primary">
                          Envoyer
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
              Reçu
            </Badge>
          </div>
        </div>

        {/* Section Identité */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <User className="w-3 h-3" /> Expéditeur
            </label>
            <div className="p-3 bg-background/50 border border-border rounded-lg text-sm font-medium">
              {courrier.nom} {courrier.prenom}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Mail className="w-3 h-3" /> Email
            </label>
            <div className="p-3 bg-background/50 border border-border rounded-lg text-sm font-medium">
              {courrier.email}
            </div>
          </div>
        </div>

        {/* Objet */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Info className="w-3 h-3" /> Objet
          </label>
          <div className="p-3 bg-background/50 border border-border rounded-lg text-sm font-bold">
            {courrier.object}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message / Description</label>
          <div className="p-4 bg-background/50 border border-border rounded-lg text-sm whitespace-pre-wrap min-h-[150px] leading-relaxed">
            {courrier.description}
          </div>
        </div>

        {/* Action Retour Bas */}
        <div className="flex items-center justify-end pt-6 border-t border-border">
          <Button onClick={onBack} variant="outline" className="border-border">
            Retour à la liste
          </Button>
        </div>
      </div>
    </Card>
  )
}