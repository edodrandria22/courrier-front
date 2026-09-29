import React from 'react';

export default function PresentationECourrier() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* En-tête / Titre principal */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-2 border border-transparent dark:border-blue-800/50">
            <svg className="w-8 h-8 text-blue-700 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Plateforme <span className="text-blue-600 dark:text-blue-400">e-Courrier</span>
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Ministère de l'Enseignement Supérieur et de la Recherche Scientifique (MESUPRES)
          </p>
        </div>

        {/* Section de présentation */}
        <section className="bg-white dark:bg-slate-800/90 rounded-2xl shadow-sm dark:shadow-none border border-slate-200/80 dark:border-slate-700 overflow-hidden transition-all duration-200">
          <div className="h-1.5 bg-blue-600 dark:bg-blue-500 w-full"></div>
          <div className="p-8 sm:p-10 space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
            <p className="text-lg font-medium text-slate-800 dark:text-slate-100">
              En application de la loi n°2014-026 du 10 décembre 2014 fixant les principes généraux relatifs à la dématérialisation des procédures administratives, le MESUPRES met à disposition e-Courrier, une plateforme numérique de gestion électronique du courrier.
            </p>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400"></div>
              </div>
              <p>
                Conçue pour faciliter l'enregistrement, le traitement, la recherche et le suivi des courriers, elle permet à chaque intéressé de retracer en permanence l'avancement de son dossier, tout en garantissant la confidentialité des échanges, la sécurité des données et leur archivage.
              </p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400"></div>
              </div>
              <p>
                En remplaçant progressivement les circuits papier par des procédures numériques, e-Courrier contribue à des services plus rapides, plus transparents et plus accessibles.
              </p>
            </div>
          </div>
        </section>

        {/* Section de contact */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Contacts & Support
            </h2>
            <div className="h-px bg-slate-200 dark:bg-slate-700/80 flex-grow"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Carte Contact 1 */}
            <div className="bg-white dark:bg-slate-800/90 rounded-xl p-6 shadow-sm dark:shadow-none border border-slate-200/80 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 dark:bg-blue-400"></div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 text-lg">
                Direction (DSINT)
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-slate-400 dark:text-slate-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nom</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Dr RASOAMANANA Radoniaina A.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-slate-400 dark:text-slate-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fonction</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">Directeur des Systèmes d’Information et des Nouvelles Technologies (DSINT)</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</p>
                    <a href="mailto:dsint@mesupres.mg" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline">
                      dsint@mesupres.mg
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Carte Contact 2 */}
            <div className="bg-white dark:bg-slate-800/90 rounded-xl p-6 shadow-sm dark:shadow-none border border-slate-200/80 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 dark:bg-indigo-400"></div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 text-lg">
                Service Système d'Information
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-slate-400 dark:text-slate-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nom</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Mr RAKOTOMANGA Samuel</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-slate-400 dark:text-slate-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fonction</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">Chef de Service Système d’Information</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</p>
                    <a href="mailto:dsint.ssi@mesupres.mg" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium hover:underline">
                      dsint.ssi@mesupres.mg
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}