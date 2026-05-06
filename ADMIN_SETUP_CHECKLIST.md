# ✅ Admin Gallery & Settings Setup Checklist

## 🚀 Before You Start

Make sure you have completed:
- [ ] Admin login page setup (`/admin/login`)
- [ ] Supabase project created
- [ ] Environment variables configured (`.env.local`)

---

## 📸 Gallery Setup

### Step 1: Create Storage Bucket

- [ ] Go to [Supabase Dashboard](https://app.supabase.com)
- [ ] Select your Infinite Studio project
- [ ] Click **Storage** in left sidebar
- [ ] Click **"New bucket"**
- [ ] Enter bucket name: `gallery`
- [ ] **Toggle "Public bucket" to ON** 🔓
- [ ] Click **"Create bucket"**

### Step 2: Set RLS Policies (Optional but Recommended)

If Supabase prompts for RLS policies:

```sql
-- Run in Supabase SQL Editor

-- Allow public to read gallery images
CREATE POLICY "Public read gallery" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'gallery' AND 
  auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'gallery' AND 
  auth.role() = 'authenticated'
);
```

### Step 3: Test Gallery Page

- [ ] Go to `/admin/gallery`
- [ ] Click "Select Files" button
- [ ] Choose an image (JPG, PNG, etc.)
- [ ] Wait for upload to complete
- [ ] See image appear in gallery grid
- [ ] Try deleting the test image
- [ ] Verify deletion works

✅ **Gallery setup complete!**

---

## ⚙️ Settings Setup

### Step 1: Create Database Table

In Supabase SQL Editor, run:

```sql
-- Create site_config table
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert default values
INSERT INTO site_config (key, value) VALUES
  ('marquee_text', 'Editorial · Cinematic · Lifestyle · Corporate'),
  ('phone', '+234 700 0000 000'),
  ('email', 'hello@infinitestudio.com')
ON CONFLICT (key) DO NOTHING;
```

### Step 2: Set RLS Policies

```sql
-- Enable RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Allow public to read settings
CREATE POLICY "Public read settings" ON site_config
FOR SELECT USING (true);

-- Allow authenticated to update
CREATE POLICY "Authenticated update" ON site_config
FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated to insert
CREATE POLICY "Authenticated insert" ON site_config
FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### Step 3: Test Settings Page

- [ ] Go to `/admin/settings`
- [ ] See current settings loaded
- [ ] Edit marquee text (e.g., "Editorial · Cinematic")
- [ ] Click "Save Changes"
- [ ] See green success message
- [ ] Refresh page - settings should persist
- [ ] Go to homepage, verify marquee text updated
- [ ] Go back to settings and try editing phone/email

✅ **Settings setup complete!**

---

## 🎨 Design Verification

After setup, verify the design looks correct:

### Light Mode
- [ ] Background is light beige (#d6d3c3)
- [ ] Text is dark brown (#1E1014)
- [ ] Buttons are copper color (#C4623A)
- [ ] Borders are soft brown (#D4B8A8)

### Dark Mode
- [ ] Click moon icon in admin header
- [ ] Background is dark purple (#2D1B2E)
- [ ] Text is light cream (#F0E4D8)
- [ ] Buttons are copper color (#C4623A)
- [ ] Toggle back to light mode

✅ **Theme switching works!**

---

## 🧪 Full Feature Test

### Gallery Features
- [ ] Drag & drop upload works
- [ ] Click upload button works
- [ ] Multiple file upload works
- [ ] Wrong file type rejected (only images)
- [ ] File too large rejected (>5MB)
- [ ] Images display correctly in grid
- [ ] Hover zoom effect works
- [ ] Delete button works
- [ ] Confirmation dialog appears
- [ ] Image removed after delete

### Settings Features
- [ ] Marquee text field loads correctly
- [ ] Phone field loads correctly
- [ ] Email field loads correctly
- [ ] Can edit all three fields
- [ ] Save button works
- [ ] Success message appears
- [ ] Settings persist on page refresh
- [ ] Error handling works (try invalid email)
- [ ] Theme toggle works
- [ ] Logout button works

---

## 🔐 Security Verification

- [ ] Admin pages require login (try `/admin/gallery` when logged out)
- [ ] Redirects to login if unauthorized
- [ ] Logout clears session
- [ ] Cannot upload images when logged out

---

## 📱 Responsive Design Test

Test on different screen sizes:

### Desktop (>768px)
- [ ] Sidebar visible on left
- [ ] Navigation items clickable
- [ ] Content fills right side
- [ ] Gallery grid shows 4 columns

### Tablet (768px)
- [ ] Sidebar hidden
- [ ] Mobile menu appears (hamburger icon)
- [ ] Gallery grid shows 2-3 columns

### Mobile (<576px)
- [ ] Mobile header with menu button
- [ ] Gallery grid shows 2 columns
- [ ] Touch interactions work
- [ ] No horizontal scroll

---

## 🎯 Final Checklist

### Core Functionality
- [ ] Gallery uploads working
- [ ] Gallery deletes working
- [ ] Settings save working
- [ ] Theme toggle working
- [ ] Admin login/logout working

### Design
- [ ] Correct colors (light and dark)
- [ ] Typography looks good
- [ ] Responsive on all devices
- [ ] No styling issues

### Performance
- [ ] Pages load quickly
- [ ] No console errors
- [ ] Uploads complete in reasonable time
- [ ] No memory leaks

### Data
- [ ] Settings persist across sessions
- [ ] Images visible after refresh
- [ ] Database connected properly
- [ ] File storage working

---

## 🚀 You're Ready!

Once all boxes are checked, your admin panel is fully functional:

✅ Gallery for managing images
✅ Settings for site configuration
✅ Responsive design on all devices
✅ Theme support (light/dark mode)
✅ Secure authentication

---

## 📞 Troubleshooting

### Gallery Upload Fails
1. Check Supabase bucket exists: `gallery`
2. Check bucket is public (toggle ON)
3. Check file size (max 5MB)
4. Check file type (images only)
5. Check browser console for errors

### Settings Don't Save
1. Check `site_config` table exists
2. Check RLS policies are set
3. Verify you're logged in
4. Check internet connection
5. Check browser console for errors

### Styling Looks Wrong
1. Hard refresh: Cmd+Shift+R
2. Check CSS variables in `globals.css`
3. Toggle dark/light mode
4. Clear browser cache
5. Try different browser

---

**Status:** Ready for Production ✅
**Last Updated:** May 6, 2026
