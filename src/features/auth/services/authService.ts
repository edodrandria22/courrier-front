import { LoginCredentials, User } from '../types/login';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include', // Important pour inclure les cookies
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || data.error || 'Identifiants invalides');
      }

      const data = await response.json();
      
      // Stocker le token et les infos utilisateur pour la persistance
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_info', JSON.stringify(data.membre));
      }

      return data.membre as User;
    } catch (error) {
      // console.error('Login error:', error);
      throw error;
    }
  },
  checkAuth: async (): Promise<User> => {
        const response = await fetch(`/api/auth/me`, {
            method: "GET",
            credentials: "include", // <--- C'est cette ligne qui manque !
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la connexion');
        }
        
        return data.user as User;
    },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Important pour inclure les cookies
      });
    } catch (error) {
      // console.error('Logout error:', error);
    } finally {
      // Nettoyer le stockage local
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
      }
    }
  },

  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  getUser: () => {
    if (typeof window !== 'undefined') {
      const userInfo = localStorage.getItem('user_info');
      return userInfo ? JSON.parse(userInfo) : null;
    }
    return null;
  },

  isAuthenticated: () => {
    return !!authService.getToken();
  },

  // Vérifier l'authentification côté serveur
  checkServerAuth: async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include', // Important pour inclure les cookies
      });
      
      if (!response.ok) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      // console.error('Auth check error:', error);
      return null;
    }
  }
};
