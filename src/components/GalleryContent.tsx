"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, X, ChevronLeft, Film } from "lucide-react"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

interface GalleryItem {
  id: string
  url: string
  space_id: string | null
  space_name: string | null
}

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".avi", ".mkv"]
const isVideo = (filename: string) => VIDEO_EXTENSIONS.some(ext => filename.toLowerCase().endsWith(ext))

export function GalleryContent() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeFilter, setActiveFilter] = useState("all")
  const [spaceFilters, setSpaceFilters] = useState<{ id: string; name: string }[]>([])

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      setLoading(true)
      const [storageRes, metaRes, spacesRes] = await Promise.all([
        supabase.storage.from("gallery").list("", { limit: 200 }),
        supabase.from("gallery_metadata").select("*"),
        supabase.from("spaces").select("id, name").eq("is_active", true)
      ])

      if (storageRes.error) throw storageRes.error

      const metaMap: Record<string, any> = {}
      if (metaRes.data) {
        for (const m of metaRes.data) { metaMap[m.id] = m }
      }

      const spacesMap: Record<string, string> = {}
      if (spacesRes.data) {
        for (const s of spacesRes.data) { spacesMap[s.id] = s.name }
      }

      const withUrls = (storageRes.data || [])
        .filter((f: any) => !f.name.startsWith("."))
        .map((f: any) => {
          const meta = metaMap[f.name]
          const spaceId = meta?.space_id || null
          return {
            id: f.name,
            url: supabase.storage.from("gallery").getPublicUrl(f.name).data.publicUrl,
            space_id: spaceId,
            space_name: spaceId ? (spacesMap[spaceId] || null) : null,
          }
        })

      setGalleryItems(withUrls)

      // Build unique filters from tagged images
      const usedSpaces = new Set<string>()
      for (const item of withUrls) {
        if (item.space_id && item.space_name) usedSpaces.add(item.space_id)
      }
      const filters = Array.from(usedSpaces).map(id => ({
        id,
        name: spacesMap[id] || id,
      }))
      setSpaceFilters(filters)
    } catch (err) {
      console.error("Failed to fetch gallery:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = activeFilter === "all"
    ? galleryItems
    : galleryItems.filter(item => item.space_id === activeFilter)

  const handleImageClick = (item: GalleryItem, index: number) => {
    setSelectedImage(item)
    setCurrentIndex(index)
  }

  const handleNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      const nextItem = filteredItems[currentIndex + 1]
      setSelectedImage(nextItem)
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevItem = filteredItems[currentIndex - 1]
      setSelectedImage(prevItem)
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="heading-h1 mb-4">Creator Gallery</h1>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            See what talented creators have made at Infinite Studio
          </p>
        </motion.div>

        {/* Filter Bar */}
        {spaceFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter("all")}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                backgroundColor: activeFilter === "all" ? "var(--cta-primary)" : "var(--surface)",
                color: activeFilter === "all" ? "white" : "var(--text-primary)",
                border: `2px solid ${activeFilter === "all" ? "var(--cta-primary)" : "var(--border)"}`,
              }}
            >
              All
            </motion.button>
            {spaceFilters.map(space => (
              <motion.button
                key={space.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(space.id)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  backgroundColor: activeFilter === space.id ? "var(--cta-primary)" : "var(--surface)",
                  color: activeFilter === space.id ? "white" : "var(--text-primary)",
                  border: `2px solid ${activeFilter === space.id ? "var(--cta-primary)" : "var(--border)"}`,
                }}
              >
                {space.name}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--cta-primary)" }} />
          </div>
        ) : filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
            style={{ color: "var(--text-muted)" }}
          >
            <p>{activeFilter === "all" ? "No images have been added to the gallery yet." : "No images tagged to this space yet."}</p>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  onClick={() => handleImageClick(item, i)}
                  className="group cursor-pointer rounded-xl overflow-hidden card card-hover relative"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="w-full h-48 md:h-64 relative overflow-hidden">
                    {isVideo(item.id) ? (
                      <video
                        src={item.url}
                        muted
                        autoPlay
                        loop
                        playsInline
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                        style={{ backgroundImage: `url('${item.url}')` }}
                      />
                    )}
                    {isVideo(item.id) && (
                      <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center z-10">
                        <Film size={14} className="text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div>
                        {item.space_name && (
                          <span className="inline-block px-2 py-1 rounded-md text-[10px] font-bold text-white mb-1" style={{ background: "var(--cta-primary)" }}>
                            {item.space_name}
                          </span>
                        )}
                        <p className="text-white text-sm font-semibold">{isVideo(item.id) ? "Play Video" : "View Image"}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Image Preview Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 p-2 rounded-lg z-10 transition-all"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")}
                >
                  <X size={24} color="white" />
                </button>

                {/* Main Content Container */}
                <div className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center">
                  {isVideo(selectedImage.id) ? (
                    <video
                      src={selectedImage.url}
                      controls
                      autoPlay
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  ) : (
                    <img
                      src={selectedImage.url}
                      alt="Gallery preview"
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  )}

                  {/* Navigation Arrows */}
                  {currentIndex > 0 && (
                    <motion.button
                      onClick={handlePrev}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all"
                      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    >
                      <ChevronLeft size={24} color="white" />
                    </motion.button>
                  )}

                  {currentIndex < filteredItems.length - 1 && (
                    <motion.button
                      onClick={handleNext}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all"
                      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    >
                      <ChevronRight size={24} color="white" />
                    </motion.button>
                  )}
                </div>

                {/* Image Info */}
                <div className="mt-4 flex items-center justify-center gap-3">
                  <span className="text-white/70 text-sm">
                    {currentIndex + 1} / {filteredItems.length}
                  </span>
                  {selectedImage.space_name && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "var(--cta-primary)", color: "white" }}>
                      {selectedImage.space_name}
                    </span>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16 py-12"
        >
          <p className="text-lg mb-6" style={{ color: "var(--text-muted)" }}>
            Want to add your work to our gallery?
          </p>
          <Link href="/booking">
            <button
              className="inline-flex items-center gap-2 px-8 py-3 font-semibold rounded-lg text-white transition-all shadow-lg"
              style={{ backgroundColor: "var(--cta-primary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)";
              }}
            >
              Book Your Session <ChevronRight size={20} />
            </button>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
