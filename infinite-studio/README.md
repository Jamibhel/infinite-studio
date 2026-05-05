# Infinite Studio - Website & Admin Dashboard

A premium content creation studio booking platform built with Next.js 14, Supabase, and Tailwind CSS.

## 📋 Project Overview

Infinite Studio is a full-featured website and admin dashboard for a creative studio in Abeokuta. It includes:

- **Public Website**: Landing page, spaces showcase, booking system, about page, and gallery
- **Admin Dashboard**: Booking management, space management, gallery curator, and site settings
- **Supabase Integration**: Real-time database, authentication, and storage
- **Premium Design**: Editorial aesthetic with custom animations and responsive layout

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design tokens
- **Backend**: Supabase (Auth, Database, Storage)
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Database Client**: @supabase/supabase-js
- **UI Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
infinite-studio/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   ├── booking/
│   │   │   └── page.tsx            # Multi-step booking form
│   │   ├── spaces/
│   │   │   └── page.tsx            # Spaces showcase
│   │   ├── about/
│   │   │   └── page.tsx            # About page
│   │   ├── gallery/
│   │   │   └── page.tsx            # Gallery with filtering
│   │   └── admin/
│   │       ├── page.tsx            # Admin dashboard
│   │       ├── bookings/
│   │       │   └── page.tsx        # Booking manager
│   │       ├── spaces/
│   │       │   └── page.tsx        # Space management
│   │       ├── gallery/
│   │       │   └── page.tsx        # Gallery curator
│   │       └── settings/
│   │           └── page.tsx        # Site settings
│   ├── components/
│   │   ├── Navigation.tsx          # Top navigation bar
│   │   ├── Footer.tsx              # Footer
│   │   └── AdminLayout.tsx         # Admin sidebar layout
│   ├── lib/
│   │   └── supabase.ts             # Supabase client
│   ├── types/
│   │   └── index.ts                # TypeScript types
│   └── styles/
│       └── globals.css             # Global styles
├── public/                         # Static assets
├── package.json                    # Dependencies
├── tailwind.config.ts              # Tailwind configuration
├── next.config.js                  # Next.js configuration
└── .env.local.example              # Environment variables template
```

## 🎨 Design System

### Colors
- **Light Mode**: `#FAF8F4` (Warm Alabaster bg), `#0D0D0D` (Obsidian text), `#C9A84C` (Muted Gold accent)
- **Dark Mode**: `#0D0D0D` (Deep Black bg), `#2A2A2A` (Stone grey), `#C9A84C` (Amber gold accent)

### Typography
- **Display**: Cormorant Garamond (serif, editorial feel)
- **Body**: DM Sans (sans-serif, clean and readable)

### UI Elements
- Border Radius: `12px` (soft corners)
- Film Grain Overlay: Subtle analog texture overlay
- Custom Cursor: Gold circle that expands on hover

## 🗄️ Supabase Schema

### Tables

#### `bookings`
```sql
id (UUID, PK)
created_at (timestamp)
name (text)
email (text)
phone (text)
spaces (text[])
preferred_date (date)
preferred_time (time)
status (text: pending, confirmed, completed)
group_size (int)
notes (text)
```

#### `spaces`
```sql
id (UUID, PK)
name (text)
mood_tag (text)
description (text)
cover_image_url (text)
gallery_images (text[])
is_active (boolean)
sort_order (int)
created_at (timestamp)
```

#### `site_config`
```sql
id (UUID, PK)
key (text, unique)
value (text)
```

### Storage Buckets
- `studio-media`: Gallery and space images
  - Row Level Security: Public read, authenticated write

### Row Level Security
- Bookings: Users can only read their own bookings (via email), admins can manage all
- Spaces: Public read access
- Site Config: Public read access

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### 1. Install Dependencies

```bash
cd infinite-studio
npm install
```

### 2. Configure Supabase

1. Create a new project on [supabase.com](https://supabase.com)
2. Create the tables as per schema above
3. Set up authentication (Email provider recommended)
4. Create storage bucket `studio-media`
5. Configure Row Level Security policies

### 3. Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Update with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
NEXT_PUBLIC_CALENDLY_URL=your_calendly_url
NEXT_PUBLIC_WHATSAPP_NUMBER=2347000000000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📄 Pages & Features

### Public Pages

#### Home (`/`)
- Hero section with CTA buttons
- Service marquee (animated scroll)
- Featured spaces preview
- Features showcase
- About teaser

#### Spaces (`/spaces`)
- All 8 spaces with descriptions
- Mood tags and details
- Responsive grid layout

#### Booking (`/booking`)
- 3-step form wizard:
  1. Atmosphere selection (space choice)
  2. Timing (date & time)
  3. Logistics (client details)
- WhatsApp integration
- Form validation with React Hook Form

#### About (`/about`)
- Studio story and mission
- Why choose Infinite Studio
- Location information
- CTA to booking

#### Gallery (`/gallery`)
- Filterable gallery by space
- Image grid with hover effects
- Client work showcase

### Admin Pages (`/admin`)

#### Dashboard (`/admin`)
- Key metrics (bookings, pending, gallery items, spaces)
- Recent bookings overview
- Quick action cards

#### Bookings (`/admin/bookings`)
- List all bookings
- Filter by date/status
- Change booking status (pending → confirmed → completed)
- View booking details
- Delete bookings

#### Spaces (`/admin/spaces`)
- CRUD operations for spaces
- Toggle space active status
- Edit descriptions and mood tags
- Update pricing
- Reorder spaces with drag & drop

#### Gallery (`/admin/gallery`)
- Upload new images
- Organize by space
- Drag & drop reordering
- Delete images

#### Settings (`/admin/settings`)
- Update hero marquee text
- Change studio phone number
- Toggle features
- Update contact information

## 🔐 Authentication & Security

- **Admin Protection**: Protected routes redirect unauthenticated users to login
- **Row Level Security**: Database policies enforce user permissions
- **Environment Variables**: Sensitive keys in `.env.local` only
- **Client-side Validation**: React Hook Form validation
- **Server-side Validation**: Add API routes for critical operations

## 🎬 Animations & Effects

- **Scroll Triggers**: Framer Motion viewport-based animations
- **Marquee**: Continuous animated text scroll
- **Hover Effects**: Interactive card scaling and color transitions
- **Page Transitions**: Smooth fade-in animations
- **Film Grain**: Subtle overlay texture for premium feel

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Mobile navigation menu
- Touch-friendly button sizes

## 🚀 Performance Optimization

- Image optimization with `next/image`
- Blurhash placeholders for fast loading
- CSS-in-JS optimizations
- Code splitting via dynamic imports
- SEO meta tags on all pages

## 📊 SEO

- Meta titles and descriptions on all pages
- Open Graph tags for social sharing
- Semantic HTML structure
- Sitemap generation (can be added)
- Structured data (Schema.org) ready

## 🔄 Integration Points

### WhatsApp Integration
- Pre-filled messages for bookings
- Direct contact link
- Mobile-friendly

### Calendly Integration
- Embed calendar on booking page
- Alternative booking method
- Sync with studio calendar

### Email Integration
- Booking confirmations (add nodemailer/sendgrid)
- Admin notifications
- Customer follow-ups

## 📝 Future Enhancements

- [ ] Payment integration (Stripe/Paystack)
- [ ] Email notifications (Nodemailer)
- [ ] SMS alerts (Twilio)
- [ ] Video testimonials section
- [ ] Client portfolio showcase
- [ ] Review/ratings system
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)

## 🧪 Testing

Add test files:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

## 📦 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
- Netlify
- Railway
- AWS Amplify

### Environment Variables on Production
Add to your hosting platform's environment settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Other config variables

## 📞 Support & Contact

- **Studio**: +234 700 0000 000
- **Email**: hello@infinitestudio.com
- **Location**: Omida Shopping Complex, Abeokuta
- **Instagram**: @de_infinite_space

## 📄 License

© 2025 Infinite Studio. All rights reserved.

---

Built with ❤️ for Infinite Studio
