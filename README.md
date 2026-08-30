# ShopLite

Next.js (App Router) + TypeScript + Tailwind clone of the ShopLite layout.

## Run it

```bash
npm install
npm run dev
```

## What's built

- `Header` — logo, nav, icon cluster
- `Hero` — headline + CTA, circular slot reserved for the 3D GoPro, carousel arrows
- `FeaturesBar` — 4-up icon/feature row
- `Categories` — 6 category cards
- `BestSelling` — 5 product cards, carousel arrows
- `DiscountBanner` — image + working countdown timer (`CountdownTimer.tsx`)

## Asset slots

Every spot waiting on a real image is styled with the `.asset-slot` class
(defined in `app/globals.css`) — a dashed, hatched placeholder with a label,
sized to the final layout. Search the codebase for `asset-slot` to find all
of them: category icons, product photos, the Apple-collection banner shot.

## Wiring up the 3D GoPro

Model source: [GoPro Hero 8 on Sketchfab](https://sketchfab.com/3d-models/gopro-hero-8-3b38ac33b19d49d4b23b8125c6e1912b)

1. Download the model as `.glb`/`.gltf` from Sketchfab and put it in `public/models/`.
2. Install the three.js + fiber stack:
   ```bash
   npm install three @react-three/fiber @react-three/drei
   ```
3. In `components/Hero.tsx`, there's a clearly marked block explaining exactly
   what to swap the placeholder `<div className="asset-slot" ...>` for —
   a `<Canvas>` with lighting, `<Suspense>`, `OrbitControls`, and your
   model component (you can generate the model component with
   `npx gltfjsx public/models/gopro.glb`).
4. Keep the surrounding circular div (`bg-[#e9e7e3]`) — that's the background
   disc from the design; the canvas just fills the inner square.

## Countdown timer

`components/CountdownTimer.tsx` counts down from "now + 21d 22h 19m 30s" by
default (matching the screenshot at the moment it was captured). Change
`TARGET_DATE` to whatever end date the real promotion needs.
