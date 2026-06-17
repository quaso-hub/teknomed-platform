// ─────────────────────────────────────────────────────────────
// @teknomed/database — Barrel export
// ─────────────────────────────────────────────────────────────

// Client
export { getSupabase, createSupabaseClient } from './supabase';

// Types
export type {
  Product,
  ProductInsert,
  ProductUpdate,
  ProductCategory,
  ProductSpec,
  MaterialLayer,
  CameraPreset,
  Project,
  ProjectInsert,
  ProjectUpdate,
  Inquiry,
  InquiryInsert,
  InquiryUpdate,
  UserProfile,
} from './types';

// Queries — Products
export {
  getProducts,
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductPublish,
} from './queries/products';

// Queries — Projects
export {
  getProjects,
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from './queries/projects';

// Queries — Inquiries
export {
  createInquiry,
  getInquiries,
  updateInquiry,
  deleteInquiry,
} from './queries/inquiries';

// Queries — Auth
export {
  signIn,
  signOut,
  getSession,
  getCurrentProfile,
  getUserProfiles,
  updateUserRole,
} from './queries/auth';

// Queries — Storage
export {
  uploadFile,
  deleteFile,
  listFiles,
} from './queries/storage';
