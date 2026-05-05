"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

// Space data with multiple images for each
const spacesData = [
  {
    id: "the-bar",
    name: "The Bar",
    description:
      "Dark wood tones, ambient lighting, and a fully styled bar counter. Perfect for editorial shoots, music videos, lifestyle content, and anything with an edge.",
    fullDescription:
      "Step into sophistication with our Bar space. This meticulously designed environment features authentic bar setup with ambient lighting that creates the perfect moody atmosphere. Ideal for lifestyle shoots, music videos, brand campaigns, and editorial work that demands edge and attitude.",
    price: "₦8,500",
    priceType: "/hour",
    features: ["Professional Bar Setup", "Ambient Lighting", "Moody Aesthetics", "Full Bar Equipment", "LED Accent Lighting"],
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1510812431401-41d2cab2707d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1470229722913-7f419f6dccf9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1514432324607-2e467f4af3fb?w=800&h=600&fit=crop",
    ],
  },
  {
    id: "green-screen",
    name: "Green Screen Studio",
    description:
      "Step into any world. Our professional green screen setup gives you the power to place yourself anywhere — from fantasy sets to branded environments.",
    fullDescription:
      "Transform your creative vision into any reality with our professional Green Screen studio. Equipped with a 4K capable green screen backdrop, professional lighting rigs, and full chroma-key support. Perfect for virtual set content, product visualization, creative storytelling, and unlimited post-production possibilities.",
    price: "₦7,000",
    priceType: "/hour",
    features: ["4K Green Screen", "Professional Lighting", "Unlimited Possibilities", "Chroma Key Ready", "Professional Rigging"],
    images: [
      "https://images.unsplash.com/photo-1536968335557-91d2582f3e91?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1516387938669-e51073ccc549?w=800&h=600&fit=crop",
    ],
  },
  {
    id: "vanity-mirror",
    name: "Vanity Mirror Corner",
    description:
      "Hollywood-style bulb lighting surrounds a full-length vanity mirror. Made for beauty content, brand shoots, and behind-the-scenes moments.",
    fullDescription:
      "Capture that Hollywood glamour with our iconic Vanity Mirror Corner. Featuring professional Hollywood-style bulb lighting, a full-length mirror, and carefully curated decor. Perfect for beauty tutorials, makeup content, personal branding, and those Instagram-worthy behind-the-scenes moments.",
    price: "₦6,500",
    priceType: "/hour",
    features: ["Hollywood Lighting", "Full-Length Mirror", "Beauty Focused", "Professional Setup", "Perfect Lighting Angles"],
    images: [
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1577720643272-265e434f3629?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1599927921410-1eb0d83b0624?w=800&h=600&fit=crop",
    ],
  },
  {
    id: "eid-setup",
    name: "Eid Shoot Setup",
    description:
      "An elegantly decorated space built to celebrate. Rich colours, soft textures, and details that make every cultural moment feel timeless.",
    fullDescription:
      "Celebrate in style with our specially designed Eid Shoot Setup. This uniquely decorated space combines cultural elements with modern design, featuring rich colors, luxurious textures, and thoughtfully placed decor that captures the essence of festive celebration. Perfect for family shoots, cultural content, and milestone celebrations.",
    price: "₦9,000",
    priceType: "/hour",
    features: ["Cultural Decor", "Festive Ambience", "Premium Setup", "Luxurious Textures", "Celebration Focused"],
    images: [
      "https://images.unsplash.com/photo-1519167758993-14554ea4c0c1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1496681620519-cd4628902d4a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519167758993-14554ea4c0c1?w=800&h=600&fit=crop",
    ],
  },
  {
    id: "staircase",
    name: "Staircase Scene",
    description:
      "Clean lines, natural light, and an architectural staircase that adds dimension and drama. A favourite for fashion, portrait, and lifestyle content.",
    fullDescription:
      "Add dimension and drama to your content with our Staircase Scene. Featuring architectural clean lines, abundant natural light, and dramatic angles that work perfectly for fashion, editorial portraits, and lifestyle content. The geometric design elements create dynamic compositions with minimal setup.",
    price: "₦7,500",
    priceType: "/hour",
    features: ["Natural Light", "Architectural Design", "Dramatic Angles", "Fashion Ready", "Geometric Perfection"],
    images: [
      "https://images.unsplash.com/photo-1514432324607-2e467f4af3fb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1531591904146-1f0cd86cb159?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1557672172-298e090d0f80?w=800&h=600&fit=crop",
    ],
  },
  {
    id: "chair-space",
    name: "Chair Space",
    description:
      "Simplicity at its finest. A beautifully lit, carefully styled single-chair setup — the kind of clean frame that lets your subject speak.",
    fullDescription:
      "Sometimes simplicity speaks volumes. Our Chair Space strips away distractions with a single, beautifully lit, meticulously styled chair that puts all focus on your subject. Perfect for interviews, podcasts, portraits, and content where your talent is the star.",
    price: "₦5,500",
    priceType: "/hour",
    features: ["Minimal Design", "Clean Setup", "Subject Focused", "Perfect Lighting", "Interview Ready"],
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1567538096051-b6643de8b335?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524634126288-917ccccc9d38?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
    ],
  },
  {
    id: "office-set",
    name: "Office Set",
    description:
      "A sleek, contemporary workspace setting ideal for business content, LinkedIn shots, corporate videos, and professional brand storytelling.",
    fullDescription:
      "Project professionalism with our sleek Office Set. Featuring contemporary furniture, modern aesthetics, and corporate-ready lighting, this space is perfect for LinkedIn content, business podcasts, corporate videos, thought leadership shoots, and professional brand storytelling.",
    price: "₦8,000",
    priceType: "/hour",
    features: ["Corporate Setup", "Modern Design", "Professional Grade", "Tech Ready", "Business Focused"],
    images: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    ],
  },
  {
    id: "bookshelf",
    name: "Bookshelf Wall",
    description:
      "Floor-to-ceiling books, warm lighting, and scholarly vibes. Perfect for thought leadership, educational content, and sophisticated storytelling.",
    fullDescription:
      "Establish credibility and sophistication with our Bookshelf Wall. Floor-to-ceiling books, warm professional lighting, and intellectual ambiance create the perfect backdrop for thought leadership content, educational videos, author interviews, and expert positioning.",
    price: "₦6,000",
    priceType: "/hour",
    features: ["Bookshelf Backdrop", "Warm Lighting", "Intellectual Vibes", "Author Ready", "Educational Grade"],
    images: [
      "https://images.unsplash.com/photo-1507842217343-583b8cb2acde?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1507842217343-583b8cb2acde?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=600&fit=crop",
    ],
  },
]

export function SpaceDetailPage({ spaceId }: { spaceId: string }) {
  const space = spacesData.find((s) => s.id === spaceId)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!space) {
    return (
      <main
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}
      >
        <div className="text-center">
          <h1 className="heading-h1 mb-4">Space Not Found</h1>
          <p className="mb-6" style={{ color: "var(--text-muted)" }}>
            We couldn't find the space you're looking for.
          </p>
          <Link href="/spaces">
            <button
              className="px-6 py-3 rounded-lg font-semibold"
              style={{ backgroundColor: "var(--cta-primary)", color: "white" }}
            >
              Back to Spaces
            </button>
          </Link>
        </div>
      </main>
    )
  }

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev + 1) % space.images.length)
  }

  const handlePrev = () => {
    setSelectedImageIndex((prev) => (prev - 1 + space.images.length) % space.images.length)
  }

  return (
    <main
      className="pt-32 pb-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/spaces" className="inline-block mb-8">
          <button
            className="px-4 py-2 rounded-lg font-semibold transition-all"
            style={{ backgroundColor: "var(--surface)", color: "var(--text-primary)" }}
          >
            ← Back to Spaces
          </button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="heading-h1 mb-4">{space.name}</h1>
          <p className="text-lg mb-4" style={{ color: "var(--text-muted)" }}>
            {space.fullDescription}
          </p>

          {/* Price */}
          <div
            className="inline-block p-4 rounded-lg mb-6"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <div className="flex items-baseline gap-2">
              <span
                className="text-3xl font-bold"
                style={{ color: "var(--cta-primary)" }}
              >
                {space.price}
              </span>
              <span style={{ color: "var(--text-muted)" }}>
                {space.priceType}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="relative">
            {/* Main Image */}
            <div
              className="w-full h-96 md:h-[500px] bg-cover bg-center rounded-xl overflow-hidden"
              style={{
                backgroundImage: `url('${space.images[selectedImageIndex]}')`,
              }}
            >
              {/* Navigation Overlay */}
              <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity">
                {selectedImageIndex > 0 && (
                  <motion.button
                    onClick={handlePrev}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-full"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  >
                    <ChevronLeft size={28} color="white" />
                  </motion.button>
                )}

                {selectedImageIndex < space.images.length - 1 && (
                  <motion.button
                    onClick={handleNext}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-full ml-auto"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  >
                    <ChevronRight size={28} color="white" />
                  </motion.button>
                )}
              </div>

              {/* Image Counter */}
              <div
                className="absolute bottom-4 right-4 px-4 py-2 rounded-lg text-white text-sm font-semibold"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                {selectedImageIndex + 1} / {space.images.length}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {space.images.map((img, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all"
                  style={{
                    backgroundImage: `url('${img}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    outline:
                      idx === selectedImageIndex
                        ? "2px solid var(--cta-primary)"
                        : "none",
                    opacity: idx === selectedImageIndex ? 1 : 0.6,
                  }}
                  onMouseEnter={(e) => {
                    if (idx !== selectedImageIndex) {
                      ;(e.currentTarget as HTMLElement).style.opacity = "1"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (idx !== selectedImageIndex) {
                      ;(e.currentTarget as HTMLElement).style.opacity = "0.6"
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="heading-h2 mb-6">Space Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {space.features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + idx * 0.05 }}
                className="flex items-center gap-3 p-4 rounded-lg"
                style={{ backgroundColor: "var(--surface)" }}
              >
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: "var(--cta-primary)" }}
                />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex gap-4"
        >
          <Link href="/booking" className="flex-1">
            <button
              className="w-full px-8 py-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all"
              style={{ backgroundColor: "var(--cta-primary)" }}
            >
              Book This Space
              <ArrowRight size={20} />
            </button>
          </Link>
          <Link href="/spaces" className="flex-1">
            <button
              className="w-full px-8 py-4 rounded-lg font-semibold transition-all"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
            >
              View All Spaces
            </button>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
