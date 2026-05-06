# 🎬 Supabase Storage Buckets - Complete Guide

**Project:** Infinite Studio
**Date:** May 6, 2026
**Status:** All image storage organized and ready

---

## 📋 Complete Bucket Structure

You'll need to create **6 main storage buckets** in Supabase to manage all images:

### 1. **gallery** ✅
**Purpose:** General gallery/portfolio images shown on `/gallery` page  
**Access:** Public (read-only)  
**Use Cases:**
- Admin uploads general portfolio photos
- Shoot galleries
- Behind-the-scenes content
- Portfolio items

**Storage Path:** `gallery/`  
**File Naming Convention:** `{timestamp}-{original-filename}.{ext}`

**RLS Policy:**
```sql
-- Public can read
CREATE POLICY "Public read gallery" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery');

-- Authenticated can upload
CREATE POLICY "Authenticated upload gallery" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- Authenticated can delete
CREATE POLICY "Authenticated delete gallery" ON storage.objects
FOR DELETE USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');
```

---

### 2. **space-images** ✅
**Purpose:** Individual space images and covers shown on space cards/detail pages + featured spaces (IMPORTANT: Featured spaces now reuse these!)  
**Access:** Public (read-only)  
**Use Cases:**
- Space cover images (8 spaces)
- Space gallery photos (4 per space)
- Space setup photos
- Featured space images (The Bar, Green Screen, Vanity Mirror)

**Storage Path:** `spaces/{space-id}/`  
**Examples:**
- `spaces/the-bar/`
- `spaces/green-screen/`
- `spaces/vanity-mirror/`
- `spaces/staircase/`
- `spaces/office-set/`
- `spaces/chair-space/`
- `spaces/eid-setup/`
- `spaces/bookshelf/`

**File Naming Convention:** `{space-id}-{description}.{ext}`  
**Examples:**
- `spaces/the-bar/cover.jpg` (used in: spaces list, home featured section)
- `spaces/the-bar/hero.jpg` (used in: space detail page)
- `spaces/the-bar/image-1.jpg` (detail gallery)
- `spaces/the-bar/image-2.jpg` (detail gallery)
- `spaces/the-bar/image-3.jpg` (detail gallery)
- `spaces/the-bar/image-4.jpg` (detail gallery)

**⚠️ IMPORTANT NOTE:** Featured spaces on home page now use the same images from `space-images` bucket, not separate images. This eliminates duplication and keeps everything consistent.

**RLS Policy:**
```sql
-- Public can read space images
CREATE POLICY "Public read space images" ON storage.objects
FOR SELECT USING (bucket_id = 'space-images');

-- Authenticated can upload
CREATE POLICY "Authenticated upload space images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'space-images' AND auth.role() = 'authenticated');

-- Authenticated can delete
CREATE POLICY "Authenticated delete space images" ON storage.objects
FOR DELETE USING (bucket_id = 'space-images' AND auth.role() = 'authenticated');
```

---

### 3. **hero-images** ✅
**Purpose:** Full-page hero/banner images used in page backgrounds  
**Access:** Public (read-only)  
**Use Cases:**
- Home page hero banner
- Spaces page hero banner
- About page hero banner
- Booking page hero banner
- Gallery page hero banner

**Storage Path:** `pages/{page-name}/`  
**Examples:**
- `pages/home/hero.jpg`
- `pages/spaces/hero.jpg`
- `pages/about/hero.jpg`
- `pages/booking/hero.jpg`
- `pages/gallery/hero.jpg`

**File Naming Convention:** `{page}-hero.{ext}`

**RLS Policy:**
```sql
-- Public can read hero images
CREATE POLICY "Public read hero images" ON storage.objects
FOR SELECT USING (bucket_id = 'hero-images');

-- Authenticated can upload
CREATE POLICY "Authenticated upload hero" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'hero-images' AND auth.role() = 'authenticated');

-- Authenticated can delete
CREATE POLICY "Authenticated delete hero" ON storage.objects
FOR DELETE USING (bucket_id = 'hero-images' AND auth.role() = 'authenticated');
```

---

### 4. **about-content** ✅
**Purpose:** Images for About/Story page, testimonials, and why-choose-us section  
**Access:** Public (read-only)  
**Use Cases:**
- About page hero background
- "Why Infinite Studio" section images (3 large images)
- Testimonial avatars (4 creator profile pictures)
- Story/mission related images

**Storage Path:** `about/` and `testimonials/`  
**Examples:**
- `about/hero.jpg` (about page main hero)
- `about/designed-for-results.jpg` (why section - "Designed for Real Results")
- `about/space-for-everyone.jpg` (why section - "A Space for Everyone")
- `about/full-experience.jpg` (why section - "A Full Experience")
- `testimonials/adeyemi-johnson.jpg` (Podcast Host & Creator - 100x100)
- `testimonials/folake-okafor.jpg` (Beauty & Lifestyle Creator - 100x100)
- `testimonials/chisom-nwankwo.jpg` (YouTube Content Creator - 100x100)
- `testimonials/ife-adelusi.jpg` (Corporate Video Producer - 100x100)

**File Naming Convention:** `{section}/{name}.{ext}`

**Image Specs:**
- Why section images: 500x400px (large, high-quality)
- Testimonial avatars: 100x100px (small, profile pictures)

**RLS Policy:**
```sql
-- Public can read about content
CREATE POLICY "Public read about content" ON storage.objects
FOR SELECT USING (bucket_id = 'about-content');

-- Authenticated can upload
CREATE POLICY "Authenticated upload about" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'about-content' AND auth.role() = 'authenticated');

-- Authenticated can delete
CREATE POLICY "Authenticated delete about" ON storage.objects
FOR DELETE USING (bucket_id = 'about-content' AND auth.role() = 'authenticated');
```

---

### 5. **resources** ✅
**Purpose:** Blog post headers, resource images, guide images, and educational content  
**Access:** Public (read-only)  
**Use Cases:**
- Blog post header images
- Creator Resources & Tips section
- Tutorial/guide images
- Creator tips illustrations
- Resource preview images

**Storage Path:** `blog/` and `guides/`  
**Examples:**
- `blog/lighting-101.jpg` (Mastering Studio Lighting: A Creator's Guide)
- `blog/behind-scenes.jpg` (Behind-the-Scenes: Studio Tour & Setup Tips)
- `blog/content-batching.jpg` (Content Batching: Shoot a Month's Worth in One Day)
- `blog/outfit-styling.jpg` (Wardrobe Essentials for Every Studio Aesthetic)
- `blog/gear-guide.jpg` (Essential Gear to Bring to Your Studio Session)
- `guides/setup-tips.jpg`
- `guides/lighting-tips.jpg`
- `guides/editing-tutorial.jpg`

**File Naming Convention:** `blog/{topic}.{ext}` or `guides/{guide-name}.{ext}`

**Image Specs:**
- Blog post headers: 800x400px (large, eye-catching)
- Guide images: 500x400px

**RLS Policy:**
```sql
-- Public can read resources
CREATE POLICY "Public read resources" ON storage.objects
FOR SELECT USING (bucket_id = 'resources');

-- Authenticated can upload
CREATE POLICY "Authenticated upload resources" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'resources' AND auth.role() = 'authenticated');

-- Authenticated can delete
CREATE POLICY "Authenticated delete resources" ON storage.objects
FOR DELETE USING (bucket_id = 'resources' AND auth.role() = 'authenticated');
```

---

### 6. **testimonial-avatars** ✅ (OPTIONAL - Alternative Approach)
**Alternative to storing in `about-content`**

If you want testimonial avatars in their own bucket:

**Purpose:** Creator profile pictures and testimonial avatars  
**Access:** Public (read-only)  
**Use Cases:**
- Home page testimonials (4 avatars)
- Future team member profiles
- Creator success stories

**Storage Path:** `creators/`  
**Examples:**
- `creators/adeyemi-johnson.jpg`
- `creators/folake-okafor.jpg`
- `creators/chisom-nwankwo.jpg`
- `creators/ife-adelusi.jpg`

**File Naming Convention:** `{creator-name}.{ext}`

**⚠️ RECOMMENDATION:** Store testimonial avatars in `about-content` bucket to keep related content together. Only create this bucket if you plan to add many more creator profiles later.

---

## 🎯 Where Each Bucket is Used

### Home Page (`/`)
```
Hero Banner Background:
└─ hero-images/pages/home/hero.jpg

Featured Spaces Cards (3 spaces - The Bar, Green Screen, Vanity Mirror):
├─ space-images/the-bar/cover.jpg
├─ space-images/green-screen/cover.jpg
└─ space-images/vanity-mirror/cover.jpg
(⚠️ Now reuses space-images instead of featured-spaces!)

Testimonials Section (4 avatars):
├─ about-content/testimonials/adeyemi-johnson.jpg
├─ about-content/testimonials/folake-okafor.jpg
├─ about-content/testimonials/chisom-nwankwo.jpg
└─ about-content/testimonials/ife-adelusi.jpg

Creator Resources & Tips Section (5 blog post previews):
├─ resources/blog/lighting-101.jpg
├─ resources/blog/behind-scenes.jpg
├─ resources/blog/content-batching.jpg
├─ resources/blog/outfit-styling.jpg
└─ resources/blog/gear-guide.jpg
```

### About Page (`/about`)
```
Hero Banner:
└─ hero-images/pages/about/hero.jpg

Why Infinite Studio Section (3 images):
├─ about-content/about/designed-for-results.jpg
├─ about-content/about/space-for-everyone.jpg
└─ about-content/about/full-experience.jpg
```

### Spaces Page (`/spaces`)
```
Hero Banner:
└─ hero-images/pages/spaces/hero.jpg

Space Cards Grid (8 spaces):
├─ space-images/the-bar/cover.jpg
├─ space-images/green-screen/cover.jpg
├─ space-images/vanity-mirror/cover.jpg
├─ space-images/eid-setup/cover.jpg
├─ space-images/staircase/cover.jpg
├─ space-images/office-set/cover.jpg
├─ space-images/chair-space/cover.jpg
└─ space-images/bookshelf/cover.jpg
```

### Space Detail Page (`/spaces/[id]`)
```
Space Hero Image:
└─ space-images/{space-id}/hero.jpg

Gallery Images (4 images per space):
├─ space-images/{space-id}/image-1.jpg
├─ space-images/{space-id}/image-2.jpg
├─ space-images/{space-id}/image-3.jpg
└─ space-images/{space-id}/image-4.jpg

Total: 8 spaces × 5 images = 40 images
```

### Blog/Resources Page (`/blog`)
```
Hero Banner:
└─ hero-images/pages/blog/hero.jpg (optional)

Blog Post Headers (5 articles):
├─ resources/blog/lighting-101.jpg
├─ resources/blog/behind-scenes.jpg
├─ resources/blog/content-batching.jpg
├─ resources/blog/outfit-styling.jpg
└─ resources/blog/gear-guide.jpg
```

### Gallery Page (`/gallery`)
```
Hero Banner:
└─ hero-images/pages/gallery/hero.jpg

Gallery Grid (12+ items):
└─ gallery/
   ├─ 1234567890-shoot-1.jpg
   ├─ 1234567890-shoot-2.jpg
   ├─ 1234567890-shoot-3.jpg
   └─ ... (can add unlimited items)
```

### Booking Page (`/booking`)
```
Hero Banner:
└─ hero-images/pages/booking/hero.jpg

(No other images currently)
```

### Admin Gallery (`/admin/gallery`)
```
Uploaded Images:
└─ gallery/
   ├─ 1234567890-image-1.jpg
   ├─ 1234567890-image-2.jpg
   └─ ... (admin uploads here)
```

### Admin Spaces (`/admin/spaces`)
```
Space Management:
└─ space-images/
   ├─ spaces/{space-id}/
   │  ├─ image-1.jpg
   │  ├─ image-2.jpg
   │  └─ ... (admin uploads here)
```

---

## 📊 Image Inventory Summary

| Location | Bucket | Count | Purpose | Status |
|----------|--------|-------|---------|--------|
| Home Hero | hero-images | 1 | Full-page background | Core |
| Home Featured Spaces | space-images | 3 | Featured cards (reuses space-images) | Core ⚠️ |
| Home Testimonials | about-content | 4 | Creator avatars | Core |
| Home Blog Preview | resources | 5 | Creator resources section | Core |
| About Page Hero | hero-images | 1 | Full-page background | Core |
| About Why Section | about-content | 3 | Large section images | Core |
| Spaces Page Hero | hero-images | 1 | Full-page background | Core |
| Spaces Cards | space-images | 8 | Space previews | Core |
| Space Details | space-images | 32 | 8 spaces × 4 images each | Core |
| Gallery Page Hero | hero-images | 1 | Full-page background | Core |
| Gallery Items | gallery | 12+ | Portfolio/shoots | Variable |
| Blog/Resources Hero | hero-images | 1 | Full-page background | Optional |
| Blog Post Headers | resources | 5+ | Article previews | Core |
| Booking Page Hero | hero-images | 1 | Full-page background | Optional |
| **TOTAL** | **6 buckets** | **78+** | **All site images** | **Complete** |

---

## 🚀 Setup Instructions

### Step 1: Create Buckets in Supabase

1. Go to **Supabase Dashboard** → Your Project
2. Click **Storage** in the left sidebar
3. Click **"New bucket"**

Repeat for each bucket:

```
✅ Bucket 1: gallery
   - Access: Public ✓
   
✅ Bucket 2: space-images
   - Access: Public ✓
   
✅ Bucket 3: hero-images
   - Access: Public ✓
   
✅ Bucket 4: about-content
   - Access: Public ✓
   
✅ Bucket 5: resources
   - Access: Public ✓
   
✅ Bucket 6: testimonial-avatars (OPTIONAL)
   - Access: Public ✓
```

### Step 2: Set RLS Policies

For each bucket, go to **Storage** → Select Bucket → **Policies Tab**

Paste the RLS policies for each bucket (see above).

**Or use this combined SQL:**

```sql
-- GALLERY BUCKET
CREATE POLICY "Public read gallery" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated upload gallery" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete gallery" ON storage.objects
FOR DELETE USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- SPACE IMAGES BUCKET
CREATE POLICY "Public read space-images" ON storage.objects
FOR SELECT USING (bucket_id = 'space-images');

CREATE POLICY "Authenticated upload space-images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'space-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete space-images" ON storage.objects
FOR DELETE USING (bucket_id = 'space-images' AND auth.role() = 'authenticated');

-- HERO IMAGES BUCKET
CREATE POLICY "Public read hero-images" ON storage.objects
FOR SELECT USING (bucket_id = 'hero-images');

CREATE POLICY "Authenticated upload hero-images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'hero-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete hero-images" ON storage.objects
FOR DELETE USING (bucket_id = 'hero-images' AND auth.role() = 'authenticated');

-- ABOUT CONTENT BUCKET
CREATE POLICY "Public read about-content" ON storage.objects
FOR SELECT USING (bucket_id = 'about-content');

CREATE POLICY "Authenticated upload about-content" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'about-content' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete about-content" ON storage.objects
FOR DELETE USING (bucket_id = 'about-content' AND auth.role() = 'authenticated');

-- RESOURCES BUCKET
CREATE POLICY "Public read resources" ON storage.objects
FOR SELECT USING (bucket_id = 'resources');

CREATE POLICY "Authenticated upload resources" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'resources' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete resources" ON storage.objects
FOR DELETE USING (bucket_id = 'resources' AND auth.role() = 'authenticated');

-- TESTIMONIAL AVATARS BUCKET (OPTIONAL)
CREATE POLICY "Public read testimonial-avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'testimonial-avatars');

CREATE POLICY "Authenticated upload testimonial-avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'testimonial-avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete testimonial-avatars" ON storage.objects
FOR DELETE USING (bucket_id = 'testimonial-avatars' AND auth.role() = 'authenticated');
```

### Step 3: Get Bucket URLs

After creating buckets, get the public URL pattern:

```
https://[PROJECT-ID].supabase.co/storage/v1/object/public/[BUCKET-NAME]/[FILE-PATH]

Examples:
- https://xxxxx.supabase.co/storage/v1/object/public/gallery/1234567890-image.jpg
- https://xxxxx.supabase.co/storage/v1/object/public/space-images/the-bar/cover.jpg
- https://xxxxx.supabase.co/storage/v1/object/public/hero-images/pages/home/hero.jpg
- https://xxxxx.supabase.co/storage/v1/object/public/about-content/testimonials/adeyemi-johnson.jpg
- https://xxxxx.supabase.co/storage/v1/object/public/resources/blog/lighting-101.jpg
```

---

## 🎨 File Organization Examples

### Gallery Bucket Structure
```
gallery/
├── 1234567890-portfolio-1.jpg
├── 1234567890-portfolio-2.jpg
├── 1234567890-behind-scenes.jpg
├── 1234567890-shoot-setup.jpg
└── ... (add more as needed)
```

### Space Images Bucket Structure
```
space-images/
├── the-bar/
│   ├── cover.jpg          (primary - shown on card + featured)
│   ├── hero.jpg           (space detail page)
│   ├── image-1.jpg        (detail gallery)
│   ├── image-2.jpg        (detail gallery)
│   ├── image-3.jpg        (detail gallery)
│   └── image-4.jpg        (detail gallery)
├── green-screen/
│   ├── cover.jpg
│   ├── hero.jpg
│   ├── image-1.jpg
│   ├── image-2.jpg
│   ├── image-3.jpg
│   └── image-4.jpg
├── vanity-mirror/
│   ├── cover.jpg
│   ├── hero.jpg
│   ├── image-1.jpg
│   ├── image-2.jpg
│   ├── image-3.jpg
│   └── image-4.jpg
├── staircase/
├── office-set/
├── chair-space/
├── eid-setup/
└── bookshelf/
    └── (same structure for each)
```

### Hero Images Bucket Structure
```
hero-images/
└── pages/
    ├── home/
    │   └── hero.jpg
    ├── spaces/
    │   └── hero.jpg
    ├── about/
    │   └── hero.jpg
    ├── gallery/
    │   └── hero.jpg
    ├── booking/
    │   └── hero.jpg
    └── blog/
        └── hero.jpg (optional)
```

### About Content Bucket Structure
```
about-content/
├── about/
│   ├── hero.jpg
│   ├── designed-for-results.jpg
│   ├── space-for-everyone.jpg
│   └── full-experience.jpg
└── testimonials/
    ├── adeyemi-johnson.jpg
    ├── folake-okafor.jpg
    ├── chisom-nwankwo.jpg
    └── ife-adelusi.jpg
```

### Resources Bucket Structure
```
resources/
├── blog/
│   ├── lighting-101.jpg
│   ├── behind-scenes.jpg
│   ├── content-batching.jpg
│   ├── outfit-styling.jpg
│   └── gear-guide.jpg
└── guides/
    ├── setup-tips.jpg
    ├── lighting-tips.jpg
    └── editing-tutorial.jpg
```

---

## 📝 Image Specifications

### Recommended Image Sizes

| Use Case | Width | Height | Format | Max Size |
|----------|-------|--------|--------|----------|
| Space Card/Featured | 500px | 400px | JPG/PNG | 200KB |
| Space Hero Detail | 800px | 600px | JPG/PNG | 300KB |
| Page Hero | 1200px | 900px | JPG | 500KB |
| Gallery Item | 500px | 400px | JPG | 200KB |
| Why Section Image | 500px | 400px | JPG | 250KB |
| Blog Post Header | 800px | 400px | JPG | 300KB |
| Testimonial Avatar | 100px | 100px | JPG/PNG | 50KB |

### File Naming Best Practices

```
Format: {bucket}/{category}/{description}.{ext}

Examples:
✅ space-images/the-bar/cover.jpg
✅ about-content/testimonials/adeyemi-johnson.jpg
✅ hero-images/pages/home/hero.jpg
✅ resources/blog/lighting-101.jpg
✅ gallery/1234567890-shoot-1.jpg

❌ image.jpg (too generic)
❌ Space Photo.jpg (spaces in name)
❌ IMG_1234.jpg (no description)
```

---

## ⚠️ IMPORTANT: Featured Spaces Configuration

### Old Approach (❌ NO LONGER RECOMMENDED)
- Had separate `featured-spaces` bucket
- Duplicated images from `space-images`
- Created maintenance overhead
- Hard to keep consistent

### New Approach (✅ RECOMMENDED)
- Featured spaces now pull from `space-images` bucket
- Use the same `cover.jpg` for each space
- Single source of truth
- Much easier to maintain
- No bucket duplication

**Update Code Example:**
```typescript
// OLD: Featured spaces from dedicated bucket
const featuredImage = `https://xxxxx.supabase.co/storage/v1/object/public/featured-spaces/the-bar.jpg`

// NEW: Featured spaces from space-images bucket
const featuredImage = `https://xxxxx.supabase.co/storage/v1/object/public/space-images/the-bar/cover.jpg`
```

---

## 🔄 Upload Workflow

### For Admin Users

**Uploading Space Images:**
1. Go to `/admin/spaces`
2. Click "Edit" on a space
3. Upload images (max 5MB each)
4. Images are stored in: `space-images/{space-id}/`
5. Public URL is generated automatically
6. Same images appear on: spaces list, featured section, detail page

**Uploading Gallery Images:**
1. Go to `/admin/gallery`
2. Click "Select Files" or drag images
3. Upload images (max 5MB each)
4. Images are stored in: `gallery/`
5. Public URL is generated automatically

**Uploading Hero Images:**
1. Go to Supabase Dashboard
2. Storage → hero-images bucket
3. Upload your page hero images
4. Create folder structure: `pages/home/`, `pages/spaces/`, etc.
5. Upload `hero.jpg` to each folder

**Uploading About & Testimonial Images:**
1. Go to Supabase Dashboard
2. Storage → about-content bucket
3. Create folders: `about/` and `testimonials/`
4. Upload why-section images to `about/`
5. Upload testimonial avatars (100x100) to `testimonials/`

**Uploading Blog/Resource Images:**
1. Go to Supabase Dashboard
2. Storage → resources bucket
3. Create folders: `blog/` and `guides/`
4. Upload blog post headers (800x400) to `blog/`
5. Upload guide images to `guides/`

---

## 🎯 Current State (Before Setup)

The site currently uses placeholder images from **Unsplash**:
- `https://images.unsplash.com/photo-...`

### Images Need to be Replaced

**Home Page:**
- Hero background (1)
- 3 featured space cards (now share with space-images)
- 4 testimonial avatars

**Spaces Page:**
- Hero background (1)
- 8 space cards

**Space Detail Pages:**
- Each space needs 5 images (1 hero + 4 gallery)
- Total: 8 spaces × 5 = 40 images

**About Page:**
- Hero background (1)
- 3 "Why Infinite Studio" section images

**Gallery Page:**
- Hero background (1)
- 12+ portfolio items

**Blog/Resources:**
- 5 blog post headers

**Other Pages:**
- Booking hero background (1)
- Additional blog resources (optional)

---

## ✅ Setup Checklist

### Bucket Creation
- [ ] Create `gallery` bucket (public)
- [ ] Create `space-images` bucket (public)
- [ ] Create `hero-images` bucket (public)
- [ ] Create `about-content` bucket (public)
- [ ] Create `resources` bucket (public)
- [ ] Create `testimonial-avatars` bucket (OPTIONAL)

### Folder Structure
- [ ] In `hero-images`: Create `pages/` folder with subfolders (home, spaces, about, gallery, booking, blog)
- [ ] In `about-content`: Create `about/` and `testimonials/` folders
- [ ] In `resources`: Create `blog/` and `guides/` folders
- [ ] In `space-images`: Create folders for each space (the-bar, green-screen, vanity-mirror, staircase, office-set, chair-space, eid-setup, bookshelf)

### RLS Policies
- [ ] Add policies to `gallery` bucket
- [ ] Add policies to `space-images` bucket
- [ ] Add policies to `hero-images` bucket
- [ ] Add policies to `about-content` bucket
- [ ] Add policies to `resources` bucket
- [ ] Add policies to `testimonial-avatars` bucket (if using)

### Test Uploads
- [ ] Upload test image to each bucket
- [ ] Verify public access works
- [ ] Test image URLs in browser

### Image Collection
- [ ] Collect/create 1 home hero image
- [ ] Collect/create 1 about hero image
- [ ] Collect/create 1 spaces page hero
- [ ] Collect/create 8 space cover images
- [ ] Collect/create 32 space detail images (8 × 4)
- [ ] Collect/create 3 "why" section images
- [ ] Collect/create 4 testimonial avatars (100x100)
- [ ] Collect/create 5 blog post header images
- [ ] Collect/create 12+ gallery portfolio items
- [ ] Collect/create 2 optional heroes (booking, blog)

### Image Upload
- [ ] Upload all hero images to `hero-images`
- [ ] Upload all space images to `space-images`
- [ ] Upload about/testimonial images to `about-content`
- [ ] Upload blog images to `resources`
- [ ] Upload gallery images to `gallery`

### Integration
- [ ] Update home page hero image URL
- [ ] Update home page featured spaces to use space-images (remove featured-spaces bucket)
- [ ] Update home page testimonial avatars
- [ ] Update home page blog previews
- [ ] Update about page hero
- [ ] Update about page why-section images
- [ ] Update spaces page hero
- [ ] Update space card images
- [ ] Update space detail page images
- [ ] Update gallery page images
- [ ] Test all pages load images correctly
- [ ] Verify responsive images work
- [ ] Test admin upload functionality

---

## 💡 Pro Tips

1. **Batch Upload:** Upload multiple images at once using Supabase dashboard
2. **Organize Folders:** Use consistent folder structure for easy management
3. **Version Control:** Use timestamps in filenames for easy updates
4. **Compression:** Compress images before uploading to save space
5. **CDN:** Supabase automatically CDNs public images (fast delivery)
6. **Single Source:** Featured spaces now reuse space-images (no duplication)
7. **Fallbacks:** Keep Unsplash URLs as fallback if needed
8. **Sync:** Keep admin and marketing team in sync on image updates

---

## 📞 Support

**Questions about buckets?**
- Check Supabase Storage Docs: https://supabase.com/docs/guides/storage

**Admin image upload not working?**
- Verify bucket is public
- Check RLS policies are set correctly
- Verify file size < 5MB
- Check file format is image (JPG/PNG/GIF/WebP)

**Images not showing on site?**
- Verify bucket is public
- Check image URL is correct
- Verify RLS allows public read
- Check browser console for errors

---

## 🎉 Summary

**Total Buckets Needed:** 5-6
- `gallery` - Portfolio/shoot images
- `space-images` - Space images (+ featured spaces)
- `hero-images` - Page hero backgrounds
- `about-content` - About page & testimonials
- `resources` - Blog posts & guides
- `testimonial-avatars` - (Optional alternative)

**Total Estimated Images:** 80+
- 6 page heroes
- 8 space covers (now shared with featured)
- 32 space detail images
- 4 testimonial avatars
- 3 why-section images
- 5 blog post headers
- 12+ gallery items
- Plus optional additions

**Key Update:** Featured space images now reuse `space-images` bucket instead of duplicating - saves space and keeps everything consistent!

**All set?** Start uploading and updating the site! 🚀

---

*Last Updated: May 6, 2026*
*Status: Complete Guide - Ready to implement ✅*
