'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowLeft, Download, Trash2, Archive, Reply, Forward } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Sender {
  id: string
  name: string
  email: string
  avatar?: string
}

interface Attachment {
  id: string
  filename: string
  filepath: string
  size: number
  mimetype: string
}

interface EmailDetail {
  id: string
  subject: string
  body: string
  sender: Sender
  createdAt: string
  attachments: Attachment[]
}

export default function EmailDetailPage() {
  const params = useParams()
  const router = useRouter()
  const emailId = params.id as string
  const [email, setEmail] = useState<EmailDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEmail()
  }, [emailId])

  const fetchEmail = async () => {
    try {
      const response = await fetch(`/api/emails/${emailId}`)
      if (response.ok) {
        const data = await response.json()
        setEmail(data)
      } else {
        setError('Email not found')
      }
    } catch (err) {
      setError('Error loading email')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this email?')) {
      return
    }

    try {
      const response = await fetch(`/api/emails/${emailId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Error deleting email')
    }
  }

  const handleArchive = async () => {
    try {
      const response = await fetch(`/api/emails/${emailId}/folder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: 'archive' }),
      })
      if (response.ok) {
        router.push('/dashboard/archive')
      }
    } catch (err) {
      setError('Error archiving email')
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  if (!email || error) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="border-b border-border bg-card px-6 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">{error || 'Email non trouvé'}</p>
            <Link href="/dashboard">
              <Button>Retour à la boîte de réception</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const senderInitials = email.sender.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleArchive}
            >
              <Archive className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Card className="max-w-3xl">
          {/* Subject */}
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {email.subject}
            </h1>

            {/* Sender Info */}
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 bg-primary">
                {email.sender.avatar ? (
                  <img src={email.sender.avatar} alt={email.sender.name} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {senderInitials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground">
                  {email.sender.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {email.sender.email}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(email.createdAt), {
                    locale: fr,
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="p-6 border-b border-border">
            <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap break-words">
              {email.body}
            </div>
          </div>

          {/* Attachments */}
          {email.attachments.length > 0 && (
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold text-foreground mb-4">Pièces jointes</h3>
              <div className="space-y-2">
                {email.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {attachment.filename}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(attachment.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <a
                      href={attachment.filepath}
                      download
                      className="p-2 hover:bg-muted-foreground/10 rounded transition"
                    >
                      <Download className="w-4 h-4 text-primary" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-6 flex items-center gap-2">
            <Button className="gap-2">
              <Reply className="w-4 h-4" />
              Répondre
            </Button>
            <Button variant="outline" className="gap-2">
              <Forward className="w-4 h-4" />
              Transférer
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
