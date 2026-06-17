// ─────────────────────────────────────────────────────────────
// @teknomed/database — Project queries
// ─────────────────────────────────────────────────────────────

import { getSupabase } from '../supabase';
import type { Project, ProjectInsert, ProjectUpdate } from '../types';

export async function getProjects(): Promise<Project[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`getProjects: ${error.message}`);
  return data ?? [];
}

export async function getAllProjects(): Promise<Project[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`getAllProjects: ${error.message}`);
  return data ?? [];
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`getProject: ${error.message}`);
  }
  return data;
}

export async function createProject(project: ProjectInsert): Promise<Project> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) throw new Error(`createProject: ${error.message}`);
  return data;
}

export async function updateProject(id: string, updates: ProjectUpdate): Promise<Project> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`updateProject: ${error.message}`);
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw new Error(`deleteProject: ${error.message}`);
}
