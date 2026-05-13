"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Star, Clock, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

interface Space {
  id: string
  name: string
  description: string
  mood_tag: string
  cover_image_url: string | null
  is_active: boolean
  pricing: number
}



export function SpacesContent() {
  const [spaces, setSpaces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  useEffect(() => {
    fetchLiveSpaces()

    const channel = supabase.channel('public:spaces')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'spaces' },
        () => {
          fetchLiveSpaces()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchLiveSpaces() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("spaces")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        
      if (error) throw error

      if (data && data.length > 0) {
        const liveSpaces = data.map((s: any) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          pricing: s.pricing || 10000,
          mood_tag: s.mood_tag || "Modern",
          image: s.gallery_images && s.gallery_images.length > 0 ? s.gallery_images[0] : "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=400&fit=crop",
          features: [] // amenities column removed
        }))
        setSpaces(liveSpaces)
      } else {
        // Fallback if no spaces exist in DB yet
        setSpaces([])
      }
    } catch (err) {
      setSpaces([])
      console.error("Failed to fetch spaces:", err)
    } finally {
      setLoading(false)
    }
  }

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      Modern: "#3B82F6",
      Vintage: "#F59E0B",
      Cinematic: "#EF4444",
      Corporate: "#10B981",
      Minimalist: "#6B7280",
      Beauty: "#EC4899",
      Editorial: "#8B5CF6",
      Lifestyle: "#F97316",
      Intellectual: "#6366F1",
    }
    return colors[mood] || "#3B82F6"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg)" }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--cta-primary)" }} />
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}>
      {/* ===== HERO ===== */}
      <section
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 mt-16 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=1200&h=900&fit=crop')",
          backgroundAttachment: "fixed",
        }}
      >
        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="heading-h1 mb-6" style={{ color: "white" }}>
            {spaces.length} Creative Spaces
          </h1>
          <p className="text-xl sm:text-2xl mb-8" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
            Each uniquely designed to inspire, elevate, and bring your creative vision to life
          </p>
        </motion.div>
      </section>

      {/* ===== SPACES GRID ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {spaces.map((space, idx) => (
              <motion.div
                key={space.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredId(space.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group h-full flex flex-col overflow-hidden rounded-xl transition-all duration-300 hover:shadow-2xl"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  border: "1px solid var(--border)",
                  transform: hoveredId === space.id ? "translateY(-8px)" : "translateY(0)",
                }}
              >
                {/* IMAGE CONTAINER */}
                <div className="relative h-64 overflow-hidden bg-gray-900">
                  <motion.img
                    src={space.image}
                    alt={space.name}
                    className="w-full h-full object-cover"
                    animate={{
                      scale: hoveredId === space.id ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* OVERLAY GRADIENT */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* MOOD TAG */}
                  <motion.div
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold text-white"
                    style={{
                      backgroundColor: getMoodColor(space.mood_tag),
                    }}
                    animate={{
                      opacity: hoveredId === space.id ? 1 : 0.7,
                      y: hoveredId === space.id ? 0 : -5,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {space.mood_tag}
                  </motion.div>

                  {/* QUICK VIEW BUTTON */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ opacity: hoveredId === space.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={`/spaces/${space.id}`}>
                      <button
                        className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-transform duration-300 hover:scale-110"
                        style={{
                          backgroundColor: "var(--cta-primary)",
                          color: "white",
                        }}
                      >
                        Quick View
                        <ArrowRight size={18} />
                      </button>
                    </Link>
                  </motion.div>
                </div>

                {/* CONTENT */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* NAME */}
                  <h3 className="heading-h3 mb-2 group-hover:text-blue-500 transition-colors">
                    {space.name}
                  </h3>

                  {/* DESCRIPTION */}
                  <p
                    className="text-sm line-clamp-2 mb-4"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {space.description}
                  </p>

                  {/* DIVIDER */}
                  <div
                    className="mb-4"
                    style={{
                      borderTop: "1px solid var(--border)",
                    }}
                  />

                  {/* PRICE & ACTIONS */}
                  <div className="mt-auto">
                    <div className="mb-4 flex items-baseline justify-between">
                      <div>
                        <p style={{ color: "var(--text-muted)" }} className="text-xs uppercase tracking-wider">
                          Starting at
                        </p>
                        <p
                          className="text-2xl font-bold"
                          style={{ color: "var(--cta-primary)" }}
                        >
                          ₦{(space.pricing || 5500).toLocaleString()}
                          <span className="text-sm font-normal ml-1" style={{ color: "var(--text-muted)" }}>
                            /hour
                          </span>
                        </p>
                      </div>
                      <Star
                        size={20}
                        style={{ color: getMoodColor(space.mood_tag) }}
                        fill={hoveredId === space.id ? "currentColor" : "none"}
                        className="transition-all duration-300"
                      />
                    </div>

                    {/* CTA BUTTONS */}
                    <div className="flex gap-3">
                      <Link href={`/spaces/${space.id}`} className="flex-1">
                        <button
                          className="w-full py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
                          style={{
                            backgroundColor: "var(--cta-primary)",
                            color: "white",
                          }}
                        >
                          Details
                        </button>
                      </Link>
                      <Link href="/booking" className="flex-1">
                        <button
                          className="w-full py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
                          style={{
                            backgroundColor: "transparent",
                            color: "var(--text-primary)",
                            border: "2px solid var(--cta-primary)",
                          }}
                        >
                          Book Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOOKING OPTIONS ===== */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "var(--surface)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-h2 mb-4">Flexible Booking Options</h2>
            <p className="text-lg" style={{ color: "var(--text-muted)" }}>
              Choose the perfect plan for your creative needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Hourly Slots",
                price: "Starting from ₦10,000",
                desc: "Perfect for quick shoots, product photography, or short content bursts",
                features: ["Flexible timing", "Equipment access", "Studio support"],
              },
              {
                title: "Half-Day Package",
                price: "₦40,000 - ₦50,000",
                desc: "Ideal for multiple setups, team shoots, or brand campaigns",
                features: ["4-hour session", "Multiple spaces", "Priority support"],
                featured: true,
              },
              {
                title: "Custom Plans",
                price: "Let's talk",
                desc: "Monthly passes, bulk bookings, or specialized setups for brands",
                features: ["Flexible terms", "Dedicated support", "Special rates"],
              },
            ].map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`p-8 rounded-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.featured ? "scale-105" : ""
                }`}
                style={{
                  backgroundColor: "var(--bg)",
                  borderColor: plan.featured ? "var(--cta-primary)" : "var(--border)",
                }}
              >
                {plan.featured && (
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
                    style={{
                      backgroundColor: "var(--tag-accent)",
                      color: "var(--text-primary)",
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <h3 className="heading-h3 mb-2">{plan.title}</h3>
                <div className="text-3xl font-bold mb-4" style={{ color: "var(--cta-primary)" }}>
                  {plan.price}
                </div>
                <p className="mb-6" style={{ color: "var(--text-muted)" }}>
                  {plan.desc}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "var(--tag-accent)" }}
                      >
                        <span style={{ color: "var(--cta-primary)" }}>✓</span>
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/booking" className="w-full block">
                  <button
                    className="w-full py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
                    style={{
                      backgroundColor: plan.featured ? "var(--cta-primary)" : "var(--surface)",
                      color: plan.featured ? "white" : "var(--text-primary)",
                      border: plan.featured ? "none" : "1px solid var(--border)",
                    }}
                  >
                    Get Started
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
