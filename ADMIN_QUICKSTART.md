# 🚀 ADMIN GALLERY & SETTINGS - QUICK START

## 5-Minute Setup

### Step 1: Create Supabase Bucket (2 min)

```bash
1. Go to https://app.supabase.com
2. Select your project
3. Click Storage → New Bucket
4. Name: gallery
5. Toggle: Public bucket ON
6. Click Create
```

### Step 2: Create Database Table (2 min)

```bash
1. Go to SQL Editor in Supabase
2. Copy & paste:

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

3. Click Run
```

### Step 3: Run Dev Server (1 min)

```bash
cd /Users/user/Desktop/Infinite-Studio
npm run dev
```

---

## ✨ Start Using

### Gallery Upload
```
1. Go to http://localhost:3000/admin/gallery
2. Drag image or click Select Files
3. Image appears in grid
4. Click trash to delete
```

### Edit Settings
```
1. Go to http://localhost:3000/admin/settings
2. Edit Marquee Text / Phone / Email
3. Click Save Changes
4. See success message
5. Refresh to verify saved
```

---

## 🧪 Quick Test

**Gallery:**
- [ ] Upload an image
- [ ] See it in grid
- [ ] Delete it
- [ ] Confirm deletion

**Settings:**
- [ ] Change marquee text
- [ ] Save changes
- [ ] Refresh page
- [ ] Verify text saved

**Theme:**
- [ ] Toggle dark/light mode
- [ ] Verify colors change
- [ ] Refresh page
- [ ] Verify theme persists

---

## 📞 Troubleshooting

| Problem | Solution |
|---------|----------|
| Upload fails | Bucket `gallery` doesn't exist → Create it |
| Settings won't save | Table `site_config` doesn't exist → Create it |
| Colors look wrong | Hard refresh: Cmd+Shift+R |
| Dark mode broken | Click moon icon in admin header |

---

## 📚 Full Docs

- **Setup Checklist:** `ADMIN_SETUP_CHECKLIST.md`
- **Feature Guide:** `ADMIN_GALLERY_SETTINGS_GUIDE.md`
- **Technical Ref:** `ADMIN_TECHNICAL_REFERENCE.md`
- **Status:** `ADMIN_GALLERY_SETTINGS_COMPLETE.md`

---

**Ready in 5 minutes! 🎉**
