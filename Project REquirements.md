==================================================
INFINITE STUDIO — COMPLETE MASTER PROMPT + COPYWRITING
==================================================

To ensure you have full control over your studio’s digital flagship, we need to add a robust **Admin Dashboard** section. This allows you to manage bookings, update space availability, and curate your gallery without touching a single line of code.

Here is the updated **Part 1**, now featuring the **Infinite Admin Suite**.

---

### PART 1: MASTER BUILD PROMPT (THE ARCHITECT’S BLUEPRINT)
==================================================

**THE CORE DIRECTIVE**
You are the Lead Developer and Art Director for **Infinite Studio**. You are building a digital flagship that feels less like a website and more like a high-end editorial magazine. This is a premium content creation brand in Abeokuta that sells "Creative Prestige." Every interaction must be tactile, cinematic, and whisper luxury. 

**INSPIRATION LOGIC**
*   **Grid System:** Mimic `contentspace.in`’s sophisticated, structured layout.
*   **Narrative Flow:** Adopt `acontentspace.com`’s creator-first psychology—positioning the studio as a partner in excellence.
*   **Atmosphere:** Use the minimalist, high-fashion aesthetic of `contentroombyld.com` (generous whitespace and serif storytelling).

---

### 1. TECH STACK & ARCHITECTURE
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS with a strict custom design token system.
- **Backend/Database:** Supabase (Auth, Database, and Storage).
- **Typography:** 
    - *Display:* Cormorant Garamond (Italic for emphasis, regular for storytelling).
    - *Body:* DM Sans (Clean, high-readability for functional data).
- **Animations:** Framer Motion (Targeting 60fps). Use `viewport` triggers for scroll-based reveals.
- **Asset Management:** `next/image` with Blurhash placeholders for a seamless "premium" load.

---

### 2. VISUAL IDENTITY & "THE FEEL"
- **Style:** Artistic Modern — editorial, high-fashion, "boutique" feel.
- **The Palette:**
    - **Light Mode:** `#FAF8F4` (Warm Alabaster), `#0D0D0D` (Obsidian text), `#C9A84C` (Muted Gold).
    - **Dark Mode:** `#0D0D0D` (Deep Black), `#2A2A2A` (Stone grey), `#C9A84C` (Amber gold).
- **Tactile UX:** 
    - Implement a custom "soft-circle" cursor that expands/transforms on hover.
    - Subtle film-grain overlay across the site to add "analog" depth to digital pixels.
    - **No standard components:** No flat corporate blues. Borders should be hair-thin (`0.5px`) or non-existent.

---

### 3. THE PAGE BLUEPRINTS

**A. LANDING PAGE (The Immersive Entry)**
*   **Hero:** Cinematic full-bleed video/image background. Staggered headline animation: *"Your Vision, Rendered in Infinite Detail."*
*   **The Marquee:** A slow, sophisticated crawl of services (e.g., *Editorial · Cinematic · Lifestyle · Corporate*).
*   **Interactive Grid:** Asymmetric Masonry layout for featured spaces. Hovering triggers a smooth grayscale-to-color transition and reveals "Mood Tags."

**B. SPACES PAGE (The Lookbook)**
*   **Header:** "Our Creative Environments."
*   **Space Cards:** Editorial vertical layout. Main image + 2 detail shots.
*   **Interactions:** Shared Layout animations (Framer Motion) expanding cards into full-screen views.

**C. BOOKING PAGE (The Concierge)**
*   **UX:** Multi-step frictionless flow (Atmosphere Selection → Timing → Logistics).
*   **Integrations:** Multi-channel booking (Supabase Form, Calendly, and "Direct to WhatsApp").

**D. ADMIN DASHBOARD (/admin) — "THE CONTROL CENTER"**
*   **Auth:** Secure login via Supabase Auth (protected routes).
*   **Modules:**
    - **Booking Manager:** View, filter (by date/status), and update booking statuses (Pending/Confirmed/Completed).
    - **Studio Control:** CRUD operations for the "Spaces." Change descriptions, toggle "is_active" status, or update pricing/mood tags instantly.
    - **Gallery Curator:** Upload new shoot results to the `studio-media` bucket and drag-and-drop to reorder how they appear on the live site.
    - **Site Settings:** Toggle the "Hero Marquee" text or update the Studio contact number across the site.

---

### 4. SUPABASE DATA SCHEMA
*   **Table: `bookings`**
    `id (UUID) | created_at | name | email | phone | spaces (text[]) | preferred_date | preferred_time | status (default: 'pending') | group_size | notes`
*   **Table: `spaces`**
    `id (UUID) | name | mood_tag | description | cover_image_url | gallery_images (text[]) | is_active (bool) | sort_order (int)`
*   **Table: `site_config`**
    `id | key | value (For dynamic text like marquee or phone numbers)`

---

### 5. THE "GOLD-STANDARD" CHECKLIST
*   [ ] **Zero-Friction:** Booking must take less than 60 seconds.
*   [ ] **Admin Privacy:** Ensure RLS (Row Level Security) is enabled—only you can edit data.
*   [ ] **Editorial SEO:** Meta tags tailored for "Abeokuta’s Premier Creative Studio."
*   [ ] **Performance:** Lighthouse score of 95+. No layout shifts.

**[BEGIN SCAFFOLDING: Initialize Next.js 14, setup Supabase Auth for the Admin page, and define the custom Tailwind Design Tokens.]**
==================================================
PART 2: WEBSITE COPYWRITING
==================================================

--- HERO ---
Headline: Where Your Vision Comes to Life
Subheadline: Abeokuta's most beautiful content creation studio. Six stunning themes. Professional lighting. Unforgettable results.
CTA 1: Book a Session | CTA 2: Explore Our Spaces

--- ABOUT TEASER ---
Heading: Built for creators, by creatives.
Body: Infinite Studio is not just a space — it's a stage. Nestled in the heart of Abeokuta at Omida Shopping Complex, we've curated six distinct themed environments designed to elevate every shoot, every reel, every moment worth capturing. Whether you're a solo content creator, a fashion brand, a photographer, or a business telling your story, our studio gives you the tools, the ambience, and the freedom to create without limits. Come in with an idea. Leave with a masterpiece.

--- WHAT'S INCLUDED ---
Section Heading: Everything You Need. Nothing You Don't.
1. Professional Lighting Rigs — Studio-grade lighting setups for flawless, flattering results every time.
2. Private Changing Room — Transition between looks with ease in your own dedicated space.
3. High-Speed WiFi — Stay connected, upload in real time, and keep your workflow moving.
4. Multiple Themed Backdrops — Six distinct themes — one booking. Switch between moods effortlessly.
5. Air Conditioning — Shoot comfortably, no matter the Abeokuta heat.

--- SPACES ---
Page Heading: Our Creative Spaces
Page Subheading: Six meticulously designed themes. Every one a story.

The Bar | Mood: Dramatic · Moody
Dark wood tones, ambient lighting, and a fully styled bar counter. Perfect for editorial shoots, music videos, lifestyle content, and anything with an edge.

Green Screen Studio | Mood: Versatile · Limitless
Step into any world. Our professional green screen setup gives you the power to place yourself anywhere — from fantasy sets to branded environments.

Vanity Mirror Corner | Mood: Glam · Editorial
Hollywood-style bulb lighting surrounds a full-length vanity mirror. Made for beauty content, brand shoots, and behind-the-scenes moments that feel like a magazine cover.

Eid Shoot Setup | Mood: Festive · Cultural
An elegantly decorated space built to celebrate. Rich colours, soft textures, and details that make every cultural moment feel timeless.

Staircase Scene | Mood: Architectural · Bold
Clean lines, natural light, and an architectural staircase that adds dimension and drama to any frame. A favourite for fashion, portrait, and lifestyle content.

Chair Space | Mood: Minimal · Refined
Simplicity at its finest. A beautifully lit, carefully styled single-chair setup — the kind of clean frame that lets your subject, your product, or your brand speak loudly.

Office Set | Mood: Professional · Corporate
A sleek, contemporary workspace setting ideal for business content, LinkedIn shots, corporate videos, and professional brand storytelling.

Bookshelf Wall | Mood: Intellectual · Warm
Floor-to-ceiling shelves, warm tones, and the kind of atmosphere that says "authoritative but approachable." Perfect for podcasts, thought leadership content, and lifestyle reels.

--- BOOKING PAGE ---
Heading: Let's Make Something Beautiful
Subheading: Ready to bring your vision to life? Book your session below.
WhatsApp pre-fill: Hi Infinite Studio! I'd like to book a session. Could you help me with availability and pricing?

--- ABOUT PAGE ---
Heading: We Built the Space You Always Needed
Body: Infinite Studio was born from a simple frustration — great creators in Abeokuta deserved a great studio. Not a makeshift setup in someone's living room. Not a trip to Lagos for a decent background. A proper, beautiful, professional creative space, right here at home. We designed every theme with intention. We sourced every prop with care. We set up every light to make you look your best. Because when you walk into Infinite Studio, you shouldn't have to think about logistics. You should be able to think about your art. We are located at Omida Shopping Complex, Abeokuta — and we are just getting started.

Why Infinite Studio:
1. Designed for Real Results — Every space is built with photography and videography in mind. We obsess over angles, lighting ratios, and colour theory so your content stands out.
2. A Space for Everyone — Solo creator. Fashion brand. Corporate team. Family portrait. Influencer. Whatever your goal, there's a space here for you.
3. A Full Experience, Not Just a Room — From arrival to upload, we want every moment to feel effortless, premium, and worth every kobo.

--- FOOTER ---
Tagline: Where Your Vision Comes to Life
Address: Omida Shopping Complex, Abeokuta, Ogun State, Nigeria
Social: @de_infinite_space | CTA: Book a Session
Legal: © 2025 Infinite Studio. All rights reserved.

--- SEO META ---
Homepage: Title: Infinite Studio | Content Creation Studio in Abeokuta | Desc: Abeokuta's most beautiful content creation studio. 6 stunning themed spaces, professional lighting, changing room & WiFi. Book your session today.
Spaces: Title: Our Spaces | Infinite Studio Abeokuta | Desc: Explore 6 unique themed spaces — The Bar, Green Screen, Vanity Mirror, Staircase, Office Set & more. Every theme designed for stunning content.
Booking: Title: Book a Session | Infinite Studio | Desc: Book your studio session via form, Calendly, WhatsApp, or Instagram. Easy, fast, flexible.
About: Title: About Us | Infinite Studio Abeokuta | Desc: Learn the story behind Infinite Studio — Abeokuta's premier creative content space built for photographers, videographers, brands, and creators.
Gallery: Title: Gallery | Infinite Studio | Desc: See what creators have made at Infinite Studio. Browse shoots from all 6 themed spaces.