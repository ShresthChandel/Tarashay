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
- Homepage with placeholder data (no DB on home yet)
- Story page with 1942–present timeline
- Stub routes and API shells for Phase 2

## Getting Started

```bash
cd supari-art
cp .env.example .env.local
# Add MONGODB_URI and other keys as needed

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Seed Database (Phase 2 local dev)

```bash
# Requires MONGODB_URI in .env.local
npx tsx scripts/seed.ts
```

## Environment Variables

See [`.env.example`](.env.example).

## Phase 2 Checklist

- [ ] Wire homepage to `GET /api/artisans` and `GET /api/products`
- [ ] Artisans, Shop, Product detail, Commission, Impact, Learn pages
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
