# Sav Zaman — Supabase

## Fresh setup (empty or broken database)

1. Open the [Supabase SQL Editor](https://supabase.com/dashboard) for your project.
2. Paste and run **`sav_zaman_fresh_setup.sql`** once.

This creates:

- **`properties`** — columns aligned with `src/lib/propertyRecords.ts` (admin listing form), plus **Property Records** fields: `record_status` (pending/approved), `is_upcoming`, `show_home_rental`, `hidden_from_public`, `created_by`, `created_by_label`.
- **`lead_inquiries`** — contact / callback forms (`EnquiryFormBody`, `PropertyDetail`).
- **`property_inquiries`** — Guided Property Finder (`src/services/leadService.ts`).
- **RLS**: anonymous visitors only see rows where **`record_status = 'approved'`** and **`hidden_from_public = false`**. Signed-in admins see **all** rows (dashboard + Property Records table). Only authenticated users can insert/update/delete listings.
- **`property-images`** storage bucket and policies for uploads from the admin UI.

### Already ran an older `sav_zaman_fresh_setup.sql`?

Run **`add_property_records_columns.sql`** once to add the Property Records columns and update RLS.

## After running the script

1. In **Authentication → Users**, create (or confirm) the user you use to log into `/admin`.
2. Add listings while **logged in** as that user. New rows appear on the public site immediately (and via realtime refresh).

## Environment

Set in `.env`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- Optional: `VITE_SUPABASE_STORAGE_BUCKET` (defaults to `property-images`)
