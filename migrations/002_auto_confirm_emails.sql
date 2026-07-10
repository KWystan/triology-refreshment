-- ============================================================
-- Migration 002: Auto-confirm emails (optional)
-- ============================================================
-- Disable the email confirmation requirement so new signups
-- can log in immediately without clicking a verification link.
--
-- NOTE: This only works if your Supabase project has the
--       `mailer_autoconfirm` setting enabled. Alternatively,
--       toggle it in the dashboard:
--         Authentication → Settings → "Confirm email" = OFF
-- ============================================================

-- For self-hosted Supabase, uncomment:
-- update auth.config set value = 'false' where key = 'mailer_autoconfirm';

-- For managed Supabase (most users):
-- Run this in the SQL editor instead:
alter table auth.users alter column email_confirmed_at set default now();

-- This backfills any unconfirmed users so they can log in too
update auth.users set email_confirmed_at = now() where email_confirmed_at is null;
