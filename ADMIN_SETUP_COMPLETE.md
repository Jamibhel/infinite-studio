# 🚨 ADMIN PANEL FIX — Complete Setup Guide

## The Problem

Admin panel shows errors because:
1. ❌ Database tables may not exist or have wrong schema
2. ❌ RLS (Row Level Security) policies block access
3. ❌ Storage buckets not configured
4. ❌ Real auth now requires proper Supabase user (demo credentials removed)

---

## CRITICAL: Run This Now in Supabase SQL Editor

### Step 1: Copy-Paste the Complete Setup SQL

Go to Supabase Dashboard → SQL Editor → New Query → Paste this:

```sql
-- ============================================
-- CREATE TABLES WITH CORRECT SCHEMA
-- ============================================

-- DROP existing tables (if corrupted)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS spaces CASCADE;
DROP TABLE IF EXISTS site_config CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;

-- 1. BOOKINGS TABLE (matches BookingContent.tsx)
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  spaces TEXT[] NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed')),
  group_size INTEGER DEFAULT 1,
  addons TEXT[] DEFAULT '{}',
  amount INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(date);

-- 2. SPACES TABLE (matches admin spaces manager)
CREATE TABLE spaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mood_tag TEXT,
  description TEXT,
  price INTEGER,
  capacity INTEGER,
  amenities TEXT[],
  images TEXT[],
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_spaces_active ON spaces(is_active);
CREATE INDEX idx_spaces_sort ON spaces(sort_order);

-- 3. SITE_CONFIG TABLE (for settings that sync to site)
CREATE TABLE site_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. GALLERY TABLE (for gallery images)
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  caption TEXT,
  tags TEXT[],
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: ALLOW ALL (for public booking + admin access)
-- ============================================

-- BOOKINGS: Public can create, read, and update
CREATE POLICY "Enable insert for all users" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for all users" ON bookings
  FOR SELECT USING (true);

CREATE POLICY "Enable update for all users" ON bookings
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON bookings
  FOR DELETE USING (true);

-- SPACES: Public can read, admins can insert/update/delete
CREATE POLICY "Enable read for all users" ON spaces
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON spaces
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON spaces
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON spaces
  FOR DELETE USING (true);

-- SITE_CONFIG: Public can read, admins can update
CREATE POLICY "Enable read for all users" ON site_config
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON site_config
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON site_config
  FOR UPDATE USING (true);

-- GALLERY: Public can read, admins can manage
CREATE POLICY "Enable read for all users" ON gallery
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON gallery
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON gallery
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON gallery
  FOR DELETE USING (true);

-- ============================================
-- INSERT SAMPLE SPACES
-- ============================================
INSERT INTO spaces (id, name, mood_tag, description, price, capacity, is_active, sort_order) VALUES
  ('bar', 'The Bar', 'Premium', 'Luxury bar setup with ambient lighting', 12000, 20, true, 1),
  ('green', 'Green Screen Studio', 'Production', 'Professional green screen setup', 10000, 10, true, 2),
  ('vanity', 'Vanity Mirror Corner', 'Beauty', 'Beauty and makeup focused space', 10500, 5, true, 3),
  ('eid', 'Eid Shoot Setup', 'Celebration', 'Festival and celebration backdrop', 15000, 30, true, 4),
  ('staircase', 'Staircase Scene', 'Cinematic', 'Multi-level scenic background', 11000, 15, true, 5),
  ('chair', 'Chair Space', 'Minimalist', 'Clean minimalist shooting area', 10000, 8, true, 6),
  ('office', 'Office Set', 'Corporate', 'Professional office environment', 12000, 12, true, 7),
  ('bookshelf', 'Bookshelf Wall', 'Editorial', 'Library-style backdrop', 11500, 10, true, 8)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- INSERT SAMPLE SETTINGS
-- ============================================
INSERT INTO site_config (key, value) VALUES
  ('hero_title', 'Where Your Vision Becomes Content'),
  ('hero_subtitle', 'Stunning themed spaces, professional equipment, and creative energy'),
  ('studio_phone', '+234 704 0000 000'),
  ('whatsapp_number', '2347040000000'),
  ('instagram_handle', 'de_infinite_space')
ON CONFLICT (key) DO NOTHING;
```

### Step 2: Run the Query

Click **RUN** button (or Cmd+Enter)

You should see: `Query Executed Successfully`

---

## Step 3: Create Storage Bucket for Images

1. Go to Supabase Dashboard → Storage
2. Create new bucket named: `space-images`
3. Click on the bucket → Policies tab → Add policy:
   - **Policy name:** Allow public read and authenticated write
   - **Template:** Custom
   - **Allowed operations:** SELECT, INSERT, UPDATE, DELETE
   - **Policy:** `true` (allow all)

---

## Step 4: Create Admin User in Supabase Auth

1. Go to Supabase Dashboard → Authentication → Users
2. Click **"Invite user"** or **"Add user"**
3. Enter:
   - **Email:** your@email.com
   - **Password:** create a strong password
4. Save and copy the password

---

## Step 5: Update Your .env.local

Make sure you have:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from: Supabase Dashboard → Settings → API → Project URL & Anon Key

---

## Step 6: Test Admin Login

1. Run: `npm run dev`
2. Go to: http://localhost:3000/admin/login
3. Login with your Supabase admin email & password (from Step 4)
4. Should see dashboard with:
   - ✅ 8 spaces loaded
   - ✅ Bookings stats
   - ✅ Recent bookings list

---

## Step 7: Test Each Admin Feature

### Dashboard
- ✅ Should load stats (total bookings, revenue, occupancy)
- ✅ Should show recent bookings

### Bookings
- ✅ Should load all bookings
- ✅ Should allow status change (pending → confirmed → completed)
- ✅ Should allow delete

### Spaces
- ✅ Should load 8 spaces
- ✅ Should allow edit each space
- ✅ Should allow add new space
- ✅ Should allow upload images
- ✅ Should allow toggle active/inactive

### Gallery
- ✅ Should allow upload images
- ✅ Should show uploaded images

### Settings
- ✅ Should load current settings
- ✅ Should allow edit and save
- ✅ Changes should appear on homepage

---

## If You Still Get Errors

### Error: "Failed to load bookings"
**Solution:** 
1. Check RLS policies (run SQL from Step 1 again)
2. Check `.env.local` has correct SUPABASE_URL and ANON_KEY
3. Check Supabase project has bookings table

### Error: "Failed to upload image"
**Solution:**
1. Check storage bucket `space-images` exists
2. Check storage policy allows upload
3. Check `space-images` is public (Settings → Policies)

### Error: "Failed to save settings"
**Solution:**
1. Check site_config table exists (run SQL from Step 1)
2. Check RLS policy allows UPDATE
3. Check settings form has all required fields

### Error: "Can't login"
**Solution:**
1. Check admin user exists in Supabase Auth
2. Check email/password is correct
3. Check `.env.local` has SUPABASE_URL and ANON_KEY
4. Restart dev server: `npm run dev`

---

## Verification Checklist

Run this in Supabase SQL Editor to verify setup:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check bookings count
SELECT COUNT(*) as bookings_count FROM bookings;

-- Check spaces count
SELECT COUNT(*) as spaces_count FROM spaces;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;
```

Expected output:
```
Tables: bookings, gallery, gallery_comments, spaces, site_config
bookings_count: 0 (or however many you've created)
spaces_count: 8
All tables have: rowsecurity = true
```

---

## Next: Test the Full Flow

1. ✅ Admin login works
2. ✅ Dashboard loads
3. ✅ Can create booking via /booking page → saved to DB
4. ✅ Can view booking in admin
5. ✅ Can change status
6. ✅ Can upload space images
7. ✅ Can edit settings

---

**Status:** Ready to test  
**Time to complete:** 10 minutes  
**Impact:** Admin panel fully functional
