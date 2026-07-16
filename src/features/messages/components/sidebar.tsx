'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Mail,
  ShieldCheck,
  ClipboardEdit,
  User as UserIcon,
  Send,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { User } from '@/features/auth/types/login'

interface SidebarProps {
  user: User | null,
  onNavigate?: () => void
}

export default function Sidebar({ user, onNavigate }: SidebarProps) {
  const pathname = usePathname()

  // 1. Définition de la variable pour les actions
  const isAdmin = user?.role === 'Admin'
  const actionItems: any[] = [];
  const systemFolders: any[] = [];
  if (!isAdmin) {
    actionItems.push({
      id: 'new-courrier',
      name: 'Nouveau Courrier',
      icon: ClipboardEdit,
      path: '/message/courrier',
    });
    actionItems.push({
      id: 'statistique',
      name: 'Statistique',
      icon: BarChart3,
      path: '/message/courrier/statistique',
    })
    systemFolders.push(
    {
      id: 'inbox',
      name: 'Boîte de réception',
      icon: Mail,
      path: '/message/courrier/receive',
    },
    {
      id: 'send',
      name: "Boîte d'envoi",
      icon: Send,
      path: '/message/courrier/send',
    },
    {
      id: 'recherche',
      name: 'Recherche',
      icon: ClipboardEdit,
      path: '/message/courrier/recherche',
    }
  )
    
  }
  else {
    actionItems.push({
      id: 'utilisateurs',
      name: 'Utilisateurs',
      icon: UserIcon,
      path: '/message/utilisateurs',
    })
    // actionItems.push({
    //   id: 'new-courrier',
    //   name: 'Nouveau Courrier',
    //   icon: ClipboardEdit,
    //   path: '/message/courrier',
    // })
    
    systemFolders.push(
    // {
    //   id: 'inbox',
    //   name: 'Boîte de réception',
    //   icon: Mail,
    //   path: '/message/courrier/receive',
    // },
    // {
    //   id: 'send',
    //   name: "Boîte d'envoie",
    //   icon: Send,
    //   path: '/message/courrier/send',
    // },
    {
      id: 'recherche',
      name: 'Recherche',
      icon: ClipboardEdit,
      path: '/message/courrier/recherche',
    })
    
  }

  // 2. Définition de la variable pour le menu principal
  
  

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen">
      {/* Logo Image & Nom Projet */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3 group select-none">
          {/* Conteneur du Logo */}
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-sidebar-border bg-white shadow-sm group-hover:border-sidebar-primary/40 group-hover:shadow-md transition-all duration-300 flex items-center justify-center">
            <Image 
              src="/mesupres.jpg" 
              alt="Logo MESUPRES" 
              fill
              className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
          
          {/* Texte de la Marque */}
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold tracking-wider text-sidebar-foreground group-hover:text-sidebar-primary transition-colors duration-300">
              MESUPRES
            </span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-normal truncate mt-0.5">
              Enseignement Supérieur
            </span>
          </div>
        </div>
      </div>
      {/* Actions List */}
      <div className="mb-6 mt-5 px-2">
        <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          Actions
        </div>
        <nav className="space-y-1">
          {actionItems.map((action) => {
            const Icon = action.icon
            const isActive = pathname === action.path
            
            return (
              <Link key={action.id} href={action.path} onClick={onNavigate}>
                <button
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm group text-left relative',
                    isActive
                      ? 'bg-sidebar-primary/10 text-sidebar-primary font-bold'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground'
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r-full bg-sidebar-primary" />
                  )}
                  <Icon className={cn(
                    "w-4 h-4 transition-transform group-hover:scale-110",
                    isActive ? "text-sidebar-primary" : "text-muted-foreground"
                  )} />
                  {action.name}
                </button>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Folders List */}
      <div className="flex-1 overflow-auto px-2">
        <div className="mb-6">
          <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            Menu Principal
          </div>
          <nav className="space-y-1">
            {systemFolders.map((folder) => {
              const Icon = folder.icon
              const isActive = pathname === folder.path
              return (
                <Link key={folder.id} href={folder.path} onClick={onNavigate}>
                  <button
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm group text-left relative',
                      isActive
                        ? 'bg-sidebar-primary/10 text-sidebar-primary font-bold'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground'
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r-full bg-sidebar-primary" />
                    )}
                    <Icon className={cn(
                      "w-4 h-4 transition-transform group-hover:scale-110",
                      isActive ? "text-sidebar-primary" : "text-muted-foreground"
                    )} />
                    {folder.name}
                  </button>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Custom Labels Section */}
        {/* Vous pourrez réintégrer votre logique d'étiquettes dynamiques ici */}
        
      </div>

      {/* User Footer - Info Polytechnique */}
      <div className="p-4 mt-auto border-t border-sidebar-border bg-sidebar-accent/5">
        <div className="flex items-center gap-2 px-2">
          <ShieldCheck className="w-4 h-4 text-sidebar-primary" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            MESUPRES Sécurisé
          </span>
        </div>
      </div>
    </aside>
  )
}