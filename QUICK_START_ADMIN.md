# 🚀 QUICK START — Admin Panel Setup

## What's Done ✅

- Real Supabase auth (replaces demo credentials)
- Bookings save to database
- Spaces manager with create/edit/delete
- Mobile navigation enhanced
- All code compiled and tested

## What You Need to Do 🔧

### Step 1: Supabase Setup (10 minutes)

1. Open Supabase Dashboard
2. Go to SQL Editor → New Query
3. Copy-paste from: **`ADMIN_SETUP_COMPLETE.md`** (lines with SQL code block)
4. Click **RUN**
5. Wait for "Query Executed Successfully"

### Step 2: Create Admin User (2 minutes)

1. Go to Supabase → Authentication → Users
2. Click **Add User**
3. Enter email & password
4. Save

### Step 3: Verify .env.local (1 minute)

Check you have:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get from: Supabase → Settings → API

### Step 4: Start Dev Server (1 minute)

```bash
npm run dev
```

### Step 5: Test Admin Login (2 minutes)

1. Go to: http://localhost:3000/admin/login
2. Enter your Supabase admin email & password
3. Should see dashboard

---

## Expected Results ✅

| Feature | Should Work |
|---------|------------|
| Admin login | ✅ Real credentials work |
| Dashboard | ✅ Shows bookings stats |
| Bookings list | ✅ Shows all bookings |
| Spaces list | ✅ Shows 8 spaces |
| Edit space | ✅ Modal opens, can save |
| Add space | ✅ New space form works |
| Upload images | ✅ Images go to storage |
| Mobile menu | ✅ Hamburger menu visible |
| Settings | ✅ Can save settings |

---

## Troubleshooting

### Can't login
- Check email/password in Supabase Auth
- Check `.env.local` has SUPABASE_URL and ANON_KEY
- Restart dev server

### Dashboard shows errors
- Run SQL setup again (copy from ADMIN_SETUP_COMPLETE.md)
- Check all tables exist in Supabase
- Check RLS policies are set correctly

### Can't upload images
- Check `space-images` storage bucket exists
- Check bucket policy allows uploads
- Refresh page after upload

### Mobile menu not visible
- Check you're viewing on mobile or <768px width
- Press hamburger menu icon (☰)
- Should show dropdown with nav items

---

## Files You Created/Modified

```
✅ src/lib/auth-context.tsx           — Real auth
✅ src/components/BookingContent.tsx   — DB save
✅ src/app/admin/spaces/page.tsx       — Space manager
✅ src/components/AdminLayout.tsx      — Mobile nav
✅ ADMIN_SETUP_COMPLETE.md             — SQL setup
✅ PHASE1_COMPLETE.md                  — Summary
```

---

## Success = This Works

```
1. ✅ npm run build (no errors)
2. ✅ npm run dev (starts)
3. ✅ Login at /admin/login (with real credentials)
4. ✅ See dashboard with stats
5. ✅ Create booking via /booking → appears in admin
6. ✅ Mobile menu works on phone
```

---

## Git Commits (All Pushed) ✅

```
7914fee6 Phase 1 complete summary
1aa0c903 Mobile nav enhancements
57f7369b Spaces manager complete
dce4663c Booking DB save
6006e5c1 Real Supabase auth
```

---

## Questions?

Check these files:
- **Setup issues?** → ADMIN_SETUP_COMPLETE.md
- **What changed?** → PHASE1_COMPLETE.md
- **Auth details?** → AUTH_INTEGRATION_COMPLETE.md
- **How to test?** → TEST_FIX3_LOGIN.md

---

**Status:** ✅ Ready to go!  
**Time to setup:** ~15 minutes  
**Complexity:** Easy (just run SQL + create user)

Go to ADMIN_SETUP_COMPLETE.md and follow step-by-step 🚀
