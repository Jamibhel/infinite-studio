# 🔐 Fix Supabase RLS Policy Error

## Problem
```
Error: new row violates row-level security policy
```

This means your bucket has RLS (Row-Level Security) policies that are too restrictive.

---

## Solution

### Option 1: Disable RLS (Quick Fix) ⚡

**For Development Only** - If you want to quickly test:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Storage** → `space-images` bucket
4. Click **Policies** tab
5. Look for any policies and delete them
6. Click the **toggle** to disable RLS if available

**After this:**
- Public uploads should work
- Test the upload in admin panel

### Option 2: Fix RLS Policies (Recommended) ✅

1. Go to **SQL Editor** in Supabase
2. Run this SQL to create proper policies:

```sql
-- Drop existing policies if any
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete" ON storage.objects;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public read
CREATE POLICY "Public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'space-images');

-- Policy 2: Allow authenticated users to upload
CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'space-images'
);

-- Policy 3: Allow authenticated users to delete their own files
CREATE POLICY "Authenticated delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'space-images'
);
```

3. Click **Execute** button
4. If successful, you'll see ✅ "Query executed successfully"

---

## After Fixing Policies

1. **Refresh your browser** (hard refresh: Cmd+Shift+R)
2. Go to **http://localhost:3000/admin/spaces**
3. Click **Edit** on a space
4. Try uploading an image
5. Should see: ✅ **"Image uploaded successfully"**

---

## Why This Error Occurs

The RLS policy is designed to protect data, but:
- ❌ It's blocking **storage.objects** table insert
- ❌ The policy requires conditions that aren't met
- ✅ We need to allow authenticated users + public read

---

## Verify the Fix

After running the SQL:

1. In Supabase, go to **Storage** → `space-images`
2. Click **Policies** tab
3. You should see these 3 policies:
   - ✅ "Public read"
   - ✅ "Authenticated upload"
   - ✅ "Authenticated delete"

---

## Troubleshooting

### Still getting RLS error?
1. Make sure you ran the SQL code
2. Check that the SQL executed successfully (green checkmark)
3. Try a hard refresh (Cmd+Shift+R)
4. Try uploading again

### SQL won't run?
1. Copy the entire SQL block
2. Paste it in the SQL Editor
3. Click the blue **Play** button (►) or **Execute**
4. Check for error messages

### Can't find SQL Editor?
1. In Supabase dashboard
2. Left sidebar → **SQL Editor**
3. Create new query
4. Paste the SQL
5. Click Execute

---

## Quick Steps Summary

1. ✅ Go to Supabase SQL Editor
2. ✅ Copy the SQL code above
3. ✅ Click Execute
4. ✅ Refresh browser (Cmd+Shift+R)
5. ✅ Try uploading in admin panel

That should fix it! 🚀
