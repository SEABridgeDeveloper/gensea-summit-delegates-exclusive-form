# 1967 — Win Your Seat

Long-scroll landing page + 5-step scholarship application wizard for the 1967 program. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, react-hook-form, and zod.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Stack
- Next.js 14 (App Router)
- Tailwind CSS with a warm editorial sunset palette
- next/font: Geist (EN) + IBM Plex Sans Thai (TH)
- react-hook-form + zod per-step validation
- lucide-react icons
- Lightweight `useLocale()` context (TH default, EN toggle), copy in `messages/th.json` + `messages/en.json`

## Notes
- Submit handler in `app/apply/page.tsx` logs the payload then redirects to `/apply/success`.
- University + faculty data lives in `lib/data/`. ~140 ASEAN institutions seeded, 30+ Thai.
- Hero photo is a free Unsplash image of a Thai temple at golden hour.
