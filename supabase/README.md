# Sav Zaman — Supabase

## Fresh setup (empty or broken database)

1. Open the [Supabase SQL Editor](https://supabase.com/dashboard) for your project.
2. Paste and run **`sav_zaman_fresh_setup.sql`** once.

This creates:

- **`properties`** — columns aligned with `src/lib/propertyRecords.ts` (admin listing form).
- **`lead_inquiries`** — contact / callback forms (`EnquiryFormBody`, `PropertyDetail`).
- **`property_inquiries`** — Guided Property Finder (`src/services/leadService.ts`).
- **RLS** so **everyone can read listings**; only **signed-in** users can create/update/delete listings (use your admin account in the Admin panel).
- **`property-images`** storage bucket and policies for uploads from the admin UI.

## After running the script

1. In **Authentication → Users**, create (or confirm) the user you use to log into `/admin`.
2. Add listings while **logged in** as that user. New rows appear on the public site immediately (and via realtime refresh).

## Environment

Set in `.env`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- Optional: `VITE_SUPABASE_STORAGE_BUCKET` (defaults to `property-images`)
