import { useEffect, useCallback, useRef } from 'react'

interface Notification {
  type: string
  message?: string
  data?: any
}

type NotificationCallback = (notification: Notification) => void

export function useNotifications(onNotification: NotificationCallback) {
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    try {
      eventSourceRef.current = new EventSource('/api/notifications/subscribe')

      eventSourceRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          onNotification(data)
        } catch (err) {
          // console.error('Error parsing notification:', err)
        }
      }

      eventSourceRef.current.onerror = () => {
        // console.error('Notification connection error')
        eventSourceRef.current?.close()
      }

      return () => {
        eventSourceRef.current?.close()
      }
    } catch (err) {
      // console.error('Error setting up notifications:', err)
    }
  }, [onNotification])

  return eventSourceRef
}
