# Quick Start Guide - Infinite Studio

## 🚀 Getting Started (5 minutes)

### Step 1: Install Dependencies

```bash
cd /Users/user/Desktop/Infinite-Studio/infinite-studio
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- Supabase
- Framer Motion
- Tailwind CSS
- And more...

### Step 2: Set Up Supabase

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)
   - Go to Console → New Project
   - Choose a region (e.g., ap-northeast-1 for faster Asia access)
   - Save your password securely

2. **Get your credentials** from Project Settings → API:
   - Copy `Project URL` (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - Copy `anon public` key (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - Copy `service_role` secret key (this is your `SUPABASE_SERVICE_ROLE_KEY`)

### Step 3: Create Database Tables

In Supabase SQL Editor, run:

```sql
-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  spaces TEXT[] NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed')),
  group_size INT DEFAULT 1,
  notes TEXT
);

-- Spaces table
CREATE TABLE spaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  mood_tag TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Site configuration
CREATE TABLE site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can read spaces" ON spaces FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read config" ON site_config FOR SELECT USING (true);
```

### Step 4: Create Storage Bucket

1. Go to **Storage** in Supabase console
2. Click **Create new bucket**
   - Name: `studio-media`
   - Public bucket: Yes
   - Click Create

### Step 5: Configure Environment Variables

Create `.env.local` in your project root:

```bash
# Copy from Supabase console
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE

# From Service Role Secret
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

# Contact info
NEXT_PUBLIC_WHATSAPP_NUMBER=2347000000000
```

### Step 6: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 📖 Project Structure Quick Reference

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home
│   ├── booking/page.tsx   # Booking form
│   ├── spaces/page.tsx    # Spaces showcase
│   ├── gallery/page.tsx   # Gallery
│   └── admin/             # Admin dashboard (protected)
├── components/            # Reusable React components
├── lib/                   # Utilities (Supabase client)
├── types/                 # TypeScript definitions
└── styles/               # Global CSS
```

## 🎨 Customization

### Update Brand Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  "light-bg": "#FAF8F4",        // Change here
  "light-text": "#0D0D0D",      // Change here
  "light-accent": "#C9A84C",    // Change here
}
```

### Update Contact Info

All contact info is in `src/components/Footer.tsx` and environment variables.

### Add Your Spaces

1. Go to **Admin Dashboard** → Spaces
2. Click "Add Space"
3. Fill in details and save

## 🔐 Deploying to Production

### Vercel (Easiest)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Then redeploy
vercel --prod
```

### Other Platforms

**Netlify**, **Railway**, or **AWS Amplify** also work. Just:
1. Connect your GitHub repo
2. Add environment variables to platform settings
3. Deploy!

## ✅ Verification Checklist

- [ ] Dependencies installed (`npm install` completed)
- [ ] Supabase project created
- [ ] Database tables created
- [ ] Storage bucket created
- [ ] `.env.local` filled with credentials
- [ ] Dev server running (`npm run dev`)
- [ ] Home page loads at localhost:3000
- [ ] Can navigate all public pages
- [ ] Booking form submits data

## 🐛 Troubleshooting

### Dependencies not found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Supabase connection error
- Check `.env.local` credentials are correct
- Verify Supabase project status is online
- Check firewall/proxy settings

### Build errors
```bash
# Check for TypeScript errors
npm run build

# Fix eslint issues
npx eslint --fix src/
```

## 📚 Next Steps

1. **Customize content**: Update copywriting in each page
2. **Add real images**: Replace placeholder images
3. **Set up payment**: Add Stripe/Paystack for paid bookings
4. **Configure email**: Add SendGrid/Mailgun for notifications
5. **Analytics**: Add Google Analytics or Mixpanel
6. **SEO**: Submit sitemap to Google Search Console

## 🎯 Key Features to Implement

- [ ] Admin authentication (email/password)
- [ ] Email confirmations on bookings
- [ ] SMS reminders (Twilio)
- [ ] Payment processing
- [ ] Review system
- [ ] Advanced analytics
- [ ] Email newsletter signup

## 📞 Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/

---

**You're all set!** 🚀 Start the dev server and begin customizing your studio website.
