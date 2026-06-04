# तराशय (Tarashay) — Rewa Supari Art

A cultural heritage platform for **Rewa Supari Art**, practiced exclusively by the Kunder family of Rewa, Madhya Pradesh since 1942.

This is not a generic e-commerce site — it is a cultural embassy to witness, understand, and preserve a critically endangered craft.

## Tech Stack

- Next.js 14 (App Router) · TypeScript · Tailwind CSS · Shadcn/ui
- Framer Motion · MongoDB Atlas · Mongoose · NextAuth.js
- Cloudinary · Razorpay · Stripe · Resend · Zustand · Vercel

## Phase 1 (Complete)

- Project structure, Mongoose models, TypeScript types
- Design system (heritage palette, Playfair + Inter, film grain)
- Story page with 1942–present timeline

## Phase 2A (Complete)

- Full `/api/artisans` and `/api/products` routes (GET, POST, PUT)
- NextAuth credentials + admin role guard on write routes
- Homepage wired to API (`revalidate: 3600`, placeholder fallback)
- Artisans listing and `/artisans/[slug]` profile pages
- Updated `ArtisanCard` (full `IArtisan`, default export, gold hover)

## Getting Started

```bash
cd supari-art
cp .env.example .env.local
# Add MONGODB_URI and other keys as needed

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Seed Database (local dev)

```bash
# Requires MONGODB_URI in .env.local
npx tsx scripts/seed.ts

# Create admin for POST/PUT API routes
npx tsx scripts/create-admin.ts admin@tarashay.local yourpassword "Admin"
```

Sign in at `/admin` (NextAuth) before calling admin APIs, or use a session cookie from NextAuth.

## Environment Variables

See [`.env.example`](.env.example).

## Phase 2 Checklist

- [x] Wire homepage to `GET /api/artisans` and `GET /api/products`
- [x] Artisans listing + profile pages
- [ ] Shop, Product detail, Commission, Impact, Learn pages
- [ ] NextAuth admin dashboard CRUD
- [ ] Orders, Razorpay/Stripe webhooks
- [ ] Zustand cart and checkout
- [ ] GlobalMap + ImpactDashboard with live data

## Design

| Token | Hex |
|-------|-----|
| Heritage brown | `#3D2B1F` |
| Warm beige | `#F5ECD7` |
| Ochre | `#C8860A` |
| Off-white | `#FAF7F2` |
| Gold | `#D4A017` |

All imagery placeholders: `/placeholder.svg`
