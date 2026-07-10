import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { NotificationDisplay } from '@/features/notifications/components/NotificationDisplay'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono',
});

// 1. Correction : On sépare le Viewport des Metadata
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }, // Ton fond Midnight
  ],
}

export const metadata: Metadata = {
  title: 'Gestion de Courrier ESPA Polytechnique Vontovorona',
  description: 'Plateforme de gestion de courrier sécurisée avec envoi de pièces jointes, dossiers personnalisés et notifications temps réel.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  keywords: ['email', 'courrier', 'gestion', 'pièces jointes', 'collaboratif'],
}

// Composant interne pour utiliser le hook
function NotificationWrapper() {
  return <NotificationDisplay />
}
import { Toaster } from "@/components/ui/sonner" // ou le bon chemin
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <NotificationWrapper />
          <Toaster position="top-right" richColors />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}