'use client'

import { Bell, X, Check, Info, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'

export const NotificationDisplay = () => {
  const { notifications, markAsRead, clearNotification, unreadCount } = useNotifications()

  if (notifications.length === 0) return null

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-3 h-3" />
      case 'error':
        return <AlertCircle className="w-3 h-3" />
      case 'warning':
        return <AlertTriangle className="w-3 h-3" />
      default:
        return <Info className="w-3 h-3" />
    }
  }

  const getIconColors = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-600'
      case 'error':
        return 'bg-red-100 text-red-600'
      case 'warning':
        return 'bg-yellow-100 text-yellow-600'
      default:
        return 'bg-blue-100 text-blue-600'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {/* Badge du compteur non lu */}
      {unreadCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
          {unreadCount}
        </div>
      )}

      {notifications.slice(0, 3).map((notification) => (
        <div
          key={notification.id}
          className={`
            relative p-4 rounded-lg border shadow-lg animate-in slide-in-from-right duration-300
            ${notification.read 
              ? 'bg-muted/50 border-border/50 opacity-60' 
              : 'bg-background border-border'
            }
          `}
        >
          {/* Bouton fermer */}
          <button
            onClick={() => clearNotification(notification.id)}
            className="absolute top-2 right-2 p-1 rounded hover:bg-muted transition-colors"
          >
            <X className="w-3 h-3" />
          </button>

          {/* Contenu */}
          <div className="pr-6">
            <div className="flex items-start gap-3">
              {/* Icône selon le type */}
              <div className={`p-2 rounded-full shrink-0 ${getIconColors(notification.type)}`}>
                {getIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate">
                  {notification.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-[10px] text-muted-foreground/50 mt-2">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* Indicateur non lu */}
          {!notification.read && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg" />
          )}

          {/* Bouton marquer comme lu */}
          {!notification.read && (
            <button
              onClick={() => markAsRead(notification.id)}
              className="absolute bottom-2 right-2 text-[10px] text-primary hover:text-primary/80 transition-colors"
            >
              Marquer comme lu
            </button>
          )}
        </div>
      ))}

      {/* Indicateur de notifications supplémentaires */}
      {notifications.length > 3 && (
        <div className="text-center text-xs text-muted-foreground p-2 bg-muted/50 rounded-lg">
          +{notifications.length - 3} notifications supplémentaires
        </div>
      )}
    </div>
  )
}
