"use client";
import React from 'react';
import Image from 'next/image';

// Interface pour rendre le composant dynamique et réutilisable
interface PayslipProps {
  logoUrl?: string; // Mettez l'URL de l'image du logo TAF ici
}

export default function BulletinPaie({ logoUrl }: PayslipProps) {
  // Données extraites de l'image
  const employeeInfo = {
    emploi: "Acheteur",
    classification: "HC1",
    anciennete: "1 an(s) et 0 mois",
    situationFamiliale: "Divorcé(e)",
    nbreEnfant: 2,
    embauche: "02/06/25",
    periode: "01/05/26 au 31/05/26",
    matricule: "1617",
    nom: "Mme RAVELONJATOVO FANIRINIAINA FRANCIA",
    cnaps: "972727001416",
    cin: "101252193454",
    adresse: "Lot II N 171 I Bis Analamahitsy Tanana",
    salaireBase: "2 004 300,00"
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg my-6 print:shadow-none print:my-0 print:p-0">
      
      {/* Bouton d'action - Caché lors de l'impression PDF */}
      <div className="flex justify-end mb-4 print:hidden">
        <button 
          onClick={handlePrint}
          className="bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded transition shadow"
        >
          Imprimer / Exporter en PDF
        </button>
      </div>

      {/* Conteneur principal du Bulletin */}
      <div className="border border-gray-300 p-8 rounded-sm bg-white min-h-[297mm] flex flex-col justify-between print:border-none print:p-0">
        <div>
          {/* Header Section */}
          <div className="grid grid-cols-2 gap-8 mb-6 pb-6">
            
            {/* Colonne Gauche : Logo & Infos Emploi */}
            <div>
              <div className="mb-4">
                {logoUrl ? (
                  <img src={logoUrl} alt="TAF Madagascar" className="h-16 object-contain" />
                ) : (
                  <div>
                    <Image 
                      src="/taf.jpg" 
                      alt="Logo Footer"
                      width={138}
                      height={138}
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-1.5 text-sm text-gray-800 mt-6">
                <div><span className="font-semibold inline-block w-35">Emploi </span>{employeeInfo.emploi}</div>
                <div className="flex items-start">
                  <span className="font-semibold inline-block w-56 shrink-0 whitespace-nowrap">
                    Classification Professionnelle
                  </span>
                  <span>{employeeInfo.classification}</span>
                </div>
                <div><span className="font-semibold inline-block w-35">Ancienneté</span>{employeeInfo.anciennete}</div>
                <div><span className="font-semibold inline-block w-35">Situat° familiale</span>{employeeInfo.situationFamiliale}</div>
                
                {/* Conteneur flex pour aligner horizontalement */}
                <div className="flex items-center gap-x-8">
                  <div>
                    <span className="font-semibold inline-block w-30">Nbre enfant</span>
                    {employeeInfo.nbreEnfant}
                  </div>
                  <div>
                    <span className="font-semibold inline-block w-25">Embauche</span>
                    {employeeInfo.embauche}
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Titre & Infos Collaborateur */}
            <div>
              <div className="bg-white rounded-xl p-4 space-y-0.5 text-sm text-gray-800">
                <h2 className="text-2xl font-bold tracking-wider text-slate-950 uppercase mb-2">
                  Bulletin de Paie
                </h2>
                
                <div className="grid grid-cols-[85px_1fr] gap-x-1 items-start">
                  <span className="font-semibold text-gray-700">Période du</span>
                  <span className="text-black-600 text-[11px] leading-tight font-bold">{employeeInfo.periode}</span>
                </div>

                <div className="grid grid-cols-[85px_1fr] gap-x-1 items-start">
                  <span className="font-semibold text-gray-700">Matricule</span>
                  <span className="text-gray-600 text-[11px] leading-tight">{employeeInfo.matricule}</span>
                </div>

                <div className="grid grid-cols-[85px_1fr] gap-x-1 items-start">
                  <span className="font-semibold text-gray-700">Mme</span>
                  <span className="text-gray-600 text-[11px] leading-tight">{employeeInfo.nom}</span>
                </div>

                <div className="grid grid-cols-[85px_1fr] gap-x-1 items-start">
                  <span className="font-semibold text-gray-700">N° CNaPS</span>
                  <span className="text-gray-900  text-xs">{employeeInfo.cnaps}</span>
                </div>

                <div className="grid grid-cols-[85px_1fr] gap-x-1 items-start">
                  <span className="font-semibold text-gray-700">CIN n°</span>
                  <span className="text-gray-900  text-xs">{employeeInfo.cin}</span>
                </div>

                <div className="grid grid-cols-[85px_1fr] gap-x-1 items-start">
                  <span className="font-semibold text-gray-700">Adresse</span>
                  <span className="text-gray-600 text-[12px] leading-tight ml-2">{employeeInfo.adresse}</span>
                </div>

                <div className="mt-2 font-bold flex items-center text-sm text-slate-900">
                  <span>Salaire Base</span>
                  <span className="tracking-tight ml-2">{employeeInfo.salaireBase} Ar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tableau des Éléments de Salaire */}
          <div className="mt-4">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="text-gray-800 uppercase text-xs font-bold border-y border-gray-300">
                  <th className="p-2 border border-gray-300 text-center w-[10%]">N°</th>
                  <th className="p-2 border border-gray-300 w-[20%]">Désignation</th>
                  <th className="p-2 border border-gray-300 text-right w-[10%]">Nombre</th>
                  <th className="p-2 border border-gray-300 text-right w-[12%]">Base</th>
                  <th className="p-2 border border-gray-300 text-right w-[8%]">Taux</th>
                  <th className="p-2 border border-gray-300 text-right w-[14%]">Gain</th>
                  <th className="p-2 border border-gray-300 text-right w-[15%]">Retenue</th>
                </tr>
              </thead>
              <tbody className="text-gray-900">
                {/* Salaire de Base */}
                <tr>
                  <td className="p-2 border-x border-gray-300 text-center  text-xs">0010</td>
                  <td className="p-2 border-x border-gray-300">Salaire de base mensuel</td>
                  <td className="p-2 border-x border-gray-300 text-right"></td>
                  <td className="p-2 border-x border-gray-300 text-right"></td>
                  <td className="p-2 border-x border-gray-300 text-right"></td>
                  <td className="p-2 border-x border-gray-300 text-right font-medium">2 004 300,00</td>
                  <td className="p-2 border-x border-gray-300 text-right"></td>
                </tr>
                
                {/* Absence */}
                <tr>
                  <td className="p-2 border-x border-gray-300 text-center  text-xs">0080</td>
                  <td className="p-2 border-x border-gray-300">Absence congés</td>
                  <td className="p-2 border-x border-gray-300 text-right">0,00</td>
                  <td className="p-2 border-x border-gray-300 text-right  text-xs">0,00</td>
                  <td className="p-2 border-x border-gray-300 text-right"></td>
                  <td className="p-2 border-x border-gray-300 text-right"></td>
                  <td className="p-2 border-x border-gray-300 text-right">0,00</td>
                </tr>
                
                {/* Allocations Congés */}
                <tr>
                  <td className="p-2 border-x border-gray-300 text-center  text-xs">0090</td>
                  <td className="p-2 border-x border-gray-300">Allocation congé payé</td>
                  <td className="p-2 border-x border-gray-300 text-right">0,00</td>
                  <td className="p-2 border-x border-gray-300 text-right  text-xs">0,00</td>
                  <td className="p-2 border-x border-gray-300 text-right"></td>
                  <td className="p-2 border-x border-gray-300 text-right font-medium">0,00</td>
                  <td className="p-2 border-x border-gray-300 text-right"></td>
                </tr>

                {/* Ligne Intermédiaire : Salaire Brut */}
                {/* 1. On a retiré border-y et sa couleur ici */}
                <tr className="font-bold">
                  {/* 2. On remplace "border" par "border-x" sur toutes les cellules */}
                  <td colSpan={1} className="p-2 border-x border-gray-300"></td>
                  <td colSpan={1} className="p-2 border-x border-gray-300 uppercase tracking-wider text-xs">Salaire brut</td>
                  <td colSpan={1} className="p-2 border-x border-gray-300"></td>
                  <td colSpan={1} className="p-2 border-x border-gray-300"></td>
                  <td colSpan={1} className="p-2 border-x border-gray-300"></td>
                  
                  <td colSpan={1} className="p-2 border-x border-t border-gray-300 text-right">2 004 300,00</td>
                  <td colSpan={1} className="p-2 border-x border-t border-gray-300"></td>
                  
                </tr>

                {/* CNaPS */}
                <tr>
                  <td className="p-2 border-x border-gray-300 text-center  text-xs">0020</td>
                  <td className="p-2 border-x border-gray-300">Cotisation SAL CNaPS N.Agri</td>
                  <td className="p-2 border-x border-gray-300 text-right"></td>
                  <td className="p-2 border-x border-gray-300 text-right  text-xs">2 004 300,00</td>
                  <td className="p-2 border-x border-gray-300 text-right  text-xs">1,000</td>
                  <td className="p-2 border-x border-gray-300 text-right"></td>
                  <td className="p-2 border-x border-gray-300 text-right">17 900,00</td>
                </tr>

                {/* OSTIE */}
                <tr>
                  <td className="p-2 border-x border-gray-300 text-center  text-xs">0120</td>
                  <td className="p-2 border-x border-gray-300">Cotisation Sal OSTIE</td>
                  <td className="p-2 border-x border-gray-300 text-right"></td>
                  <td className="p-2 border-x border-gray-300 text-right  text-xs">2 004 300,00</td>
                  <td className="p-2 border-x border-gray-300 text-right  text-xs">1,000</td>
                  <td className="p-2 border-x border-gray-300 text-right"></td>
                  <td className="p-2 border-x border-gray-300 text-right">17 900,00</td>
                </tr>

                {/* IRSA */}
                <tr>
                  <td className="p-2 border-x border-gray-300 text-center  text-xs">0560</td>
                  <td className="p-2 border-x border-gray-300">Retenue IRSA</td>
                  <td className="p-2 border-x border-gray-300 text-right"></td>
                  <td className="p-2 border-x border-gray-300 text-right"></td>
                  <td className="p-2 border-x border-gray-300 text-right"></td>
                  <td className="p-2 border-x border-gray-300 text-right"></td>
                  <td className="p-2 border-x border-gray-300 text-right">268 500,00</td>
                </tr>

                {/* Total Cotisations */}
                <tr className="font-bold border-t border-b border-gray-400">
                  <td className="p-2 border-x border-gray-300 text-right"></td>
                  <td colSpan={5} className="p-2 border border-gray-300 uppercase tracking-wider text-xs">Total Cotisations</td>
                  <td className="p-2 border border-gray-300 text-right">2 004 300,00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Grand bloc de synthèse à 4 quadrants (Conforme aux photos du bulletin) */}
          <div className="w-full border border-gray-400 text-xs text-gray-900 mt-6 bg-white">
  
  {/* --- PARTIE SUPÉRIEURE --- */}
          <div className="flex border-b border-gray-400">
            
            {/* 1. Haut-Gauche : Compteurs de Congés */}
            <div className="w-[60%] border-r border-gray-400 p-3">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-right text-gray-700 font-normal">
                    <th className="text-left font-normal w-[35%]"></th>
                    <th className="font-bold pb-1">Antérieur</th>
                    <th className="font-bold pb-1">Acquis</th>
                    <th className="font-bold pb-1">Pris</th>
                    <th className="font-bold pb-1">Solde</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-right">
                    <td className="text-left py-0.5 font-extrabold">Congé:</td>
                    <td className="font-extrabold">20,50</td>
                    <td className="font-extrabold">2,50</td>
                    <td className="font-extrabold">0,00</td>
                    <td className="font-extrabold">23,00</td>
                  </tr>
                  <tr className="text-right">
                    <td className="text-left py-0.5 font-extrabold">Abs Maladie:</td>
                    <td></td>
                    <td></td>
                    <td className="font-extrabold">0,00</td>
                    <td></td>
                  </tr>
                  <tr className="text-right">
                    <td className="text-left py-0.5 font-extrabold whitespace-nowrap">Permission Exceptionnelle</td>
                    <td></td>
                    <td></td>
                    <td className="font-extrabold">0,00</td>
                    <td></td>
                  </tr>
                  <tr className="text-right">
                    <td className="text-left py-0.5 font-extrabold">Autres abscences</td>
                    <td></td>
                    <td></td>
                    <td className="font-extrabold">0,00</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 2. Haut-Droite : Le bloc Net à Payer */}
            <div className="w-[40%] p-3 flex flex-col justify-between items-end pr-8">
              <div className="text-gray-700 text-sm font-bold">Net à payer</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold tracking-tight">1 700 000,00</span>
                <span className="text-sm">Ar</span>
              </div>
            </div>
          </div>

          {/* --- PARTIE INFÉRIEURE --- */}
          <div className="flex">
            
            {/* 3. Bas-Gauche : Espace vide + Synthèse financière */}
            <div className="w-[60%] border-r border-gray-400 p-3 flex">
              {/* Espace vide pour reproduire le décalage de l'image */}
              <div className="w-[40%]"></div>
              
              {/* Tableau financier */}
              <div className="w-[60%]">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr>
                      <td className="py-0.5 text-gray-800 font-bold">Salaire brut</td>
                      <td className="text-right">2 004 300,00</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 text-gray-800 font-bold">Charges salariales</td>
                      <td className="text-right font-bold">35 800,00</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 text-gray-800 font-bold">Charges patronales</td>
                      <td className="text-right font-bold">380 817,00</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 text-gray-800 font-bold">Avantage en nature</td>
                      <td className="text-right font-bold">0,00</td>
                    </tr>
                    <tr className="font-medium">
                      <td className="py-0.5 font-bold">Net imposable</td>
                      <td className="text-right font-bold">2 004 300,00</td>
                    </tr>
                    
                    {/* Mentions de paiement */}
                    <tr>
                      <td colSpan={2} className="pt-5">
                        <div className="flex justify-between w-full text-gray-800 font-bold">
                          <span className="font-bold">Paiement le 31/05/26</span>
                          <span className="font-bold">par Virement</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="text-gray-800 font-bold">BOA</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Bas-Droite : Zone de signature Salarié */}
            <div className="w-[40%] p-3 pt-4 flex justify-center items-start">
              <span className="text-sm text-gray-600 font-bold">Salarié</span>
            </div>

          </div>
        </div>
        </div>
        
        {/* Pied de page signatures */}
        
      </div>
    </div>
  );
}