# 🛠️ Admin Gallery & Settings - Technical Reference

## File Structure

```
src/
├── app/admin/
│   ├── gallery/
│   │   └── page.tsx          ← Gallery upload/management
│   ├── settings/
│   │   └── page.tsx          ← Site configuration
│   └── layout.tsx            ← Admin layout wrapper
├── components/
│   └── AdminLayout.tsx       ← Sidebar & navigation
└── lib/
    └── supabase.ts           ← Database client
```

---

## 📸 Gallery Page Implementation

### Location
`src/app/admin/gallery/page.tsx`

### Key Functions

#### Upload Handler
```typescript
const handleFileSelect = async (files: FileList) => {
  // Validates file type and size
  // Uploads to Supabase storage bucket: "gallery"
  // Handles errors gracefully
  // Refreshes gallery after upload
}
```

**Features:**
- ✅ File type validation (images only)
- ✅ File size validation (max 5MB)
- ✅ Multiple file support
- ✅ Progress feedback
- ✅ Error messages

#### Delete Handler
```typescript
const deleteItem = async (itemId: string) => {
  // Confirmation dialog
  // Removes from storage
  // Updates local state
  // Shows success/error message
}
```

#### Drag & Drop
```typescript
const handleDragOver = (e: React.DragEvent) => { /* ... */ }
const handleDrop = (e: React.DragEvent) => { /* ... */ }
```

### Database Integration

**Storage Bucket:** `gallery` (public)

**File Structure:**
```
gallery/
├── 1234567890-image1.jpg
├── 1234567890-image2.png
└── 1234567890-image3.gif
```

**File Naming:** `{timestamp}-{original-filename}`

### UI Components

**Upload Area:**
- Drag & drop zone
- Click to select files
- Visual feedback during upload

**Gallery Grid:**
- Responsive 4-column layout (desktop)
- 2-column layout (mobile)
- Hover zoom effect
- Delete button per image

### Styling

Uses CSS variables for theming:
```css
Background: var(--bg)
Surface: var(--surface)
Border: var(--border)
Text: var(--text-primary)
Buttons: var(--cta-primary)
Hover: var(--cta-hover)
```

### Dependencies

```typescript
import { createClient } from "@supabase/supabase-js"
import { motion } from "framer-motion"
import { Upload, Trash2, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"
```

---

## ⚙️ Settings Page Implementation

### Location
`src/app/admin/settings/page.tsx`

### Key Functions

#### Fetch Settings
```typescript
const fetchSettings = async () => {
  // Loads from site_config table
  // Parses key-value pairs
  // Sets to local state
  // Handles errors
}
```

#### Save Settings
```typescript
const saveSettings = async () => {
  // Upserts to site_config table
  // Handles multiple settings
  // Shows success/error feedback
  // Clear success message after delay
}
```

### Database Integration

**Table:** `site_config`

**Schema:**
```sql
CREATE TABLE site_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

**Data:**
```javascript
{
  "marquee_text": "Editorial · Cinematic · Lifestyle · Corporate",
  "phone": "+234 700 0000 000",
  "email": "hello@infinitestudio.com"
}
```

### UI Components

**Input Fields:**
- Hero Marquee Text (text)
- Studio Phone (tel)
- Studio Email (email)

**Feedback:**
- Loading spinner during fetch
- Error message if fetch fails
- Success message after save
- Save button with loading state

### Styling

Matches Gallery page with CSS variables:
```css
Inputs: Dark background with color-changing borders
Focus: Ring effect using --cta-primary
Labels: Font family from --text-primary
Buttons: Full width with hover effect
```

### Dependencies

```typescript
import { createClient } from "@supabase/supabase-js"
import { motion } from "framer-motion"
import { Save, AlertCircle, CheckCircle } from "lucide-react"
import toast from "react-hot-toast"
```

---

## 🔌 Supabase Configuration

### Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Client Setup

File: `src/lib/supabase.ts`

```typescript
import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
)
```

### SQL Setup Scripts

#### Gallery Bucket
```sql
-- Create public bucket for gallery images
-- Name: gallery
-- Public: YES
```

#### Settings Table
```sql
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

INSERT INTO site_config (key, value) VALUES
  ('marquee_text', 'Editorial · Cinematic · Lifestyle · Corporate'),
  ('phone', '+234 700 0000 000'),
  ('email', 'hello@infinitestudio.com')
ON CONFLICT (key) DO NOTHING;
```

---

## 🎨 Component Integration

### Admin Layout Wrapper

File: `src/components/AdminLayout.tsx`

Provides:
- ✅ Sidebar navigation (desktop)
- ✅ Mobile menu
- ✅ Theme toggle
- ✅ Logout button
- ✅ User greeting
- ✅ Protected route

```typescript
<AdminLayout>
  <div>Your page content</div>
</AdminLayout>
```

### Navigation Items

```typescript
const navItems = [
  { label: "Dashboard", href: "/admin", icon: Home },
  { label: "Bookings", href: "/admin/bookings", icon: Calendar },
  { label: "Spaces", href: "/admin/spaces", icon: Grid },
  { label: "Gallery", href: "/admin/gallery", icon: Image },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]
```

---

## 🎯 Key Features Checklist

### Gallery Page
- [x] Drag & drop file upload
- [x] Click to select files
- [x] Multiple file support
- [x] File type validation
- [x] File size validation (5MB max)
- [x] Responsive grid layout
- [x] Hover zoom effects
- [x] Quick delete functionality
- [x] Delete confirmation
- [x] Loading states
- [x] Error messages
- [x] Success feedback

### Settings Page
- [x] Load current settings
- [x] Edit marquee text
- [x] Edit phone number
- [x] Edit email address
- [x] Save changes to database
- [x] Validation feedback
- [x] Success messages
- [x] Error handling
- [x] Loading states
- [x] Theme support

### Admin Layout
- [x] Sidebar navigation (desktop)
- [x] Mobile dropdown menu
- [x] Theme toggle
- [x] Logout functionality
- [x] Protected routes
- [x] User greeting
- [x] Responsive design
- [x] Dark/Light mode

---

## 🧪 Testing Guide

### Unit Tests (When Ready)

```typescript
// Test gallery upload
test("uploads file to gallery", async () => {
  const file = new File(["content"], "test.jpg", { type: "image/jpeg" })
  // Test upload logic
})

// Test settings save
test("saves settings to database", async () => {
  // Test save logic with mock data
})
```

### Integration Tests

1. **Upload flow:** Upload → Verify file in bucket → Delete → Verify deletion
2. **Settings flow:** Load → Edit → Save → Refresh → Verify persistence
3. **Theme switching:** Toggle → Verify colors change → Refresh → Persist
4. **Authentication:** Logout → Redirect to login → Cannot access admin pages

### Manual Testing

See `ADMIN_SETUP_CHECKLIST.md` for comprehensive manual testing guide.

---

## 📊 Performance Considerations

### Gallery Page
- **Images:** Optimized for web (consider compression)
- **Grid:** Responsive CSS grid (no JS calculations)
- **Uploads:** Chunked handling for large files
- **Memory:** Cleans up file references after upload

### Settings Page
- **Load:** Single query to fetch all settings
- **Save:** Upsert operation (atomic)
- **State:** Minimal re-renders
- **Network:** Debounced if needed

### Best Practices

1. **Compress images before upload**
   - Reduces storage costs
   - Faster loading
   - Better UX

2. **Validate on client & server**
   - File type, size
   - Settings format
   - Email format

3. **Handle errors gracefully**
   - Toast notifications
   - User feedback
   - Retry logic

4. **Optimize re-renders**
   - Use useCallback for handlers
   - Memoize expensive components
   - Avoid unnecessary state updates

---

## 🔐 Security Best Practices

### Authentication
- ✅ Admin-only routes protected
- ✅ Supabase auth enforced
- ✅ Session storage
- ✅ Logout clears session

### Data Validation
- ✅ File type validation (client & server)
- ✅ File size limits
- ✅ Email format validation
- ✅ Required field checks

### API Security
- ✅ Supabase RLS policies
- ✅ Row-level security enabled
- ✅ Public bucket for images
- ✅ Authenticated operations

### Storage Security
- ✅ Public read access to gallery
- ✅ Authenticated write access
- ✅ Authenticated delete access
- ✅ Filename validation

---

## 📈 Future Enhancements

### Gallery Features
- [ ] Image cropping/resizing
- [ ] Bulk upload
- [ ] Image tagging/categories
- [ ] Search functionality
- [ ] Sort/filter options
- [ ] Drag to reorder
- [ ] Lightbox preview

### Settings Features
- [ ] Settings groups/sections
- [ ] Real-time preview
- [ ] Settings backup/restore
- [ ] Audit log
- [ ] Scheduled updates
- [ ] Advanced validation

### Admin Features
- [ ] Analytics dashboard
- [ ] Recent activity log
- [ ] Quick actions
- [ ] Notifications
- [ ] Export data
- [ ] User management

---

## 🐛 Debugging Tips

### Console Logging

```typescript
// Gallery upload debug
console.log("Upload started:", file)
console.log("Upload complete:", response)

// Settings debug
console.log("Fetching settings...")
console.log("Settings loaded:", data)
```

### Browser DevTools

1. **Network tab:** Check API requests
2. **Storage tab:** Verify Supabase bucket access
3. **Console tab:** Check for errors
4. **Application tab:** Check local storage/session

### Supabase Dashboard

1. **Storage:** Verify bucket and files
2. **Database:** Check site_config table
3. **Logs:** Monitor requests
4. **RLS:** Verify policies

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

---

**Last Updated:** May 6, 2026
**Version:** 1.0.0
