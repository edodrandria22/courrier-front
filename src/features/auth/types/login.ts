export interface LoginCredentials {
  email: string;
  mdp: string; // Aligné sur ton contrôleur Symfony
}

export interface AuthError {
  error: string;
  message?: string;
}
export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  idRole?: number;
  avatar?: string;
  adresse: string;
}
