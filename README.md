# Abdulfatai Jamiu — UI/UX Product Design Portfolio

A dark, editorial product-design portfolio: oversized condensed display type, animated text bands, a custom cursor, art-directed case studies, and a light-to-dark contact transition.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · self-hosted fonts (Bebas Neue + Instrument Sans).

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
```

## Structure

```
src/
  app/
    layout.tsx            # fonts, metadata, nav, cursor, footer, skip link
    page.tsx              # homepage composition
    template.tsx          # route-level page transition
    work/[slug]/page.tsx  # statically generated case studies
    not-found.tsx
  components/
    Nav.tsx               # sticky nav + full-screen mobile overlay (scroll-locked)
    Cursor.tsx            # desktop-only cursor; VIEW / arrow states
    Hero.tsx  FeaturedGallery.tsx  Approach.tsx  SelectedWorks.tsx
    Expertise.tsx  About.tsx  Contact.tsx  Footer.tsx
    Marquee.tsx           # infinite band, pauses on hover
    Reveal.tsx            # fade-up + masked line reveals
    ProjectArt.tsx        # generated SVG cover artwork per project
  data/
    site.ts               # name, links, email, CV path, nav
    projects.ts           # all project + case-study content
  fonts/                  # self-hosted woff2
public/
  Abdulfatai_Jamiu_CV.pdf
```

## Editing content

Everything recruiter-facing lives in `src/data/`. Add or edit a project in
`src/data/projects.ts` and both the list and its case-study page update — the
route is generated from the `slug`.

Update contact details, social links and the CV filename in `src/data/site.ts`.

## Replacing the generated artwork with real screens

Cover art is currently generated inline SVG (`ProjectArt.tsx`) so the repo ships
with no binary dependencies. To use real mockups:

1. Drop images in `public/projects/<slug>.jpg` (recommended 1600×1200 or wider).
2. In `FeaturedGallery.tsx` and `work/[slug]/page.tsx`, swap `<ProjectArt … />`
   for `next/image`:

```tsx
<Image src={`/projects/${p.slug}.jpg`} alt={`${p.title} — ${p.category}`}
       fill sizes="(max-width: 768px) 90vw, 45vw"
       className="object-cover" />
```

## Accessibility & motion

- Semantic landmarks, a skip link, visible focus rings, labelled SVG artwork.
- Full keyboard navigation; the mobile menu traps scroll and closes on `Escape`.
- Every animation respects `prefers-reduced-motion` (marquees stop, reveals fade).
- The custom cursor is `pointer-events: none` and disabled on touch devices.
- Verified with no horizontal overflow at 1440px and 390px.

## Deploying

Any Next.js host works. On [Vercel](https://vercel.com/new): import the repo,
accept the defaults, deploy. No environment variables are required.
