# 🔧 Fix Supabase Image Upload - Step by Step

## Problem
Image upload fails with: **"BUCKET NOT FOUND"**

This means the `space-images` bucket doesn't exist in your Supabase project.

---

## Solution: Create the Bucket

### Step 1: Go to Supabase Dashboard
1. Visit [https://app.supabase.com](https://app.supabase.com)
2. Log in with your account
3. Select your **Infinite Studio** project

### Step 2: Navigate to Storage
1. In the left sidebar, click on **Storage**
2. You'll see existing buckets (if any)

### Step 3: Create New Bucket
1. Click the **"+ New bucket"** button
2. Enter the bucket name: `space-images`
3. **Important**: Toggle **"Public bucket"** to ON
   - This allows the images to be publicly accessible
4. Click **"Create bucket"**

### Step 4: Verify the Bucket
The bucket should now appear in your storage list:
```
📦 space-images (Public)
```

### Step 5: Set CORS (if needed)
If you get CORS errors, configure it:
1. Click on the bucket name `space-images`
2. Go to **Settings** tab
3. Scroll to **CORS configuration**
4. Add (if not already there):
```json
[
  {
    "origin": "http://localhost:3000",
    "methods": ["GET", "POST", "DELETE"],
    "allowedHeaders": ["*"]
  },
  {
    "origin": "https://infinitestudio.com",
    "methods": ["GET", "POST", "DELETE"],
    "allowedHeaders": ["*"]
  }
]
```

---

## Step 6: Test the Upload

1. Go to: `http://localhost:3000/admin/spaces`
2. Click **Edit** on any space
3. Click the upload area in **"Space Images"** section
4. Select an image (PNG, JPG, WebP, max 5MB)
5. Watch the progress bar (golden color)
6. You should see: ✅ **"Image uploaded successfully"**

---

## Troubleshooting

### If still failing:
1. **Open Browser DevTools** (Cmd+Option+I on Safari)
2. Go to **Console** tab
3. Try uploading an image
4. Look for error messages in the console
5. Share those errors with me

### Common Issues:
- **"No such bucket"**: The bucket wasn't created
- **"Bucket is not public"**: Toggle Public ON in Supabase
- **CORS error**: Add CORS configuration as shown above
- **File too large**: Max 5MB per file

---

## Quick Reference

**Bucket Name**: `space-images`
**Access Level**: Public
**File Size Limit**: 5MB
**Supported Formats**: PNG, JPG, WebP

After setting this up, all image uploads from the admin panel will work perfectly! 🎉
