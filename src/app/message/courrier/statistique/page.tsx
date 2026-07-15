'use client'

import { useEffect, useState } from 'react';
import { useStatistique } from '@/features/courriers/hooks/useStatistique';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function StatistiquePage() {
  const { statistique, loading, error, getStatistique } = useStatistique();
  const currentYear = new Date().getFullYear();
  
  // Initialisation dynamique : 1er janvier de l'année en cours et date du jour
  const [dateDebut, setDateDebut] = useState(`${currentYear}-01-01`);
  const [dateFin, setDateFin] = useState(new Date().toISOString().split('T')[0]);

  const handleSetToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setDateDebut(today);
    setDateFin(today);
  };
  const handleSetAnnuel = () => {
    const today = new Date().toISOString().split('T')[0];
    setDateDebut(`${currentYear}-01-01`);
    setDateFin(today);
  };
  useEffect(() => {
    // Sécurité : on s'assure que les dates ne sont pas vides avant de lancer la requête
    if (dateDebut && dateFin) {
      getStatistique(dateDebut, dateFin);
    }
  }, [dateDebut, dateFin, getStatistique]);

  // Transformation des données pour Recharts
  const data = statistique ? [
    { name: 'Non traités', value: statistique.nonTraite, color: '#ff4d4f' },
    { name: 'Reçus', value: statistique.recu || 0, color: '#1890ff' },
    { name: 'Envoyés', value: statistique.envoye || 0, color: '#52c41a' },
    { name: 'Traités', value: statistique.traite || 0, color: '#faad14' },
    { name: 'Lu', value: statistique.lu || 0, color: '#722ed1' },
    { name: 'Non lu', value: statistique.nonLu || 0, color: '#eb2f96' },
  ].filter(item => item.value > 0) : []; // On enlève les valeurs à 0

  // Debug logs
  // console.log('Statistique brute:', statistique);
  // console.log('Data transformée:', data);

  // Création d'une clé unique basée sur les valeurs pour forcer Recharts à se rafraîchir
  const chartKey = data.map(d => d.value).join('-');

  return (
    <div className="p-8 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Répartition des Courriers</h1>
      
      {/* Zone des filtres (Toujours visible) */}
      <div className="flex gap-4 mb-8 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Date début</label>
          <input 
            type="date" 
            value={dateDebut} 
            onChange={(e) => setDateDebut(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date fin</label>
          <input 
            type="date" 
            value={dateFin} 
            onChange={(e) => setDateFin(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        {/* Bouton Aujourd'hui */}
        <button
            type="button"
            onClick={handleSetToday}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50 transition-colors font-medium h-[42px] dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            >
            Aujourd'hui
        </button>
        
        {/* Bouton Annuel */}
        <button
            type="button"
            onClick={handleSetAnnuel}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50 transition-colors font-medium h-[42px] dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            >
            Annuel
        </button>
      </div>

      {/* Zone du graphique (Affichage conditionnel) */}
      <div className="flex-1 min-h-[400px]">
        {loading ? (
          // Affiché PENDANT le chargement
          <div className="flex flex-col items-center justify-center h-full w-full max-w-sm mx-auto p-6 animate-pulse">
            {/* Faux graphique en anneau */}
            <div className="relative w-48 h-48 rounded-full border-[16px] border-gray-200 dark:border-gray-700 flex items-center justify-center mb-6">
              {/* Centre du graphique */}
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800"></div>
            </div>
            
            {/* Fausse légende sous le graphique */}
            <div className="w-full space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-2/3 mx-auto"></div>
              <div className="flex justify-center gap-4 pt-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
              </div>
            </div>
          </div>
        ) : error ? (
          // Affiché en cas d'ERREUR
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : statistique && data.length > 0 ? (
          // Affiché quand les DONNÉES sont prêtes
          <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          // Affiché s'il n'y a aucune donnée pour ces dates
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Aucune donnée pour cette période.</p>
          </div>
        )}
      </div>
    </div>
  );
}