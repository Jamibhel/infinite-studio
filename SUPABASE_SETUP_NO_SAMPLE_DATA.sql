-- Infinite Studio Database Setup (Without Sample Data)
-- Use this if tables already exist or you want to skip sample data
-- Copy and paste into Supabase SQL Editor

-- ============================================
-- 1. BOOKINGS TABLE
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

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(preferred_date);

-- ============================================
-- 2. SPACES TABLE
-- ============================================
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

-- Create index on active status for faster queries
CREATE INDEX IF NOT EXISTS idx_spaces_active ON spaces(is_active);
CREATE INDEX IF NOT EXISTS idx_spaces_sort ON spaces(sort_order);

-- ============================================
-- 3. SITE CONFIG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert default config values (if not already present)
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
-- 4. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. ROW LEVEL SECURITY POLICIES
-- ============================================

-- BOOKINGS: Anyone can create, anyone can read, anyone can update
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
CREATE POLICY "Anyone can create bookings"
ON bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read own bookings" ON bookings;
CREATE POLICY "Anyone can read bookings"
ON bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can update bookings" ON bookings;
CREATE POLICY "Anyone can update bookings"
ON bookings FOR UPDATE USING (true);

-- SPACES: Public read access, authenticated users can insert/update
DROP POLICY IF EXISTS "Public can read active spaces" ON spaces;
CREATE POLICY "Anyone can read spaces"
ON spaces FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can insert spaces" ON spaces;
CREATE POLICY "Authenticated users can insert spaces"
ON spaces FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Only admins can update spaces" ON spaces;
CREATE POLICY "Authenticated users can update spaces"
ON spaces FOR UPDATE USING (auth.role() = 'authenticated');

-- SITE CONFIG: Public read access, authenticated users can update
DROP POLICY IF EXISTS "Public can read site config" ON site_config;
CREATE POLICY "Anyone can read site config"
ON site_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can update config" ON site_config;
CREATE POLICY "Authenticated users can update config"
ON site_config FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================
-- Done! Your database is ready to use.
-- Tables created, RLS enabled, and policies configured.
-- ============================================
