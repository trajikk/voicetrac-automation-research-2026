# Origin Visibility — Marketing Site

Next.js (App Router) + TypeScript + Tailwind CSS site for Origin Visibility,
an AI search visibility / GEO, website rebuild, SEO, and content strategy
agency.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `src/app/` — routes: home (`/`), `/services`, `/about`, `/contact`
- `src/components/` — shared nav, footer, buttons, contact form
- `src/lib/services.ts` — service copy shared between the home and services pages

## Before launch

- Update the placeholder domain (`originvisibility.com`) in `src/app/layout.tsx`,
  `src/app/sitemap.ts`, and `src/app/robots.ts` to the real domain.
- Update the placeholder email/phone in `src/components/Footer.tsx` and
  `src/app/contact/page.tsx`.
- Wire `src/components/ContactForm.tsx` up to a real submission endpoint
  (API route, Formspree, HubSpot, etc.) — it currently only confirms the
  form works client-side.
- Swap in real client testimonials/logos if you want social proof on the
  home page.

## Commands

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run lint` — ESLint
