// ─────────────────────────────────────────────────────────────
// @teknomed/database — Supabase client factory
// ─────────────────────────────────────────────────────────────

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

let client: SupabaseClient<Database> | null = null;

function getEnv(key: string): string | undefined {
  // Vite (import.meta.env)
  try {
    const viteEnv = (import.meta as Record<string, unknown>).env as Record<string, string> | undefined;
    if (viteEnv?.[key]) return viteEnv[key];
  } catch {}
  // Node (process.env)
  try {
    if (typeof process !== 'undefined' && process.env?.[key]) return process.env[key];
  } catch {}
  return undefined;
}

/**
 * Get or create Supabase client singleton.
 */
export function getSupabase(): SupabaseClient<Database> {
  if (client) return client;

  const url = getEnv('VITE_SUPABASE_URL');
  const anonKey = getEnv('VITE_SUPABASE_ANON_KEY');

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
