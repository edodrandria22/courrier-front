'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Mail, Lock, Share2, Clock, ShieldCheck, ArrowRight, MapPin, Search } from 'lucide-react'

// ==========================================
// 1. CONFIGURATION & DONNÉES DE L'APPLICATION
// ==========================================

const APP_CONFIG = {
  name: "Mesupres Courrier",
  subName: "Enseignement Supérieur",
  badge: "PLATEFORME OFFICIELLE - Mesupres",
  title: {
    normal: "Gestion de Courrier",
    gradient: "Mesupres"
  },
  description: "Communiquez efficacement avec vos collègues. Envoyez, recevez et gérez vos courriers avec des pièces jointes de manière intuitive et sécurisée.",
  contact: {
    email: "contact@espa-poly.mg",
    address: "Vontovorona, Antananarivo 101"
  },
  copyright: `© ${new Date().getFullYear()}. Application Mesupres Courrier.`,
  paths: {
    logo: "/mesupres.jpg",
    logoFooter: "/logo-edogsanmhr.png",
    login: "/login",
    suivi: "/suivi",
    home: "/"
  }
}

// Liste des fonctionnalités
const FEATURES_DATA = [
  {
    icon: Mail,
    color: "text-primary",
    title: "Courriers",
    description: "Envoyez et recevez des courriers instantanés avec mise en forme riche."
  },
  {
    icon: Search,
    color: "text-secondary",
    title: "Recherche",
    description: "Recherchez facilement vos courriers selon vos critères."
  },
  {
    icon: Clock,
    color: "text-primary",
    title: "Temps Réel",
    description: "Suivez l'état de vos courriers en temps réel par mail."
  },
  {
    icon: Lock,
    color: "text-secondary",
    title: "Sécurisé",
    description: "Vos échanges sont chiffrés et protégés selon les normes Mesupres."
  }
]

// ==========================================
// 2. STYLES EN LIGNE EXTRAITS (Pour un JSX propre)
// ==========================================

const BUTTON_STYLES = {
  navLogin: {
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'var(--primary)',
    padding: '12px 24px',
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(30, 64, 175, 0.2), 0 2px 4px -1px rgba(30, 64, 175, 0.1)',
    transition: 'all 0.2s'
  } as React.CSSProperties,

  heroPrimary: {
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'var(--primary)',
    padding: '16px 32px',
    borderRadius: '9999px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 10px 15px -3px rgba(30, 64, 175, 0.4), 0 4px 6px -2px rgba(30, 64, 175, 0.2)',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  } as React.CSSProperties,

  heroSecondary: {
    backgroundColor: 'transparent',
    color: 'var(--secondary)',
    borderColor: 'var(--secondary)',
    borderWidth: '2px',
    borderStyle: 'solid',
    padding: '16px 32px',
    borderRadius: '9999px',
    fontSize: '18px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 10px 15px -3px rgba(243, 244, 250, 0.4), 0 4px 6px -2px rgba(30, 64, 175, 0.2)',
    gap: '8px',
    width: '100%'
  } as React.CSSProperties
}

// ==========================================
// 3. COMPOSANT PRINCIPAL
// ==========================================

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 selection:bg-primary/30">
      
      {/* --- NAVIGATION --- */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <Link href={APP_CONFIG.paths.home} className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(var(--primary),0.2)] group-hover:shadow-primary/40 transition-all duration-300">
            <Image 
              src={APP_CONFIG.paths.logo} 
              alt={`Logo ${APP_CONFIG.name}`}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-foreground leading-none group-hover:text-primary transition-colors">
              {APP_CONFIG.name}
            </span>
            <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-medium">
              {APP_CONFIG.subName}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link href={APP_CONFIG.paths.login}>
            <button
              style={BUTTON_STYLES.navLogin}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              Se connecter
            </button>
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="px-6 py-24 text-center max-w-5xl mx-auto relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 animate-pulse">
          <ShieldCheck className="w-3 h-3" />
          {APP_CONFIG.badge}
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-8 leading-[1.1] tracking-tighter">
          {APP_CONFIG.title.normal} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            {APP_CONFIG.title.gradient}
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          {APP_CONFIG.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={APP_CONFIG.paths.login}>
            <button
              style={BUTTON_STYLES.heroPrimary}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(30, 58, 138, 0.4), 0 10px 10px -5px rgba(30, 58, 138, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(30, 64, 175, 0.4), 0 4px 6px -2px rgba(30, 64, 175, 0.2)'
              }}
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5 transition-transform" />
            </button>
          </Link>

          <Link href={APP_CONFIG.paths.suivi} className="w-full sm:w-auto">
            <button
              style={BUTTON_STYLES.heroSecondary}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <Search className="w-5 h-5 text-muted-foreground" />
              Suivre un courrier
            </button>
          </Link>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="px-6 py-24 bg-card/30 border-y border-border relative">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-16 italic">
            Fonctionnalités Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES_DATA.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={<feature.icon className={`w-8 h-8 ${feature.color}`} />}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-border bg-card/40 px-6 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          
          {/* Logo & Description */}
          <div className="space-y-4 max-w-sm">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="relative w-8 h-8 rounded-md overflow-hidden border border-border">
                <Image 
                  src={APP_CONFIG.paths.logo} 
                  alt="Logo Footer"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground italic uppercase">
                {APP_CONFIG.name}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Plateforme officielle du Mesupres. 
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-end gap-3 text-sm text-muted-foreground">
            <h4 className="font-bold text-foreground uppercase text-xs tracking-[0.2em] mb-2">Nous contacter</h4>
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="w-4 h-4 text-primary" /> 
              <span>{APP_CONFIG.contact.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-secondary" /> 
              <span className="italic">{APP_CONFIG.contact.address}</span>
            </div>
          </div>
        </div>

        {/* Barre Copyright */}
        <div className="relative max-w-6xl mx-auto pt-8 mt-8 border-t border-border/50">
          <p className="text-center text-muted-foreground text-[10px] font-medium tracking-[0.2em] uppercase px-12">
            {APP_CONFIG.copyright}
          </p>

          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <img
              src={APP_CONFIG.paths.logoFooter}
              alt="EDOGSANMHR"
              className="h-6 w-auto opacity-80 hover:opacity-100 transition duration-300"
            />
          </div>
        </div>
      </footer>
    </div>
  )
}

// Component de carte réutilisable
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group p-8 bg-card/50 rounded-3xl border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 relative overflow-hidden">
      <div className="mb-6 p-4 bg-background w-fit mx-auto rounded-2xl shadow-inner border border-border/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
        {icon}
      </div>
      <h3 className="font-bold text-xl text-foreground mb-3 tracking-tight">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  )
}