'use client'

import { Bell, X, Check } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications'

export const NotificationToast = () => {
  const { notifications, markAsRead, clearNotification, unreadCount } = useNotifications()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
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
              <div className={`
                p-2 rounded-full shrink-0
                ${notification.type === 'success' && 'bg-green-100 text-green-600'}
                ${notification.type === 'error' && 'bg-red-100 text-red-600'}
                ${notification.type === 'warning' && 'bg-yellow-100 text-yellow-600'}
                ${notification.type === 'info' && 'bg-blue-100 text-blue-600'}
              `}>
                {notification.type === 'success' && <Check className="w-3 h-3" />}
                {notification.type === 'error' && <X className="w-3 h-3" />}
                {notification.type === 'warning' && <Bell className="w-3 h-3" />}
                {notification.type === 'info' && <Bell className="w-3 h-3" />}
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
