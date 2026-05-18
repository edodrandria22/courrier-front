'use client'

import { useState, useCallback } from 'react'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
  timestamp: Date
  read: boolean
  data?: any
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((
    title: string,
    message: string,
    type: Notification['type'] = 'info',
    data?: any
  ) => {
    const notification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false,
      data
    }

    setNotifications(prev => [notification, ...prev])

    // Log pour le débogage (remplacer par toast si vous avez sonner)
    // console.log(`🔔 [${type.toUpperCase()}] ${title}: ${message}`)

    // Son de notification (optionnel)
    if (typeof window !== 'undefined' && 'Audio' in window) {
      try {
        const audio = new Audio('/sounds/notification.mp3')
        audio.volume = 0.3
        audio.play().catch(() => {}) // Ignorer les erreurs de lecture
      } catch (e) {
        // Ignorer si le fichier n'existe pas
      }
    }

    return notification.id
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,
    unreadCount
  }
}
