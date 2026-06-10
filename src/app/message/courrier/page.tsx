'use client';

import { useState } from 'react';
import { CourrierForm } from '@/features/courriers/components/form/CourrierForm';
import { CourrierSelectTemplate } from '@/features/courriers/pages/CourrierSelectTemplate';

export default function CourrierPage() {
    const [activeTab, setActiveTab] = useState<'form' | 'template'>('form');

    return (
        <main className="min-h-screen flex flex-col  antialiased text-slate-900">
            
            {/* EN-TÊTE ET NAVIGATION PREMIUM */}
            <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors duration-200">
                <div className="w-full px-6 py-4 sm:px-8 md:px-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    
                    {/* Titre et contexte adaptés */}
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                            Gestion des Courriers
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Rédigez un nouveau document ou appliquez un modèle existant.
                        </p>
                    </div>
                    
                    {/* Menu Onglets - Segmented Control Sombre/Clair */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl gap-1 border border-slate-200/60 dark:border-slate-800/60 w-full sm:w-80 shadow-inner shrink-0">
                        <button
                            onClick={() => setActiveTab('form')}
                            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                                activeTab === 'form'
                                    ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/50 dark:bg-slate-800 dark:text-blue-400 dark:ring-slate-700/50'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-800/50'
                            }`}
                        >
                            {/* Icône Document */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Nouveau
                        </button>
                        
                        <button
                            onClick={() => setActiveTab('template')}
                            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                                activeTab === 'template'
                                    ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/50 dark:bg-slate-800 dark:text-blue-400 dark:ring-slate-700/50'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-800/50'
                            }`}
                        >
                            {/* Icône Modèle */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            Modèles
                        </button>
                    </div>

                </div>
            </header>

            {/* ZONE DE CONTENU CENTRALISÉE */}
            {/* CONTENU EN BAS : Remplit désormais 100% de la largeur et de la hauteur restante */}
           
                    
                    {/* Conteneur interne pour l'animation */}
                    <div className="flex-1 w-full flex flex-col">
                        {activeTab === 'form' && (
                                <CourrierForm onSuccess={() => setActiveTab('template')} />
                        )}
                        {activeTab === 'template' && (
                                <CourrierSelectTemplate />
                        )}
                    </div>
                    
        </main>
    );
}