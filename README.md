# Mon Panier Guyane 🧺

Application mobile-first de vente de paniers de fruits & légumes en Guyane Française.

**Stack:** Next.js 14 · Supabase · Vercel · TypeScript · Tailwind CSS

---

## 🚀 Déploiement en 5 étapes

### Étape 1 — Préparer le code

```bash
# Cloner ou extraire le projet
cd mon-panier-guyane

# Installer les dépendances
npm install
```

---

### Étape 2 — Configurer Supabase

1. Aller sur [app.supabase.com](https://app.supabase.com) → **New Project**
2. Nom du projet: `mon-panier-guyane` · Choisir une région proche (ex: Europe West)
3. Une fois créé, aller dans **SQL Editor** → **New Query**
4. Coller tout le contenu de `supabase-schema.sql` et cliquer **Run**
5. Aller dans **Settings → API** et copier:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Activer l'authentification
- **Authentication → Providers → Email** : activer
- **Authentication → URL Configuration** : ajouter `https://votre-domaine.vercel.app`

#### Créer un compte admin
Après avoir créé votre compte via l'app:
```sql
-- Dans SQL Editor, remplacer l'email par le vôtre
UPDATE profiles SET is_admin = true
WHERE email = 'votre-email@exemple.com';
```

---

### Étape 3 — Variables d'environnement locales

```bash
# Copier le fichier exemple
cp .env.local.example .env.local

# Éditer .env.local avec vos vraies clés
```

Contenu de `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  (optionnel pour l'instant)
STRIPE_SECRET_KEY=sk_test_...                   (optionnel pour l'instant)
```

---

### Étape 4 — Tester en local

```bash
npm run dev
# Ouvrir http://localhost:3000
```

---

### Étape 5 — Déployer sur Vercel

#### Option A — Via GitHub (recommandé)

1. Pousser le code sur GitHub:
```bash
git init
git add .
git commit -m "Initial commit - Mon Panier Guyane"
git remote add origin https://github.com/votre-user/mon-panier-guyane.git
git push -u origin main
```

2. Aller sur [vercel.com](https://vercel.com) → **New Project** → Importer le repo GitHub
3. Dans **Environment Variables**, ajouter les mêmes variables que `.env.local`
4. Cliquer **Deploy** ✅

#### Option B — Via CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 📁 Structure du projet

```
src/
├── app/
│   ├── page.tsx              # Accueil
│   ├── catalogue/page.tsx    # Catalogue paniers
│   ├── panier/page.tsx       # Panier & checkout
│   ├── livraisons/page.tsx   # Suivi commandes
│   ├── profil/page.tsx       # Profil client
│   └── admin/page.tsx        # Dashboard admin
├── components/
│   ├── layout/               # BottomNav, BackBar
│   ├── client/               # ProductCard, CheckoutSheet…
│   └── admin/                # OrderDetailSheet, ProductFormSheet…
├── hooks/
│   └── useCart.ts            # State panier (Zustand)
├── lib/
│   └── supabase/             # client.ts + server.ts
└── types/
    └── database.ts           # Types TypeScript Supabase
```

---

## 🔧 Fonctionnalités

### App Client
- ✅ Accueil avec paniers du jour
- ✅ Catalogue avec recherche et filtres
- ✅ Panier persistant (localStorage via Zustand)
- ✅ Checkout: livraison à domicile ou retrait en magasin
- ✅ 3 modes de paiement (Stripe, Mobile Money, livraison)
- ✅ Suivi des commandes en temps réel
- ✅ Profil + programme de fidélité

### Dashboard Admin
- ✅ Statistiques du jour (commandes, CA, livraisons)
- ✅ Gestion des commandes avec changement de statut
- ✅ Gestion des paniers (CRUD complet)
- ✅ Upload d'images vers Supabase Storage
- ✅ Barre de stock visuelle

---

## 🔒 Sécurité

- Row Level Security (RLS) activée sur toutes les tables
- Clients voient uniquement leurs propres commandes
- Seuls les admins peuvent modifier produits et statuts
- Images stockées sur Supabase Storage avec accès public en lecture

---

## 📱 PWA

Pour transformer en app installable sur mobile, ajouter dans `public/manifest.json`:
```json
{
  "name": "Mon Panier Guyane",
  "short_name": "MPGuyane",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f5f7f5",
  "theme_color": "#1a6b2f",
  "icons": [{ "src": "/icon-192.png", "sizes": "192x192" }]
}
```
