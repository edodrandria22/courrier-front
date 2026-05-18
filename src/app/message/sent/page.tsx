'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { Mail, Archive, Trash2, MoreVertical, Star, Send, Plus } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LoadingScreen } from '@/components/loading/loading'

interface EmailItem {
  id: string
  subject: string
  preview: string
  senderName: string
  senderEmail: string
  createdAt: string
  isRead: boolean
  hasAttachments: boolean
}

export default function SentPage() {
  const [emails, setEmails] = useState<EmailItem[]>([])
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    fetchEmails()
  }, [])

  const fetchEmails = async () => {
    try {
      const response = await fetch('/api/emails?folder=sent')
      if (response.ok) {
        const data = await response.json()
        setEmails(data)
      }
    } catch (error) {
      // console.error('Error fetching emails:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmails(new Set(emails.map((e) => e.id)))
    } else {
      setSelectedEmails(new Set())
    }
  }

  const handleSelectEmail = (emailId: string, checked: boolean) => {
    const newSelected = new Set(selectedEmails)
    if (checked) {
      newSelected.add(emailId)
    } else {
      newSelected.delete(emailId)
    }
    setSelectedEmails(newSelected)
  }

  const handleArchive = async (emailId: string) => {
    try {
      await fetch(`/api/emails/${emailId}/folder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: 'archive' }),
      })
      fetchEmails()
    } catch (error) {
      // console.error('Error archiving email:', error)
    }
  }

  const handleDelete = async (emailId: string) => {
    try {
      await fetch(`/api/emails/${emailId}`, { method: 'DELETE' })
      fetchEmails()
    } catch (error) {
      // console.error('Error deleting email:', error)
    }
  }

  if (loading) {
    return (
      <LoadingScreen label="Synchronisation en cours" />
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-transparent">
      {/* Toolbar - Style "Glassmorphism" sombre */}
      <div className="border-b border-border bg-muted/20 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={selectedEmails.size === emails.length && emails.length > 0}
              onCheckedChange={handleSelectAll}
              className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            {selectedEmails.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                  {selectedEmails.size} élément(s) sélectionné(s)
                </span>
              </div>
            )}
          </div>
          <h2 className="text-sm font-black text-foreground uppercase tracking-[0.2em] italic">
            Messages Envoyés
          </h2>
        </div>
      </div>

      {/* Emails List */}
      <div className="flex-1 overflow-auto">
        {emails.length === 0 ? (
          /* Ton nouveau style "Boîte vide" */
          <div className="flex flex-col items-center justify-center py-24 px-4 md:px-6 bg-transparent">
            <div className="bg-primary/5 p-4 md:p-8 rounded-full mb-6 border border-primary/10">
              <Send className="w-12 h-12 text-primary/30" />
            </div>
            <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-[0.2em]">Aucun envoi</h3>
            <p className="text-muted-foreground/70 text-xs text-center max-w-[250px] mt-2 font-medium">
              Votre registre de messages envoyés est actuellement vide.
            </p>
            <Link href="/message/compose" className="mt-8">
              <Button className="bg-primary hover:bg-primary/90 text-black font-black uppercase text-[10px] px-8 tracking-widest transition-all">
                <Plus className="w-4 h-4 mr-2" /> Nouveau Message
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {emails.map((email) => (
              <div key={email.id} className="group relative">
                <Link
                  href={`/dashboard/email/${email.id}`}
                  className="px-4 md:px-6 py-4 flex items-center gap-4 hover:bg-primary/5 transition-all cursor-pointer"
                >
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedEmails.has(email.id)}
                      onCheckedChange={(checked) => handleSelectEmail(email.id, Boolean(checked))}
                      className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </div>

                  <Star className="w-4 h-4 text-muted-foreground/50 hover:text-yellow-500 transition-colors" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-black text-foreground uppercase tracking-tighter truncate">
                        À : {email.senderName}
                      </span>
                      {email.hasAttachments && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase bg-primary/10 text-primary border-primary/20">
                          Fichier
                        </span>
                      )}
                    </div>
                    <div className="truncate text-xs text-muted-foreground font-medium italic">
                      {email.subject}
                    </div>
                  </div>

                  <span className="text-[10px] text-muted-foreground/50 flex-shrink-0 ml-4 font-mono">
                    {formatDistanceToNow(new Date(email.createdAt), {
                      locale: fr,
                      addSuffix: true,
                    })}
                  </span>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground/70 hover:bg-accent/20"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border text-foreground">
                      <DropdownMenuItem
                        className="focus:bg-accent/10 focus:text-primary cursor-pointer text-xs uppercase font-bold"
                        onClick={(e) => {
                          e.preventDefault()
                          handleArchive(email.id)
                        }}
                      >
                        <Archive className="w-3.5 h-3.5 mr-2" />
                        Archiver
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="focus:bg-red-500/10 text-red-500 focus:text-red-500 cursor-pointer text-xs uppercase font-bold"
                        onClick={(e) => {
                          e.preventDefault()
                          handleDelete(email.id)
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}