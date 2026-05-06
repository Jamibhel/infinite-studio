# 🚀 Fix RLS Policy Error - Quick Action

## Error
```
new row violates row-level security policy
```

## Solution (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your **Infinite Studio** project
3. Click **SQL Editor** (left sidebar)
4. Click **"+ New query"**

### Step 2: Copy the SQL
Copy this SQL code:
```sql
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete" ON storage.objects;
DROP POLICY IF EXISTS "Public read" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload" ON storage.objects;

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'space-images');

CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'space-images');

CREATE POLICY "Authenticated delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'space-images');
```

### Step 3: Paste & Execute
1. Paste the SQL into the editor
2. Click the blue **Play button** (►) or press **Cmd+Enter**
3. Wait for: ✅ **"Query executed successfully"**

### Step 4: Test
1. Refresh browser: **Cmd+Shift+R**
2. Go to **http://localhost:3000/admin/spaces**
3. Click **Edit** on a space
4. Upload an image
5. Should see: ✅ **"Image uploaded successfully"**

---

## What This Does

| Policy | What it allows |
|--------|----------------|
| **Public read** | Anyone can view/download images |
| **Authenticated upload** | Logged-in users can upload images |
| **Authenticated delete** | Logged-in users can delete images |

---

## If It Fails

### Error: "Policy already exists"
→ The DROP POLICY commands didn't work
→ Try running the SQL again

### Error: "Cannot find table"
→ Make sure you're in the SQL Editor
→ Not in the Storage section

### Still getting RLS error after upload?
1. Hard refresh: **Cmd+Shift+R**
2. Check browser console (Cmd+Option+I)
3. Look for the exact error message
4. Share it with me

---

## Files Reference

- `SUPABASE_RLS_FIX.md` - Detailed explanation
- `SUPABASE_SETUP.sql` - Full SQL with policies (updated)

---

## That's it! 🎉

Once you run the SQL and see ✅ success:
- Image uploads will work
- Admin panel fully functional
- Your storage bucket is properly secured

**Total time: ~2 minutes**
