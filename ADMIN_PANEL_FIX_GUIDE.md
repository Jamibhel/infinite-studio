# Admin Panel Fixes — Detailed Action Items

---

## Phase 1: Critical Fixes (In Priority Order)

### Fix #1: Verify Database Schema
**Objective:** Confirm all admin code assumes the correct tables and columns

**Action:**
1. Run this query in Supabase SQL editor to export current schema:
```sql
-- Check bookings table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
ORDER BY ordinal_position;

-- Check spaces table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'spaces' 
ORDER BY ordinal_position;

-- Check site_config table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'site_config' 
ORDER BY ordinal_position;
```

2. Compare output with admin code expectations:
   - **Bookings:** Should have `id`, `name`, `email`, `phone`, `spaces` (text[] or text?), `date`, `time`, `status`, `group_size`, `addons` (jsonb?), `amount`, `created_at`
   - **Spaces:** Should have `id`, `name`, `mood_tag`, `description`, `is_active`, `images` (text[]?), `price` (integer?), `amenities` (text[]? or jsonb?), `capacity`, `sort_order`, `created_at`
   - **Site Config:** Should have `key` (text, primary), `value` (text), `updated_at`

3. If schema differs, create migration or fix admin code to match

**Blocker:** Booking saving doesn't work until this is confirmed

---

### Fix #2: Wire BookingContent to Save Bookings to DB
**File:** `/src/components/BookingContent.tsx`  
**Current Issue:** `onSubmit` opens WhatsApp but doesn't save to DB  

**Action:**
In `onSubmit` function (currently ~line 183), replace or add Supabase INSERT:

```typescript
// Inside onSubmit, after WhatsApp message creation but before opening URL:
const bookingRecord = {
  name: data.name,
  email: data.email,
  phone: data.phone,
  spaces: selectedSpaces, // matches booking IDs
  date: data.date,
  time: data.time,
  status: 'pending', // new bookings start as pending
  group_size: data.groupSize,
  addons: selectedAddOns,
  amount: totalPrice, // use calculated total
  notes: data.notes,
  created_at: new Date().toISOString(),
}

// Save to Supabase
const { error } = await supabase
  .from('bookings')
  .insert([bookingRecord])

if (error) {
  toast.error('Booking saved to WhatsApp but failed to log in system. Contact admin.')
  console.error('Booking save error:', error)
} else {
  toast.success('Booking confirmed and logged!')
}
```

**Verification:** After booking, check Supabase `bookings` table to see new row

---

### Fix #3: Replace Demo Auth with Supabase Auth
**File:** `/src/lib/auth-context.tsx`  
**Current Issue:** Hardcoded credentials, no real authentication

**Step 1: Create Supabase Auth user**
- Go to Supabase Dashboard → Authentication → Users
- Create a real admin user (or use invite link)
- Note the UID (you'll need it)

**Step 2: Update auth-context to use Supabase Auth**
Replace the hardcoded auth with real Supabase:

```typescript
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
)

// In login function, replace demo check:
const login = async (email: string, password: string): Promise<boolean> => {
  setIsLoading(true)
  try {
    // Use Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Auth error:", error.message)
      return false
    }

    if (data.user) {
      const newUser: User = {
        id: data.user.id,
        email: data.user.email || "",
        name: data.user.user_metadata?.full_name || "Admin",
      }
      setUser(newUser)
      
      // Store token (Supabase handles session)
      return true
    }

    return false
  } finally {
    setIsLoading(false)
  }
}

// In logout function:
const logout = () => {
  supabase.auth.signOut()
  setUser(null)
}
```

**Verification:** Try logging in with real credentials; should work

---

### Fix #4: Implement Booking Detail View
**File:** `/src/app/admin/bookings/page.tsx`  
**Current Issue:** Edit button exists but does nothing

**Action:** Add modal to view/edit booking details:

```typescript
// After state declarations, add:
const [detailModalOpen, setDetailModalOpen] = useState(false)
const [selectedBookingForDetail, setSelectedBookingForDetail] = useState<Booking | null>(null)

// Replace Edit2 button onClick (line ~160):
<button 
  onClick={() => {
    setSelectedBookingForDetail(booking)
    setDetailModalOpen(true)
  }}
  className="p-2 hover:bg-[var(--cta-primary)] hover:bg-opacity-20 rounded-lg text-[var(--cta-primary)] transition-colors"
>
  <Edit2 size={16} />
</button>

// Add modal component at end of return (before </AdminLayout>):
{detailModalOpen && selectedBookingForDetail && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[var(--surface)] rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto"
    >
      <h2 className="heading-h2 mb-4">Booking Details</h2>
      <div className="space-y-4">
        <p><strong>Client:</strong> {selectedBookingForDetail.name}</p>
        <p><strong>Email:</strong> {selectedBookingForDetail.email}</p>
        <p><strong>Phone:</strong> {selectedBookingForDetail.phone}</p>
        <p><strong>Spaces:</strong> {selectedBookingForDetail.spaces.join(", ")}</p>
        <p><strong>Date:</strong> {selectedBookingForDetail.date}</p>
        <p><strong>Time:</strong> {selectedBookingForDetail.time}</p>
        <p><strong>Group Size:</strong> {selectedBookingForDetail.group_size}</p>
        <p><strong>Status:</strong> {selectedBookingForDetail.status}</p>
      </div>
      <div className="mt-6 flex gap-2">
        <button 
          onClick={() => setDetailModalOpen(false)}
          className="px-4 py-2 bg-[var(--border)] rounded-lg"
        >
          Close
        </button>
      </div>
    </motion.div>
  </div>
)}
```

---

### Fix #5: Complete Spaces Manager Save
**File:** `/src/app/admin/spaces/page.tsx`  
**Current Issue:** Form edits don't save to DB

**Action:** Find the `openModal` function and add save handler:

```typescript
// Add this function after deleteSpace:
const saveSpace = async () => {
  if (!formData.name || !formData.description) {
    toast.error("Please fill in required fields")
    return
  }

  try {
    if (editMode && selectedSpace) {
      // Update existing
      const { error: updateError } = await supabase
        .from("spaces")
        .update({
          name: formData.name,
          description: formData.description,
          mood_tag: formData.mood_tag,
          price: formData.price,
          capacity: formData.capacity,
          amenities: formData.amenities,
          images: formData.images,
        })
        .eq("id", selectedSpace.id)

      if (updateError) throw updateError
      toast.success("Space updated!")
    } else {
      // Create new
      const { error: insertError } = await supabase
        .from("spaces")
        .insert([{
          name: formData.name,
          description: formData.description,
          mood_tag: formData.mood_tag,
          price: formData.price,
          capacity: formData.capacity,
          amenities: formData.amenities,
          images: formData.images,
          is_active: true,
        }])

      if (insertError) throw insertError
      toast.success("Space created!")
    }

    setShowModal(false)
    setEditMode(false)
    setFormData({})
    setSelectedSpace(null)
    await fetchSpaces() // Refresh list
  } catch (err) {
    console.error("Error saving space:", err)
    toast.error("Failed to save space")
  }
}

// Find the modal's Save button and add onClick:
<button 
  onClick={saveSpace}
  className="px-4 py-2 bg-[var(--cta-primary)] text-white rounded-lg"
>
  Save Space
</button>
```

---

### Fix #6: Wire Settings to Site (Hero Title Example)
**Objective:** Make hero settings actually update the homepage

**Step 1: Create hero_config table** (if not exists):
```sql
CREATE TABLE hero_config (
  id SERIAL PRIMARY KEY,
  title TEXT,
  subtitle TEXT,
  image_url TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO hero_config (title, subtitle, image_url)
VALUES ('Where Your Vision Becomes Content', 'Stunning themed spaces...', 'https://...');
```

**Step 2: Update homepage** to fetch hero config:
**File:** `/src/app/page.tsx`

```typescript
// Add near top:
import { createClient } from "@supabase/supabase-js"

// In component:
const [heroConfig, setHeroConfig] = useState({
  title: "Where Your Vision Becomes Content",
  subtitle: "Stunning themed spaces, professional equipment, and creative energy. Everything you need to create extraordinary content.",
})

useEffect(() => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )
  
  const fetchHeroConfig = async () => {
    const { data, error } = await supabase
      .from("hero_config")
      .select("title, subtitle")
      .single()
    
    if (data) {
      setHeroConfig({
        title: data.title || heroConfig.title,
        subtitle: data.subtitle || heroConfig.subtitle,
      })
    }
  }

  fetchHeroConfig()
}, [])

// In JSX, replace hardcoded text:
<motion.h1 ...>
  {heroConfig.title}  {/* was: "Where Your Vision Becomes Content" */}
</motion.h1>

<motion.p ...>
  {heroConfig.subtitle}  {/* was: "Stunning themed spaces..." */}
</motion.p>
```

**Step 3: Update Settings page** to save to new table:
**File:** `/src/app/admin/settings/page.tsx`

```typescript
// In saveSettings function, add:
const { error: heroError } = await supabase
  .from("hero_config")
  .update({
    title: heroTitle,
    subtitle: heroSubtitle,
    image_url: heroImageUrl,
  })
  .eq("id", 1)

if (heroError) throw heroError
```

---

## Phase 2: High-Priority Features

### Feature #1: Add Search/Filter to Bookings
**File:** `/src/app/admin/bookings/page.tsx`  
**Add above table:**

```typescript
const [filters, setFilters] = useState({
  status: "",
  dateFrom: "",
  dateTo: "",
  search: "",
})

// Add filter UI:
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
  <input
    type="text"
    placeholder="Search by name or email"
    value={filters.search}
    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
    className="px-4 py-2 border border-[var(--border)] rounded-lg"
  />
  <select
    value={filters.status}
    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
    className="px-4 py-2 border border-[var(--border)] rounded-lg"
  >
    <option value="">All Statuses</option>
    <option value="pending">Pending</option>
    <option value="confirmed">Confirmed</option>
    <option value="completed">Completed</option>
  </select>
  <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} className="..." />
  <input type="date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} className="..." />
</div>

// Filter bookings before rendering:
const filteredBookings = bookings.filter(b => {
  if (filters.search && !b.name.toLowerCase().includes(filters.search.toLowerCase()) && !b.email.includes(filters.search)) return false
  if (filters.status && b.status !== filters.status) return false
  if (filters.dateFrom && b.date < filters.dateFrom) return false
  if (filters.dateTo && b.date > filters.dateTo) return false
  return true
})

// Use filteredBookings in table map instead of bookings
```

---

### Feature #2: Booking Notifications
**File:** `/src/components/BookingContent.tsx`  
**Objective:** Notify customer when booking status changes

**In admin bookings updateStatus function, add:**
```typescript
// Send email notification
const sendNotification = async (bookingId: string, newStatus: string) => {
  const booking = bookings.find(b => b.id === bookingId)
  if (!booking) return

  // Call a backend API or Supabase function
  const response = await fetch('/api/admin/notify-booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bookingId,
      email: booking.email,
      status: newStatus,
      name: booking.name,
    }),
  })

  if (!response.ok) {
    toast.error("Booking updated but notification failed")
  }
}

// Call in updateStatus:
await updateStatus(bookingId, newStatus)
await sendNotification(bookingId, newStatus)
```

**Create backend route:** `/src/app/api/admin/notify-booking.ts`
```typescript
import { Resend } from 'resend' // or nodemailer

export async function POST(req: Request) {
  const { email, status, name } = await req.json()

  const statusMessages = {
    pending: "Your booking is being reviewed.",
    confirmed: "Your booking is confirmed!",
    completed: "Your session is complete. We hope you enjoyed!",
  }

  // Send email
  // await resend.emails.send({...})

  return Response.json({ success: true })
}
```

---

## Phase 3: Testing & Validation

### Test Checklist
- [ ] Login with real Supabase credentials (not demo)
- [ ] Create a booking via booking form → check `bookings` table in Supabase
- [ ] View booking in admin → edit status → check notification email
- [ ] Upload space image in admin → check Supabase Storage and `spaces.images` 
- [ ] Change hero title in settings → check homepage updates (with cache clear)
- [ ] Delete booking → confirm soft-delete or archival
- [ ] Search bookings by date range
- [ ] Export bookings to CSV (optional enhancement)
- [ ] Mobile responsiveness of admin pages

---

## Files Requiring Changes (Summary)
1. `/src/lib/auth-context.tsx` — Replace demo auth
2. `/src/components/BookingContent.tsx` — Add DB save + notifications
3. `/src/app/admin/bookings/page.tsx` — Add detail view, filters, notifications
4. `/src/app/admin/spaces/page.tsx` — Complete save functionality
5. `/src/app/admin/settings/page.tsx` — Wire settings to site
6. `/src/app/page.tsx` — Fetch hero config from DB
7. Create `/src/app/api/admin/notify-booking.ts` — Booking notifications
8. Supabase migrations — Create/update schema tables

---

## Estimated Effort per Fix
| Fix | Effort | Time |
|-----|--------|------|
| 1. Schema audit | 1 hr | ~30 min |
| 2. Booking DB save | 1–2 hrs | ~1 hr |
| 3. Real auth | 2 hrs | ~1.5 hrs |
| 4. Detail view | 1 hr | ~1 hr |
| 5. Space save | 1 hr | ~45 min |
| 6. Hero config | 2 hrs | ~1.5 hrs |
| **Phase 1 Total** | **~8 hrs** | **~6–7 hrs** |

---

## Do NOT Deploy Until
✅ Phase 1 is complete  
✅ All tests pass  
✅ Real Supabase Auth is active  
✅ Bookings successfully save to DB  
✅ Admin can view and modify bookings  

