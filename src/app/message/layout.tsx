'use client'

import { ReactNode, useState } from 'react'
import Sidebar from '@/features/messages/components/sidebar'
import MobileSidebar from '@/features/messages/components/MobileSidebar'
import Header from '@/features/messages/components/header'
import { NotificationProvider } from '@/components/notification-provider'
import { ThemePresetProvider } from '@/features/theme/components/ThemePresetProvider'
import { useIsMobile } from '@/hooks/use-mobile'
// 1. Importation du Provider (Ajustez le chemin si nécessaire)
import { UtilisateursProvider } from '@/features/utilisateurs/context/UtilisateursContext'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ThemePresetProvider>
      {/* 2. On enveloppe le tout pour donner accès au contexte à tout le Dashboard */}
      <UtilisateursProvider>
        <div className="flex h-screen bg-background">
          <NotificationProvider />

          {/* Desktop sidebar */}
          {!isMobile && <Sidebar />}

          {/* Mobile sidebar (Sheet) */}
          {isMobile && (
            <MobileSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
          )}

          <div className="flex-1 flex flex-col overflow-hidden">
            <Header onMenuToggle={() => setSidebarOpen(true)} showMenu={isMobile} />
            <main className="flex-1 overflow-auto">
              {children} {/* Vos pages enfants auront aussi accès au contexte */}
            </main>
          </div>
        </div>
      </UtilisateursProvider>
    </ThemePresetProvider>
  )
}