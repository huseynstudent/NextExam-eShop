# ShopLite

Next.js (App Router) + TypeScript + Tailwind storefront, with a database-backed
catalog, an admin panel, and Google sign-in.

## Stack

- Next.js 14 (App Router)
- Tailwind CSS v3
- next-intl — English/Azerbaijani storefront localization
- Prisma + SQLite — catalog + auth data
- Auth.js (NextAuth v5) — Google OAuth for the admin panel
- react-three-fiber — 3D GoPro model in the hero section

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

1. **`AUTH_SECRET`** — any random string. Generate one with `openssl rand -base64 32`.
2. **`AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`** — from
   [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   create an OAuth client ID (type: **Web application**), and add this
   authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   (add your production URL's equivalent once you deploy)
3. **`ADMIN_EMAILS`** — your Google account's email. Comma-separate multiple
   admins. Anyone signing in with a listed email is auto-promoted to admin —
   see "Bootstrapping your first admin" below.
4. `DATABASE_URL` can be left as-is for local dev (SQLite, zero setup).

Then create the database and load starter data:

```bash
npm run db:push    # creates prisma/dev.db from prisma/schema.prisma
npm run db:seed    # loads the current catalog (categories + products)
npm run dev
```

Visit `http://localhost:3000` (redirects to `/en`) and `/az` for the
Azerbaijani version.

## Admin panel

Go to `http://localhost:3000/admin/login` and sign in with Google.

**Bootstrapping your first admin:** the very first time you sign in, your
Google account is created in the database as a regular user. If its email is
listed in `ADMIN_EMAILS`, the sign-in callback in `auth.ts` promotes it to
`role: "ADMIN"` automatically — no manual database editing needed. If you add
a new email to `ADMIN_EMAILS` after someone has already signed in once, they
just need to sign out and back in for the promotion to apply.

From `/admin` you can:

- See catalog counts (dashboard)
- Categories (`/admin/categories`) — add, edit, delete
- Products (`/admin/products`) — add, edit, delete
- Users (`/admin/users`) — add, delete, and grant/revoke admin access
  (you can't change or delete your own account — have another admin do it)

Changes show up on the storefront immediately — no rebuild or redeploy.

**Note on images:** there's no file upload yet. Add a category/product by
typing an image path (e.g. `/assets/newitem.png` for a file you've dropped
into `public/assets/`) or a full external image URL. Wiring up actual file
uploads (e.g. via Vercel Blob or S3) would be a reasonable next step if you
need it.

**Note on translations:** category/product names are admin-authored content,
stored once in the database — they display as-is on both `/en` and `/az`
rather than being auto-translated. Only the surrounding UI chrome (nav,
buttons, section headings) is localized via `messages/en.json` /
`messages/az.json`. If you need bilingual catalog names later, the
straightforward extension is adding `name` + `name_az` columns to the
`Category`/`Product` models.

## Customer accounts

Separate from admin — regular visitors can sign in at `/signin` or create an
account at `/signup`, either with Google or email/password. Passwords are
never stored raw, only as a bcrypt hash. New accounts default to `role:
"USER"`; only an existing admin can promote one to `"ADMIN"`, via
`/admin/users` — the `ADMIN_EMAILS` env var only ever applies at the moment
an account is first created (a one-time bootstrap), never on later sign-ins,
so a demotion in the admin panel actually sticks.

Signing in doesn't unlock anything extra on the storefront yet (no order
history, wishlist, etc. — those UI pieces didn't exist before this pass) —
it's the foundation for that, not the whole feature.

## Static pages

`/about`, `/shop`, `/blogs`, `/contact` are real routes now, linked from the
header nav. `/shop` pulls the live catalog from Prisma (same data as the
homepage). `/blogs` is static placeholder content — there's no CMS. The
contact form on `/contact` is UI-only; it shows a confirmation on submit but
isn't wired to send anywhere yet (see `components/ContactForm.tsx` for
where to add a real endpoint).

## Wishlist, cart, and messages

- **Wishlist / cart** (`/wishlist`, `/cart`) — heart and cart icons on every
  product card (BestSelling, Shop, Search, Wishlist) are wired to a real
  per-user `WishlistItem`/`CartItem` table. This is genuinely scoped to
  `userId`, not a shared cookie — sign in as two different accounts and
  you'll see two different wishlists/carts, which is the easiest way to
  prove the auth setup actually works per-user. Clicking either while
  signed out redirects to `/signin`.
- **Contact → admin** (`/contact` → `/admin/messages`) — the contact form
  now actually writes to a `ContactMessage` table instead of just showing a
  fake confirmation. Admins see submissions at `/admin/messages`, with an
  unread-count badge in the sidebar, and can mark read/unread or delete.
- **Search** (`/search`) — a plain GET-based product search (`?q=...`),
  no client JS required. Matches on product name via SQLite's `LIKE`, which
  is case-insensitive for ASCII by default — fine for a small catalog, not
  a real search engine.

## API

Two REST endpoints back the dynamic catalog (used by the admin panel's
server actions internally, and available for any other client):

- `GET /api/categories` — public. `POST` requires an admin session.
- `PATCH` / `DELETE /api/categories/:id` — admin only.
- `GET /api/products?section=best-selling` — public. `POST` requires an admin session.
- `PATCH` / `DELETE /api/products/:id` — admin only.

The storefront's `Categories` and `BestSelling` components query Prisma
directly (faster, no extra round trip) rather than calling these routes
themselves — the routes exist for the admin UI and any external integration.

## Project structure

```
app/
  [locale]/          storefront (en/az), all next-intl-aware
  admin/
    login/           public sign-in page
    (protected)/     dashboard, categories, products — gated by auth.ts
    actions.ts       server actions for catalog CRUD
  api/
    auth/[...nextauth]/   Auth.js route handler
    categories/, products/  REST endpoints described above
auth.ts              Auth.js config (Google provider, Prisma adapter, JWT sessions)
i18n/                next-intl routing/config
messages/            en.json, az.json — storefront UI copy
prisma/
  schema.prisma      Category, Product, + Auth.js's User/Account/Session tables
  seed.ts            loads the starter catalog
lib/
  prisma.ts          Prisma client singleton
  admin.ts           requireAdmin() session check, used by API routes + actions
components/          storefront sections (Header, Hero, Categories, etc.)
```

## Wiring up the 3D GoPro

Already wired up: `components/Gopro.tsx` (generated via `gltfjsx`) is mounted
inside `components/GoproScene.tsx` (lighting, `OrbitControls`, auto-rotate),
loaded client-side only via `next/dynamic` in `components/Hero.tsx`. The
model file is expected at `public/gopro.glb`.

## Countdown timer

`components/CountdownTimer.tsx` counts down from "now + 21d 22h 19m 30s" by
default. Change `TARGET_DATE` to whatever end date the real promotion needs.

## Deploying

- Swap `DATABASE_URL` to a hosted Postgres/MySQL instance and update the
  `provider` in `prisma/schema.prisma` to match (SQLite doesn't work well on
  most serverless hosts since the filesystem isn't persistent).
- Add the production callback URL to your Google OAuth client:
  `https://yourdomain.com/api/auth/callback/google`.
- Set all `.env` values as environment variables on your host.
