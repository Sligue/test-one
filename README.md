# HustleHub Starter

A modern full-stack web app with Next.js 14, React, TailwindCSS, and Supabase. Features marketplace, gigs, chat, wallet, and admin dashboard.

## Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org))
- **Supabase Account** ([Free tier](https://app.supabase.com))
- **Git** (optional)

## Quick Start (Windows)

### 1. Run Setup Script
Double-click `setup.bat` in the project folder. This will:
- Check for Node.js installation
- Install all npm dependencies
- Display next steps

If Node.js is not found, the script will guide you to install it.

### 2. Configure Environment
Your `.env.local` file already has Supabase credentials. No action needed.

### 3. Set Up Supabase

1. Go to [https://app.supabase.com](https://app.supabase.com) and select your project.
2. **SQL Editor** → **New Query** → Copy and paste the entire SQL from `sql/seed.sql` → **Run**.
3. **Storage** → Create two buckets:
   - `products` (set to Public)
   - `avatars` (set to Public)

### 4. Run the App

```powershell
npm run dev
```

Then visit **http://localhost:3000**.

---

## Quick Start (macOS/Linux)

### 1. Run Setup Script
```bash
chmod +x setup.sh
./setup.sh
```

### 2. Configure Environment
```bash
# If needed, copy template
cp .env.example .env.local
```

### 3. Set Up Supabase (same as Windows)

1. Go to [https://app.supabase.com](https://app.supabase.com) → select project.
2. **SQL Editor** → paste `sql/seed.sql` content → **Run**.
3. **Storage** → create `products` and `avatars` buckets (Public).

### 4. Run the App

```bash
npm run dev
```

Visit **http://localhost:3000**.

---

## Features

- **Auth**: Sign up, login, profile editing with avatar upload.
- **Marketplace**: Create, browse, search, edit, delete product listings with image upload.
- **Jobs/Gigs**: Post gigs, apply, manage applications, rate workers.
- **Search & Filters**: Filter by title, price, budget, category.
- **Real-Time Chat**: Message via Supabase Realtime.
- **Notifications**: Real-time alerts for messages, applications, etc.
- **Admin Dashboard**: View and moderate all listings.
- **Protected Routes**: Auth-required pages redirect to sign-in.

---

## Project Structure

```
ChiMarket/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── marketplace/       # Marketplace pages
│   ├── jobs/              # Jobs/gigs pages
│   ├── chat/              # Chat pages
│   ├── admin/             # Admin dashboard
│   ├── signin/            # Auth pages
│   └── ...
├── components/            # React components
│   ├── Header.tsx
│   ├── AuthForm.tsx
│   ├── ProductCard.tsx
│   ├── GigCard.tsx
│   ├── ChatBox.tsx
│   └── ...
├── lib/                   # Utilities & hooks
│   ├── supabaseClient.ts  # Client Supabase instance
│   ├── supabaseServer.ts  # Server Supabase instance
│   ├── useAuth.tsx        # Auth hook
│   ├── useChat.tsx        # Chat hook (real-time)
│   ├── useNotifications.tsx
│   └── ...
├── styles/                # CSS
│   └── globals.css
├── sql/                   # Database schema
│   └── seed.sql
├── .env.local             # Environment variables (pre-filled)
├── package.json
├── tsconfig.json
└── README.md
```

---

## API Routes

### Profile
- `POST /api/profile` — Upsert user profile
- `GET /api/profile?id=<uuid>` — Fetch profile
- `PATCH /api/profile` — Update profile

### Products
- `GET/POST /api/products` — List/create products
- `GET/PATCH/DELETE /api/products/[id]` — Single product CRUD
- `DELETE /api/products/[id]/delete` — Owner-only delete

### Gigs
- `GET/POST /api/gigs` — List/create gigs
- `GET/PATCH/DELETE /api/gigs/[id]` — Single gig CRUD
- `GET/POST /api/gigs/[id]/applications` — Applications
- `PATCH /api/gigs/[id]/applications/[appId]` — Update app status

### Chat & Notifications
- `GET/POST /api/messages` — Messages (real-time via Supabase)
- `GET/POST/PATCH /api/notifications` — Notifications

### Ratings
- `GET/POST /api/ratings` — User ratings

### Admin
- `GET /api/admin/listings` — All products
- `DELETE /api/admin/listings/[id]` — Remove listing

---

## Pages & Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home page |
| `/signin` | Public | Sign in |
| `/signup` | Public | Create account |
| `/profile` | Protected | View profile |
| `/profile/edit` | Protected | Edit profile + avatar |
| `/marketplace` | Public | Browse products |
| `/marketplace/[id]` | Public | Product detail |
| `/marketplace/[id]/edit` | Protected (owner) | Edit product |
| `/marketplace/create` | Protected | Create listing |
| `/jobs` | Public | Browse gigs |
| `/jobs/[id]` | Public | Gig detail + apply |
| `/jobs/create` | Protected | Post gig |
| `/chat` | Protected | Messages hub |
| `/chat/[roomId]` | Protected | Chat room |
| `/admin` | Admin | Moderation dashboard |

---

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY    # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY        # Service role (server-side)
NEXT_PUBLIC_SITE_URL             # Site URL (http://localhost:3000)
ADMIN_KEY                        # Admin secret
NEXT_PUBLIC_ADMIN_KEY            # Admin client key
```

---

## Deployment

### Deploy to Vercel

1. Push code to GitHub.
2. Go to [https://vercel.com](https://vercel.com) → import your repo.
3. Add environment variables in Vercel dashboard.
4. Deploy! 🚀

### Deploy Supabase

Your Supabase project is already live. Just update DNS if using custom domain.

---

## Troubleshooting

**"Cannot find module 'react'"**
- Run `npm install` to install dependencies.

**"Database connection error"**
- Check Supabase credentials in `.env.local`.
- Verify SQL seed was executed in Supabase.

**"Storage bucket not found"**
- Create `products` and `avatars` buckets in Supabase Storage.
- Set both to **Public**.

**"npm command not found"**
- Install Node.js from https://nodejs.org
- Restart terminal after installation.

---

## Next Steps

- Add Wallet & Payments (Stripe integration).
- Add Email notifications.
- Implement two-factor authentication.
- Add analytics dashboard.
- Deploy to production (Vercel + Supabase).

---

## Support

For issues, check:
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Project issues: Check error logs in browser console
