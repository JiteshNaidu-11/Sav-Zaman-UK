# Sav Zaman UK

Public-facing website rebuilt with Vite, React, TypeScript, Tailwind CSS, and Framer Motion.

## Scripts

- `npm run dev` - Start the local development server
- `npm run build` - Create a production build
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
- `npm run test` - Run Vitest

## Notes

- Public routing now uses `/`, `/about`, `/properties`, `/properties/:slug`, `/services`, and `/contact`
- Admin routes are available at `/admin` and `/admin/inquiries`
- Brand copy, nav items, and placeholder contact details live in `src/content/site.ts`
- Seed property data lives in `src/data/properties.ts`
- Replace the temporary text-based logo in `src/components/BrandLogo.tsx` when the final Sav Zaman UK logo is ready
