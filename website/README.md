# Origin — AI Visibility & Web

Single-page marketing site for Origin, an AI-visibility and web agency
targeting local trade businesses (contractors, concrete, fencing, general
contractors). Next.js (App Router, server-rendered/static) + TypeScript +
Tailwind CSS + Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `src/app/page.tsx` — assembles the single page from section components
- `src/components/` — Hero, Shift, Services, Process, Proof, Faq, Cta,
  Header, Footer, and the shared `AIAnswerDemo` chat-panel visual
- `src/lib/aiDemo.ts` — copy/template data for the illustrative AI-answer
  demo (used in both the hero and the Proof section)
- `src/lib/useSafeReducedMotion.ts` — SSR-safe reduced-motion detection.
  framer-motion's own `useReducedMotion()` reads `matchMedia` synchronously
  during render, which resolves differently on the server (no `window`)
  than on the client — for a visitor with reduced motion enabled, that
  causes a real hydration mismatch. This wraps `useSyncExternalStore` to
  fix it correctly instead of routing around it.

## Design notes

- Ink-navy base (`--background`) with a restrained warm copper/ember
  accent — deliberately avoiding both the cream/terracotta and
  near-black/neon-green AI-startup clichés.
- Type pairing: Fraunces (display/headlines, used with restraint —
  italic for the hero's emotional beat) + Inter (body) + JetBrains Mono
  (eyebrows and the AI-answer panel, for a technical register).
- The one "signature visual moment" is the animated AI-answer chat panel
  in the hero. Everything else uses restrained scroll-triggered reveals
  (`src/components/Reveal.tsx`) and hover states — nothing gratuitous.
  All motion respects `prefers-reduced-motion`.
- The Proof section's demo is clearly labeled illustrative — it does not
  call any real AI provider's API. Do not remove that label; claiming a
  live query without one would be misleading.

## Before launch

- Update the placeholder domain (`getorigin.ai`) in `src/app/layout.tsx`,
  `src/app/sitemap.ts`, and `src/app/robots.ts`.
- Update the placeholder email/phone/city in `src/components/Footer.tsx`.
- Wire `src/components/CtaForm.tsx` up to a real submission endpoint (API
  route, CRM, inbox, etc.) — it currently only confirms the form works
  client-side.
- `src/app/robots.ts` explicitly allows GPTBot, PerplexityBot, ClaudeBot,
  and Google-Extended in addition to `*` — keep this if you want AI
  crawlers indexing the site.

## Commands

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint
