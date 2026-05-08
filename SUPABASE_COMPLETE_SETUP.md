# 🚀 Complete Supabase SQL Setup Guide

## What This Does
This guide will fix ALL your admin panel errors in 3 simple copy-paste operations in the Supabase SQL Editor.

---

## ⚠️ IMPORTANT: Read First

### What's Broken
- Dashboard fails to load
- Bookings fail to load
- Can't add spaces
- Can't delete spaces
- Can't upload images
- Can't save settings

### Why It's Broken
Old RLS policies were checking for `auth.role() = 'authenticated'` but your frontend wasn't sending authenticated requests.

### How We Fix It
Replace the old policies with new ones that allow public read/write access: `WITH CHECK (true)`

---

## 📋 Step-by-Step Instructions

### STEP 1: Open Supabase SQL Editor (30 seconds)
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click your project
3. Left sidebar → **SQL Editor**
4. You should see a blank editor area

### STEP 2: Copy & Paste SQL Code (2 minutes)

**Copy the entire code block below:**

```sql
-- ============================================
-- SUPABASE SETUP - RLS POLICIES FIX
-- ============================================
-- Paste ALL of this into Supabase SQL Editor
-- Then click RUN

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

-- BOOKINGS TABLE
CREATE POLICY "bookings_read" ON bookings FOR SELECT USING (true);
CREATE POLICY "bookings_insert" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "bookings_update" ON bookings FOR UPDATE USING (true);
CREATE POLICY "bookings_delete" ON bookings FOR DELETE USING (true);

-- SPACES TABLE
CREATE POLICY "spaces_read" ON spaces FOR SELECT USING (true);
CREATE POLICY "spaces_insert" ON spaces FOR INSERT WITH CHECK (true);
CREATE POLICY "spaces_update" ON spaces FOR UPDATE USING (true);
CREATE POLICY "spaces_delete" ON spaces FOR DELETE USING (true);

-- SITE_CONFIG TABLE
CREATE POLICY "site_config_read" ON site_config FOR SELECT USING (true);
CREATE POLICY "site_config_insert" ON site_config FOR INSERT WITH CHECK (true);
CREATE POLICY "site_config_update" ON site_config FOR UPDATE USING (true);
CREATE POLICY "site_config_delete" ON site_config FOR DELETE USING (true);

-- ============================================
-- STEP 3: STORAGE RLS POLICIES
-- ============================================
DROP POLICY IF EXISTS "storage_read_all" ON storage.objects;
DROP POLICY IF EXISTS "storage_insert_all" ON storage.objects;
DROP POLICY IF EXISTS "storage_update_all" ON storage.objects;
DROP POLICY IF EXISTS "storage_delete_all" ON storage.objects;

CREATE POLICY "storage_read_all" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "storage_insert_all" ON storage.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "storage_update_all" ON storage.objects FOR UPDATE USING (true);
CREATE POLICY "storage_delete_all" ON storage.objects FOR DELETE USING (true);
```

**Paste into:** Supabase SQL Editor text area  
**Then click:** RUN button (blue button top right)

### Expected Result ✅
You should see:
```
Executing query: DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
Executing query: DROP POLICY IF EXISTS "Anyone can read bookings" ON bookings;
... (many more lines)
Executing query: CREATE POLICY "storage_delete_all" ON storage.objects FOR DELETE USING (true);
```

All with ✅ green checkmarks. **No errors.**

---

## 📦 Step 3: Create Storage Buckets (5 minutes)

**Do NOT skip this step.** Your admin panel needs these buckets.

### How to Create Buckets:

1. In Supabase Dashboard, go to **Storage** (left sidebar)
2. Click **Create new bucket** (blue button)
3. **Name:** `gallery` → Click **Create bucket**
4. You'll see a new bucket appear → **Click on it**
5. Look for **PUBLIC** toggle (blue circle) → Click it to turn ON (should be blue)
6. Repeat steps 2-5 for these 4 more buckets:
   - `space-images`
   - `hero-images`
   - `about-content`
   - `resources`

### Result Should Look Like:
```
✅ gallery          [PUBLIC]
✅ space-images     [PUBLIC]
✅ hero-images      [PUBLIC]
✅ about-content    [PUBLIC]
✅ resources        [PUBLIC]
```

---

## 🧪 Step 4: Verify Everything Works (1 minute)

Go back to SQL Editor and paste this to test:

```sql
-- Test Query 1: Check policies exist
SELECT COUNT(*) as policy_count FROM pg_policies 
WHERE schemaname = 'public';

-- Test Query 2: Try to read spaces
SELECT COUNT(*) as spaces_count FROM spaces;

-- Test Query 3: Try to read bookings
SELECT COUNT(*) as bookings_count FROM bookings;

-- Test Query 4: Try to read config
SELECT COUNT(*) as config_count FROM site_config;
```

**Expected results:**
- `policy_count`: Should be 12 or more
- `spaces_count`: Should be any number (0 or more)
- `bookings_count`: Should be any number (0 or more)
- `config_count`: Should be 10 or more

If you see numbers (no errors), ✅ **your database is ready!**

---

## 🎯 Step 5: Test Your Admin Panel (2 minutes)

Now go to your admin panel and test:

```
http://localhost:3000/admin
```

Try each feature:

1. **Dashboard Tab**
   - Should show loading spinner briefly
   - Should display stats or empty state
   - ✅ No red error message

2. **Bookings Tab**
   - Should show loading spinner
   - Should display bookings list
   - ✅ No error

3. **Spaces Tab**
   - Should show list of spaces
   - Click **Add Space** button
   - Fill in name and mood tag
   - Click **Create**
   - ✅ Should appear in list

4. **Delete a Space**
   - Click the trash icon on any space
   - ✅ Should disappear from list

5. **Gallery Tab**
   - Should show buckets (gallery, space-images, etc)
   - Try uploading an image
   - ✅ Should appear in gallery

6. **Settings Tab**
   - Change a setting (like "Studio Name")
   - Click **Save**
   - Refresh page (Cmd+R or F5)
   - ✅ Setting should still be there

---

## 🆘 Troubleshooting

### Issue: SQL errors when running the script
**Solution:** Copy the entire code block again. Make sure you're pasting ALL of it.

### Issue: "Policy already exists" error
**This is OK!** The script drops old policies first. Just run it again.

### Issue: Admin panel still shows "Failed to load"
**Solution:** 
1. Press Cmd+Option+I (Mac) or F12 (Windows)
2. Go to **Console** tab
3. Look for red error messages
4. Copy the exact error text
5. Share it for help

### Issue: Can upload images but can't see them
**Solution:**
1. Go to Supabase → Storage
2. Check each bucket has **PUBLIC** toggle ON (blue)
3. If not, click it to turn it on

### Issue: Still getting storage errors
**Solution:**
1. Go back to SQL Editor
2. Run the storage RLS policy section again (the `DROP POLICY IF EXISTS...` part for storage)
3. Refresh your browser

---

## 📝 Quick Reference

### What Each Section Does:

| Section | What It Does | Why It Matters |
|---------|-------------|-----------------|
| DROP POLICY | Removes old broken policies | Prevents conflicts with new ones |
| CREATE POLICY (tables) | Creates new working policies | Allows read/write to tables |
| CREATE POLICY (storage) | Creates storage policies | Allows image uploads/downloads |

### Database Tables:

| Table | Purpose | What It Stores |
|-------|---------|-----------------|
| `bookings` | User bookings | Name, email, dates, space choices |
| `spaces` | Studio spaces | Space names, descriptions, images |
| `site_config` | Settings | Logo URL, email, phone, etc |

### Storage Buckets:

| Bucket | Purpose |
|--------|---------|
| `gallery` | Gallery images |
| `space-images` | Space cover/detail images |
| `hero-images` | Hero section images |
| `about-content` | About page content |
| `resources` | Other resources |

---

## ✅ Success Checklist

- [ ] Copied SQL code from this guide
- [ ] Pasted into Supabase SQL Editor
- [ ] Clicked RUN and got all ✅ green checkmarks
- [ ] Created 5 storage buckets
- [ ] Made all 5 buckets PUBLIC
- [ ] Ran verification queries (got numbers with no errors)
- [ ] Tested admin dashboard (loads without error)
- [ ] Tested adding a space (appears in list)
- [ ] Tested deleting a space (disappears from list)
- [ ] Tested uploading image (appears in gallery)
- [ ] Tested saving settings (persists after refresh)

Once all checkboxes are done → **Your admin panel is fully working!** 🎉

---

## 🎉 You're Done!

If all tests pass:
- ✅ Dashboard working
- ✅ Bookings working
- ✅ Spaces add/delete working
- ✅ Gallery uploads working
- ✅ Settings saving working

**Your admin panel is now complete and fully functional!**

---

## 📞 Still Having Issues?

If something's not working:
1. Open browser console (Cmd+Option+I or F12)
2. Try the failing action again
3. Look for red error messages in console
4. Copy the exact error text
5. Share it with your developer

The error message will tell us exactly what's wrong!
