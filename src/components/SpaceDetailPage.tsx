"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

interface SpaceData {
  id: string
  name: string
  description: string
  mood_tag: string
  is_active: boolean
  gallery_images: string[]
  pricing: number
  amenities: string[]
}

const AMENITY_ICONS: Record<string, React.ElementType> = {
  "WiFi": require("lucide-react").Wifi,
  "Power Supply": require("lucide-react").Zap,
  "AC/Cooling": require("lucide-react").AirVent,
  "Sound System": require("lucide-react").Volume2,
  "Coffee/Tea": require("lucide-react").Coffee,
  "Camera Mount": require("lucide-react").Camera,
}

interface AddOn {
  id: string
  name: string
  price: number
  description: string
}



export function SpaceDetailPage({ spaceId }: { spaceId: string }) {
  const [space, setSpace] = useState<SpaceData | null>(null)
  const [addOns, setAddOns] = useState<AddOn[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [spaceRes, configRes] = await Promise.all([
          supabase.from("spaces").select("*").eq("id", spaceId).single(),
          supabase.from("site_config").select("value").eq("key", "addons").single()
        ])

        if (spaceRes.data) {
          setSpace({
            id: spaceRes.data.id,
            name: spaceRes.data.name,
            description: spaceRes.data.description || "",
            mood_tag: spaceRes.data.mood_tag || "",
            is_active: spaceRes.data.is_active !== false,
            gallery_images: spaceRes.data.gallery_images || [],
            pricing: spaceRes.data.pricing || 0,
            amenities: spaceRes.data.amenities || [],
          })
        }

        if (configRes.data?.value) {
          try { setAddOns(JSON.parse(configRes.data.value)) } catch {}
        }
      } catch (err) {
        console.error("Failed to load space:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [spaceId])

  if (loading) {
    return (
      <main className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg)" }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--cta-primary)" }} />
      </main>
    )
  }

  if (!space) {
    return (
      <main className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}>
        <div className="text-center">
          <h1 className="heading-h1 mb-4">Space Not Found</h1>
          <p className="mb-6" style={{ color: "var(--text-muted)" }}>We couldn't find the space you're looking for.</p>
          <Link href="/spaces">
            <button className="px-6 py-3 rounded-lg font-semibold text-white" style={{ backgroundColor: "var(--cta-primary)" }}>Back to Spaces</button>
          </Link>
        </div>
      </main>
    )
  }

  const handleNext = () => setSelectedImageIndex((prev) => (prev + 1) % Math.max(space.gallery_images.length, 1))
  const handlePrev = () => setSelectedImageIndex((prev) => (prev - 1 + Math.max(space.gallery_images.length, 1)) % Math.max(space.gallery_images.length, 1))
  const toggleAddOn = (id: string) => setSelectedAddOns(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])

  const hasImages = space.gallery_images.length > 0
  const currentImage = hasImages ? space.gallery_images[selectedImageIndex] : null

  return (
    <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <Link href="/spaces" className="inline-block mb-8">
          <button className="px-4 py-2 rounded-lg font-semibold transition-all" style={{ backgroundColor: "var(--surface)", color: "var(--text-primary)" }}>
            ← Back to Spaces
          </button>
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h1 className="heading-h1">{space.name}</h1>
            {space.mood_tag && (
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "var(--cta-primary)", color: "white" }}>
                {space.mood_tag}
              </span>
            )}
          </div>
          <p className="text-lg mb-6 leading-relaxed max-w-3xl" style={{ color: "var(--text-muted)" }}>{space.description}</p>

          {/* Price */}
          <div className="inline-block p-4 rounded-xl" style={{ backgroundColor: "var(--surface)" }}>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold" style={{ color: "var(--cta-primary)" }}>₦{space.pricing.toLocaleString()}</span>
              <span style={{ color: "var(--text-muted)" }}>/hour</span>
            </div>
          </div>
        </motion.div>

        {/* Image Gallery */}
        {hasImages && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-12">
            <div className="relative">
              <div className="w-full h-72 sm:h-96 md:h-[500px] rounded-2xl overflow-hidden relative" style={{ backgroundColor: "var(--surface)" }}>
                {currentImage && currentImage.match(/\.(mp4|webm|mov)$/i) ? (
                  <video src={currentImage} autoPlay muted loop playsInline className="w-full h-full object-contain" />
                ) : (
                  <img src={currentImage || ""} alt={space.name} className="w-full h-full object-contain" />
                )}
                
                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity">
                  {selectedImageIndex > 0 && (
                    <motion.button onClick={handlePrev} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-3 rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                      <ChevronLeft size={28} color="white" />
                    </motion.button>
                  )}
                  <div />
                  {selectedImageIndex < space.gallery_images.length - 1 && (
                    <motion.button onClick={handleNext} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-3 rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                      <ChevronRight size={28} color="white" />
                    </motion.button>
                  )}
                </div>
                <div className="absolute bottom-4 right-4 px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                  {selectedImageIndex + 1} / {space.gallery_images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {space.gallery_images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {space.gallery_images.map((img, idx) => {
                    const isVid = img.match(/\.(mp4|webm|mov)$/i);
                    return (
                      <motion.button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all relative bg-black"
                        style={{
                          outline: idx === selectedImageIndex ? "3px solid var(--cta-primary)" : "none",
                          opacity: idx === selectedImageIndex ? 1 : 0.5,
                        }}
                      >
                        {isVid ? (
                          <video src={img} className="w-full h-full object-cover" />
                        ) : (
                          <img src={img} className="w-full h-full object-cover" />
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Amenities */}
        {space.amenities.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-12">
            <h2 className="heading-h2 mb-6">Features & Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {space.amenities.map(amenity => {
                const Icon = AMENITY_ICONS[amenity] || require("lucide-react").Sparkles
                return (
                  <div key={amenity} className="flex flex-col items-center justify-center p-4 rounded-xl text-center" style={{ backgroundColor: "var(--surface)" }}>
                    <Icon size={24} className="mb-2" style={{ color: "var(--cta-primary)" }} />
                    <span className="text-sm font-semibold">{amenity}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Add-ons */}
        {addOns.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} className="mb-12">
            <h2 className="heading-h2 mb-2">Enhance Your Booking</h2>
            <p className="mb-6" style={{ color: "var(--text-muted)" }}>Add professional services to elevate your shoot</p>
            <div className="grid md:grid-cols-2 gap-4">
              {addOns.map((addon, idx) => (
                <motion.button
                  key={addon.id}
                  type="button"
                  onClick={() => toggleAddOn(addon.id)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + idx * 0.05 }}
                  className="p-4 rounded-xl border-2 transition-all hover:shadow-lg text-left"
                  style={{
                    backgroundColor: selectedAddOns.includes(addon.id) ? "var(--cta-primary)" : "var(--surface)",
                    borderColor: selectedAddOns.includes(addon.id) ? "var(--cta-primary)" : "var(--border)",
                    color: selectedAddOns.includes(addon.id) ? "white" : "var(--text-primary)",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold mb-1">{addon.name}</h3>
                      <p className="text-sm" style={{ color: selectedAddOns.includes(addon.id) ? "rgba(255,255,255,0.85)" : "var(--text-muted)" }}>{addon.description}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ml-2"
                      style={{ backgroundColor: selectedAddOns.includes(addon.id) ? "rgba(255,255,255,0.2)" : "var(--bg)", color: selectedAddOns.includes(addon.id) ? "white" : "var(--cta-primary)" }}>
                      +₦{addon.price.toLocaleString()}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row gap-4">
          <Link href={`/booking?space=${space.id}${selectedAddOns.length > 0 ? `&addons=${selectedAddOns.join(",")}` : ""}`} className="flex-1">
            <button className="w-full px-8 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-lg" style={{ backgroundColor: "var(--cta-primary)" }}>
              Book This Space <ArrowRight size={20} />
            </button>
          </Link>
          <Link href="/spaces" className="flex-1">
            <button className="w-full px-8 py-4 rounded-xl font-semibold transition-all" style={{ backgroundColor: "var(--surface)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
              View All Spaces
            </button>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
