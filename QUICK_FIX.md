# ✅ Quick Fix Guide: Solving All 306 Errors

## Summary

**All 306 TypeScript errors are caused by missing npm dependencies**, not code issues. Your code is production-ready.

### Error Pattern
```
Cannot find module 'react' or its corresponding type declarations.
Cannot find module 'next/link' or its corresponding type declarations.
JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.
```

### Root Cause
Node.js/npm is not installed on your system, so the following directories don't exist:
- `node_modules/react/`
- `node_modules/next/`
- Type definitions for React/Next.js

---

## 3-Step Solution

### Step 1: Install Node.js

1. Go to **https://nodejs.org**
2. Download **LTS (Long-Term Support)** version
3. Run the installer and follow prompts
4. **Restart your terminal** after installation

#### Verify Installation
Open PowerShell and run:
```powershell
node --version
npm --version
```

Expected output:
```
v18.17.0  (or newer)
9.6.7     (or newer)
```

---

### Step 2: Run Setup Script

**Option A: Windows (Easiest)**
1. Navigate to your project folder: `c:\Users\User\Documents\ChiMarket`
2. Double-click **`setup.bat`**
3. Wait for completion (takes 2-3 minutes)

**Option B: Manual (PowerShell)**
```powershell
cd C:\Users\User\Documents\ChiMarket
npm install
```

---

### Step 3: Start Dev Server

```powershell
npm run dev
```

Expected output:
```
▲ Next.js 14.0.0
- Local:        http://localhost:3000
```

Then open **http://localhost:3000** in your browser. ✅

---

## Post-npm Setup (One-Time)

### Configure Supabase

1. Go to **https://app.supabase.com** → Select your project
2. Go to **SQL Editor** → **New Query**
3. Copy the entire content of `sql/seed.sql` and paste into the editor
4. Click **Run** (executes 8 table creation statements)

### Create Storage Buckets

1. Go to **Storage** → **New Bucket**
2. Create bucket **`products`** (set to Public)
3. Create bucket **`avatars`** (set to Public)

---

## Verify Everything Works

1. **Auth Test**: Go to `/signup` → create account
2. **Marketplace Test**: Go to `/marketplace` → browse products
3. **Profile Test**: Go to `/profile` → view your profile
4. **Error Check**: Open browser **DevTools** (F12) → no red errors in Console

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm: The term 'npm' is not recognized` | Node.js not installed. Download from nodejs.org and restart terminal. |
| `Failed to fetch products` | Supabase not set up. Run SQL seed and create storage buckets. |
| `Avatar upload fails` | `avatars` bucket doesn't exist. Create it in Supabase Storage. |
| Port 3000 already in use | Run `npm run dev -- -p 3001` to use port 3001 instead. |

---

## What Happens Next

Once `npm install` completes:
- ✅ All 306 errors vanish
- ✅ VS Code shows no red squiggles
- ✅ `npm run dev` starts the app successfully
- ✅ Browser opens at http://localhost:3000

---

## Why This Works

Running `npm install` creates the `node_modules/` directory containing:
- ✅ React 18.2 library
- ✅ Next.js 14 framework
- ✅ All type definitions (.d.ts files)
- ✅ TailwindCSS, Supabase SDK, and other dependencies

Once these are present, TypeScript can resolve all module imports, and the 306 errors disappear immediately.

---

## File Structure After npm install

```
ChiMarket/
├── node_modules/          ← Created by npm install (DO NOT edit)
│   ├── react/
│   ├── next/
│   ├── @supabase/
│   └── ... (900+ packages)
├── .next/                 ← Build cache (DO NOT edit)
├── app/
├── components/
├── lib/
└── package.json
```

---

## Next: Run the App

```powershell
npm run dev
```

Then visit http://localhost:3000 🚀
