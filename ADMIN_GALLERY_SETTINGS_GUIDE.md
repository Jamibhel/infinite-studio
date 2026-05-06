# 🎨 Admin Gallery & Settings Guide

## Overview

The Admin Panel includes two critical management interfaces:
- **Gallery** - Upload and manage shoot photos
- **Settings** - Configure studio information and site-wide settings

Both pages are fully functional with the latest design system (CSS variables, theme support, and proper styling).

---

## 📸 Gallery Page (`/admin/gallery`)

### Features

✅ **Drag & Drop Upload**
- Drag images directly onto the designated area
- Or click the "Select Files" button to browse

✅ **Batch Upload**
- Upload multiple images at once
- Auto-validates file types (images only)
- File size limit: 5MB per image

✅ **Image Gallery**
- View all uploaded images in a responsive grid
- Hover effects with zoom animation
- Filename displayed below each image

✅ **Quick Delete**
- Click trash icon to remove images
- Confirmation dialog prevents accidental deletion
- Images deleted from storage immediately

✅ **Error Handling**
- Clear error messages if upload fails
- Type validation (images only)
- Size validation (max 5MB)

### How to Use

#### 1. **Upload Images**

```
Dashboard → Gallery
    ↓
Click "Select Files" or drag images
    ↓
Choose image file(s)
    ↓
Wait for upload confirmation
    ↓
Images appear in gallery grid
```

**Valid Formats:** JPG, PNG, GIF, WebP, SVG
**Max Size:** 5MB per image

#### 2. **View Gallery**

- Images display in a responsive 4-column grid on desktop
- Hover to see zoom effect
- Filename shown at bottom of each card

#### 3. **Delete Images**

```
Gallery Page
    ↓
Hover over image you want to delete
    ↓
Click trash icon
    ↓
Confirm deletion
    ↓
Image removed from storage
```

### Supabase Setup (Required)

Before uploading images, you need to create a storage bucket:

**Steps:**
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your Infinite Studio project
3. Click **Storage** in the left sidebar
4. Click **"New bucket"**
5. Enter name: `gallery`
6. **Toggle "Public bucket" to ON** ✅
7. Click **"Create"**

**RLS Policy** (if prompted):
```sql
CREATE POLICY "Anyone can read gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete their uploads" ON storage.objects FOR DELETE USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');
```

### Technical Details

**Uploads To:** Supabase Storage (`gallery` bucket)
**File Naming:** `{timestamp}-{original-filename}`
**Public URL:** Automatically generated and stored
**Validation:**
- MIME type check (image/*)
- Size check (≤ 5MB)
- Required: Supabase bucket setup

---

## ⚙️ Settings Page (`/admin/settings`)

### Features

✅ **Hero Marquee Text**
- Customize the scrolling text on homepage hero section
- Supports multiple items separated by · symbol
- Example: "Editorial · Cinematic · Lifestyle · Corporate"

✅ **Studio Contact Info**
- Phone number field
- Email address field
- Used throughout the site for contact display

✅ **Real-time Validation**
- Auto-save on change (with confirmation)
- Visual feedback on save success/failure
- Loading states during save

✅ **Persistent Storage**
- All settings stored in database
- Survive page refreshes
- Instant sync across all pages

### How to Use

#### 1. **Update Marquee Text**

```
Settings → Hero Marquee Text field
    ↓
Enter or edit text
    ↓
Separate items with · (option+shift+9 on Mac)
    ↓
Example: "Editorial · Cinematic · Lifestyle"
    ↓
Click "Save Changes"
    ↓
Refresh homepage to see changes
```

#### 2. **Update Contact Information**

```
Settings → Studio Phone / Studio Email
    ↓
Enter phone in format: +234 700 0000 000
    ↓
Enter valid email: hello@infinitestudio.com
    ↓
Click "Save Changes"
    ↓
Contact info updates on site
```

#### 3. **Verify Changes**

After saving settings:
- ✅ Green success message appears
- Check homepage hero (marquee text)
- Check footer (contact info)
- Check contact pages

### Supabase Setup (Required)

Settings are stored in the `site_config` table:

**Table Creation:**
```sql
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

**RLS Policy:**
```sql
CREATE POLICY "Anyone can read settings" ON site_config FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update" ON site_config FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert" ON site_config FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### Technical Details

**Storage:** Supabase Database (`site_config` table)
**Update Method:** Upsert (insert or update if exists)
**Fields:**
- `key` - Setting name (marquee_text, phone, email)
- `value` - Setting value
- `updated_at` - Last modification timestamp

---

## 🎨 Design System Integration

Both pages use the modern design system with:

### Colors (CSS Variables)
```css
--bg: Background color (light: #d6d3c3, dark: #2D1B2E)
--surface: Surface/card color (light: #EDE0D4, dark: #3E2030)
--border: Border color (light: #D4B8A8, dark: #6B2D3E)
--text-primary: Main text (light: #1E1014, dark: #F0E4D8)
--text-muted: Secondary text (light: #9A7060, dark: #C4A090)
--cta-primary: Button color (#C4623A)
--cta-hover: Button hover (#E8956D)
```

### Typography
```
.heading-h1: Large titles (Cormorant Garamond)
.heading-h2: Section headers (Cormorant Garamond)
.heading-h3: Subsections (Cormorant Garamond)
.body-text: Regular text (DM Sans)
.body-small: Small text/labels (DM Sans)
```

### Theme Support
- ✅ Light/Dark mode toggle in admin header
- ✅ Automatic color switching
- ✅ Smooth transitions

---

## 🔐 Authentication & Security

### Protected Routes
Both Gallery and Settings pages are protected:
- Requires admin login at `/admin/login`
- Uses Supabase authentication
- Session persists in browser

### Required Permissions
Admin user needs:
- Read/Write access to `gallery` bucket (for Gallery page)
- Read/Write access to `site_config` table (for Settings page)

### Logout
Use the "Logout" button in admin header to:
- Clear authentication session
- Redirect to login page

---

## 🚀 Quick Troubleshooting

### Gallery upload not working?

1. **Check Supabase bucket exists:**
   ```
   Supabase → Storage → Look for "gallery" bucket
   ```

2. **Verify bucket is public:**
   ```
   Select "gallery" → Settings → "Public bucket" should be ON
   ```

3. **Check file size:**
   ```
   Max 5MB per image - reduce image size if too large
   ```

4. **Check file type:**
   ```
   Must be image format (JPG, PNG, GIF, WebP, SVG)
   ```

5. **Clear browser cache:**
   ```
   Cmd+Shift+Delete (or Ctrl+Shift+Delete) and retry
   ```

### Settings not saving?

1. **Check database table exists:**
   ```
   Supabase → SQL Editor → Check for "site_config" table
   ```

2. **Verify you're logged in:**
   ```
   Should see admin greeting in top right
   ```

3. **Check internet connection:**
   ```
   Make sure connection is active
   ```

4. **Check browser console for errors:**
   ```
   F12 → Console tab → Look for error messages
   ```

### Styling looks wrong?

1. **Verify theme variables in globals.css:**
   ```
   Check that CSS variables are defined correctly
   ```

2. **Toggle dark/light mode:**
   ```
   Click moon/sun icon in admin header
   ```

3. **Hard refresh page:**
   ```
   Cmd+Shift+R (or Ctrl+Shift+R)
   ```

---

## 📊 Data Structure

### Gallery Items
```javascript
{
  id: "1234567890-image.jpg",        // filename
  filename: "1234567890-image.jpg",  // display name
  url: "https://..../gallery/...",   // public URL
  created_at: "2024-01-15T10:30:00Z" // upload time
}
```

### Site Config
```javascript
{
  marquee_text: "Editorial · Cinematic · Lifestyle · Corporate",
  phone: "+234 700 0000 000",
  email: "hello@infinitestudio.com"
}
```

---

## 💡 Best Practices

### Gallery Management
✅ Use consistent image formats (all JPG or all PNG)
✅ Compress images before uploading to save space
✅ Name images descriptively for easy management
✅ Organize by shooting type or date
✅ Delete outdated/unused images regularly

### Settings Management
✅ Keep marquee text short and scannable
✅ Use · (bullet) separator for readability
✅ Verify contact info is up-to-date
✅ Test links in footer after changing
✅ Back up critical settings before mass changes

---

## 🎯 Next Steps

1. **Upload your first images** to the gallery
2. **Configure studio info** in settings
3. **Test on different devices** (mobile, tablet, desktop)
4. **Verify theme switching** works correctly
5. **Check footer and hero** display updated content

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify Supabase setup (bucket/table exists)
3. Check browser console (F12) for error messages
4. Ensure you're logged in as admin
5. Try clearing cache and refreshing

---

**Last Updated:** May 6, 2026
**Status:** ✅ Fully Functional
