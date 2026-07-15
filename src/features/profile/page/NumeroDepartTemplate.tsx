"use client";

import React, { useEffect, useState } from 'react';
import { useNumeroDeparts } from '../hooks/useNumeroDepart';
import { NumeroDepart } from '../../utilisateurs/types/numeroDepart';
import { toast } from "sonner"; // Adapte selon ta librairie

export default function NumeroDepartTemplate() {
  const { numeroDepart, loading, error, fetchNumeroDepart, creerNumeroDepart } = useNumeroDeparts();

  const [nouveauNumero, setNouveauNumero] = useState('');
  const [isSendMode, setIsSendMode] = useState(false);

  // 1. Charger/Recharger les données dès que `isSendMode` change
  useEffect(() => {
    fetchNumeroDepart(isSendMode);
  }, [fetchNumeroDepart, isSendMode]); // 👈 On ajoute isSendMode dans les dépendances

  // 2. Pré-remplir le formulaire avec les données récupérées
  useEffect(() => {
    if (numeroDepart) {
      // On convertit en string pour l'input text
      setNouveauNumero(numeroDepart.numero ? String(numeroDepart.numero) : '0');
      // On met à jour la checkbox selon la donnée actuelle
      
    }
    setIsSendMode(isSendMode); 
  }, [numeroDepart]); // 👈 S'exécute à chaque fois que numeroDepart change

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: NumeroDepart = {
      numero: parseInt(nouveauNumero, 10),
      isSend: isSendMode
    };

    try {
      const result = await creerNumeroDepart(payload);

      if (result && result.numero) {
        const message = isSendMode ? "d'envoi" : "de réception";
        toast.success(`Numéro ${result.numero} numéro ${message} modifié avec succès !`);
        fetchNumeroDepart(isSendMode); 
      }
    } catch (err) {
      toast.error("Erreur lors de la modification du numéro"+ (err as Error).message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-black text-foreground uppercase tracking-tight">
          Gestion des Numéros de Départ
        </h1>

        <p className="text-muted-foreground mt-2 text-sm">
          Configurez les numéros de départ pour l'envoi et la réception
        </p>
        <div className="h-1 w-12 bg-blue-600 mx-auto mt-6 rounded-full" />
      </div>

      <div className="bg-card border border-border rounded-3xl shadow-xl p-8 md:p-12 overflow-hidden relative">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 bg-primary/10 rounded-full blur-3xl opacity-50" />

        <form onSubmit={handleCreate} className="space-y-8 relative z-10">
          <div className="space-y-6">
            {/* Numéro */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                Numéro de départ {isSendMode ? "d'envoi" : "de réception"}
              </label>
              <div className="relative group">
                <input
                  id="numero"
                  type="number"
                  value={nouveauNumero}
                  onChange={(e) => setNouveauNumero(e.target.value)}
                  placeholder="Ex: 2026001"
                  className="w-full bg-muted/50 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-2xl px-5 py-4 text-sm transition-all duration-300 outline-none"
                  required
                />
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-3">
              <input
                id="isSend"
                type="checkbox"
                checked={isSendMode}
                onChange={(e) => setIsSendMode(e.target.checked)}
                className="w-5 h-5 text-primary border-2 border-muted-300 rounded focus:ring-primary focus:ring-offset-0"
              />
              <label htmlFor="isSend" className="text-sm font-medium text-foreground cursor-pointer">
                Marquer comme numéro d'envoi
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-lg ${
              loading
                ? "bg-muted text-secondary-foreground cursor-not-allowed shadow-none"
                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-1 active:scale-95 text-white"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Enregistrement...</span>
              </div>
            ) : "Enregistrer le numéro"}
          </button>
        </form>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Mesupres / Rapport d'Activités &copy; 2026
        </p>
      </div>
    </div>
  );
}
