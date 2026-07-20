# Autopark GmbH — autopark-gmbh.vercel.app

## Structure (monorepo unifié pour Vercel)
```
autopark/
├── api/              ← Serverless functions (backend)
│   ├── auth/         ← login, register, me
│   ├── cars/         ← index, [id], categories
│   ├── cart/         ← index, count, [carId]
│   ├── orders/       ← index, my, [id], track/[orderNumber]
│   ├── simulation/   ← index
│   ├── admin/        ← stats, clients
│   └── user/         ← profile, password
├── lib/              ← Shared: prisma.js, middleware.js, helpers.js
├── prisma/           ← schema.prisma, seed.js
├── src/              ← React frontend
│   ├── components/   ← Navbar, CarCard, Toast, Chatbot, UI, AdminSidebar
│   ├── pages/        ← Home, Catalog, CarDetails, Cart, Track...
│   │   └── admin/    ← AdminDashboard, AdminOrders...
│   ├── store/        ← Zustand (auth, cart, toast, lang)
│   ├── services/     ← api.js (axios)
│   └── utils/        ← helpers.js, i18n.js
├── vercel.json       ← Routes + CORS headers
├── package.json      ← Unified dependencies
└── supabase-schema.sql ← Run in Supabase SQL Editor
```

## Déploiement sur Vercel

### 1. Supabase
1. [supabase.com](https://supabase.com) → New project → Frankfurt
2. SQL Editor → coller `supabase-schema.sql` → Run
3. Settings → Database → copier `DATABASE_URL` et `DIRECT_URL`

### 2. GitHub
```bash
git init && git add . && git commit -m "🚀 Autopark GmbH"
git remote add origin https://github.com/VOTRE_USER/autopark.git
git push -u origin main
```

### 3. Vercel
1. [vercel.com](https://vercel.com) → Import GitHub repo
2. **Root Directory : laisser vide** (à la racine)
3. Framework: **Vite**
4. Environment Variables → ajouter :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | postgresql://postgres.XXX:PWD@pooler.supabase.com:6543/postgres?pgbouncer=true |
| `DIRECT_URL` | postgresql://postgres.XXX:PWD@pooler.supabase.com:5432/postgres |
| `JWT_SECRET` | (chaîne aléatoire 64+ caractères) |

5. Deploy → ✅ https://autopark-gmbh.vercel.app

### 4. Seeder (une seule fois)
Dans Supabase → SQL Editor, exécuter le seed manuellement, ou:
```bash
# Depuis votre machine avec .env configuré
npm run seed
```

## Comptes demo
- Admin : autoKompetenz@gmail.com / password
- Client : client@autopark-gmbh.com / password
