# Deploying Tarashay to Vercel

## Quick deploy

1. Push `supari-art` to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Set **Root Directory** to `supari-art` if the repo contains the parent folder.
4. Add environment variables below (Vercel → Project → Settings → Environment Variables).
5. Deploy. Verify: `https://YOUR_DOMAIN/api/health`

## Environment variables (Vercel dashboard)

Add each variable for **Production** (and **Preview** if you want preview deploys to work fully).

### Core (required for site to work)

| Variable | Example / notes |
|---|---|
| `MONGODB_URI` | Atlas connection string. Prefer non-SRV URI if SRV lookups fail. Whitelist `0.0.0.0/0` or Vercel IPs in Atlas Network Access. |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` (must match deployed URL exactly) |
| `NEXTAUTH_SECRET` | Long random string (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_SITE_URL` | Same as `NEXTAUTH_URL` — used for server-side API fetches |

`VERCEL_URL` is set automatically by Vercel and used as a fallback in `lib/fetch-api.ts`.

### Auth (NextAuth)

| Variable | Required? | Notes |
|---|---|---|
| `NEXTAUTH_URL` | Yes | See Core |
| `NEXTAUTH_SECRET` | Yes | See Core |

After deploy, create an admin user locally against the **same** `MONGODB_URI`:

```bash
npm run create-admin -- admin@yourdomain.com YourPassword "Admin Name"
```

Sign in at `https://your-domain.vercel.app/api/auth/signin`, then visit `/admin`.

### Payments (Razorpay + Stripe)

| Variable | Required? | Notes |
|---|---|---|
| `RAZORPAY_KEY_ID` | For India checkout | Razorpay Dashboard → API Keys (use Live keys in production) |
| `RAZORPAY_KEY_SECRET` | For India checkout | Server-side only — never expose publicly |
| `RAZORPAY_WEBHOOK_SECRET` | Optional | For server-to-server Razorpay webhooks in production |
| `STRIPE_SECRET_KEY` | Optional | International payments are stubbed in UI today |
| `STRIPE_WEBHOOK_SECRET` | Optional | For Stripe webhooks when implemented |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional | Client-side Stripe when implemented |

**Razorpay webhook URL (production):** `https://your-domain.vercel.app/api/webhooks/razorpay`

### Media (Cloudinary)

| Variable | Required? | Notes |
|---|---|---|
| `CLOUDINARY_CLOUD_NAME` | Optional | Commission image uploads |
| `CLOUDINARY_API_KEY` | Optional | Server-side upload API |
| `CLOUDINARY_API_SECRET` | Optional | Server-side only |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Optional | Shows upload UI on commission form (same as cloud name) |

### Email (Resend)

| Variable | Required? | Notes |
|---|---|---|
| `RESEND_API_KEY` | Optional | Commission + order confirmation emails |
| `RESEND_FROM_EMAIL` | Optional | Defaults to `hello@tarashay.com` — must be a verified domain in Resend |

Without Resend keys, emails are skipped silently (requests still save to DB).

## Post-deploy checklist

- [ ] `GET /api/health` → `{ status: "ok", db: "connected", timestamp: "..." }`
- [ ] Homepage and `/shop` load products
- [ ] `/commission` form submits successfully
- [ ] `/api/auth/signin` → admin login → `/admin`
- [ ] Razorpay test/live payment (if keys set)

## MongoDB Atlas for Vercel

1. **Database Access** — app user with **Read and write to any database**
2. **Network Access** — allow Vercel (often `0.0.0.0/0` for serverless, or restrict later)
3. Use database name `tarasay` or `tarashay` consistently in the URI

## Build notes

- All API routes use `runtime = "nodejs"` (Mongoose, bcrypt, Node `crypto`/`dns` are not Edge-compatible).
- Dynamic API routes use `force-dynamic` to avoid static generation errors.
- `/impact` is force-dynamic so live stats don't require DB at build time.
