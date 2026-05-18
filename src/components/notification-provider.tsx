'use client'

import { useCallback, useState } from 'react'
import { useNotifications } from '@/hooks/use-notifications'
import { useToast } from '@/hooks/use-toast'
import { Bell } from 'lucide-react'

export function NotificationProvider() {
  const { toast } = useToast()
  const [unreadCount, setUnreadCount] = useState(0)

  const handleNotification = useCallback(
    (notification: any) => {
      if (notification.type === 'new_email') {
        setUnreadCount((prev) => prev + 1)
        toast({
          title: notification.senderName || 'Nouveau message',
          description: notification.subject || 'Vous avez reçu un nouveau message',
        })
      } else if (notification.type === 'email_sent') {
        toast({
          title: 'Message envoyé',
          description: 'Votre message a été envoyé avec succès',
        })
      } else if (notification.type === 'connected') {
        console.log('[v0] Notification system connected')
      }
    },
    [toast]
  )

  useNotifications(handleNotification)

  return null
}
