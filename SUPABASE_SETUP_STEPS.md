# Step-by-Step Supabase Setup Guide

**Goal:** Get the admin panel working by setting up Supabase properly

---

## STEP 1: Run SQL Setup Script

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. Copy the entire content from `SUPABASE_SETUP.sql` 
4. Paste into the SQL editor
5. Click **Run**

**Expected Result:** Tables created, RLS policies set, sample data inserted

---

## STEP 2: Create Storage Buckets

1. Go to **Supabase Dashboard** → **Storage**
2. Click **Create a new bucket**
3. Name: `space-images`
4. Set to **Public**
5. Click **Create bucket**

Repeat for:
6. Name: `gallery-images` → **Public**

**Expected Result:** Two public buckets created

---

## STEP 3: Create Admin User in Supabase Auth

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **Add user** (or **Invite user**)
3. Enter:
   - Email: `admin@infinitestudio.com` (or your email)
   - Password: Create a secure password
4. Click **Save user**

**Expected Result:** Admin user created, you can now login

---

## STEP 4: Verify Environment Variables

In your project root, check `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

If missing, copy from **Supabase Dashboard** → **Settings** → **API**

---

## STEP 5: Test Everything

### Test 1: Admin Login
```
1. npm run dev
2. Go to: http://localhost:3000/admin/login
3. Enter admin credentials from Step 3
4. Should redirect to /admin dashboard
```

**Expected Result:** Dashboard loads with stats

### Test 2: Create Booking
```
1. Go to: http://localhost:3000/booking
2. Select a space and date/time
3. Fill in your details
4. Click "Confirm Booking"
5. Should save to Supabase AND open WhatsApp
```

**Expected Result:** Check Supabase → Tables → bookings → new row appears

### Test 3: Admin Spaces Manager
```
1. Login to admin
2. Go to: /admin/spaces
3. Click "Add Space"
4. Fill form and save
5. Should appear in spaces list
```

**Expected Result:** New space appears in Supabase spaces table

### Test 4: Upload Gallery Image
```
1. Login to admin
2. Go to: /admin/gallery
3. Upload an image
4. Should appear in Supabase Storage → gallery-images
```

**Expected Result:** Image file in storage bucket

---

## STEP 6: Troubleshooting

### Error: "Failed to load dashboard data"
- **Cause:** RLS policies blocking admin reads
- **Fix:** Run SQL setup script again, verify policies created
- **Check:** Supabase Dashboard → Authentication → Policies

### Error: "Invalid login credentials"
- **Cause:** Admin user doesn't exist
- **Fix:** Create admin user (Step 3)
- **Check:** Supabase Dashboard → Authentication → Users

### Error: "Failed to upload image"
- **Cause:** Storage buckets don't exist or no upload policy
- **Fix:** Create storage buckets (Step 2)
- **Check:** Supabase Dashboard → Storage → Buckets

### Images not uploading to Supabase
- **Cause:** ANON_KEY doesn't have storage permissions
- **Fix:** Check RLS policies on storage.objects table
- **Check:** Supabase Dashboard → Storage → Policies

### Bookings not saving to database
- **Cause:** Bookings table doesn't exist or RLS policy blocks INSERT
- **Fix:** Run SQL setup script (Step 1)
- **Check:** Supabase Dashboard → SQL Editor → Run query:
  ```sql
  SELECT * FROM public.bookings LIMIT 1;
  ```

---

## STEP 7: Verify All Features Work

After setup, test this checklist:

- [ ] Admin login works
- [ ] Dashboard shows stats
- [ ] Can view bookings list
- [ ] Can update booking status
- [ ] Can create new space
- [ ] Can upload space image
- [ ] Can edit space details
- [ ] Gallery upload works
- [ ] Settings form loads
- [ ] Can change hero title
- [ ] Can toggle theme
- [ ] Can logout
- [ ] Logout clears session

---

## STEP 8: Verify Database Contents

Run these queries in Supabase SQL Editor to verify:

### Check Bookings Table
```sql
SELECT COUNT(*) as total_bookings, status 
FROM public.bookings 
GROUP BY status;
```

### Check Spaces Table
```sql
SELECT id, name, price, is_active 
FROM public.spaces 
ORDER BY sort_order;
```

### Check Gallery Table
```sql
SELECT COUNT(*) as total_images 
FROM public.gallery;
```

### Check Site Config
```sql
SELECT key, value 
FROM public.site_config 
WHERE key LIKE 'hero%';
```

---

## Success Indicators

✅ Admin dashboard loads with real data  
✅ Can create and modify bookings  
✅ Can manage spaces  
✅ Can upload images to gallery  
✅ Settings save properly  
✅ All features work on mobile  
✅ No console errors  

---

## Next Steps

Once everything works:

1. Test on mobile devices
2. Run through user workflows
3. Check performance with 100+ bookings
4. Set up email notifications
5. Configure payment (optional)
6. Deploy to production

---

**Questions?** Check console logs (F12) for detailed error messages.
