# Courier ESPA- Plateforme de Gestion de Courrier Professionnelle

Une application web moderne de gestion de courrier avec envoi de pièces jointes, dossiers personnalisés, recherche et notifications temps réel.

## Fonctionnalités

- **Authentification sécurisée** avec email et mot de passe
- **Envoi et réception** de courriers avec pièces jointes
- **Dossiers personnalisés** (Inbox, Sent, Drafts, Spam, Archive)
- **Recherche** de messages par sujet, contenu ou expéditeur
- **Notifications temps réel** (SSE) pour les nouveaux messages
- **Statut des messages** (lu/non lu)
- **Interface Gmail-style** avec design bleu roi et or

## Stack Technique

- **Framework:** Next.js 16 (App Router)
- **Frontend:** React, TypeScript, Tailwind CSS
- **Database:** PostgreSQL avec Prisma ORM
- **Authentication:** Session-based avec bcryptjs
- **Real-time:** Server-Sent Events (SSE)
- **File Storage:** Local storage dans `/public/uploads`

## Configuration

### 1. Prérequis

- Node.js 18+
- PostgreSQL 12+ (local ou cloud)

### 2. Installation des dépendances

```bash
npm install
# ou
pnpm install
```

### 3. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet:

```env ito .env fotsiny fa aza asina .local
DATABASE_URL="postgresql://user:password@localhost:5432/email_platform"
```

Remplacez `user`, `password` et `localhost:5432` par vos paramètres PostgreSQL.

### 4. Configuration de la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Créer les tables
npx prisma migrate deploy

# Ou initialiser avec les migrations
npx prisma db push

#initialiser le seed ou on les donnees du login soit dans la base Ainy lisany io zala
npm run db:seed
```

### 5. Démarrage du serveur de développement

```bash
npm run dev
```

Le serveur sera disponible à `http://localhost:3000`

## Utilisation

### Créer un compte

1. Allez sur `http://localhost:3000/signup`
2. Entrez votre nom, email et mot de passe
3. Les dossiers système sont créés automatiquement

### Envoyer un courrier

1. Cliquez sur "Compose" dans la barre latérale
2. Entrez l'adresse email du destinataire
3. Rédigez le sujet et le message
4. Ajoutez des pièces jointes (optionnel)
5. Cliquez sur "Envoyer"

### Gérer vos courriers

- **Marquer comme lu:** Ouvrez le courrier
- **Archiver:** Utilisez le menu "..." ou bouton Archive
- **Supprimer:** Utilisez le menu "..." ou bouton Trash
- **Rechercher:** Utilisez la barre de recherche dans la sidebar

## Architecture

### Structure des fichiers

```
app/
├── (auth)/                 # Routes d'authentification
│   ├── login/
│   └── signup/
├── api/
│   ├── auth/              # API d'authentification
│   ├── emails/            # API de gestion des emails
│   ├── folders/           # API de gestion des dossiers
│   ├── user/              # API utilisateur
│   └── notifications/     # API notifications
├── dashboard/             # Interface principale
│   ├── compose/
│   ├── email/
│   ├── inbox/
│   ├── sent/
│   ├── archive/
│   └── spam/
└── page.tsx               # Page d'accueil

components/
├── dashboard/
│   ├── sidebar.tsx
│   └── header.tsx
├── ui/                    # Composants shadcn/ui
└── notification-provider.tsx

lib/
├── auth.ts                # Utilitaires authentification
└── utils.ts               # Utilitaires généraux

hooks/
└── use-notifications.ts   # Hook pour les notifications SSE

prisma/
└── schema.prisma          # Schéma de base de données
```

### Modèles de données

- **User:** Utilisateurs avec email unique, nom, mot de passe hashé
- **Email:** Messages avec expéditeur, destinataires, contenu
- **EmailRecipient:** Relation many-to-many avec statut lu/non lu et dossier
- **Folder:** Dossiers personnalisés et système
- **Attachment:** Pièces jointes avec chemins locaux

## Points d'API

### Authentification

- `POST /api/auth/signup` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `POST /api/auth/logout` - Se déconnecter

### Emails

- `GET /api/emails?folder=inbox` - Récupérer les emails
- `GET /api/emails/[id]` - Détails d'un email
- `POST /api/emails/send` - Envoyer un email (avec pièces jointes)
- `PATCH /api/emails/[id]` - Marquer comme lu
- `PATCH /api/emails/[id]/folder` - Changer de dossier
- `DELETE /api/emails/[id]` - Supprimer

### Recherche & Notifications

- `GET /api/emails/search?q=query` - Rechercher des emails
- `GET /api/notifications/subscribe` - SSE pour notifications

## Sécurité

- Les mots de passe sont hashés avec bcryptjs (10 salt rounds)
- Les cookies de session sont HTTP-only et secure en production
- Les emails sont isolés par utilisateur au niveau base de données
- CORS désactivé sur les endpoints sensibles

## Performance

- Utilisation de Prisma pour les requêtes optimisées
- Pagination implicite sur les recherches (limit 20)
- SSE pour les notifications temps réel sans polling

## Limitation actuelle

- Les pièces jointes sont stockées localement (pas de cloud)
- Pas de chiffrement end-to-end
- Pas de support des brouillons auto-sauvegardés
- Pas de réponse aux emails (fonctionnalité à implémenter)

## Développement futur

- [ ] Répondre/Transférer les emails
- [ ] Auto-sauvegarde des brouillons
- [ ] Labels personnalisés supplémentaires
- [ ] Pièces jointes sur cloud (Vercel Blob)
- [ ] Signature d'emails
- [ ] Galerie d'images intégrée
- [ ] Modèles d'emails

## Support

Pour toute question ou problème, veuillez consulter la documentation Next.js et Prisma officielle.

## License

@Misa_Front
