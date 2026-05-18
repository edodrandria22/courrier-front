'use client'

import { ReactNode, useState } from 'react'
import Sidebar from '@/features/messages/components/sidebar'
import MobileSidebar from '@/features/messages/components/MobileSidebar'
import Header from '@/features/messages/components/header'
import { NotificationProvider } from '@/components/notification-provider'
import { ThemePresetProvider } from '@/features/theme/components/ThemePresetProvider'
import { useIsMobile } from '@/hooks/use-mobile'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ThemePresetProvider>
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
            {children}
          </main>
        </div>
      </div>
    </ThemePresetProvider>
  )
}
