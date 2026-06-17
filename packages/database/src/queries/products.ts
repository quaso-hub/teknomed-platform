// ─────────────────────────────────────────────────────────────
// @teknomed/database — Product queries
// ─────────────────────────────────────────────────────────────

import { getSupabase } from '../supabase';
import type { Product, ProductInsert, ProductUpdate } from '../types';

/**
 * Fetch all published products (public).
 */
export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`getProducts: ${error.message}`);
  return data ?? [];
}

/**
 * Fetch all products including unpublished (admin).
 */
export async function getAllProducts(): Promise<Product[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`getAllProducts: ${error.message}`);
  return data ?? [];
}

/**
 * Fetch single product by ID.
 */
export async function getProduct(id: string): Promise<Product | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw new Error(`getProduct: ${error.message}`);
  }
  return data;
}

/**
 * Create new product (admin).
 */
export async function createProduct(product: ProductInsert): Promise<Product> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) throw new Error(`createProduct: ${error.message}`);
  return data;
}

/**
 * Update product (admin).
 */
export async function updateProduct(id: string, updates: ProductUpdate): Promise<Product> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`updateProduct: ${error.message}`);
  return data;
}

/**
 * Delete product (admin).
 */
export async function deleteProduct(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(`deleteProduct: ${error.message}`);
}

/**
 * Toggle publish status (admin).
 */
export async function toggleProductPublish(id: string, isPublished: boolean): Promise<Product> {
  return updateProduct(id, { is_published: isPublished });
}
