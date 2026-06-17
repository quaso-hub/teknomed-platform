// ─────────────────────────────────────────────────────────────
// @teknomed/database — Supabase client factory
// ─────────────────────────────────────────────────────────────

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

function getEnv(key: string): string | undefined {
  try {
    const viteEnv = (import.meta as unknown as { env: Record<string, string> }).env;
    if (viteEnv?.[key]) return viteEnv[key];
  } catch {}
  try {
    if (typeof process !== 'undefined' && process.env?.[key]) return process.env[key];
  } catch {}
  return undefined;
}

/**
 * Get or create Supabase client singleton.
 */
export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = getEnv('VITE_SUPABASE_URL');
  const anonKey = getEnv('VITE_SUPABASE_ANON_KEY');

  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env',
    );
  }

  client = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  return client;
}

/**
 * Create Supabase client with custom config.
 */
export function createSupabaseClient(
  url: string,
  key: string,
  options?: { serviceRole?: boolean },
): SupabaseClient {
  return createClient(url, key, {
    auth: {
      autoRefreshToken: !options?.serviceRole,
      persistSession: !options?.serviceRole,
    },
  });
}
