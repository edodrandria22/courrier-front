// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center gap-4">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
        404 - Page non trouvée
      </h2>
      <p className="text-muted-foreground max-w-md text-sm sm:text-base">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link 
        href="/" 
        className="px-5 py-2.5 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors inline-flex items-center justify-center shadow-sm"
      >
        Retourner à l'accueil
      </Link>
    </div>
  )
}