'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { LogOut, Settings, Menu, Palette, User as UserIcon, Hash } from 'lucide-react'
import { User } from '@/features/auth/types/login'
import { ThemePicker } from '@/features/theme/components/ThemePicker'

interface HeaderProps {
  user: User | null,
  loading: boolean,
  onMenuToggle?: () => void
  showMenu?: boolean
}

export default function Header({user,loading ,onMenuToggle, showMenu }: HeaderProps) {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push("/")
    } catch (error) {
      // console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <header className="h-14 md:h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6">
        {showMenu && <div className="w-9 h-9" />}
        <div className="flex-1" />
        <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
      </header>
    )
  }

  const initials = user?.nom
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U'

  return (
    <header className="h-14 md:h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-2">
        {showMenu && (
          <Button variant="ghost" size="icon" onClick={onMenuToggle} className="h-9 w-9">
            <Menu className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Picker */}
        <ThemePicker>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
            <Palette className="w-4 h-4" />
          </Button>
        </ThemePicker>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-3 px-2">
              <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.nom}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="bg-blue-500 text-white font-semibold h-full w-full flex items-center justify-center text-sm">
                    {initials}
                  </div>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-sm font-semibold text-foreground">
                  {user?.nom}
                </div>
                <div className="text-xs text-muted-foreground">
                  {user?.email}
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-semibold text-foreground">{user?.nom}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/message/profile/security')}>
              <Settings className="w-4 h-4 mr-2" />
              <span>Parametres</span>
            </DropdownMenuItem>
            {user?.role!="Admin" && (
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/message/profile/numeroDepart')}>
                <Hash className="w-4 h-4 mr-2" />
                <span>Numéro de départ</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Deconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
