'use client'

import { useEffect, useRef, useCallback } from 'react'

export interface MercureMessage<T = any> {
  data: T
  topic: string
}

export const useMercure = (url?: string) => {
  const eventSourceRef = useRef<EventSource | null>(null)
  const subscribersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map())

  const subscribe = useCallback(<T>(topic: string, callback: (data: T) => void) => {
    if (!subscribersRef.current.has(topic)) {
      subscribersRef.current.set(topic, new Set())
    }
    subscribersRef.current.get(topic)?.add(callback)

    // Nettoyage automatique
    return () => {
      const subscribers = subscribersRef.current.get(topic)
      if (subscribers) {
        subscribers.delete(callback)
        if (subscribers.size === 0) {
          subscribersRef.current.delete(topic)
        }
      }
    }
  }, [])

  const connect = useCallback(() => {
    // Déterminer l'URL Mercure
    const mercureUrl = url || process.env.NEXT_PUBLIC_MERCURE_URL || 'http://localhost:1337/.well-known/mercure'
    
    // Créer l'EventSource
    const eventSource = new EventSource(mercureUrl)
    eventSourceRef.current = eventSource

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        const topic = data.topic || 'default'
        
        // Notifier tous les abonnés du topic
        const subscribers = subscribersRef.current.get(topic)
        if (subscribers) {
          subscribers.forEach(callback => {
            try {
              callback(data)
            } catch (error) {
              // console.error('Error in Mercure subscriber callback:', error)
            }
          })
        }
      } catch (error) {
        // console.error('Error parsing Mercure message:', error)
      }
    }

    eventSource.onerror = (error) => {
      // console.error('Mercure connection error:', error)
      // Tentative de reconnexion après 5 secondes
      setTimeout(() => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close()
        }
        connect()
      }, 5000)
    }

    return eventSource
  }, [url])

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    subscribersRef.current.clear()
  }, [])

  useEffect(() => {
    connect()
    return disconnect
  }, [connect, disconnect])

  return {
    subscribe,
    connect,
    disconnect,
    isConnected: !!eventSourceRef.current
  }
}

// Hook pour les abonnements spécifiques
export const useMercureSubscription = <T = any>(topic: string, callback: (data: T) => void) => {
  const { subscribe } = useMercure()

  useEffect(() => {
    const unsubscribe = subscribe(topic, callback)
    return unsubscribe
  }, [subscribe, topic, callback])
}
