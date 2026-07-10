-- ============================================================
-- Migration 001: Create public.users table
-- ============================================================
-- Run this in your Supabase SQL Editor.
-- It creates a public.users table linked to auth.users via
-- a foreign key, plus a trigger that auto-creates a row when
-- someone signs up through Supabase Auth.
-- ============================================================

-- 1. Create the users table
create table if not exists public.users (
  id          uuid        primary key references auth.users(id) on delete cascade,
  email       text        not null,
  avatar_url  text,
  full_name   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2. Enable Row Level Security (so users can only see their own row)
alter table public.users enable row level security;

-- 3. Basic RLS policies
--    Users can read their own row
create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

--    Users can update their own row
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- 4. Trigger: auto-create public.users row when auth.users row is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, email, avatar_url, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'full_name'
  )
  on conflict (id) do update set
    email      = excluded.email,
    avatar_url = excluded.avatar_url,
    full_name  = excluded.full_name;
  return new;
end;
$$;

-- 5. Attach the trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. Backfill: create rows for any existing auth.users who don't have one
insert into public.users (id, email, avatar_url, full_name)
select
  id,
  email,
  raw_user_meta_data ->> 'avatar_url',
  raw_user_meta_data ->> 'full_name'
from auth.users
on conflict (id) do nothing;
