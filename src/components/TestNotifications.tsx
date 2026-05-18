'use client'

import { useNotifications } from '@/hooks/useNotifications'

export const TestNotifications = () => {
  const { addNotification } = useNotifications()

  const handleTestNotification = () => {
    addNotification(
      "Notification de test",
      "Ceci est une notification pour tester l'affichage",
      "info"
    )
  }

  const handleSuccessNotification = () => {
    addNotification(
      "Succès !",
      "Opération réalisée avec succès",
      "success"
    )
  }

  const handleErrorNotification = () => {
    addNotification(
      "Erreur",
      "Une erreur est survenue",
      "error"
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 flex gap-2">
      <button
        onClick={handleTestNotification}
        className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
      >
        Test Info
      </button>
      <button
        onClick={handleSuccessNotification}
        className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
      >
        Test Succès
      </button>
      <button
        onClick={handleErrorNotification}
        className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
      >
        Test Erreur
      </button>
    </div>
  )
}
