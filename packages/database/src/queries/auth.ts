// ─────────────────────────────────────────────────────────────
// @teknomed/database — Auth queries
// ─────────────────────────────────────────────────────────────

import { getSupabase } from '../supabase';
import type { UserProfile } from '../types';

/**
 * Sign in with email + password.
 */
export async function signIn(email: string, password: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`signIn: ${error.message}`);
  return data;
}

/**
 * Sign out.
 */
export async function signOut() {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(`signOut: ${error.message}`);
}

/**
 * Get current session.
 */
export async function getSession() {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Get current user profile (with role).
 */
export async function getCurrentProfile(): Promise<UserProfile | null> {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) return null;
  return data;
}

/**
 * Get all user profiles (admin).
 */
export async function getUserProfiles(): Promise<UserProfile[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`getUserProfiles: ${error.message}`);
  return data ?? [];
}

/**
 * Update user role (admin).
 */
export async function updateUserRole(id: string, role: UserProfile['role']): Promise<UserProfile> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ role })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`updateUserRole: ${error.message}`);
  return data;
}
