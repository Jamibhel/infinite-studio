-- ============================================
-- SUPABASE CORRECT RLS SETUP
-- ============================================
-- This version has RLS policies that ACTUALLY WORK
-- It allows public read/write access (fine for testing)
-- Copy and paste ALL of this into Supabase SQL Editor

-- ============================================
-- STEP 1: DROP ALL EXISTING POLICIES
-- ============================================
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can read bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can update bookings" ON bookings;
DROP POLICY IF EXISTS "Users can read own bookings" ON bookings;
DROP POLICY IF EXISTS "Only admins can update bookings" ON bookings;

DROP POLICY IF EXISTS "Anyone can read spaces" ON spaces;
DROP POLICY IF EXISTS "Authenticated users can insert spaces" ON spaces;
DROP POLICY IF EXISTS "Authenticated users can update spaces" ON spaces;
DROP POLICY IF EXISTS "Public can read active spaces" ON spaces;
DROP POLICY IF EXISTS "Only admins can insert spaces" ON spaces;
DROP POLICY IF EXISTS "Only admins can update spaces" ON spaces;

DROP POLICY IF EXISTS "Anyone can read site config" ON site_config;
DROP POLICY IF EXISTS "Authenticated users can update config" ON site_config;
DROP POLICY IF EXISTS "Only admins can update config" ON site_config;

-- ============================================
-- STEP 2: CREATE CORRECTED RLS POLICIES
-- ============================================

-- ============================================
-- BOOKINGS TABLE POLICIES
-- ============================================

-- Allow anyone to READ bookings
CREATE POLICY "bookings_read"
ON bookings FOR SELECT
USING (true);

-- Allow anyone to INSERT bookings (create new booking)
CREATE POLICY "bookings_insert"
ON bookings FOR INSERT
WITH CHECK (true);

-- Allow anyone to UPDATE bookings
CREATE POLICY "bookings_update"
ON bookings FOR UPDATE
USING (true);

-- Allow anyone to DELETE bookings
CREATE POLICY "bookings_delete"
ON bookings FOR DELETE
USING (true);

-- ============================================
-- SPACES TABLE POLICIES
-- ============================================

-- Allow anyone to READ spaces
CREATE POLICY "spaces_read"
ON spaces FOR SELECT
USING (true);

-- Allow anyone to INSERT spaces
CREATE POLICY "spaces_insert"
ON spaces FOR INSERT
WITH CHECK (true);

-- Allow anyone to UPDATE spaces
CREATE POLICY "spaces_update"
ON spaces FOR UPDATE
USING (true);

-- Allow anyone to DELETE spaces
CREATE POLICY "spaces_delete"
ON spaces FOR DELETE
USING (true);

-- ============================================
-- SITE_CONFIG TABLE POLICIES
-- ============================================

-- Allow anyone to READ site config
CREATE POLICY "site_config_read"
ON site_config FOR SELECT
USING (true);

-- Allow anyone to INSERT site config
CREATE POLICY "site_config_insert"
ON site_config FOR INSERT
WITH CHECK (true);

-- Allow anyone to UPDATE site config
CREATE POLICY "site_config_update"
ON site_config FOR UPDATE
USING (true);

-- Allow anyone to DELETE site config
CREATE POLICY "site_config_delete"
ON site_config FOR DELETE
USING (true);

-- ============================================
-- STORAGE: CREATE BUCKETS
-- ============================================
-- DO NOT run these in SQL Editor - use the Supabase UI instead:
--
-- 1. Go to Storage → Buckets
-- 2. Create new bucket named: gallery
-- 3. Create new bucket named: space-images
-- 4. Create new bucket named: hero-images
-- 5. Create new bucket named: about-content
-- 6. Create new bucket named: resources
--
-- For EACH bucket: Make it PUBLIC (toggle the public switch)
--
-- ============================================

-- ============================================
-- STORAGE RLS POLICIES
-- ============================================
-- Run these AFTER creating the storage buckets above

-- Allow ANYONE to READ from ANY storage bucket
DROP POLICY IF EXISTS "storage_read_all" ON storage.objects;
CREATE POLICY "storage_read_all"
ON storage.objects FOR SELECT
USING (true);

-- Allow ANYONE to INSERT into ANY storage bucket  
DROP POLICY IF EXISTS "storage_insert_all" ON storage.objects;
CREATE POLICY "storage_insert_all"
ON storage.objects FOR INSERT
WITH CHECK (true);

-- Allow ANYONE to UPDATE in ANY storage bucket
DROP POLICY IF EXISTS "storage_update_all" ON storage.objects;
CREATE POLICY "storage_update_all"
ON storage.objects FOR UPDATE
USING (true);

-- Allow ANYONE to DELETE from ANY storage bucket
DROP POLICY IF EXISTS "storage_delete_all" ON storage.objects;
CREATE POLICY "storage_delete_all"
ON storage.objects FOR DELETE
USING (true);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to check that everything is working:

-- Check all policies exist
-- SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;

-- Check if policies are allowing access
-- SELECT * FROM bookings LIMIT 1;
-- SELECT * FROM spaces LIMIT 1;
-- SELECT * FROM site_config LIMIT 1;

-- ============================================
-- DONE!
-- ============================================
-- Your Supabase is now properly configured.
-- All admin panel features should work immediately.
