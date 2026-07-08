import { createAdminClient } from '@supabase/server/core';
import  { createClient }  from '@supabase/supabase-js';
import { env } from './env.js';

/**
 * Server-side Supabase admin client.
 * Uses the secret (service-role) key — NEVER expose this to the client.
 * Bypasses Row-Level Security. Use for trusted server operations only.
 */
export const supabaseAdmin = createAdminClient({
  env: {
    url: env.SUPABASE_URL,
    secretKeys: { default: env.SUPABASE_SECRET_KEY },
  },
});

/**
 * A lightweight Supabase client using the publishable (anon) key.
 * Row-Level Security IS enforced.
 * Useful for public endpoints and operations scoped to the user's JWT.
 */
export const supabaseAnon = createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY);
