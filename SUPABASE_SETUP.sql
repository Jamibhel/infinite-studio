-- Infinite Studio Database Setup
-- Copy and paste into Supabase SQL Editor to create all tables

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
-- 6. INSERT SAMPLE DATA (OPTIONAL)
-- ============================================

-- Insert all 8 spaces
INSERT INTO spaces (name, mood_tag, description, sort_order, is_active) VALUES
  ('The Bar', 'Dramatic · Moody', 'Dark wood tones, ambient lighting, and a fully styled bar counter. Perfect for editorial shoots, music videos, lifestyle content, and anything with an edge.', 1, true),
  ('Green Screen Studio', 'Versatile · Limitless', 'Step into any world. Our professional green screen setup gives you the power to place yourself anywhere — from fantasy sets to branded environments.', 2, true),
  ('Vanity Mirror Corner', 'Glam · Editorial', 'Hollywood-style bulb lighting surrounds a full-length vanity mirror. Made for beauty content, brand shoots, and behind-the-scenes moments that feel like a magazine cover.', 3, true),
  ('Eid Shoot Setup', 'Festive · Cultural', 'An elegantly decorated space built to celebrate. Rich colours, soft textures, and details that make every cultural moment feel timeless.', 4, true),
  ('Staircase Scene', 'Architectural · Bold', 'Clean lines, natural light, and an architectural staircase that adds dimension and drama to any frame. A favourite for fashion, portrait, and lifestyle content.', 5, true),
  ('Chair Space', 'Minimal · Refined', 'Simplicity at its finest. A beautifully lit, carefully styled single-chair setup — the kind of clean frame that lets your subject, your product, or your brand speak loudly.', 6, true),
  ('Office Set', 'Professional · Corporate', 'A sleek, contemporary workspace setting ideal for business content, LinkedIn shots, corporate videos, and professional brand storytelling.', 7, true),
  ('Bookshelf Wall', 'Intellectual · Warm', 'Floor-to-ceiling shelves, warm tones, and the kind of atmosphere that says "authoritative but approachable." Perfect for podcasts, thought leadership content, and lifestyle reels.', 8, true);

-- Insert sample booking (optional)
INSERT INTO bookings (name, email, phone, spaces, preferred_date, preferred_time, group_size, notes, status) VALUES
  ('Olufunke Adeyemi', 'funke@example.com', '+234 701 234 5678', ARRAY['The Bar', 'Staircase'], CURRENT_DATE + INTERVAL '7 days', '14:00', 3, 'Fashion photoshoot for blog launch', 'pending');

-- ============================================
-- 7. HELPFUL QUERIES
-- ============================================

-- View all bookings
-- SELECT * FROM bookings ORDER BY created_at DESC;

-- View all active spaces
-- SELECT * FROM spaces WHERE is_active = true ORDER BY sort_order;

-- Get site configuration
-- SELECT key, value FROM site_config;

-- Count pending bookings
-- SELECT COUNT(*) as pending_count FROM bookings WHERE status = 'pending';

-- ============================================
-- 8. STORAGE BUCKET SETUP - RLS POLICIES
-- ============================================
-- Go to Storage in Supabase Console
-- 1. Create new bucket named: space-images
-- 2. Set as Public
-- 3. Run the RLS policies below in SQL Editor

-- Drop existing policies if any exist
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete" ON storage.objects;
DROP POLICY IF EXISTS "Public read" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete" ON storage.objects;

-- Enable RLS on storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anyone to READ images from space-images bucket
CREATE POLICY "Public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'space-images');

-- Policy 2: Allow anyone to UPLOAD to space-images bucket (for demo)
CREATE POLICY "Anyone can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'space-images');

-- Policy 3: Allow anyone to DELETE from space-images bucket (for demo)
CREATE POLICY "Anyone can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'space-images');

-- ============================================
-- DONE! Your database and storage are ready to use.
-- ============================================
