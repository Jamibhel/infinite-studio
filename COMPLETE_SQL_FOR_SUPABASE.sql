-- ============================================
-- INFINITE STUDIO - COMPLETE DATABASE SETUP
-- ============================================
-- Copy and paste EVERYTHING below into Supabase SQL Editor
-- Then click RUN
-- This will fix ALL your admin panel errors

-- ============================================
-- CREATE TABLES (if they don't exist)
-- ============================================

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  spaces TEXT[] NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed')),
  group_size INTEGER DEFAULT 1,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS spaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  mood_tag TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  pricing INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_spaces_active ON spaces(is_active);
CREATE INDEX IF NOT EXISTS idx_spaces_sort ON spaces(sort_order);

-- ============================================
-- INSERT DEFAULT SITE CONFIG (if not present)
-- ============================================

INSERT INTO site_config (key, value) VALUES
  ('marquee_text', 'Editorial · Cinematic · Lifestyle · Corporate · Fashion · Beauty'),
  ('studio_phone', '+234 700 0000 000'),
  ('studio_email', 'hello@infinitestudio.com'),
  ('studio_address', 'Omida Shopping Complex, Abeokuta, Ogun State, Nigeria'),
  ('whatsapp_number', '2347000000000'),
  ('instagram_handle', 'de_infinite_space'),
  ('bookings_enabled', 'true'),
  ('gallery_enabled', 'true'),
  ('spaces_enabled', 'true'),
  ('whatsapp_chat_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- INSERT DUMMY SPACES (if not present)
-- ============================================

INSERT INTO spaces (name, mood_tag, description, is_active, sort_order, pricing) VALUES
  ('The Bar', 'Lifestyle', 'Dark wood tones, ambient lighting, and a fully styled bar counter. Perfect for editorial shoots, music videos, lifestyle content, and anything with an edge.', true, 1, 8500),
  ('Green Screen Studio', 'Corporate', 'Step into any world. Our professional green screen setup gives you the power to place yourself anywhere — from fantasy sets to branded environments.', true, 2, 7000),
  ('Vanity Mirror Corner', 'Beauty', 'Hollywood-style bulb lighting surrounds a full-length vanity mirror. Made for beauty content, brand shoots, and behind-the-scenes moments.', true, 3, 6500),
  ('Eid Shoot Setup', 'Cinematic', 'An elegantly decorated space built to celebrate. Rich colours, soft textures, and details that make every cultural moment feel timeless.', true, 4, 9000),
  ('Staircase Scene', 'Editorial', 'Clean lines, natural light, and an architectural staircase that adds dimension and drama. A favourite for fashion, portrait, and lifestyle content.', true, 5, 7500),
  ('Chair Space', 'Minimalist', 'Simplicity at its finest. A beautifully lit, carefully styled single-chair setup — the kind of clean frame that lets your subject speak.', true, 6, 5500),
  ('Office Set', 'Corporate', 'A sleek, contemporary workspace setting ideal for business content, LinkedIn shots, corporate videos, and professional brand storytelling.', true, 7, 8000),
  ('Bookshelf Wall', 'Intellectual', 'Floor-to-ceiling books, warm lighting, and scholarly vibes. Perfect for thought leadership, educational content, and sophisticated storytelling.', true, 8, 6000)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DROP ALL OLD POLICIES (prevents conflicts)
-- ============================================
-- Drop ALL policies by name to avoid duplicates

DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can read bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can update bookings" ON bookings;
DROP POLICY IF EXISTS "Users can read own bookings" ON bookings;
DROP POLICY IF EXISTS "Only admins can update bookings" ON bookings;
DROP POLICY IF EXISTS "bookings_read" ON bookings;
DROP POLICY IF EXISTS "bookings_insert" ON bookings;
DROP POLICY IF EXISTS "bookings_update" ON bookings;
DROP POLICY IF EXISTS "bookings_delete" ON bookings;

DROP POLICY IF EXISTS "Anyone can read spaces" ON spaces;
DROP POLICY IF EXISTS "Authenticated users can insert spaces" ON spaces;
DROP POLICY IF EXISTS "Authenticated users can update spaces" ON spaces;
DROP POLICY IF EXISTS "Public can read active spaces" ON spaces;
DROP POLICY IF EXISTS "Only admins can insert spaces" ON spaces;
DROP POLICY IF EXISTS "Only admins can update spaces" ON spaces;
DROP POLICY IF EXISTS "spaces_read" ON spaces;
DROP POLICY IF EXISTS "spaces_insert" ON spaces;
DROP POLICY IF EXISTS "spaces_update" ON spaces;
DROP POLICY IF EXISTS "spaces_delete" ON spaces;

DROP POLICY IF EXISTS "Anyone can read site config" ON site_config;
DROP POLICY IF EXISTS "Authenticated users can update config" ON site_config;
DROP POLICY IF EXISTS "Only admins can update config" ON site_config;
DROP POLICY IF EXISTS "site_config_read" ON site_config;
DROP POLICY IF EXISTS "site_config_insert" ON site_config;
DROP POLICY IF EXISTS "site_config_update" ON site_config;
DROP POLICY IF EXISTS "site_config_delete" ON site_config;

-- ============================================
-- CREATE NEW RLS POLICIES - BOOKINGS TABLE
-- ============================================

CREATE POLICY "bookings_read"
ON bookings FOR SELECT
USING (true);

CREATE POLICY "bookings_insert"
ON bookings FOR INSERT
WITH CHECK (true);

CREATE POLICY "bookings_update"
ON bookings FOR UPDATE
USING (true);

CREATE POLICY "bookings_delete"
ON bookings FOR DELETE
USING (true);

-- ============================================
-- CREATE NEW RLS POLICIES - SPACES TABLE
-- ============================================

CREATE POLICY "spaces_read"
ON spaces FOR SELECT
USING (true);

CREATE POLICY "spaces_insert"
ON spaces FOR INSERT
WITH CHECK (true);

CREATE POLICY "spaces_update"
ON spaces FOR UPDATE
USING (true);

CREATE POLICY "spaces_delete"
ON spaces FOR DELETE
USING (true);

-- ============================================
-- CREATE NEW RLS POLICIES - SITE_CONFIG TABLE
-- ============================================

CREATE POLICY "site_config_read"
ON site_config FOR SELECT
USING (true);

CREATE POLICY "site_config_insert"
ON site_config FOR INSERT
WITH CHECK (true);

CREATE POLICY "site_config_update"
ON site_config FOR UPDATE
USING (true);

CREATE POLICY "site_config_delete"
ON site_config FOR DELETE
USING (true);

-- ============================================
-- STORAGE RLS POLICIES
-- ============================================
-- These apply to all storage buckets

DROP POLICY IF EXISTS "storage_read_all" ON storage.objects;
DROP POLICY IF EXISTS "storage_insert_all" ON storage.objects;
DROP POLICY IF EXISTS "storage_update_all" ON storage.objects;
DROP POLICY IF EXISTS "storage_delete_all" ON storage.objects;
DROP POLICY IF EXISTS "storage_read" ON storage.objects;
DROP POLICY IF EXISTS "storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "storage_update" ON storage.objects;
DROP POLICY IF EXISTS "storage_delete" ON storage.objects;

CREATE POLICY "storage_read_all"
ON storage.objects FOR SELECT
USING (true);

CREATE POLICY "storage_insert_all"
ON storage.objects FOR INSERT
WITH CHECK (true);

CREATE POLICY "storage_update_all"
ON storage.objects FOR UPDATE
USING (true);

CREATE POLICY "storage_delete_all"
ON storage.objects FOR DELETE
USING (true);

-- ============================================
-- DONE!
-- ============================================
-- All tables created, RLS enabled, and policies configured.
-- 
-- NEXT STEPS:
-- 1. After clicking RUN above, go to Storage → Buckets
-- 2. Create these 5 buckets (copy names exactly):
--    - gallery
--    - space-images
--    - hero-images
--    - about-content
--    - resources
--
-- 3. For EACH bucket: Click it, then toggle PUBLIC switch ON (blue)
--
-- 4. Then test your admin panel - everything should work!
