# Supabase Setup

This project now supports a live admin panel backed by Supabase. When configured, any property created from `/admin` is visible to public visitors on the website.

## 1. Add these env keys

Create a local `.env` file in the project root with:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_STORAGE_BUCKET=property-images
```

Only the first two are required. The storage bucket defaults to `property-images`.

## 2. Run the SQL setup

Open the Supabase SQL Editor and run:

- [supabase/schema.sql](./supabase/schema.sql)

That script creates:

- the `public.properties` table
- the `public.lead_inquiries` table
- update timestamp trigger
- row-level security policies
- the public `property-images` storage bucket
- storage policies for authenticated admin uploads
- realtime support for property sync

## 3. Create the admin user

In the Supabase dashboard:

1. Go to `Authentication` -> `Users`
2. Create or invite the admin user manually
3. Use that email and password on the `/admin` page

Recommended:

- disable public signups if only your client should access admin
- keep the anon key in `.env` only, not in git

## 4. Optional email notifications

If you also want every new contact message or property call request to notify the client by email:

1. Create a Resend account and get an API key
2. Deploy the edge function in [supabase/functions/send-inquiry-email/index.ts](./supabase/functions/send-inquiry-email/index.ts)
3. Add these Supabase function secrets:

```env
RESEND_API_KEY=your-resend-api-key
INQUIRY_NOTIFY_TO=jagtapshriyash1@gmail.com
INQUIRY_NOTIFY_FROM=More Estate <onboarding@resend.dev>
```

Notes:

- `INQUIRY_NOTIFY_TO` defaults to `jagtapshriyash1@gmail.com` in the current test setup
- without deploying the function, form submissions still save in admin, but email notifications will not send

## 5. How it works

- Public site visitors can read property data
- Public site visitors can submit contact and property call requests
- Only authenticated Supabase users can create, edit, or delete listings
- Only authenticated Supabase users can view client inquiries inside admin
- Device-uploaded images are stored in the configured storage bucket
- The app subscribes to realtime changes on `public.properties` and `public.lead_inquiries`

## 6. First launch

After env keys are added and SQL is run:

1. Restart the dev server
2. Open `/admin`
3. Sign in with the Supabase admin user
4. Publish a property
5. Check `/properties` on the public site
6. Open `/admin/inquiries` to review website leads
