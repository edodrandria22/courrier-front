"use client";

import { useState, useRef, useEffect } from "react";

const EMPLOYEURS = [
  "Université d'Antananarivo",
  "Université de Mahajanga",
  "Université de Tuléar",
  "Université de Toamasina",
  "Université de Fianarantsoa",
  "Université d'Antsiranana",
  "Université de l'Itasy",
  "Université de Vakinankaratra",
  "Université d'Analanjorofo",
  "Université de SAVA",
  "Université d'Agnambà",
  "Université d'Alaotra-Mangoro",
  "Université d'Anosy",
  "Université d'Androy",
  "Université d'Androna",
  "Université d'Amoron'i Mania",
  "Université de Menabe",
  "IST d'Antananarivo",
  "IST de Diego",
  "INSTN",
  "CNRE",
  "FOFIFA",
  "CNRO",
  "CNRIT",
  "CNARP",
  "PBZT",
  "IMVAVET",
  "CIDST",
  "CNTEMAD",
  "CNELA",
  "MESUPRES",
  "Autre"
];

const ITEMS_PER_PAGE = 8;

interface EmployeurSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  isRecherche?: boolean; // 1. Ajout de la nouvelle prop
}

const EmployeurSelect = ({ value, onChange, disabled, isRecherche = false }: EmployeurSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 2. Si isRecherche est vrai, on ajoute "Tous" au début de la liste
  const optionsList = isRecherche ? ["Tous", ...EMPLOYEURS] : EMPLOYEURS;

  // Filtrer la liste (inclut "Tous" dans la recherche s'il est présent)
  const filteredEmployeurs = optionsList.filter((employeur) =>
    employeur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployeurs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEmployeurs = filteredEmployeurs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Déterminer le texte à afficher sur le bouton principal
  const getDisplayText = () => {
    if (value) return value;
    if (isRecherche) return "Tous";
    return "Sélectionnez un employeur (optionnel)";
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
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

      {isOpen && !disabled && (
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
              paginatedEmployeurs.map((employeur, idx) => {
                // 4. Vérifier si cet élément est actuellement sélectionné
                const isSelected = employeur === "Tous" ? value === "" : value === employeur;

                return (
                  <li
                    key={idx}
                    onClick={() => {
                      // 5. Si on clique sur "Tous", on renvoie "", sinon la valeur normale
                      onChange(employeur === "Tous" ? "" : employeur);
                      setIsOpen(false);
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      isSelected ? "bg-gray-100 dark:bg-gray-800 font-medium" : ""
                    }`}
                  >
                    {employeur}
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