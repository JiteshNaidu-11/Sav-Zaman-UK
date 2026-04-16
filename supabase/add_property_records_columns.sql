-- Run once if you already applied sav_zaman_fresh_setup.sql without these columns.
-- Adds admin "Property Records" fields + splits public read RLS so visitors only see approved, visible listings.

alter table public.properties
  add column if not exists record_status text not null default 'approved'
    check (record_status in ('pending', 'approved')),
  add column if not exists is_upcoming boolean not null default false,
  add column if not exists show_home_rental boolean not null default false,
  add column if not exists hidden_from_public boolean not null default false,
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists created_by_label text;

drop policy if exists "properties_select_public" on public.properties;
drop policy if exists "properties_select_anon" on public.properties;
drop policy if exists "properties_select_authenticated" on public.properties;

-- Visitors: only moderated + not hidden
create policy "properties_select_anon"
on public.properties
for select
to anon
using (record_status = 'approved' and not hidden_from_public);

-- Signed-in users (admin): full catalog for the dashboard
create policy "properties_select_authenticated"
on public.properties
for select
to authenticated
using (true);
