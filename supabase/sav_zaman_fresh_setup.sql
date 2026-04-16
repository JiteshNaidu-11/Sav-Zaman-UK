-- Sav Zaman UK — fresh database setup (run once in Supabase SQL Editor)
--
-- Matches the admin listing form + PropertyStore: `src/lib/propertyRecords.ts` (PropertyRecord).
-- Guarantees:
--   • Anyone can READ published listings (anon + logged-in visitors).
--   • Logged-in users (your admin account) can INSERT / UPDATE / DELETE properties.
--   • Site forms can INSERT into inquiry tables; only authenticated users can read inquiries.
--
-- BEFORE RUNNING: if you already have data you need, back it up. This script DROPS the listed tables.

-- ---------- Reset (tables only; safe for empty projects) ----------
drop table if exists public.property_inquiries cascade;
drop table if exists public.lead_inquiries cascade;
drop table if exists public.properties cascade;

create extension if not exists pgcrypto;

-- ---------- Listings (matches PropertyRecord / admin form) ----------
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  location text not null,
  address text not null,
  price text not null,
  type text not null,
  area text not null,
  beds text,
  baths text,
  category text not null,
  overview text not null,
  amenities text[] not null default '{}'::text[],
  status text not null default 'For Sale',
  featured boolean not null default false,
  hero_featured boolean not null default false,
  image_url text not null,
  gallery_urls text[] not null default '{}'::text[],
  video_embed_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
before update on public.properties
for each row
execute function public.set_updated_at();

-- ---------- Contact / callback enquiries (EnquiryFormBody, PropertyDetail) ----------
create table public.lead_inquiries (
  id uuid primary key default gen_random_uuid(),
  inquiry_type text not null check (inquiry_type in ('contact_message', 'property_call_request')),
  property_slug text,
  property_title text,
  name text not null,
  email text,
  phone text,
  subject text,
  message text not null,
  preferred_date date,
  preferred_time time,
  created_at timestamptz not null default now()
);

-- ---------- Guided Property Finder leads (leadService.ts) ----------
create table public.property_inquiries (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('property_inquiry', 'contact')),
  property_id text,
  property_title text,
  customer_name text not null,
  contact_email text not null,
  phone_number text not null,
  message text not null default '',
  preferred_date date,
  created_at timestamptz not null default now()
);

-- ---------- Row Level Security ----------
alter table public.properties enable row level security;
alter table public.lead_inquiries enable row level security;
alter table public.property_inquiries enable row level security;

-- Listings: visible to everyone; editable only when signed in (use your admin Auth user in the dashboard).
drop policy if exists "properties_select_public" on public.properties;
create policy "properties_select_public"
on public.properties
for select
to anon, authenticated
using (true);

drop policy if exists "properties_write_authenticated" on public.properties;
create policy "properties_write_authenticated"
on public.properties
for all
to authenticated
using (true)
with check (true);

-- Forms: visitors can submit enquiries.
drop policy if exists "lead_inquiries_insert_public" on public.lead_inquiries;
create policy "lead_inquiries_insert_public"
on public.lead_inquiries
for insert
to anon, authenticated
with check (true);

drop policy if exists "lead_inquiries_select_authenticated" on public.lead_inquiries;
create policy "lead_inquiries_select_authenticated"
on public.lead_inquiries
for select
to authenticated
using (true);

drop policy if exists "property_inquiries_insert_public" on public.property_inquiries;
create policy "property_inquiries_insert_public"
on public.property_inquiries
for insert
to anon, authenticated
with check (true);

drop policy if exists "property_inquiries_select_authenticated" on public.property_inquiries;
create policy "property_inquiries_select_authenticated"
on public.property_inquiries
for select
to authenticated
using (true);

-- ---------- Storage: property images ----------
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "property_images_public_read" on storage.objects;
create policy "property_images_public_read"
on storage.objects
for select
to public
using (bucket_id = 'property-images');

drop policy if exists "property_images_authenticated_write" on storage.objects;
create policy "property_images_authenticated_write"
on storage.objects
for all
to authenticated
using (bucket_id = 'property-images')
with check (bucket_id = 'property-images');

-- ---------- Realtime (optional; PropertyStore subscribes to changes) ----------
do $$
begin
  alter publication supabase_realtime add table public.properties;
exception
  when duplicate_object then null;
end
$$;
