# 📚 Developer Notes & Architecture Guide

Complete reference for understanding and modifying the HustleHub codebase.

---

## Architecture Overview

### Tech Stack
```
Frontend        → Next.js 14 (React 18, TypeScript, TailwindCSS)
Backend         → Node.js (Next.js API Routes)
Database        → Supabase PostgreSQL
Real-Time       → Supabase Realtime (WebSocket)
Storage         → Supabase Storage (S3-compatible)
Authentication  → Supabase Auth (Email/Password)
Styling         → TailwindCSS 3.4 + Framer Motion
```

### Data Flow

```
User Browser
    ↓
Next.js Pages (App Router)
    ↓
React Components (Client-side)
    ↓
API Routes (/api/...) or Supabase Client
    ↓
Supabase (Auth, Database, Storage, Realtime)
    ↓
PostgreSQL Database
```

---

## Project Structure Deep Dive

### `/app` — Next.js App Router

**Key Files:**
- `app/layout.tsx` — Root layout (Header, Footer, metadata)
- `app/page.tsx` — Home page
- `app/globals.css` — Global TailwindCSS styles

**Page Organization:**
```
app/
├── signin/           → Auth signin page
├── signup/           → Auth signup page
├── profile/          → User profile page (protected)
│   └── edit/         → Edit profile page (protected)
├── marketplace/      → Product listing page
│   ├── [id]/         → Product detail page
│   └── [id]/edit/    → Edit product page (protected)
├── marketplace/create → Create product page (protected)
├── jobs/             → Jobs/gigs listing page
│   └── [id]/         → Job detail & apply page
├── jobs/create       → Create gig page (protected)
├── chat/             → Chat hub page (protected)
│   └── [roomId]/     → Chat room (protected)
└── admin/            → Admin dashboard (protected)
```

**Route Protection:**
- Protected routes use `<Protected>` wrapper component
- Wrapper checks `useAuth()` hook and redirects to `/signin` if no user
- Only applied on client-side for client components

### `/components` — React Components

**Authentication Components:**
- `AuthForm.tsx` — Reusable signup/signin form
- `Protected.tsx` — Route protection wrapper
- `ProfileForm.tsx` — Edit profile with avatar upload

**Marketplace Components:**
- `ProductCard.tsx` — Product grid card
- `ListingForm.tsx` — Create/edit product form
- `EditListingForm.tsx` — Edit existing product
- `SearchBar.tsx` — Product search & filters

**Jobs/Gigs Components:**
- `GigCard.tsx` — Gig list card
- `GigForm.tsx` — Create gig form
- `GigApplicationForm.tsx` — Apply to gig form
- `RatingForm.tsx` — Rate worker form

**Chat & Notifications:**
- `ChatBox.tsx` — Real-time chat interface
- `NotificationBell.tsx` — Notification dropdown
- `Header.tsx` — Navigation header (includes NotificationBell)

### `/lib` — Utilities & Hooks

**Supabase Clients:**
```typescript
// lib/supabaseClient.ts — Client-side (for browser)
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// lib/supabaseServer.ts — Server-side (for API routes)
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
```

**Custom Hooks:**
- `useAuth.tsx` — Auth state management with real-time updates
- `useChat.tsx` — Real-time chat messaging (Supabase Realtime)
- `useNotifications.tsx` — Notification polling and management

**How Hooks Work:**

```typescript
// useAuth.tsx example
export function useAuth() {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    // Subscribe to auth state changes
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })
    return () => data?.subscription?.unsubscribe()
  }, [])
  
  return { user, isLoading: user === undefined }
}
```

### `/app/api` — Next.js API Routes

**Structure:**
```
app/api/
├── profile/              → User profile CRUD
├── products/             → Product marketplace CRUD
│   └── [id]/
│       └── delete/       → Owner-only delete
├── gigs/                 → Job postings CRUD
│   └── [id]/
│       ├── applications/ → Gig applications
│       └── [appId]/      → Single application
├── messages/             → Chat messages
├── notifications/        → User notifications
├── ratings/              → Worker ratings
└── admin/
    └── listings/         → Admin moderation
```

**Pattern: Route Handler (API Route)**

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseServer
      .from('products')
      .select('*')
    
    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, error } = await supabaseServer
      .from('products')
      .insert([body])
      .select()
    
    if (error) throw error
    return NextResponse.json(data[0], { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
```

### `/sql` — Database Schema

**seed.sql** contains 8 tables:

1. **profiles** — User profiles
   ```sql
   id UUID PRIMARY KEY
   user_id UUID (links to Supabase auth)
   username TEXT UNIQUE
   full_name TEXT
   avatar_url TEXT
   bio TEXT
   rating FLOAT (1-5 stars)
   created_at TIMESTAMP
   ```

2. **products** — Marketplace listings
   ```sql
   id UUID PRIMARY KEY
   seller_id UUID (foreign key → profiles.id)
   title TEXT
   description TEXT
   price DECIMAL
   image_url TEXT
   category TEXT
   created_at TIMESTAMP
   ```

3. **gigs** — Job postings
   ```sql
   id UUID PRIMARY KEY
   poster_id UUID (foreign key → profiles.id)
   title TEXT
   description TEXT
   budget DECIMAL
   category TEXT
   deadline DATE
   status TEXT ('open' | 'closed')
   created_at TIMESTAMP
   ```

4. **gig_applications** — Job applications
   ```sql
   id UUID PRIMARY KEY
   gig_id UUID (foreign key → gigs.id)
   worker_id UUID (foreign key → profiles.id)
   proposal TEXT
   status TEXT ('pending' | 'accepted' | 'rejected')
   created_at TIMESTAMP
   ```

5. **messages** — Chat messages
   ```sql
   id UUID PRIMARY KEY
   room_id TEXT (format: 'user1_user2' sorted)
   sender_id UUID (foreign key → profiles.id)
   content TEXT
   created_at TIMESTAMP
   ```

6. **notifications** — User alerts
   ```sql
   id UUID PRIMARY KEY
   user_id UUID (foreign key → profiles.id)
   title TEXT
   message TEXT
   link TEXT (page to navigate to)
   read BOOLEAN
   created_at TIMESTAMP
   ```

7. **ratings** — Worker feedback
   ```sql
   id UUID PRIMARY KEY
   reviewer_id UUID (foreign key → profiles.id)
   target_id UUID (foreign key → profiles.id)
   score INT (1-5)
   comment TEXT
   gig_id UUID (optional foreign key → gigs.id)
   created_at TIMESTAMP
   ```

8. **transactions** — Payment records (future)
   ```sql
   id UUID PRIMARY KEY
   user_id UUID (foreign key → profiles.id)
   amount DECIMAL
   type TEXT ('credit' | 'debit')
   description TEXT
   created_at TIMESTAMP
   ```

---

## Authentication Flow

### User Sign-Up
```
1. User fills signup form (email, password)
2. AuthForm calls supabase.auth.signUp(email, password)
3. Supabase creates auth user in auth.users table
4. useAuth hook detects auth state change
5. Auto-creates profile record via POST /api/profile
6. User logged in, redirected to home
```

### User Sign-In
```
1. User fills signin form (email, password)
2. AuthForm calls supabase.auth.signInWithPassword()
3. Supabase validates and returns session
4. useAuth hook updates user state
5. Protected routes now accessible
```

### Protected Route Example
```typescript
// Inside a Client Component
'use client'
import { Protected } from '@/components/Protected'

export default function ProfilePage() {
  return (
    <Protected>
      <div>Only logged-in users see this</div>
    </Protected>
  )
}
```

---

## Real-Time Features

### Chat (Supabase Realtime)

```typescript
// lib/useChat.tsx
export function useChat(roomId: string) {
  const [messages, setMessages] = useState([])
  const { user } = useAuth()
  
  useEffect(() => {
    // Subscribe to real-time changes
    const channel = supabase
      .channel(`messages:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()
    
    return () => channel.unsubscribe()
  }, [roomId])
  
  async function sendMessage(content: string) {
    await supabase.from('messages').insert({
      room_id: roomId,
      sender_id: user.id,
      content
    })
  }
  
  return { messages, sendMessage }
}
```

### Notifications (Polling)

```typescript
// lib/useNotifications.tsx
export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const { user } = useAuth()
  
  useEffect(() => {
    if (!user) return
    
    // Poll for new notifications every 5 seconds
    const interval = setInterval(async () => {
      const res = await fetch(`/api/notifications?userId=${user.id}`)
      const data = await res.json()
      setNotifications(data)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [user])
  
  return { notifications }
}
```

---

## Common Tasks & Code Patterns

### 1. Creating a New Page

```typescript
// app/mynewpage/page.tsx
'use client' // if you use hooks/client features

import { Protected } from '@/components/Protected'

export default function MyNewPage() {
  return (
    <Protected> {/* Only if route should be protected */}
      <section className="py-8">
        <h1 className="text-3xl font-bold">My New Page</h1>
        {/* Your content here */}
      </section>
    </Protected>
  )
}
```

### 2. Creating an API Route

```typescript
// app/api/myendpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function GET(request: NextRequest) {
  try {
    // Your logic
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Your logic
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
```

### 3. Using Supabase Client (Browser)

```typescript
// Inside a client component
'use client'
import { supabaseClient } from '@/lib/supabaseClient'
import { useAuth } from '@/lib/useAuth'

export default function MyComponent() {
  const { user } = useAuth()
  
  async function uploadImage(file: File) {
    const { data, error } = await supabaseClient.storage
      .from('products') // bucket name
      .upload(`${user.id}/${file.name}`, file)
    
    if (error) console.error(error)
    return data?.path
  }
  
  return <button onClick={...}>Upload</button>
}
```

### 4. Using Supabase Server (API Routes)

```typescript
// Inside an API route
import { supabaseServer } from '@/lib/supabaseServer'

export async function POST(request: NextRequest) {
  const { data, error } = await supabaseServer
    .from('products')
    .insert({...})
    .select()
  
  // Server-side can use service role key for elevated privileges
}
```

### 5. Styling Components (TailwindCSS)

```typescript
// Use Tailwind utility classes directly
<div className="flex items-center justify-between bg-white p-4 rounded shadow">
  <h2 className="text-xl font-semibold text-gray-900">Products</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    New Product
  </button>
</div>
```

---

## Testing the API

### Using Browser Console
```javascript
// Test GET
const res = await fetch('/api/products')
const data = await res.json()
console.log(data)

// Test POST
const res = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    seller_id: 'user-uuid',
    title: 'Test Product',
    price: 29.99
  })
})
const data = await res.json()
console.log(data)
```

### Using curl (PowerShell)
```powershell
# GET
curl -X GET "http://localhost:3000/api/products"

# POST
curl -X POST "http://localhost:3000/api/products" `
  -H "Content-Type: application/json" `
  -d '{"seller_id":"...", "title":"Test", "price":29.99}'
```

---

## Environment Variables

**Required:**
```
NEXT_PUBLIC_SUPABASE_URL          # Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY    # Anon key (for browser)
SUPABASE_SERVICE_ROLE_KEY        # Service role key (for server)
```

**Optional:**
```
NEXT_PUBLIC_SITE_URL             # Site URL (for redirects)
ADMIN_KEY                        # Admin secret
NEXT_PUBLIC_ADMIN_KEY            # Admin client key
```

**In `.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Performance Optimization Tips

1. **Image Optimization**
   ```typescript
   import Image from 'next/image'
   <Image src={url} alt="Product" width={300} height={300} />
   ```

2. **Component Lazy Loading**
   ```typescript
   const ChatBox = dynamic(() => import('@/components/ChatBox'), {
     loading: () => <div>Loading...</div>
   })
   ```

3. **Database Query Optimization**
   - Use `.select('id, title, price')` instead of `*`
   - Add indexes to frequently queried columns
   - Use pagination for large datasets

4. **Caching**
   ```typescript
   // Next.js caching (ISR - Incremental Static Revalidation)
   export const revalidate = 60 // revalidate every 60 seconds
   ```

---

## Debugging Tips

### Enable Debug Logging
```typescript
// In useAuth.tsx
console.log('Auth state changed:', session)

// In API routes
console.log('Request body:', body)
console.log('Database response:', data, error)
```

### Check Browser DevTools
- **Network tab** → API requests/responses
- **Console tab** → Error messages
- **Application tab** → localStorage/cookies

### Check Server Logs
- Terminal where `npm run dev` runs
- Error stack traces appear here

### Supabase Debugging
- **Logs** in Supabase dashboard
- **Database** view to verify data
- **Storage** browser to check uploaded files

---

## Deployment Checklist

- [ ] All env vars configured in hosting platform
- [ ] Supabase RLS policies reviewed (optional)
- [ ] Storage bucket public access confirmed
- [ ] Database backups enabled
- [ ] HTTPS configured
- [ ] Error monitoring set up
- [ ] Analytics enabled
- [ ] Custom domain configured

---

## Resources

- **Next.js 14 Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **TailwindCSS**: https://tailwindcss.com/docs

---

**Happy coding! 🚀**
