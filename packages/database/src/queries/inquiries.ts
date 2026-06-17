// ─────────────────────────────────────────────────────────────
// @teknomed/database — Inquiry queries
// ─────────────────────────────────────────────────────────────

import { getSupabase } from '../supabase';
import type { Inquiry, InquiryInsert, InquiryUpdate } from '../types';

/**
 * Create inquiry from contact form (public).
 */
export async function createInquiry(inquiry: InquiryInsert): Promise<Inquiry> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('inquiries')
    .insert(inquiry)
    .select()
    .single();

  if (error) throw new Error(`createInquiry: ${error.message}`);
  return data;
}

/**
 * Fetch all inquiries (admin).
 */
export async function getInquiries(): Promise<Inquiry[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`getInquiries: ${error.message}`);
  return data ?? [];
}

/**
 * Update inquiry status (admin).
 */
export async function updateInquiry(id: string, updates: InquiryUpdate): Promise<Inquiry> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('inquiries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`updateInquiry: ${error.message}`);
  return data;
}

/**
 * Delete inquiry (admin).
 */
export async function deleteInquiry(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from('inquiries').delete().eq('id', id);
  if (error) throw new Error(`deleteInquiry: ${error.message}`);
}
