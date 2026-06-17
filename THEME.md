# teknomed-platform — Theme & Design Decisions
> Updated: 2026-05-28

## Theme: Mono (tweakcn.com)
Source: https://tweakcn.com/editor/theme?theme=mono
Install: `npx shadcn@latest add https://tweakcn.com/r/themes/mono.json`

## Characteristics
- Monochrome (grayscale)
- Geist Mono font (monospace everywhere)
- 0px border radius (sharp corners)
- 0px shadow (flat)
- Clean, minimal, technical aesthetic
- Dark mode support

## Implementation
- shadcn/ui components di `packages/ui/` (bukan custom Button/Card)
- Theme CSS di `apps/web/src/index.css` dan `apps/admin/src/index.css`
- CSS variables (bukan Tailwind config) untuk theme colors

## Supabase Status
- [x] Schema SQL executed
- [x] Auth user created
- [x] Env configured (.env)
- [ ] Storage buckets (images, models, pdf)
- [ ] RLS policies verified

## teknomed-web Status
- Lama: `D:\playgrounds\teknomed-web` (React 19, reference only)
- Baru: `D:\playgrounds\teknomed-platform\apps\web` (monorepo, dynamic dari Supabase)
- Yang lama TIDAK dihapus, jadi reference untuk design tokens + konten
