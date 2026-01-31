# 🚀 Veyeco - Checklist Production

## ✅ État actuel

Le projet est maintenant **prêt pour la production** avec une structure simple et claire.

## 📋 Avant de déployer en production

### 1. 🔐 Authentification (CRITIQUE)

**Actuellement :** Système mock avec `localStorage`  
**À faire :**
- [ ] Intégrer un vrai système d'authentification (Firebase, Supabase, Auth0, ou custom)
- [ ] Remplacer `localStorage.getItem('mockAuth')` par une vraie vérification JWT/session
- [ ] Implémenter la création de compte réelle
- [ ] Ajouter la réinitialisation de mot de passe
- [ ] Sécuriser les routes côté serveur (middleware Next.js)

**Fichiers à modifier :**
- `src/app/login-simple/page.tsx` → Vraie authentification
- `src/app/dashboard/page.tsx` → Vérification auth réelle
- `src/app/dashboard/settings/page.tsx` → Vérification auth réelle
- `src/components/SimpleTopbar.tsx` → Gestion session réelle

### 2. 📰 Sources de données (CRITIQUE)

**Actuellement :** Données mockées dans `src/lib/mockData.ts`  
**À faire :**
- [ ] Créer une API backend pour récupérer les actualités
- [ ] Intégrer des sources d'actualités réelles (RSS, API presse, web scraping)
- [ ] Mettre en place un système de collecte automatique
- [ ] Implémenter le système de scoring d'importance
- [ ] Créer la base de données pour stocker les articles

**Options techniques :**
- **Backend :** Next.js API Routes, Express, Fastify
- **Base de données :** PostgreSQL, MongoDB, Supabase
- **Sources :** API Les Échos, Reuters, Bloomberg, ou scraping légal
- **Scoring :** Algorithme custom ou IA (OpenAI, Claude)

### 3. 💳 Système de paiement (IMPORTANT)

**Actuellement :** Modal "Paiement bientôt disponible"  
**À faire :**
- [ ] Intégrer Stripe pour les paiements
- [ ] Créer les webhooks pour gérer les abonnements
- [ ] Implémenter la logique Pro vs Free
- [ ] Ajouter la gestion des factures
- [ ] Mettre en place les emails de confirmation

**Fichiers concernés :**
- `src/components/PricingModal.tsx` → Intégration Stripe
- `src/app/dashboard/settings/page.tsx` → Gestion abonnement

### 4. 📧 Emails (IMPORTANT)

**À faire :**
- [ ] Intégrer un service d'emailing (SendGrid, Resend, Mailgun)
- [ ] Créer les templates d'emails
  - Brief quotidien (avec actualités du jour)
  - Breaking alerts (notifications urgentes)
  - Confirmation inscription
  - Factures
- [ ] Mettre en place les cron jobs pour l'envoi automatique

### 5. 🗃️ Base de données

**À créer :**
```sql
Tables nécessaires :
- users (id, email, password_hash, plan, created_at)
- subscriptions (user_id, plan, status, stripe_id)
- articles (id, title, source, content, importance_score, published_at)
- user_preferences (user_id, countries, themes, alert_threshold)
```

### 6. ⚙️ Configuration environnement

**Créer `.env.local` :**
```env
# Database
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Stripe
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
SENDGRID_API_KEY=
EMAIL_FROM=

# API Keys pour sources
NEWS_API_KEY=
```

### 7. 🔒 Sécurité

- [ ] Ajouter rate limiting
- [ ] Implémenter CORS correctement
- [ ] Valider toutes les entrées utilisateur
- [ ] Protéger les API routes avec middleware
- [ ] Mettre en place CSP (Content Security Policy)
- [ ] Ajouter monitoring des erreurs (Sentry)

### 8. 📊 Analytics & Monitoring

- [ ] Intégrer Google Analytics ou Plausible
- [ ] Mettre en place des logs serveur
- [ ] Ajouter monitoring des performances (Vercel Analytics)
- [ ] Créer un dashboard admin pour voir les métriques

### 9. 🎨 Assets & SEO

- [ ] Ajouter favicon et icônes app (manifest.json)
- [ ] Optimiser les meta tags SEO
- [ ] Créer sitemap.xml
- [ ] Ajouter robots.txt
- [ ] Optimiser les images (next/image)
- [ ] Ajouter Open Graph pour partage social

### 10. 📱 PWA (Optionnel)

- [ ] Convertir en Progressive Web App
- [ ] Ajouter service worker pour offline
- [ ] Permettre l'installation sur mobile

## 🏗️ Architecture recommandée

```
Production Stack:
├── Frontend: Next.js 15 (App Router) ✅ Déjà fait
├── Auth: NextAuth.js ou Supabase Auth
├── Database: PostgreSQL (Supabase ou Railway)
├── Payments: Stripe
├── Email: Resend ou SendGrid
├── Hosting: Vercel
├── Monitoring: Sentry + Vercel Analytics
└── CDN: Vercel (automatique)
```

## 🚦 Priorités

### Phase 1 - MVP Production (2-3 semaines)
1. ✅ Frontend simple et responsive (FAIT)
2. 🔴 **Authentification réelle** (critique)
3. 🔴 **API actualités basique** (critique)
4. 🔴 **Base de données** (critique)

### Phase 2 - Monétisation (1-2 semaines)
5. 🟡 Intégration Stripe
6. 🟡 Emails automatiques
7. 🟡 Système de scoring

### Phase 3 - Amélioration (ongoing)
8. 🟢 Analytics
9. 🟢 Monitoring
10. 🟢 PWA

## 💡 Recommandations

### Pour démarrer rapidement :

**Stack simple recommandée :**
- **Auth :** Supabase (auth + DB inclus, gratuit jusqu'à 50k utilisateurs)
- **Email :** Resend (10k emails/mois gratuit, API simple)
- **Paiement :** Stripe (standard industrie)
- **Hosting :** Vercel (gratuit pour hobby, $20/mois pro)

**Temps estimé :** 3-4 semaines pour un MVP production-ready

### Coûts mensuels estimés (démarrage) :
- Hosting Vercel : 0€ (hobby) ou 20€ (pro)
- Supabase : 0€ (gratuit jusqu'à croissance)
- Stripe : 0€ + 2.9% par transaction
- Resend : 0€ (jusqu'à 10k emails)
- **Total : ~0-20€/mois** pour démarrer

## 📝 Prochaines étapes immédiates

1. Choisir votre stack backend (recommandé : Supabase)
2. Créer le schéma de base de données
3. Remplacer l'auth mock par une vraie auth
4. Créer une API pour récupérer les actualités
5. Tester en staging avant production

---

**Note :** Le frontend est prêt ! Il ne manque "que" le backend, l'auth réelle, et les données réelles. Le design et l'UX sont production-ready. ✨
