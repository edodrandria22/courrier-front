'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Paperclip, Send, X, FileText, FolderOpen, Hash, MessageSquare, Check, ChevronsUpDown, Loader2, User } from 'lucide-react'
import Link from 'next/link'

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useComposeMessage } from '../../hooks/useCompose'
import { useUtilisateurs } from '@/features/utilisateurs/hooks/useUtilisateurs'
import type { Attachment } from '../../types/compose'
import { format } from 'date-fns';
import type { Utilisateur } from '@/features/utilisateurs/types/utilisateur';

interface ComposeFormProps {
  courrierId: number;
  courrierReference?: string;
  courrierObjet?: string;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

export const ComposeForm = ({ courrierId, courrierReference, courrierObjet }: ComposeFormProps) => {
  const router = useRouter()
  const { sendMessage, loading, error } = useComposeMessage()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [destId, setDestId] = useState<number | null>(null)
  const [observation, setObservation] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dateActuelle = new Date();
  const dateString = format(dateActuelle, 'yyyy-MM-dd HH:mm:ss');

  const [dateFin, setDateFin] = useState(dateString);
  const [isPaginating, setIsPaginating] = useState(false); // Nouvel état pour le loader du bouton Voir Plus

  const { loading: loadingUsers, rechercheUtilisateurs } = useUtilisateurs();
  
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const utilisateurSelectionne = utilisateurs.find((u) => u.id === destId);

  // 1. Effet pour la recherche initiale ou quand on tape un nom (Remplacer la liste)
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      // Lors d'une nouvelle recherche, on repart de la date actuelle
      const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      const data = await rechercheUtilisateurs(searchQuery, currentDate);
      
      setUtilisateurs(data);
      
      if (data.length > 0) {
        // On prépare le curseur pour la prochaine pagination
        setDateFin(data[data.length - 1].createdAt || currentDate);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, rechercheUtilisateurs]); // On n'inclut pas dateFin ici intentionnellement

  // 2. Fonction pour charger plus d'agents (Ajouter à la liste)
  const handleLoadMore = async () => {
    if (isPaginating) return;
    setIsPaginating(true);
    try {
      const data = await rechercheUtilisateurs(searchQuery, dateFin);
      if (data.length > 0) {
        setUtilisateurs((prev) => {
          // On filtre pour éviter les doublons éventuels
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!destId) return

    const result = await sendMessage({ destId, courrierId, observation, attachments })
    if (result.success) {
      router.push('/message/courrier/send')
    }
  }
  const onReturn = () => {
    router.push('/message/courrier?tab=template', { scroll: false });
  };

  return (
    <Card className="border-border bg-card shadow-none md:border md:shadow-sm">
      <form onSubmit={handleFormSubmit}>

        {/* En-tête du formulaire */}
        <div className="px-6 py-4 border-b border-border">
          <h1 className="text-base font-bold text-foreground">Nouveau transfert</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Transférer ce courrier vers un autre agent</p>
        </div>

        <div className="p-6 space-y-5">

          {/* Erreur */}
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 flex items-center gap-2">
              <X className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* Contexte du courrier */}
          {(courrierReference || courrierObjet) && (
            <div className="p-4 rounded-xl bg-muted/20 border border-border space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Courrier concerné</p>
              {courrierReference && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Hash className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                  <span className="font-mono text-primary/80">{courrierReference}</span>
                </div>
              )}
              {courrierObjet && (
                <div className="flex items-center gap-2 text-xs text-foreground/80">
                  <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="font-medium">{courrierObjet}</span>
                </div>
              )}
            </div>
          )}

          {/* Destinataire */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              Destinataire <span className="text-destructive">*</span>
            </label>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  // On désactive seulement s'il n'y a pas d'utilisateurs et que ça charge
                  disabled={(loadingUsers && utilisateurs.length === 0) || loading} 
                  className="w-full justify-between bg-background/50 border-border font-normal text-left"
                >
                  {loadingUsers && utilisateurs.length === 0 ? (
                    <span className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Chargement des agents...
                    </span>
                  ) : utilisateurSelectionne ? (
                    <span className="font-semibold">
                      {utilisateurSelectionne.nom} {utilisateurSelectionne.prenom}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Choisir un agent destinataire...</span>
                  )}
                  
                  {!(loadingUsers && utilisateurs.length === 0) && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                </Button>
              </PopoverTrigger>
              
              <PopoverContent className="w-full p-0 popover-content-width-same-as-trigger">
                <Command shouldFilter={false}>
                  <CommandInput 
                    placeholder="Tapez le nom complet..." 
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    {loadingUsers && utilisateurs.length === 0 ? (
                      <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Recherche en cours...
                      </div>
                    ) : utilisateurs.length === 0 ? (
                      <CommandEmpty>Aucun agent disponible.</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {utilisateurs.map((u) => (
                          <CommandItem
                            key={u.id}
                            value={String(u.id)}
                            onSelect={(currentValue) => {
                              setDestId(Number(currentValue));
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                destId === u.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold">{u.nom} {u.prenom}</span>
                              <span className="text-xs text-muted-foreground">{u.adresse} · {u.role}</span>
                            </div>
                          </CommandItem>
                        ))}

                        {/* --- BOUTON VOIR PLUS --- */}
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
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
              Observation
              <span className="text-xs font-normal text-muted-foreground">(optionnel)</span>
            </label>
            <Textarea
              placeholder="Ajouter une observation ou instruction pour le destinataire..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              disabled={loading}
              rows={3}
              className="bg-background/50 border-border resize-none focus-visible:ring-0 focus-visible:border-muted-foreground placeholder:text-muted-foreground/50 text-sm"
            />
          </div>

          {/* Pièces jointes */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
              Pièces jointes
              <span className="text-xs font-normal text-muted-foreground">(optionnel)</span>
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
              />
              <FolderOpen className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50 group-hover:text-primary/50 transition-colors" />
              <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Cliquez pour joindre des fichiers
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">PDF, images, documents...</p>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">
                  {attachments.length} fichier{attachments.length > 1 ? 's' : ''} sélectionné{attachments.length > 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-3 p-3 bg-muted/20 border border-border rounded-xl"
                    >
                      <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                        <FileText className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{att.file.name}</p>
                        <p className="text-[10px] text-muted-foreground">{formatFileSize(att.file.size)}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAttachment(att.id)}
                        className="h-7 w-7 shrink-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
          
            <button
              type="button"
              disabled={loading}
              onClick={onReturn}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--secondary)',
                borderColor: 'var(--secondary)',
                borderWidth: '1px',
                borderStyle: 'solid',
                padding: '8px 16px',
                borderRadius: '6px',
                fontWeight: '500',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? '0.5' : '1',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'scale(1.05)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              Annuler
            </button>
          
          <button
            type="submit"
            disabled={loading || !destId}
            style={{
              backgroundColor: (loading || !destId) ? 'var(--muted)' : 'var(--primary)',
              color: '#ffffff',
              borderColor: (loading || !destId) ? 'var(--muted)' : 'var(--primary)',
              borderWidth: '1px',
              borderStyle: 'solid',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: (loading || !destId) ? 'not-allowed' : 'pointer',
              opacity: (loading || !destId) ? '0.5' : '1',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!loading && destId) e.currentTarget.style.backgroundColor = 'var(--primary)'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = (loading || !destId) ? 'var(--muted)' : 'var(--primary)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Envoyer le message
              </>
            )}
          </button>
        </div>

      </form>
    </Card>
  )
}