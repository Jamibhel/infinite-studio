-- Verify Supabase Setup is Complete
-- Run these queries to check what's already configured

-- ============================================
-- CHECK 1: Tables Exist?
-- ============================================
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('bookings', 'spaces', 'site_config')
ORDER BY table_name;

-- ============================================
-- CHECK 2: RLS Enabled?
-- ============================================
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('bookings', 'spaces', 'site_config');

-- ============================================
-- CHECK 3: Policies Configured?
-- ============================================
SELECT * FROM pg_policies 
WHERE schemaname = 'public';

-- ============================================
-- CHECK 4: Spaces Data Already Exists?
-- ============================================
SELECT COUNT(*) as spaces_count, array_agg(name) as space_names 
FROM spaces;

-- ============================================
-- CHECK 5: Config Data Exists?
-- ============================================
SELECT COUNT(*) as config_count 
FROM site_config;

-- If everything shows data already exists, your setup is COMPLETE ✅
-- You can skip the sample data insertion and start using the admin panel!
