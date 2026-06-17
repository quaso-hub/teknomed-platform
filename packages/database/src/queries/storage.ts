// ─────────────────────────────────────────────────────────────
// @teknomed/database — Storage queries
// ─────────────────────────────────────────────────────────────

import { getSupabase } from '../supabase';

/**
 * Upload file to Supabase Storage.
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
): Promise<string> {
  const supabase = getSupabase();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
  });
  if (error) throw new Error(`uploadFile: ${error.message}`);

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
  return urlData.publicUrl;
}

/**
 * Delete file from Supabase Storage.
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(`deleteFile: ${error.message}`);
}

/**
 * List files in a bucket path.
 */
export async function listFiles(bucket: string, path: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.storage.from(bucket).list(path);
  if (error) throw new Error(`listFiles: ${error.message}`);
  return data ?? [];
}
