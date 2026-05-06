# 🔧 Fix Supabase Storage Bucket - Detailed Troubleshooting

## The Problem
You created the `space-images` bucket but uploads still fail with:
```
"Storage bucket 'space-images' not found"
```

## Why This Happens

This error usually means one of these issues:

1. **Bucket exists but is PRIVATE** ❌
2. **Missing CORS configuration** ❌
3. **Incorrect bucket permissions** ❌
4. **Bucket name typo** ❌

## Solution - Step by Step

### Step 1: Verify Bucket Exists and is Public

1. Go to **[Supabase Dashboard](https://app.supabase.com)**
2. Select your **Infinite Studio** project
3. Click **Storage** in the left sidebar
4. Look for `space-images` bucket
5. **Check the icon next to it:**
   - 🔓 **Open lock** = Public ✅
   - 🔒 **Closed lock** = Private ❌

**If it's Private (🔒):**
1. Click the three dots (•••) next to the bucket
2. Select **Make public**
3. Confirm

### Step 2: Configure CORS

1. Go to **Storage** section
2. Click on `space-images` bucket name to open it
3. Click **Settings** tab (top right)
4. Scroll to **CORS configuration**
5. Look for this section and add/verify:

```json
[
  {
    "origin": ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allowedHeaders": ["*"]
  }
]
```

**If you have a production domain:**
```json
{
  "origin": ["https://infinitestudio.com"],
  "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  "allowedHeaders": ["*"]
}
```

### Step 3: Set Correct Bucket Policies

1. In Storage, click `space-images` bucket
2. Click **Policies** tab
3. You should see these policies (or create them):

**For Public Access (Read):**
```sql
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'space-images');
```

**For Authenticated Upload (Write):**
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'space-images' AND
  auth.role() = 'authenticated'
);
```

**For Authenticated Delete:**
```sql
CREATE POLICY "Allow authenticated delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'space-images' AND
  auth.role() = 'authenticated'
);
```

### Step 4: Test the Bucket

1. In the bucket, click **Upload file**
2. Upload a test image
3. The image should appear in the bucket
4. Click the image name
5. Copy the **File URL**
6. Try opening it in browser - should load the image

### Step 5: Restart Your Dev Server

After making changes to Supabase:

```bash
cd /Users/user/Desktop/Infinite-Studio
pkill -f "npm run dev"
sleep 2
npm run dev
```

### Step 6: Test Upload in Admin Panel

1. Go to: **http://localhost:3000/admin/spaces**
2. Click **Edit** on any space
3. Try uploading an image
4. Check browser console (Cmd+Option+I) for detailed errors

---

## Quick Checklist

- [ ] Bucket `space-images` exists
- [ ] Bucket is **PUBLIC** (🔓 open lock)
- [ ] CORS is configured
- [ ] Policies are set for public read
- [ ] Policies allow authenticated write
- [ ] Dev server restarted after changes
- [ ] Tested upload in admin panel

---

## If Still Failing: Debug Steps

### Check Console for Errors
1. Open browser (Safari): **Cmd+Option+I**
2. Go to **Console** tab
3. Try uploading an image
4. Look for error messages
5. Share the exact error with me

### Common Error Messages

**"Failed to upload image"**
→ Bucket is private or doesn't exist

**"CORS error"**
→ CORS not configured

**"Unauthorized"**
→ Permissions/policies issue

**"Invalid bucket name"**
→ Bucket doesn't exist or typo

---

## Bucket Configuration Summary

```
Bucket Name: space-images
Access: PUBLIC (🔓)
File Size Limit: 5MB (in app)
Supported Types: PNG, JPG, WebP
CORS: Enabled ✅
Policies: Read (Public) + Write (Authenticated)
```

---

## Need More Help?

1. **Take a screenshot** of your bucket settings
2. **Copy the error message** from console
3. **Share what you see** - I can help debug

Your bucket is likely already set up correctly, just needs the right permissions!
