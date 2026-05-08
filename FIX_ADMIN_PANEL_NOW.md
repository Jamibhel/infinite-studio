# Fix Admin Panel - Correct Steps ✅

## The Problem
Your RLS policies are blocking all requests because they require authenticated users, but your frontend isn't sending authenticated requests properly.

## The Solution (Take Your Time - 10 minutes)

### STEP 1: Drop Old Policies (2 minutes)
1. Go to Supabase Dashboard → SQL Editor
2. Paste **ENTIRE** content of `SUPABASE_CORRECT_RLS.sql`
3. Click **Run**
4. ✅ Should show green "Success" with multiple executions

### STEP 2: Create Storage Buckets (5 minutes)
Do NOT skip this step.

1. Go to Supabase Dashboard → Storage → Buckets
2. Click **Create new bucket**
3. Name it exactly: `gallery` → Make Public → Create
4. Repeat for each (create 5 total):
   - `gallery` ✅
   - `space-images` ✅
   - `hero-images` ✅
   - `about-content` ✅
   - `resources` ✅

**IMPORTANT:** For EACH bucket, toggle the **PUBLIC** switch on (blue circle to right)

### STEP 3: Go Back to SQL Editor (1 minute)
1. Go back to SQL Editor
2. The RLS policies for storage in the script will now apply to the buckets you created
3. Refresh the page

### STEP 4: Test Your Admin Panel (2 minutes)
1. Go to your admin panel: `http://localhost:3000/admin` (or your URL)
2. Try these actions:
   - Dashboard → Should show loading then stats ✅
   - Bookings → Should load bookings list ✅
   - Spaces → Add new space ✅
   - Spaces → Delete a space ✅
   - Gallery → Upload image ✅
   - Settings → Change a setting and refresh ✅

## If Still Not Working

Try this **Diagnostic Query** in Supabase SQL Editor to see what's happening:

```sql
-- Check if policies exist
SELECT policyname, tablename, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Try to read from spaces (should return data or no error)
SELECT * FROM spaces LIMIT 5;

-- Try to read from bookings
SELECT * FROM bookings LIMIT 5;

-- Try to read from site_config
SELECT * FROM site_config LIMIT 5;
```

If these queries work and show data, your database is fine and the issue is elsewhere.

## Files You Need

1. **SUPABASE_CORRECT_RLS.sql** ← Copy ALL of this to SQL Editor
2. **This file** ← You're reading it now
3. **SUPABASE_DIAGNOSTIC.md** ← Read if you want to understand the issue

## Common Issues & Fixes

### Issue: "Duplicate key value" error
- This is OK, it means a policy already exists
- The script drops old ones first so just run again

### Issue: Admin panel still shows "Failed to load"
- Check browser console: Press Cmd+Option+I (Mac) or F12 (Windows)
- Look for error messages
- Share the exact error for help

### Issue: Can upload images but can't see them
- Buckets must be PUBLIC (not private)
- Check Storage → Buckets → Each bucket should have PUBLIC toggle ON

### Issue: Storage says "Access Denied"
- Run SUPABASE_CORRECT_RLS.sql again
- Make sure ALL 5 buckets are created and PUBLIC
- Refresh browser

## Success Checklist ✅

- [ ] Ran SUPABASE_CORRECT_RLS.sql in SQL Editor
- [ ] Created all 5 storage buckets (gallery, space-images, hero-images, about-content, resources)
- [ ] Made all 5 buckets PUBLIC
- [ ] Admin dashboard loads without error
- [ ] Can add a new space
- [ ] Can delete a space
- [ ] Can upload image to gallery
- [ ] Can save settings and they persist
- [ ] No more error messages

## Still Stuck?

Open your browser console (Cmd+Option+I or F12) and share the exact error message. That will tell us exactly what's wrong.
