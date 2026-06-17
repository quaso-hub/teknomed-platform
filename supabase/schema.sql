-- ─────────────────────────────────────────────────────────────
-- Teknomed Platform — Supabase Schema
-- Run this in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  specs JSONB DEFAULT '[]'::jsonb,
  layers JSONB DEFAULT '[]'::jsonb,
  camera_presets JSONB DEFAULT '[]'::jsonb,
  assembled_camera_start JSONB DEFAULT '{"name":"iso","position":[120,80,100],"target":[0,40,0]}'::jsonb,
  exploded_camera_start JSONB DEFAULT '{"name":"iso","position":[180,120,140],"target":[0,60,0]}'::jsonb,
  thumbnail_url TEXT,
  catalog_images JSONB DEFAULT '[]'::jsonb,
  model_url TEXT,
  viewer_type TEXT DEFAULT 'procedural' CHECK (viewer_type IN ('procedural', 'glb')),
  is_published BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT CHECK (category IN ('Konstruksi', 'Sales', 'Maintenance')),
  area TEXT,
  year INT,
  scope JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  highlight TEXT,
  image_url TEXT,
  map_query TEXT,
  is_published BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'closed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'sales', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Auto-create user_profile on signup ──
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── Row Level Security ──

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Products: public read published, admin full access
CREATE POLICY "Public read published products" ON products
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admin full access products" ON products
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM user_profiles WHERE role = 'admin')
  );

-- Projects: public read published, admin full access
CREATE POLICY "Public read published projects" ON projects
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admin full access projects" ON projects
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM user_profiles WHERE role = 'admin')
  );

-- Inquiries: public insert, admin read/update
CREATE POLICY "Public insert inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin read update inquiries" ON inquiries
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM user_profiles WHERE role IN ('admin', 'sales'))
  );

-- User profiles: users can read own, admin can read all
CREATE POLICY "Users read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin read all profiles" ON user_profiles
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM user_profiles WHERE role = 'admin')
  );

CREATE POLICY "Admin update profiles" ON user_profiles
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM user_profiles WHERE role = 'admin')
  );

-- ── Storage buckets ──
-- Run these in Supabase Dashboard > Storage

-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('models', 'models', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('pdf', 'pdf', true);

-- Storage policies (images: public read, admin write)
-- CREATE POLICY "Public read images" ON storage.objects
--   FOR SELECT USING (bucket_id = 'images');
-- CREATE POLICY "Admin upload images" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'images' AND
--     auth.uid() IN (SELECT id FROM user_profiles WHERE role = 'admin')
--   );
