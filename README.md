# Teknomed Platform — Monorepo

Platform website + admin + 3D catalog untuk PT Teknomed Indo Timur.

## Struktur

```
apps/
  web/        → teknomed.co.id (company profile + catalog)
  admin/      → admin.teknomed.co.id (CRUD panel)
packages/
  database/   → Supabase client + types + queries
  viewers/    → 3D viewer components + catalog spec components
  ui/         → shared UI components (Button, Card, Badge, etc)
```

## Stack

- **Monorepo**: Turborepo
- **Frontend**: React 19 + Vite 8 + Tailwind v4
- **3D**: Three.js (raw)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Hosting**: Cloudflare Pages

## Quick Start

```bash
# Install dependencies
npm install

# Development (all apps)
npm run dev

# Development (single app)
npx turbo dev --filter=@teknomed/web
npx turbo dev --filter=@teknomed/admin

# Build all
npm run build

# Type check
npm run typecheck
```

## Environment

Copy `.env.example` to `.env` and fill in Supabase credentials:

```bash
cp .env.example .env
```

## Database Setup

1. Create Supabase project at https://supabase.com
2. Run `supabase/schema.sql` in SQL Editor
3. Create storage buckets: `images`, `models`, `pdf`
4. Update `.env` with Supabase URL + keys

<!-- deploy trigger: 2026-06-18 02:11 -->
