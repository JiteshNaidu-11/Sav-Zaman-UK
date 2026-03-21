-- More Estate Supabase setup
-- Safe to re-run:
-- 1. Tables use `create table if not exists`
-- 2. Policies use `drop policy if exists` before re-creating
-- 3. Storage bucket uses `on conflict`
-- 4. Realtime publication blocks ignore duplicate-object errors
--
-- Important:
-- Re-running this file will not delete your existing property or inquiry data.
-- In the future, if you add new columns to an already-existing table, you will
-- need explicit `alter table ... add column ...` statements for those changes.

-- 1. Extensions
create extension if not exists pgcrypto;

-- 2. Core tables
create table if not exists public.properties (
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
  status text not null,
  featured boolean not null default false,
  hero_featured boolean not null default false,
  image_url text not null,
  gallery_urls text[] not null default '{}'::text[],
  video_embed_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_inquiries (
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

-- 3. Utility functions and triggers
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

-- 4. Row level security
alter table public.properties enable row level security;
alter table public.lead_inquiries enable row level security;

drop policy if exists "Public can view properties" on public.properties;
create policy "Public can view properties"
on public.properties
for select
using (true);

drop policy if exists "Authenticated users can insert properties" on public.properties;
create policy "Authenticated users can insert properties"
on public.properties
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update properties" on public.properties;
create policy "Authenticated users can update properties"
on public.properties
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete properties" on public.properties;
create policy "Authenticated users can delete properties"
on public.properties
for delete
to authenticated
using (true);

drop policy if exists "Public can create lead inquiries" on public.lead_inquiries;
create policy "Public can create lead inquiries"
on public.lead_inquiries
for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated users can view lead inquiries" on public.lead_inquiries;
create policy "Authenticated users can view lead inquiries"
on public.lead_inquiries
for select
to authenticated
using (true);

-- 5. Storage bucket and storage policies
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Public can view property images" on storage.objects;
create policy "Public can view property images"
on storage.objects
for select
using (bucket_id = 'property-images');

drop policy if exists "Authenticated users can upload property images" on storage.objects;
create policy "Authenticated users can upload property images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'property-images');

drop policy if exists "Authenticated users can update property images" on storage.objects;
create policy "Authenticated users can update property images"
on storage.objects
for update
to authenticated
using (bucket_id = 'property-images')
with check (bucket_id = 'property-images');

drop policy if exists "Authenticated users can delete property images" on storage.objects;
create policy "Authenticated users can delete property images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'property-images');

-- 6. Realtime subscriptions
do $$
begin
  alter publication supabase_realtime add table public.properties;
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  alter publication supabase_realtime add table public.lead_inquiries;
exception
  when duplicate_object then null;
end
$$;
