# Veyeco - Version Finale Simplifiée ✨

SaaS de veille économique - Interface simple et épurée

## 🎯 Structure du projet (simplifiée)

```
ecoooooo/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # 🏠 Landing page
│   │   ├── login/page.tsx              # 🔐 Connexion/Inscription
│   │   └── dashboard/
│   │       ├── page.tsx                # 📊 Dashboard (SIMPLE)
│   │       └── settings/page.tsx       # ⚙️ Paramètres abonnement
│   └── components/
│       ├── SimpleTopbar.tsx            # Topbar sans filtres
│       ├── SimpleNewsCard.tsx          # Carte d'actualité épurée
│       ├── LandingNavbar.tsx           # Navbar landing
│       ├── PricingSection.tsx          # Section tarifs
│       ├── Card.tsx                    # Card de base
│       ├── Badge.tsx                   # Badge générique
│       ├── TagChip.tsx                 # Chip de tag
│       ├── PlanBadge.tsx              # Badge FREE/PRO
│       └── PricingModal.tsx           # Modal pricing
```

## 📄 Pages disponibles

| Route | Description |
|-------|-------------|
| `/` | 🏠 Page d'accueil avec présentation, features, tarifs |
| `/login` | 🔐 Connexion/Inscription (UI seulement) |
| `/dashboard` | 📊 **Dashboard simple** - Une seule liste d'actualités |
| `/dashboard/settings` | ⚙️ Paramètres - Gestion abonnement FREE/PRO |

## 🚀 Démarrage

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## ✨ Dashboard Simplifié

**URL: http://localhost:3000/dashboard**

### Caractéristiques:
- ✅ **Une seule colonne** - Pas de séparation Breaking/Brief
- ✅ **Pas de filtres** - Toutes les actualités affichées
- ✅ **Topbar minimaliste** - Logo + Connexion
- ✅ **Design épuré** - Cartes simples et lisibles
- ✅ **Navigation claire** - Bouton "Paramètres" visible

### Interface:
```
┌─────────────────────────────────────────┐
│ [Logo MacroPulse]         [Connexion]   │
├─────────────────────────────────────────┤
│ Veille économique        [Paramètres]   │
│ Les actualités essentielles du jour     │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ 📰 La BCE augmente ses taux...      │ │
│ │ Reuters • Il y a 2h • EU            │ │
│ │ #Banque Centrale #Inflation         │ │
│ │ • Taux directeur passe de...        │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ 📰 Budget 2024 : le déficit...      │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ ...                                      │
└─────────────────────────────────────────┘
```

## 🎨 Design

- **Dark theme only** : Dégradé bleu foncé → noir
- **Glass morphism** : Cartes semi-transparentes
- **Typographie** : Claire et lisible
- **Responsive** : Mobile & Desktop
- **Minimaliste** : Pas de complexité inutile

## 📦 Données

- **100% mockées** côté frontend
- Aucun backend, aucune API
- Fichier : `src/lib/mockData.ts`

## 🎯 Simplicité avant tout

### Ce qui a été supprimé :
- ❌ Filtres de recherche
- ❌ Sélection de pays
- ❌ Colonnes multiples
- ❌ Navigation complexe (tabs)
- ❌ Ancien dashboard `/app`

### Ce qui reste :
- ✅ Landing page simple
- ✅ Connexion (UI)
- ✅ Dashboard une colonne
- ✅ Paramètres abonnement
- ✅ Modal pricing

## 💡 Philosophie

> "Simplicité, clarté, efficacité"

Une veille économique accessible, sans friction, avec un seul objectif : 
**Voir les actualités importantes rapidement.**

---

**Veyeco** - L'essentiel sans le bruit.
