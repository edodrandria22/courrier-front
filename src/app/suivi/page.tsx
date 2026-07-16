'use client';

import { useState } from 'react';
import { envoyerEmailSuivi } from '@/features/courriers/hooks/envoyerEmail';
import { Send, Loader2, Hash, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function TrackingPage() {
  const [reference, setReference] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { sendEmail, loading, error } = envoyerEmailSuivi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) return;
    
    setIsSuccess(false);
    const result = await sendEmail(reference);
    
    if (result.success) {
      setReference('');
      setIsSuccess(true);
      // Fait disparaître le message de succès après 1 seconde
      setTimeout(() => setIsSuccess(false), 1500);
    }
  };

  return (
    
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-12 overflow-hidden selection:bg-primary/30">
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
      {/* Background Animated Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10 animate-[pulse_8s_ease-in-out_infinite]" />

      <div className="w-full max-w-[420px] space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Card principale */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-card/70 backdrop-blur-2xl shadow-2xl shadow-primary/5 transition-all duration-500">
          
          {/* Ligne lumineuse animée en haut */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-[shimmer_2s_infinite]" />

          {/* Header */}
          <div className="px-8 pt-12 pb-6 flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-inner transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-out">
                <Mail className="w-8 h-8 text-primary" />
                {/* Petit point lumineux sur l'icône */}
                <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)] animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground italic">
                Suivi <span className="text-primary not-italic tracking-normal">ESPA</span>
              </h1>
              <p className="text-[12px] text-muted-foreground/80 font-semibold leading-relaxed max-w-[280px] mx-auto uppercase tracking-widest">
                Recevez votre bilan détaillé par email instantanément.
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-6">
            <div className="space-y-3">
              <label 
                htmlFor="reference" 
                className="block text-[10px] font-black uppercase tracking-[0.25em] text-foreground/50 ml-1"
              >
                Référence du document
              </label>
              <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary group-focus-within:rotate-12 transition-all duration-300 pointer-events-none" />
                <Input
                  id="reference"
                  placeholder="Ex: ESPA-2026-XXXX"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  disabled={loading || isSuccess}
                  className="pl-11 h-14 bg-background/40 border-border/50 rounded-2xl text-sm font-mono tracking-wider focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Affichage des erreurs avec animation slide */}
            {error && (
              <div className="p-4 text-[12px] font-bold text-destructive bg-destructive/5 rounded-2xl border border-destructive/10 animate-in slide-in-from-top-4 duration-300 flex items-start gap-3">
                <span className="shrink-0 mt-0.5 animate-bounce">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Bouton d'action dynamique avec transition de couleur */}
            <button
              type="submit"
              disabled={loading || !reference.trim() || isSuccess}
              style={{
                width: '100%',
                height: '56px',
                borderRadius: '16px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                fontSize: '11px',
                transition: 'all 0.5s',
                transform: isSuccess ? 'scale(1.02)' : 'scale(1)',
                backgroundColor: isSuccess ? '#059669' : 'var(--secondary)',
                color: '#ffffff',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: isSuccess ? '#059669' : 'var(--secondary)',
                cursor: (loading || !reference.trim() || isSuccess) ? 'not-allowed' : 'pointer',
                opacity: (loading || !reference.trim() || isSuccess) ? '0.6' : '1',
                boxShadow: isSuccess 
                  ? '0 0 25px rgba(5, 150, 105, 0.5), 0 10px 15px -3px rgba(5, 150, 105, 0.3)' 
                  : '0 10px 15px -3px rgba(30, 64, 175, 0.4), 0 4px 6px -2px rgba(30, 64, 175, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!loading && reference.trim() && !isSuccess) {
                  e.currentTarget.style.backgroundColor = 'var(--primary)'
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
                  e.currentTarget.style.borderColor = 'var(--primary)'
                  e.currentTarget.style.boxShadow = '0 25px 30px -5px rgba(30, 58, 138, 0.4), 0 10px 10px -5px rgba(30, 58, 138, 0.3)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && reference.trim() && !isSuccess) {
                  e.currentTarget.style.backgroundColor = 'var(--secondary)'
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.borderColor = 'var(--secondary)'
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(30, 64, 175, 0.4), 0 4px 6px -2px rgba(30, 64, 175, 0.2)'
                }
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  <span>Traitement...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Lien envoyé !</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Recevoir le suivi</span>
                </>
              )}
            </button>
          </form>

        </div>
        
        <p className="text-center text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.3em]">
          Système sécurisé ESPA 2026
        </p>
      </div>
    </div>
  );
}