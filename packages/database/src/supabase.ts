// ─────────────────────────────────────────────────────────────
// @teknomed/database — Supabase client factory
// ─────────────────────────────────────────────────────────────

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

let client: SupabaseClient<Database> | null = null;

/**
 * Get or create Supabase client singleton.
 * Uses VITE_ env vars (works in both Vite and Node).
 */
export function getSupabase(): SupabaseClient<Database> {
  if (client) return client;

  const url = import.meta.env.VITE_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env',
    );
  }

  client = createClient<Database>(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  return client;
}

/**
 * Create Supabase client with custom config (for admin/service role).
 */
export function createSupabaseClient(
  url: string,
  key: string,
  options?: { serviceRole?: boolean },
): SupabaseClient<Database> {
  return createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: !options?.serviceRole,
      persistSession: !options?.serviceRole,
    },
  });
}
