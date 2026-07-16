'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import { LoginForm } from '../components/form/LoginForm'

export const LoginTemplate = () => {
    return (
        <>
            {/* Bouton de retour - style simple et discret */}
            <Link 
                href="/"
                className="fixed top-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium whitespace-nowrap z-50 hover:bg-accent hover:text-accent-foreground"
                style={{
                    backgroundColor: 'transparent',
                    border: '1px solid transparent',
                    fontWeight: '500',
                    minWidth: 'auto'
                }}
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour à l'accueil</span>
            </Link>

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/5 p-4 relative overflow-hidden">
                {/* Blobs décoratifs */}
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[100px] pointer-events-none" />

                <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block group">
                        {/* <div className="relative w-16 h-16 mx-auto mb-4 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(var(--primary),0.2)] group-hover:shadow-primary/40 transition-all duration-300 border border-border">
                            <Image
                                src="/mesupres.jpg"
                                alt="Logo Espa Courier"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div> */}
                        <h1 className="text-3xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors italic">
                            ESPA COURIER
                        </h1>
                        <div className="flex items-center justify-center gap-2 mt-1">
                            <ShieldCheck className="w-3 h-3 text-primary" />
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Portail Polytechnique</p>
                        </div>
                    </Link>
                </div>

                {/* Formulaire de Login */}
                <LoginForm />

                {/* Footer discret */}
                <p className="mt-8 text-center text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-medium">
                    &copy; 2026 Ecole Polytechnique Vontovorona
                </p>
            </div>
        </div>
        </>
    )
}
