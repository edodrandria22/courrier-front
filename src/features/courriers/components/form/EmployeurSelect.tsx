"use client";

import { useState, useRef, useEffect } from "react";
import { useEmployeur } from "../../contexts/EmployeursContext";
import { Employeur } from "../../types/courrier";

const ITEMS_PER_PAGE = 8;

interface EmployeurSelectProps {
  value: string|number;
  onChange: (value: string) => void;
  disabled?: boolean;
  isRecherche?: boolean;
}

const EmployeurSelect = ({ value, onChange, disabled, isRecherche = false }: EmployeurSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { Employeur, loading, error } = useEmployeur();

  // 1. Formatage des données : on sécurise l'ID et on gère nom/name
  const employeursList = (Employeur || []).map((emp: any) => ({
    id: String(emp.id || emp._id || ""), // Sécurise la conversion en String
    name: emp.nom || emp.name || "Nom inconnu", 
  }));

  // 2. Intégration de l'option "Tous" si isRecherche est true
  const optionsList = isRecherche 
    ? [{ id: "", name: "Tous" }, ...employeursList] 
    : employeursList;

  // 3. Filtrage de la liste
  const filteredEmployeurs = optionsList.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredEmployeurs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEmployeurs = filteredEmployeurs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Gestion du clic à l'extérieur pour fermer le menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 4. Fonction pour afficher le texte du bouton
  const getDisplayText = () => {
    if (loading) return "Chargement des employeurs...";
    if (error) return "Erreur de chargement";
    
    // Si une valeur (ID) est présente, on cherche le nom correspondant
    if (value !== undefined && value !== null && value !== "") {
      const selectedEmp = optionsList.find(e => String(e.id) === String(value));
      return selectedEmp ? selectedEmp.name : "Employeur inconnu";
    }
    
    if (isRecherche) return "Tous";
    return "Sélectionnez un employeur (optionnel)";
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled || loading || !!error}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={value || isRecherche ? "text-foreground" : "text-muted-foreground"}>
          {getDisplayText()}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && !disabled && !loading && !error && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-background shadow-md">
          
          <div className="border-b border-border p-2">
            <input
              type="text"
              placeholder="Rechercher un employeur..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="flex h-9 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              autoFocus
            />
          </div>

          <ul className="p-1">
            {paginatedEmployeurs.length > 0 ? (
              paginatedEmployeurs.map((emp, idx) => {
                // 5. Comparaison stricte en forçant le format String
                const isSelected = String(value) === String(emp.id);

                return (
                  <li
                    key={emp.id || `fallback-key-${idx}`} 
                    onClick={() => {
                      // 6. On remonte l'ID sélectionné
                      onChange(String(emp.id));
                      setIsOpen(false);
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      isSelected ? "bg-gray-100 dark:bg-gray-800 font-medium" : ""
                    }`}
                  >
                    {emp.name}
                  </li>
                );
              })
            ) : (
              <li className="py-2 px-2 text-sm text-center text-gray-500">
                Aucun résultat trouvé.
              </li>
            )}
          </ul>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border p-2 text-xs">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-md border border-border px-2 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent dark:hover:bg-gray-800"
              >
                Précédent
              </button>
              <span className="text-muted-foreground">
                Page {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-md border border-border px-2 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent dark:hover:bg-gray-800"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeurSelect;