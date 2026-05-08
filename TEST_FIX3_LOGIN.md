# Fix #3: Admin Login — Quick Test Guide

## Prerequisites

Before testing, ensure:
1. ✅ Your `.env.local` has Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
2. ✅ You have a **real admin user** in Supabase (created via Auth dashboard)
3. ✅ Dev server is running: `npm run dev`

---

## Test Steps

### Test 1: Invalid Credentials ❌
```
1. Navigate to: http://localhost:3000/admin/login
2. Enter email: invalid@test.com
3. Enter password: wrongpassword
4. Click "Sign In"
5. Expected: Error message "Invalid email or password"
6. Check browser console: Should show "Auth error: Invalid login credentials"
```

**Status:** ✅ PASS if error appears  
**Status:** ❌ FAIL if login succeeds or different error

---

### Test 2: Real Credentials ✅
```
1. Navigate to: http://localhost:3000/admin/login
2. Enter your real Supabase admin email
3. Enter your real Supabase admin password
4. Click "Sign In"
5. Expected: Redirects to /admin dashboard
6. Should see: Dashboard with bookings stats, recent bookings, etc.
7. Check console: Should show successful auth
```

**Status:** ✅ PASS if redirects to dashboard  
**Status:** ❌ FAIL if stays on login or shows error

---

### Test 3: Session Persistence 🔄
```
1. From Test 2, confirm you're logged in at /admin
2. Refresh the page (Cmd+R or Ctrl+R)
3. Expected: Stay on /admin dashboard (no redirect to login)
4. Should see: Same dashboard data

This tests: onAuthStateChange() listener and session restore
```

**Status:** ✅ PASS if stays logged in after refresh  
**Status:** ❌ FAIL if redirects to login

---

### Test 4: Logout 🚪
```
1. From logged-in state, click "Logout" button (bottom of sidebar on desktop, mobile menu)
2. Expected: Redirects to /admin/login
3. Try to access /admin directly in URL bar
4. Expected: Redirects to /admin/login again
5. Check console: Should show successful signOut

This tests: logout() async function works, ProtectedRoute checks work
```

**Status:** ✅ PASS if redirects to login and can't access /admin  
**Status:** ❌ FAIL if stays on admin or shows error

---

### Test 5: Multiple Tab Sync 📱
```
Advanced test (optional):
1. Log in on Tab A: http://localhost:3000/admin
2. Open new tab (Tab B), navigate to /admin
3. Expected: Tab B also shows logged in (same session)
4. Go back to Tab A, click Logout
5. Go to Tab B, refresh page
6. Expected: Tab B should detect logout and redirect to login

This tests: onAuthStateChange() real-time sync across tabs
```

**Status:** ✅ PASS if logout syncs across tabs  
**Status:** ❌ FAIL if doesn't sync

---

## Troubleshooting

### Issue: "Invalid login credentials" even with correct password
**Solution:**
- Confirm user exists in Supabase Auth dashboard
- Verify email matches exactly (case-sensitive on some systems)
- Try resetting password in Supabase dashboard
- Check `.env.local` has correct SUPABASE_URL and ANON_KEY

### Issue: Page stays on login after clicking "Sign In"
**Solution:**
- Check browser console for errors (Cmd+Opt+I or F12)
- Look for "Auth error: ..." messages
- Ensure Supabase credentials in `.env.local` are correct
- Try hard refresh (Cmd+Shift+R) to clear cache

### Issue: Already on admin page, but still shows "Please login"
**Solution:**
- Run `npm run dev` to restart dev server
- Check that ProtectedRoute component isn't blocking access
- Verify user object is being set in auth context (check console)

### Issue: Logout button doesn't work (stays on admin page)
**Solution:**
- Check console for "Logout error: ..." message
- Ensure `logout()` function in auth-context is being called
- Try refreshing page after logout attempt
- Restart dev server

---

## Success Indicators

✅ You'll know Fix #3 is working when:

1. ✅ Login with real credentials works → redirects to /admin
2. ✅ Invalid credentials show error → doesn't redirect
3. ✅ Refresh while logged in → stays logged in
4. ✅ Logout works → redirects to login, can't access /admin
5. ✅ Browser console shows no auth errors

---

## Next Action

Once all 5 tests pass:

1. Note any issues in console (for debugging)
2. Proceed to **Fix #2: Booking DB Save** — Wire BookingContent to save to Supabase
3. Then **Fix #1: Schema Verification** — Confirm your database schema matches expected structure

---

## Console Logs to Expect

### Successful Login:
```
Session check error: [no error - session found]
Auth state changed: user logged in
```

### Successful Logout:
```
Auth state changed: user logged out
```

### Failed Login:
```
Auth error: Invalid login credentials
```

---

**Status:** ⏳ Ready for testing  
**Time to test:** ~5 minutes  
**Impact:** Critical — authentication is the gateway to admin panel
