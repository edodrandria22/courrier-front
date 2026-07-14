"use client";

import { useCallback, useState, useEffect } from "react";
import { User } from "@/features/auth/types/login";
import { authService } from "../services/authService";

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrentUser = useCallback(async () => {
      setLoading(true)
      setError(null)
  
      try {
        const user =  await authService.checkAuth();
        setUser(user);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Erreur lors de la récupération de l'utilisateur"
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }, []);

  useEffect(() => {
    // 1. Essayer de récupérer l'utilisateur depuis le localStorage
    const userFromStorage = localStorage.getItem('user_info');
    if (userFromStorage) {
      try {
        const parsedData = JSON.parse(userFromStorage);
        // La clé est 'user_info' et contient data.membre
        const user = parsedData.membre || parsedData;
        setUser(user);
        setLoading(false);
        return;
      } catch (err) {
        console.error('Erreur lors de la lecture du localStorage:', err);
      }
    }
    
    // 2. Si pas dans localStorage, appeler getCurrentUser
    getCurrentUser();
  }, [getCurrentUser]);

  return { user, loading, error };
}
