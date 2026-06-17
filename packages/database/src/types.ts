// ─────────────────────────────────────────────────────────────
// @teknomed/database — Shared types for Teknomed Platform
// ─────────────────────────────────────────────────────────────

export type ProductCategory =
  | 'Wall Panel'
  | 'Ceiling'
  | 'Doors'
  | 'Surgical'
  | 'Support'
  | 'HVAC'
  | 'Medical Gas'
  | 'Fixtures'
  | 'Flooring'
  | 'Accessories';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface MaterialLayer {
  name: string;
  material: string;
  thickness: string;
  color?: string;
}

export interface CameraPreset {
  name: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string | null;
  specs: ProductSpec[];
  layers: MaterialLayer[];
  camera_presets: CameraPreset[];
  assembled_camera_start: CameraPreset;
  exploded_camera_start: CameraPreset;
  thumbnail_url: string | null;
  catalog_images: string[];
  model_url: string | null;
  viewer_type: 'procedural' | 'glb';
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string | null;
  category: 'Konstruksi' | 'Sales' | 'Maintenance';
  area: string;
  year: number;
  scope: string[];
  tags: string[];
  highlight: string | null;
  image_url: string | null;
  map_query: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  product_id: string | null;
  message: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  admin_notes: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'sales' | 'viewer';
  created_at: string;
}

// ── Insert/Update types (tanpa auto-generated fields) ──

export type ProductInsert = Omit<Product, 'created_at' | 'updated_at'>;
export type ProductUpdate = Partial<ProductInsert>;

export type ProjectInsert = Omit<Project, 'created_at'>;
export type ProjectUpdate = Partial<ProjectInsert>;

export type InquiryInsert = Omit<Inquiry, 'id' | 'status' | 'admin_notes' | 'created_at'>;
export type InquiryUpdate = Partial<Pick<Inquiry, 'status' | 'admin_notes'>>;
