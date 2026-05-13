"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Sparkles, Check, Star, GalleryHorizontal, Film } from "lucide-react"
import { FAQ } from "@/components/FAQ"
import { useSettings } from "@/lib/settings-context"
import { createClient } from "@supabase/supabase-js"

interface GalleryItem {
  id: string
  url: string
  space_name: string | null
  caption: string
}

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".avi", ".mkv"]
const isVideoFile = (filename: string) => VIDEO_EXTENSIONS.some(ext => filename.toLowerCase().endsWith(ext))

export default function Home() {
  const [isMobile, setIsMobile] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const { settings, loading } = useSettings()
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [galleryLoading, setGalleryLoading] = useState(true)

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  // Deep parallax for the background
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  
  // Fade and scale down the content as it scrolls out of view
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 640)
    onResize()
    window.addEventListener("resize", onResize)

    const rm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduceMotion(rm ? rm.matches : false)

    return () => window.removeEventListener("resize", onResize)
  }, [])

  // Fetch live gallery images from Supabase
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || "",
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
        )
        // Get all files from the gallery bucket
        const { data: files } = await supabase.storage.from("gallery").list("", { limit: 6, sortBy: { column: "created_at", order: "desc" } })
        if (!files || files.length === 0) { setGalleryLoading(false); return }

        // Get metadata (space tags / captions) from gallery_metadata table
        const ids = files.map(f => f.name)
        const { data: meta } = await supabase.from("gallery_metadata").select("id, space_id, caption")
        const metaMap: Record<string, { space_id: string; caption: string }> = {}
        if (meta) meta.forEach((m: any) => { metaMap[m.id] = m })

        // Get space names for space_ids we have
        const spaceIds = [...new Set(Object.values(metaMap).map(m => m.space_id).filter(Boolean))]
        const { data: spacesData } = spaceIds.length > 0
          ? await supabase.from("spaces").select("id, name").in("id", spaceIds)
          : { data: [] }
        const spaceMap: Record<string, string> = {}
        if (spacesData) spacesData.forEach((s: any) => { spaceMap[s.id] = s.name })

        const items: GalleryItem[] = files
          .filter(f => f.name !== ".emptyFolderPlaceholder")
          .map(f => {
            const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(f.name)
            const m = metaMap[f.name]
            return {
              id: f.name,
              url: urlData.publicUrl,
              space_name: m?.space_id ? spaceMap[m.space_id] || null : null,
              caption: m?.caption || "",
            }
          })

        setGalleryItems(items)
      } catch (e) {
        console.error("Gallery fetch error:", e)
      } finally {
        setGalleryLoading(false)
      }
    }
    fetchGallery()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: isMobile ? 0.08 : 0.16, delayChildren: 0.18 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: isMobile ? 8 : 24, scale: isMobile ? 0.996 : 0.998 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: isMobile ? 0.5 : 0.75, ease: "easeOut" } },
  }

  const marqueeText = settings.marquee_text ? settings.marquee_text.split("·")[0].trim() || "Where Your Vision Becomes Content" : "Where Your Vision Becomes Content"
  const headingWords = marqueeText.split(" ")

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}>
      {/* ===== HERO SECTION ===== */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 mt-16 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1200&h=900&fit=crop')",
          backgroundAttachment: "fixed",
        }}
      >

        {/* background multilayer parallax for mobile first */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          initial={{ scale: 1.05 }}
          style={{ 
            backgroundImage: "inherit", 
            backgroundSize: "cover", 
            backgroundPosition: "center",
            y: reduceMotion ? 0 : bgY,
            willChange: "transform"
          }}
        />

        {/* soft vignette layer that pulses */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0.08 }}
          animate={reduceMotion ? {} : { opacity: [0.08, 0.02, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.3), transparent 40%)" }}
        />

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            willChange: "transform, opacity"
          }}
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-block mb-6 glass-strong shadow-lg"
            style={{ color: "white", transformOrigin: "center" }}
            animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [0, -2, 0], opacity: [1, 0.96, 1] }}
            transition={reduceMotion ? undefined : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
              <Sparkles size={16} />
              {settings.studio_name}
            </span>
          </motion.div>

          {/* Main Heading */}
          <h1
            className="heading-h1 mb-6 flex flex-wrap justify-center gap-x-3 gap-y-2"
            style={{ color: "white", textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}
          >
            {headingWords.map((word, i) => (
              <span key={i} className="overflow-hidden inline-block px-1">
                <motion.span
                  className="inline-block"
                  initial={reduceMotion ? { opacity: 0 } : { y: "100%", rotate: 4 }}
                  animate={reduceMotion ? { opacity: 1 } : { y: 0, rotate: 0 }}
                  transition={{
                    type: "spring",
                    damping: 18,
                    stiffness: 100,
                    delay: 0.1 + i * 0.08
                  }}
                  style={{ willChange: "transform, opacity" }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl mb-8"
            style={{ color: "rgba(255, 255, 255, 0.9)" }}
          >
            {settings.studio_description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/booking">
              <motion.button
                whileTap={reduceMotion ? undefined : { scale: isMobile ? 0.97 : 0.985, y: isMobile ? 0 : -1 }}
                whileHover={reduceMotion ? undefined : { scale: 1.03, y: -2 }}
                className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto shadow-2xl"
                style={{
                  backgroundColor: "var(--cta-primary)",
                  color: "white",
                }}
              >
                Book Now <ArrowRight size={20} />
              </motion.button>
            </Link>
            <Link href="/spaces">
              <motion.button
                whileTap={reduceMotion ? undefined : { scale: isMobile ? 0.985 : 0.995 }}
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                className="w-full sm:w-auto px-6 py-3 text-sm font-semibold rounded-lg transition-all"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                Explore Spaces
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { number: "∞", label: "Creative Possibilities" },
              { number: "100+", label: "Happy Creators" },
              { number: "4K", label: "Hours Booked" },
              { number: "24/7", label: "Support" },
            ].map((stat, idx) => (
              <div key={idx}>
                <div
                  className="text-3xl sm:text-4xl font-bold"
                  style={{ color: "var(--cta-primary)" }}
                >
                  {stat.number}
                </div>
                <div style={{ color: "var(--text-muted)" }} className="text-sm mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Spaces removed — content moved to dedicated Spaces page */}

      {/* ===== WHY CHOOSE US ===== */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: "var(--surface)", borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-h2 mb-4">Why Choose {settings.studio_name}</h2>
            <p className="text-lg" style={{ color: "var(--text-muted)" }}>
              Everything creators need to produce professional content
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Professional Equipment",
                desc: "Cinema-grade lighting, 4K cameras, and premium audio setup",
              },
              {
                title: "Flexible Booking",
                desc: "Hourly slots, half-day packages, or custom monthly plans",
              },
              {
                title: "Creative Support",
                desc: "Our team helps bring your vision to life with expert guidance",
              },
              {
                title: "Prime Location",
                desc: "Easy access with ample parking and comfortable facilities",
              },
              {
                title: "Aesthetic Design",
                desc: "Every corner is Instagram-worthy and production-ready",
              },
              {
                title: "Community",
                desc: "Connect with other creators and collaborate on projects",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.95 }}
                whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                whileHover={reduceMotion ? undefined : { y: -4, scale: 1.02 }}
                transition={{ 
                  duration: 0.5, 
                  delay: isMobile ? idx * 0.05 : idx * 0.1, 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 15 
                }}
                viewport={{ once: true, margin: "-50px" }}
                className="p-4 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "var(--tag-accent)" }}
                  >
                    <Check style={{ color: "var(--cta-primary)" }} size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">{feature.title}</h3>
                    <p style={{ color: "var(--text-muted)" }}>{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-h2 mb-4">What Creators Say</h2>
            <p className="text-lg" style={{ color: "var(--text-muted)" }}>
              Join hundreds of satisfied content creators
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: "Adeyemi Johnson",
                role: "Podcast Host & Creator",
                quote:
                  `${settings.studio_name} completely changed my production game. The equipment is top-notch and the team is super supportive!`,
                avatar: "https://images.unsplash.com/photo-1507009974461-92a795e61a81?w=100&h=100&fit=crop",
              },
              {
                name: "Folake Okafor",
                role: "Beauty & Lifestyle Creator",
                quote:
                  "Finally found a studio that looks as good as studios in Lagos. The lighting is absolutely perfect!",
                avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
              },
              {
                name: "Chisom Nwankwo",
                role: "YouTube Content Creator",
                quote:
                  "The flexibility with booking slots is amazing. I can create on my schedule without any stress.",
                avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
              },
              {
                name: "Ife Adelusi",
                role: "Corporate Video Producer",
                quote:
                  "Professional setup, creative team, and pricing that makes sense. Highly recommend for brands!",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
                whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                whileHover={reduceMotion ? undefined : { y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
                transition={{ type: "spring", stiffness: 100, damping: 15, delay: isMobile ? idx * 0.1 : idx * 0.2 }}
                viewport={{ once: true, margin: "-50px" }}
                className="card p-6 flex flex-col transition-all duration-300"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0"
                    style={{
                      backgroundImage: `url('${testimonial.avatar}')`,
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p style={{ color: "var(--text-muted)" }} className="text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                  <div style={{ color: "var(--cta-primary)" }}>
                    <Star size={18} fill="currentColor" />
                  </div>
                </div>
                <p className="italic" style={{ color: "var(--text-muted)" }}>
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <FAQ />

  {/* Blog removed from homepage — see /blog for posts */}

      {/* ===== GALLERY SECTION ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-h2 mb-4">Creative Showcase</h2>
            <p className="text-lg" style={{ color: "var(--text-muted)" }}>
              See what's being created at {settings.studio_name}
            </p>
          </motion.div>

          {galleryLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 rounded-xl animate-pulse" style={{ backgroundColor: "var(--surface)" }} />
              ))}
            </div>
          ) : galleryItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 rounded-2xl"
              style={{ backgroundColor: "var(--surface)", border: "2px dashed var(--border)" }}
            >
              <GalleryHorizontal size={48} className="mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
              <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Gallery coming soon</p>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Images will appear here once uploaded from the admin panel</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {galleryItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-xl h-80 cursor-pointer"
                  style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
                >                  {/* Media */}
                  {isVideoFile(item.id) ? (
                    <video
                      src={item.url}
                      muted
                      autoPlay
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${item.url}')` }}
                    />
                  )}

                  {/* Video badge */}
                  {isVideoFile(item.id) && (
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center z-10">
                      <Film size={14} className="text-white" />
                    </div>
                  )}

                  {/* Space tag */}
                  {item.space_name && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white z-10"
                      style={{ backgroundColor: "var(--cta-primary)" }}>
                      {item.space_name}
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.caption && (
                      <p className="text-white text-sm font-medium">{item.caption}</p>
                    )}
                    {item.space_name && !item.caption && (
                      <p className="text-white/80 text-sm">Shot in {item.space_name}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/gallery">
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "var(--cta-primary)", color: "white" }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 font-semibold rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                }}
              >
                View Full Gallery →
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "var(--cta-primary)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center text-white"
        >
          <h2 className="heading-h2 mb-6">Ready to Create Something Amazing?</h2>
          <p className="text-xl mb-8 opacity-90">
            Book your session today and join the community of creators pushing boundaries
          </p>
          <Link href="/booking">
            <button
              className="px-8 py-3 font-semibold rounded-lg transition-all"
              style={{
                backgroundColor: "white",
                color: "var(--cta-primary)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Start Booking Now
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
