'use client'

import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Forward, FileText, X, Paperclip, Check, ChevronsUpDown, Loader2, User } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from '@/lib/utils'

import { useTransferer } from '../hooks/useTransferer'
import { useUtilisateurs } from '@/features/utilisateurs/hooks/useUtilisateurs'
import type { Utilisateur } from '@/features/utilisateurs/types/numeroDepart';
import { format } from 'date-fns';

// Si vous utilisiez le contexte pour autre chose, vous pouvez le garder, 
// mais pour la recherche dynamique nous avons besoin du hook useUtilisateurs.
// import { useUtilisateursContext } from '@/features/utilisateurs/context/UtilisateursContext'

interface Attachment {
  file: File
  id: string
}

interface Props {
  messageId: number
  onSuccess: () => void
}

export const TransfererDialog = ({ messageId, onSuccess }: Props) => {
  // États de la modale
  const [open, setOpen] = useState(false)
  
  // États du formulaire
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [observation, setObservation] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // États de la recherche (Combobox)
  const [openCombobox, setOpenCombobox] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPaginating, setIsPaginating] = useState(false);
  
  const dateActuelle = new Date();
  const dateString = format(dateActuelle, 'yyyy-MM-dd HH:mm:ss');
  const [dateFin, setDateFin] = useState(dateString);

  // Hooks métiers
  const { transferer, loading: transferring, error: transferError } = useTransferer();
  const { loading: loadingUsers, rechercheUtilisateurs } = useUtilisateurs();
  
  const [utilisateursList, setUtilisateursList] = useState<Utilisateur[]>([]);
  const utilisateurSelectionne = utilisateursList.find((u) => u.id === selectedUserId);

  // 1. Recherche dynamique (Debounce)
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      const data = await rechercheUtilisateurs(searchQuery, currentDate);
      
      setUtilisateursList(data);
      
      if (data.length > 0) {
        setDateFin(data[data.length - 1].createdAt || currentDate);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, rechercheUtilisateurs]);

  // 2. Pagination (Bouton "Voir plus")
  const handleLoadMore = async () => {
    if (isPaginating) return;
    setIsPaginating(true);
    try {
      const data = await rechercheUtilisateurs(searchQuery, dateFin);
      if (data.length > 0) {
        setUtilisateursList((prev) => {
          const newUsers = data.filter(d => !prev.some(p => p.id === d.id));
          return [...prev, ...newUsers];
        });
        setDateFin(data[data.length - 1].createdAt || dateFin);
      }
    } finally {
      setIsPaginating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newAttachments = files.map((file) => ({
      file,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    }))
    
    setAttachments((prev) => [...prev, ...newAttachments])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id))
  }

  const handleTransferer = async () => {
    if (!selectedUserId) return

    const files = attachments.map((att) => att.file)
    const result = await transferer(messageId, selectedUserId, observation, files)

    if (result.success) {
      setOpen(false)
      setSelectedUserId(null)
      setObservation('')
      setAttachments([])
      setSearchQuery('')
      onSuccess()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" >
          <Forward className="w-4 h-4" />
          Transférer
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card border-border text-foreground sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transférer le message</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto px-1">
          {/* Utilisateurs avec Recherche */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Sélectionner le destinataire
            </label>
            
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  disabled={(loadingUsers && utilisateursList.length === 0) || transferring} 
                  className="w-full justify-between bg-background border-border font-normal text-left h-10 px-3"
                >
                  {loadingUsers && utilisateursList.length === 0 ? (
                    <span className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Chargement...
                    </span>
                  ) : utilisateurSelectionne ? (
                    <span className="font-semibold truncate">
                      {utilisateurSelectionne.nom} {utilisateurSelectionne.prenom}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Choisir un destinataire...</span>
                  )}
                  
                  {!(loadingUsers && utilisateursList.length === 0) && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                </Button>
              </PopoverTrigger>
              
              {/* Utilisation de PopoverContent à l'intérieur d'un Dialog (z-index déjà géré par shadcn) */}
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command shouldFilter={false}>
                  <CommandInput 
                    placeholder="Tapez le nom complet..." 
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    {loadingUsers && utilisateursList.length === 0 ? (
                      <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Recherche...
                      </div>
                    ) : utilisateursList.length === 0 ? (
                      <CommandEmpty>Aucun agent trouvé.</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {utilisateursList.map((u) => (
                          <CommandItem
                            key={u.id}
                            value={String(u.id)}
                            onSelect={(currentValue) => {
                              setSelectedUserId(Number(currentValue));
                              setOpenCombobox(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedUserId === u.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold">{u.nom} {u.prenom}</span>
                              <span className="text-xs text-muted-foreground truncate">{u.adresse}</span>
                            </div>
                          </CommandItem>
                        ))}

                        {/* Bouton Voir Plus */}
                        <CommandItem
                          key="load-more"
                          value="load-more"
                          onSelect={() => handleLoadMore()}
                          className="flex justify-center items-center py-3 text-sm text-primary font-medium cursor-pointer aria-selected:bg-primary/10 hover:bg-primary/10 mt-1 border-t border-border/50"
                        >
                          {isPaginating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Chargement...
                            </>
                          ) : (
                            "Voir plus d'agents"
                          )}
                        </CommandItem>
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Observation */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Observation <span className="text-muted-foreground font-normal">(optionnel)</span>
            </label>
            <Textarea
              placeholder="Ajouter un commentaire..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              disabled={transferring}
              rows={3}
              className="resize-none bg-background/50 border-border text-foreground text-sm"
            />
          </div>

          {/* Fichiers */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Documents <span className="text-muted-foreground font-normal">(optionnel)</span>
            </label>
            <div
              onClick={() => !transferring && fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed border-border rounded-lg p-6 text-center transition-all group',
                transferring ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-accent/5 hover:border-primary/40'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                disabled={transferring}
              />
              <Paperclip className="w-6 h-6 mx-auto mb-2 text-muted-foreground/50 group-hover:text-primary/50 group-hover:scale-110 transition-all" />
              <p className="text-xs font-medium text-muted-foreground">
                Cliquez pour ajouter des fichiers
              </p>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-2 bg-muted/30 border border-border rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-2 truncate text-foreground">
                      <FileText className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate max-w-[160px] sm:max-w-[300px] font-medium">{att.file.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="h-6 w-6 text-destructive hover:bg-destructive/10 shrink-0"
                      disabled={transferring}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Erreur */}
          {transferError && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 flex items-center gap-2">
              <X className="w-4 h-4 shrink-0" />
              {transferError}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={transferring}
          >
            Annuler
          </Button>
          <Button
            type="button"
            style={{ color: '#ffffff' }}
            onClick={handleTransferer}
            disabled={transferring || !selectedUserId || loadingUsers}
            className="bg-primary hover:opacity-90 text-primary-foreground min-w-[140px] flex items-center gap-2"
          >
            {transferring ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Envoi...
              </>
            ) : (
              'Transférer'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}