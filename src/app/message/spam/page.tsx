'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Mail } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

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

export default function SpamPage() {
  const [emails, setEmails] = useState<EmailItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmails()
  }, [])

  const fetchEmails = async () => {
    try {
      const response = await fetch('/api/emails?folder=spam')
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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-border bg-card px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground">Spam</h2>
      </div>

      {/* Emails List */}
      <div className="flex-1 overflow-auto">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <Mail className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucun message spam
            </h3>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {emails.map((email) => (
              <Link
                key={email.id}
                href={`/dashboard/email/${email.id}`}
              >
                <div className="px-6 py-4 hover:bg-muted/50 transition-colors cursor-pointer flex items-center gap-4">
                  <Avatar className="h-8 w-8 flex-shrink-0 bg-primary">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground font-semibold">
                      {email.senderName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground">
                      {email.senderName}
                    </div>
                    <div className="truncate text-sm text-muted-foreground">
                      {email.subject}
                    </div>
                  </div>

                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatDistanceToNow(new Date(email.createdAt), {
                      locale: fr,
                      addSuffix: false,
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
