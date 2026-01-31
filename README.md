# Veyeco — Veille Économique

Frontend SaaS de veille économique avec **Next.js 15**, **TypeScript** et **Tailwind CSS**.

## 🎨 Direction Artistique

- **Dark theme only** : dégradé bleu foncé → noir (`#06162f` → `#0b1b3a` → `#000000`)
- **UI premium** : cartes glass morphism, bordures subtiles, animations fluides
- **Responsive** : mobile-first, optimisé desktop
- **Composants custom** : pas de shadcn/ui, que du Tailwind

## 📁 Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Styles globaux + utilities
│   ├── login/
│   │   └── page.tsx            # Page connexion (UI seulement)
│   └── app/
│       ├── layout.tsx          # Layout dashboard (AppShell)
│       ├── page.tsx            # Dashboard principal
│       ├── sources/
│       │   └── page.tsx        # Gestion des sources
│       └── settings/
│           └── page.tsx        # Paramètres utilisateur
├── components/
│   ├── AppShell.tsx            # Layout application
│   ├── Topbar.tsx              # Barre de navigation
│   ├── Card.tsx                # Composant carte
│   ├── Badge.tsx               # Badge générique
│   ├── TagChip.tsx             # Chip de tag
│   ├── NewsItemCard.tsx        # Carte d'actualité
│   ├── ScoreBadge.tsx          # Badge de score d'importance
│   ├── CountryFilter.tsx       # Filtre par pays
│   └── SearchInput.tsx         # Champ de recherche
└── lib/
    └── mockData.ts             # Données mockées
```

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🔥 Backend Firebase (Auth + Firestore + Functions)

Le backend vit dans `functions/` avec Cloud Functions TypeScript et des docs agrégés dans `public_feeds/*`.

### Pré-requis

- Firebase CLI : `npm i -g firebase-tools`
- Projet Firebase configuré (Firestore + Functions + Auth)

### Configuration Firebase

```bash
firebase login
firebase use --add
```

### Variables d’environnement (Cloud Functions)

Configurer dans Google Cloud Functions (ou `.env` pour l’émulateur local) :

```
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_MONTHLY=
LLM_PROVIDER=openai|anthropic
LLM_API_KEY=
RESEND_API_KEY=
RESEND_FROM=no-reply@votre-domaine
APP_URL=https://votre-domaine
```

### Variables d’environnement (Front Next.js)

Créer un fichier `.env.local` à la racine :

```
NEXT_PUBLIC_API_BASE=https://us-central1-macropulse-3ce60.cloudfunctions.net
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Build & déploiement Functions

```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

### Règles & Indexes Firestore

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### Endpoints HTTP

- `GET /feed?country=FR` → `{ daily, breaking }` (2 lectures max)
- `POST /createCheckoutSession` (auth) → session Stripe
- `POST /stripeWebhook` → webhook Stripe

### Schedulers

- `ingestFeeds` : toutes les 30 minutes
- `sendWeeklyEmail` : chaque lundi 09:00

## 📄 Pages

### `/` — Landing
- Hero avec titre et CTA
- Section features (3 cartes)
- Footer minimaliste

### `/login` — Connexion
- Formulaire UI (email + password)
- Message "Auth branchée bientôt"
- Lien vers démo

### `/app` — Dashboard
- **Breaking** : 10 alertes importantes (colonne gauche)
- **Brief du jour** : 8 actualités (colonne droite)
- Filtres : recherche + pays (FR/EU/US)
- Chaque item affiche :
  - Titre
  - Source (badge)
  - Date/heure
  - Tags (chips)
  - Score d'importance (0-100)
  - Résumé en bullet points
  - Lien vers source

### `/app/sources` — Sources
- Liste des sources d'information
- Toggle activé/désactivé (state local)
- Bouton "Ajouter une source" (modal inline)
- Données mockées, pas de persistance

### `/app/settings` — Paramètres
- Pays suivis (checkbox)
- Thématiques suivies (checkbox)
- Slider seuil d'alerte (0-100)
- Bouton "Enregistrer" (toast mock)

## 🎯 Features

- ✅ **Dark theme** avec dégradé bleu → noir
- ✅ **Données mockées** (pas d'API, pas de backend)
- ✅ **Filtrage local** par pays et recherche
- ✅ **Responsive** mobile & desktop
- ✅ **Navigation** via layout + topbar
- ✅ **Composants réutilisables** (Card, Badge, etc.)
- ✅ **Animations** légères au hover
- ✅ **Score d'importance** avec badge coloré
- ✅ **UI premium** avec glass morphism

## 🛠 Technologies

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS 3.4**
- **Lucide React** (icônes)

## 📦 Commandes

```bash
npm run dev      # Développement
npm run build    # Build production
npm run start    # Démarrer build production
npm run lint     # Linter
```

## 🎨 Palette de Couleurs

- **Background** : `#06162f` → `#0b1b3a` → `#000000`
- **Cards** : `bg-white/5` + `border-white/10`
- **Accent** : `sky-500` (`#0ea5e9`)
- **Texte** : blanc + gris clair
- **Score badges** :
  - 0-49 : gris
  - 50-79 : bleu
  - 80-100 : rouge/amber

## ⚠️ Notes Backend

- Les docs `public_feeds/*` sont publics en lecture, écriture interdite côté client.
- Les collections `sources`, `articles`, `insights` sont en écriture server-only.
- Les emails sont envoyés via Resend.

---

**Veyeco** — L'essentiel sans le bruit.
