"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronRight, X, ChevronLeft } from "lucide-react"
import Link from "next/link"

export function GalleryContent() {
  // Mock gallery data - would come from Supabase in production
  const galleryItems = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    title: `Creator Shoot ${i + 1}`,
    space: ["The Bar", "Green Screen", "Vanity Mirror", "Staircase"][i % 4],
    image: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1536968335557-91d2582f3e91?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1514432324607-2e467f4af3fb?w=500&h=400&fit=crop",
    ][i % 4],
  }))

  const [filter, setFilter] = useState("all")
  const [selectedImage, setSelectedImage] = useState<(typeof galleryItems)[0] | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const spaces = ["all", "The Bar", "Green Screen", "Vanity Mirror", "Staircase"]

  const filtered =
    filter === "all" ? galleryItems : galleryItems.filter((item) => item.space === filter)

  const handleImageClick = (item: typeof galleryItems[0], index: number) => {
    setSelectedImage(item)
    setCurrentIndex(index)
  }

  const handleNext = () => {
    if (currentIndex < filtered.length - 1) {
      const nextItem = filtered[currentIndex + 1]
      setSelectedImage(nextItem)
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevItem = filtered[currentIndex - 1]
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
          className="text-center mb-16"
        >
          <h1 className="heading-h1 mb-4">Creator Gallery</h1>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            See what talented creators have made at Infinite Studio
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {spaces.map((space) => (
            <button
              key={space}
              onClick={() => setFilter(space)}
              className="px-6 py-2 rounded-lg font-semibold transition-all"
              style={{
                backgroundColor:
                  filter === space ? "var(--cta-primary)" : "var(--surface)",
                color:
                  filter === space ? "white" : "var(--text-primary)",
                border: filter === space ? "none" : "1px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                if (filter !== space) {
                  e.currentTarget.style.backgroundColor = "var(--surface)";
                  e.currentTarget.style.opacity = "0.8";
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== space) {
                  e.currentTarget.style.opacity = "1";
                }
              }}
            >
              {space.charAt(0).toUpperCase() + space.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleImageClick(item, i)}
              className="group cursor-pointer rounded-lg overflow-hidden card card-hover"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="w-full h-64 bg-cover bg-center relative group-hover:scale-110 transition-transform duration-300"
                style={{
                  backgroundImage: `url('${item.image}')`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div>
                    <p className="text-white/70 text-sm mb-1">{item.space}</p>
                    <h3 className="text-white heading-h3">{item.title}</h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Image Preview Modal */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl"
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

              {/* Main Image */}
              <div
                className="w-full h-96 md:h-[600px] bg-cover bg-center rounded-lg"
                style={{
                  backgroundImage: `url('${selectedImage.image}')`,
                }}
              />

              {/* Image Info */}
              <div className="mt-6 text-white">
                <p className="text-sm opacity-70 mb-2">{selectedImage.space}</p>
                <h2 className="heading-h2 mb-4">{selectedImage.title}</h2>
              </div>

              {/* Navigation Arrows */}
              {currentIndex > 0 && (
                <motion.button
                  onClick={handlePrev}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")}
                >
                  <ChevronLeft size={24} color="white" />
                </motion.button>
              )}

              {currentIndex < filtered.length - 1 && (
                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")}
                >
                  <ChevronRight size={24} color="white" />
                </motion.button>
              )}

              {/* Image Counter */}
              <div className="mt-6 text-center text-white/70">
                {currentIndex + 1} / {filtered.length}
              </div>
            </motion.div>
          </motion.div>
        )}

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
              className="inline-flex items-center gap-2 px-8 py-3 font-semibold rounded-lg text-white transition-all"
              style={{ backgroundColor: "var(--cta-primary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Book Your Session <ChevronRight size={20} />
            </button>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
