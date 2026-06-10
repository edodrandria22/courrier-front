'use client'

import { ReactNode, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/features/messages/components/sidebar'
import MobileSidebar from '@/features/messages/components/MobileSidebar'
import Header from '@/features/messages/components/header'
import { NotificationProvider } from '@/components/notification-provider'
import { ThemePresetProvider } from '@/features/theme/components/ThemePresetProvider'
import { useIsMobile } from '@/hooks/use-mobile'
// 1. Importation du Provider (Ajustez le chemin si nécessaire)
import { UtilisateursProvider } from '@/features/utilisateurs/context/UtilisateursContext'
import { User } from '@/features/auth/types/login'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const login = process.env.NEXT_PUBLIC_LOGIN_URL || '/login';
  const router = useRouter();
    useEffect(() => {
      checkAuth()
    }, [])

    const checkAuth = async () => {
      try {
        const response = await fetch(`/api/auth/me`);
        if (!response.ok) {
          router.push(login)
          return;
        }
        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        router.push(login)
      }
      finally {
        setLoading(false)
      }
    };


  return (
    <ThemePresetProvider>
      {/* 2. On enveloppe le tout pour donner accès au contexte à tout le Dashboard */}
      <UtilisateursProvider>
        <div className="flex h-screen bg-background">
          <NotificationProvider />

          {/* Desktop sidebar */}
          {!isMobile && <Sidebar user={user} />}

          {/* Mobile sidebar (Sheet) */}
          {isMobile && (
            <MobileSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
          )}

          <div className="flex-1 flex flex-col overflow-hidden">
            <Header user={user} loading={loading} onMenuToggle={() => setSidebarOpen(true)} showMenu={isMobile} />
            <main className="flex-1 overflow-auto">
              {children} {/* Vos pages enfants auront aussi accès au contexte */}
            </main>
          </div>
        </div>
      </UtilisateursProvider>
    </ThemePresetProvider>
  )
}