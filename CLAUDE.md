# AgentNest - Real Estate Application

## Overview
Next.js 14 real estate listing app with Supabase backend, SimplyRETS API for property data, and Leaflet maps.

## Tech Stack
- **Framework**: Next.js 14 (App Router) with TypeScript
- **Database**: Supabase (PostgreSQL with RLS enabled)
- **Auth**: Supabase Auth (email/password)
- **Styling**: Tailwind CSS
- **Maps**: Leaflet / React-Leaflet
- **Icons**: Lucide React
- **External API**: SimplyRETS (property listings)

## Project Structure
```
app/
  api/
    sync/route.ts         # POST endpoint to sync SimplyRETS -> Supabase (auth required)
    properties/[mlsId]/   # Server-side proxy for SimplyRETS property lookups
  favorites/page.tsx      # Saved properties page (client component)
  login/page.tsx          # Login page
  signup/page.tsx         # Signup page
  property/[id]/page.tsx  # Property detail page
  search/page.tsx         # Search/browse with filters and map
  page.tsx                # Homepage
components/               # Reusable UI components
context/
  AuthContext.tsx          # Supabase auth state management
  FavoritesContext.tsx     # Favorites with optimistic updates + Supabase sync
lib/
  api.ts                  # SimplyRETS API client (server-side only)
  db.ts                   # Supabase database queries for listings
  env.ts                  # Environment variable validation
  types.ts                # TypeScript interfaces
  supabase/
    client.ts             # Browser Supabase client
    server.ts             # Server Supabase client
middleware.ts             # Supabase auth session refresh
```

## Environment Variables
Required in `.env.local` (and in Vercel for deployment):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- `SYNC_SECRET` - Bearer token for /api/sync endpoint
- `SIMPLYRETS_USERNAME` - SimplyRETS API username
- `SIMPLYRETS_PASSWORD` - SimplyRETS API password

## Database Tables
### listings
- Synced from SimplyRETS via `/api/sync` endpoint
- Primary key: `mls_id`
- RLS: publicly readable, only service_role can write

### favorites
- User-saved property references
- Columns: `user_id`, `mls_id`
- RLS: users can only read/insert/delete their own rows

## Key Commands
```bash
npm run dev       # Start dev server on localhost:3000
npm run build     # Production build
npm run lint      # ESLint check

# Seed database with listing data (replace secret with actual SYNC_SECRET value)
curl -X POST http://localhost:3000/api/sync -H "Authorization: Bearer <SYNC_SECRET>"
```

## Security Notes
- RLS is enabled on both tables - do not disable
- SimplyRETS credentials are server-side only via env vars
- Image domains are restricted in next.config.mjs - add new domains there if needed
- /api/sync has rate limiting (1 request per minute)
- Search params are validated and clamped to safe ranges
- Never commit .env.local (it's in .gitignore)

## Deployment
- Target platform: Vercel
- Set all environment variables in Vercel project settings
- After first deploy, run the sync curl command against the Vercel URL to seed data
