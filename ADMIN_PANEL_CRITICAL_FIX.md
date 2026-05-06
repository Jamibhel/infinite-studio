# 🚨 ADMIN PANEL - CRITICAL ISSUES & FIXES

**Date:** May 6, 2026  
**Status:** 🔴 Multiple Issues Detected  
**Priority:** URGENT - Requires Supabase Setup  

---

## 🔴 Issues Identified

### 1. Failed to Load Dashboard Data
- **Cause:** `bookings` table doesn't exist OR RLS policies blocking access
- **Impact:** Dashboard shows error, no stats display

### 2. Failed to Load Bookings
- **Cause:** Same as above
- **Impact:** Bookings page blank with error

### 3. Failed to Update Spaces
- **Cause:** `spaces` table doesn't exist OR no DELETE policy
- **Impact:** Can't modify or delete spaces

### 4. Failed to Upload Images (Gallery, Spaces, Settings)
- **Cause:** Storage buckets not created OR RLS policies blocking uploads
- **Impact:** No images can be uploaded anywhere

### 5. Failed to Save Settings
- **Cause:** `site_config` table doesn't exist OR RLS policies blocking updates
- **Impact:** Settings changes don't persist

### 6. Add Space Button Not Working
- **Cause:** Missing INSERT policy OR table doesn't exist

### 7. No Way to Delete Spaces
- **Cause:** Missing DELETE policy in RLS

---

## ✅ Complete Fix (Step-by-Step)

### STEP 1: Create All Database Tables

1. Go to **Supabase Dashboard** → Your Project
2. Click **SQL Editor** (left sidebar)
3. Click **"+ New query"**
4. Paste this SQL and run it:

```sql
-- ============================================
-- CREATE ALL REQUIRED TABLES
-- ============================================

-- 1. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  spaces TEXT[] NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TIME,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed')),
  group_size INT DEFAULT 1,
  notes TEXT,
  amount NUMERIC DEFAULT 0
);

-- 2. SPACES TABLE
CREATE TABLE IF NOT EXISTS spaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  name TEXT NOT NULL,
  mood_tag TEXT,
  description TEXT,
  cover_image_url TEXT,
  gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  price NUMERIC,
  capacity INT,
  amenities TEXT[]
);

-- 3. SITE CONFIG TABLE
CREATE TABLE IF NOT EXISTS site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. INSERT DEFAULT SITE CONFIG
INSERT INTO site_config (key, value) VALUES
  ('marquee_text', 'Editorial · Cinematic · Lifestyle · Corporate'),
  ('studio_name', 'Infinite Studio'),
  ('studio_description', 'Premium photography & videography studio'),
  ('phone', '+234 700 0000 000'),
  ('email', 'hello@infinitestudio.com'),
  ('website', 'infinitestudio.com'),
  ('instagram', '@infinitestudio'),
  ('hero_title', 'Your Vision, Our Expertise'),
  ('hero_subtitle', 'Professional photography & videography services'),
  ('light_bg', '#d6d3c3'),
  ('dark_bg', '#2D1B2E'),
  ('primary_cta', '#C4623A'),
  ('admin_username', 'admin'),
  ('logo_url', ''),
  ('favicon_url', '')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
```

✅ Click **Run** button

---

### STEP 2: Set Up RLS Policies for Tables

In the same SQL Editor, create new query and paste:

```sql
-- ============================================
-- ROW LEVEL SECURITY POLICIES - TABLES
-- ============================================

-- BOOKINGS: Anyone can create/read/update
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can read bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can update bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can delete bookings" ON bookings;

CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Anyone can update bookings" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete bookings" ON bookings FOR DELETE USING (true);

-- SPACES: Anyone can create/read/update/delete
DROP POLICY IF EXISTS "Anyone can read spaces" ON spaces;
DROP POLICY IF EXISTS "Anyone can create spaces" ON spaces;
DROP POLICY IF EXISTS "Anyone can update spaces" ON spaces;
DROP POLICY IF EXISTS "Anyone can delete spaces" ON spaces;

CREATE POLICY "Anyone can read spaces" ON spaces FOR SELECT USING (true);
CREATE POLICY "Anyone can create spaces" ON spaces FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update spaces" ON spaces FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete spaces" ON spaces FOR DELETE USING (true);

-- SITE CONFIG: Anyone can read, authenticated can update
DROP POLICY IF EXISTS "Public read config" ON site_config;
DROP POLICY IF EXISTS "Anyone can update config" ON site_config;
DROP POLICY IF EXISTS "Anyone can insert config" ON site_config;

CREATE POLICY "Public read config" ON site_config FOR SELECT USING (true);
CREATE POLICY "Anyone can update config" ON site_config FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert config" ON site_config FOR INSERT WITH CHECK (true);
```

✅ Click **Run** button

---

### STEP 3: Create Storage Buckets

1. In Supabase, click **Storage** (left sidebar)
2. Click **"+ New bucket"** for each:

**Bucket 1: gallery**
- Name: `gallery`
- Make Public ✅ (toggle ON)
- Click **Create bucket**

**Bucket 2: space-images**
- Name: `space-images`
- Make Public ✅ (toggle ON)
- Click **Create bucket**

**Bucket 3: hero-images**
- Name: `hero-images`
- Make Public ✅ (toggle ON)
- Click **Create bucket**

**Bucket 4: about-content**
- Name: `about-content`
- Make Public ✅ (toggle ON)
- Click **Create bucket**

**Bucket 5: resources**
- Name: `resources`
- Make Public ✅ (toggle ON)
- Click **Create bucket**

---

### STEP 4: Set Up Storage RLS Policies

In SQL Editor, create new query:

```sql
-- ============================================
-- STORAGE RLS POLICIES - ALL BUCKETS
-- ============================================

-- Drop existing storage policies
DROP POLICY IF EXISTS "Public read gallery" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload gallery" ON storage.objects;
DROP POLICY IF EXISTS "Public read space-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload space-images" ON storage.objects;
DROP POLICY IF EXISTS "Public read hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Public read about-content" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload about-content" ON storage.objects;
DROP POLICY IF EXISTS "Public read resources" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload resources" ON storage.objects;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- GALLERY BUCKET
CREATE POLICY "Public read gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Authenticated upload gallery" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "Authenticated delete gallery" ON storage.objects FOR DELETE USING (bucket_id = 'gallery');

-- SPACE-IMAGES BUCKET
CREATE POLICY "Public read space-images" ON storage.objects FOR SELECT USING (bucket_id = 'space-images');
CREATE POLICY "Authenticated upload space-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'space-images');
CREATE POLICY "Authenticated delete space-images" ON storage.objects FOR DELETE USING (bucket_id = 'space-images');

-- HERO-IMAGES BUCKET
CREATE POLICY "Public read hero-images" ON storage.objects FOR SELECT USING (bucket_id = 'hero-images');
CREATE POLICY "Authenticated upload hero-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hero-images');
CREATE POLICY "Authenticated delete hero-images" ON storage.objects FOR DELETE USING (bucket_id = 'hero-images');

-- ABOUT-CONTENT BUCKET
CREATE POLICY "Public read about-content" ON storage.objects FOR SELECT USING (bucket_id = 'about-content');
CREATE POLICY "Authenticated upload about-content" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'about-content');
CREATE POLICY "Authenticated delete about-content" ON storage.objects FOR DELETE USING (bucket_id = 'about-content');

-- RESOURCES BUCKET
CREATE POLICY "Public read resources" ON storage.objects FOR SELECT USING (bucket_id = 'resources');
CREATE POLICY "Authenticated upload resources" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resources');
CREATE POLICY "Authenticated delete resources" ON storage.objects FOR DELETE USING (bucket_id = 'resources');
```

✅ Click **Run** button

---

## 🧪 Test Everything After Setup

### Test 1: Dashboard
```
1. Go to http://localhost:3000/admin
2. Should show stats (not "failed to load")
```

### Test 2: Bookings
```
1. Go to http://localhost:3000/admin/bookings
2. Should load (even if empty, no error)
```

### Test 3: Spaces
```
1. Go to http://localhost:3000/admin/spaces
2. Click "+ Add Space" button
3. Fill in name, description, etc.
4. Click Save
5. Space should appear in list
6. Click Delete icon - space should be removed
```

### Test 4: Gallery
```
1. Go to http://localhost:3000/admin/gallery
2. Select "gallery" bucket
3. Try uploading an image
4. Should appear in grid
5. Try deleting - should work
```

### Test 5: Settings
```
1. Go to http://localhost:3000/admin/settings
2. Go to any tab (General, Hero, etc.)
3. Make a change
4. Click "Save All Changes"
5. Refresh page - should still be there
```

---

## 🔍 Troubleshooting

### If Dashboard Still Shows Error:
1. Verify `bookings` table exists:
   ```sql
   SELECT * FROM information_schema.tables WHERE table_name='bookings';
   ```
2. Verify policies exist:
   ```sql
   SELECT * FROM pg_policies WHERE tablename='bookings';
   ```

### If Upload Still Fails:
1. Verify buckets exist in Storage tab
2. Verify buckets are PUBLIC (🔓 not 🔒)
3. Verify RLS policies are set

### If Save Settings Fails:
1. Verify `site_config` table exists
2. Check that at least one row exists with INSERT

### If Add/Delete Space Fails:
1. Verify `spaces` table exists
2. Verify CREATE, UPDATE, DELETE policies exist
3. Check browser console for specific error

---

## 📋 Quick Checklist

After completing all steps, verify:

- [ ] Supabase tables created (bookings, spaces, site_config)
- [ ] RLS policies set for tables
- [ ] 5 storage buckets created
- [ ] Buckets are PUBLIC
- [ ] Storage RLS policies set
- [ ] Dashboard loads without errors
- [ ] Bookings page loads
- [ ] Can add/delete spaces
- [ ] Can upload images to gallery
- [ ] Can save settings
- [ ] Settings persist after refresh

---

## 🚀 After Fixes

Once all setup complete:

1. Run dev server: `npm run dev`
2. Test each admin page
3. Try creating, updating, deleting data
4. Try uploading images
5. All should work!

**If still issues, run these diagnostic queries:**

```sql
-- Check tables exist
SELECT * FROM information_schema.tables WHERE table_name IN ('bookings', 'spaces', 'site_config');

-- Check RLS enabled
SELECT * FROM pg_class WHERE relname IN ('bookings', 'spaces', 'site_config');

-- Check policies
SELECT * FROM pg_policies WHERE tablename IN ('bookings', 'spaces', 'site_config');

-- Check buckets
SELECT * FROM storage.buckets;
```

---

**Status: CRITICAL - DO NOT SKIP THESE STEPS!**  
Your admin panel is built perfectly - it just needs the database to be set up! 🔧
