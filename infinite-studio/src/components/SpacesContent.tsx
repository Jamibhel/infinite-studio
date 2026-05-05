"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const spaces = [
  {
    id: "the-bar",
    name: "The Bar",
    description:
      "Dark wood tones, ambient lighting, and a fully styled bar counter. Perfect for editorial shoots, music videos, lifestyle content, and anything with an edge.",
    price: "₦8,500",
    priceType: "/hour",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=400&fit=crop",
    features: ["Professional Bar Setup", "Ambient Lighting", "Moody Aesthetics"],
  },
  {
    id: "green-screen",
    name: "Green Screen Studio",
    description:
      "Step into any world. Our professional green screen setup gives you the power to place yourself anywhere — from fantasy sets to branded environments.",
    price: "₦7,000",
    priceType: "/hour",
    image: "https://images.unsplash.com/photo-1536968335557-91d2582f3e91?w=500&h=400&fit=crop",
    features: ["4K Green Screen", "Professional Setup", "Unlimited Possibilities"],
  },
  {
    id: "vanity-mirror",
    name: "Vanity Mirror Corner",
    description:
      "Hollywood-style bulb lighting surrounds a full-length vanity mirror. Made for beauty content, brand shoots, and behind-the-scenes moments.",
    price: "₦6,500",
    priceType: "/hour",
    image: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=500&h=400&fit=crop",
    features: ["Hollywood Lighting", "Full-Length Mirror", "Beauty Focused"],
  },
  {
    id: "eid-setup",
    name: "Eid Shoot Setup",
    description:
      "An elegantly decorated space built to celebrate. Rich colours, soft textures, and details that make every cultural moment feel timeless.",
    price: "₦9,000",
    priceType: "/hour",
    image: "https://images.unsplash.com/photo-1519167758993-14554ea4c0c1?w=500&h=400&fit=crop",
    features: ["Cultural Decor", "Festive Ambience", "Premium Setup"],
  },
  {
    id: "staircase",
    name: "Staircase Scene",
    description:
      "Clean lines, natural light, and an architectural staircase that adds dimension and drama. A favourite for fashion, portrait, and lifestyle content.",
    price: "₦7,500",
    priceType: "/hour",
    image: "https://images.unsplash.com/photo-1514432324607-2e467f4af3fb?w=500&h=400&fit=crop",
    features: ["Natural Light", "Architectural Design", "Dramatic Angles"],
  },
  {
    id: "chair-space",
    name: "Chair Space",
    description:
      "Simplicity at its finest. A beautifully lit, carefully styled single-chair setup — the kind of clean frame that lets your subject speak.",
    price: "₦5,500",
    priceType: "/hour",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=400&fit=crop",
    features: ["Minimal Design", "Clean Setup", "Subject Focused"],
  },
  {
    id: "office-set",
    name: "Office Set",
    description:
      "A sleek, contemporary workspace setting ideal for business content, LinkedIn shots, corporate videos, and professional brand storytelling.",
    price: "₦8,000",
    priceType: "/hour",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=400&fit=crop",
    features: ["Corporate Setup", "Modern Design", "Professional Grade"],
  },
  {
    id: "bookshelf",
    name: "Bookshelf Wall",
    description:
      "Floor-to-ceiling books, warm lighting, and scholarly vibes. Perfect for thought leadership, educational content, and sophisticated storytelling.",
    price: "₦6,000",
    priceType: "/hour",
    image: "https://images.unsplash.com/photo-1507842217343-583b8cb2acde?w=500&h=400&fit=crop",
    features: ["Bookshelf Backdrop", "Warm Lighting", "Intellectual Vibes"],
  },
]

export function SpacesContent() {
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
          <h1 className="heading-h1 mb-6" style={{ color: "white" }}>{spaces.length} Creative Spaces</h1>
          <p
            className="text-xl sm:text-2xl mb-8"
            style={{ color: "rgba(255, 255, 255, 0.9)" }}
          >
            Each uniquely designed to inspire, elevate, and bring your creative
            vision to life
          </p>
        </motion.div>
      </section>

      {/* ===== SPACES GRID ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {spaces.map((space, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="group card card-hover overflow-hidden"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                {/* Image */}
                <div
                  className="w-full h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{
                    backgroundImage: `url('${space.image}')`,
                  }}
                />

                {/* Content */}
                <div className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="heading-h3 mb-2">{space.name}</h3>
                    <p
                      className="text-sm mb-4 line-clamp-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {space.description}
                    </p>
                  </div>

                  <div>
                    {/* Price */}
                    <div
                      className="mb-4 p-3 rounded-lg"
                      style={{ backgroundColor: "var(--bg)" }}
                    >
                      <div
                        className="text-2xl font-bold"
                        style={{ color: "var(--cta-primary)" }}
                      >
                        {space.price}
                        <span
                          className="text-sm font-normal ml-1"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {space.priceType}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex gap-2">
                      <Link href={`/spaces/${space.id}`} className="flex-1">
                        <button
                          className="w-full btn-primary"
                          style={{
                            backgroundColor: "var(--cta-primary)",
                            color: "white",
                          }}
                        >
                          View Details
                        </button>
                      </Link>
                      <Link href="/booking" className="flex-1">
                        <button
                          className="w-full btn-primary"
                          style={{
                            backgroundColor: "var(--surface)",
                            color: "var(--text-primary)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          Book
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
                price: "Starting from ₦5,500",
                desc: "Perfect for quick shoots, product photography, or short content bursts",
                features: ["Flexible timing", "Equipment access", "Studio support"],
              },
              {
                title: "Half-Day Package",
                price: "₦22,000 - ₦28,000",
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
                className={`p-8 rounded-lg border-2 ${plan.featured ? "scale-105" : ""}`}
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
                <div
                  className="text-3xl font-bold mb-4"
                  style={{ color: "var(--cta-primary)" }}
                >
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
                    className={`w-full btn-primary`}
                    style={{
                      backgroundColor: plan.featured
                        ? "var(--cta-primary)"
                        : "var(--surface)",
                      color: plan.featured ? "white" : "var(--text-primary)",
                      borderColor: "var(--border)",
                    }}
                  >
                    Get Started{" "}
                    <ArrowRight size={16} className="inline ml-2" />
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY BOOK ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-h2 mb-4">Why Creators Love Us</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎬",
                title: "Professional Quality",
                desc: "Every space is studio-grade with professional lighting, equipment, and backdrops.",
              },
              {
                icon: "⏰",
                title: "Easy Booking",
                desc: "Book online in minutes. No long processes, no hidden fees. Just simple, transparent pricing.",
              },
              {
                icon: "👥",
                title: "Creator Community",
                desc: "Connect with other creators, share tips, and collaborate on amazing projects.",
              },
              {
                icon: "💡",
                title: "Creative Freedom",
                desc: "No restrictions. Bring props, build sets, experiment. Your vision, our support.",
              },
              {
                icon: "🎯",
                title: "Expert Support",
                desc: "Our team is here to help. From setup tips to post-shoot advice, we've got you.",
              },
              {
                icon: "📍",
                title: "Prime Location",
                desc: "Easy access in Abeokuta with ample parking and comfortable facilities.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p style={{ color: "var(--text-muted)" }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ADD-ONS SECTION ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-h2 mb-4">Enhance Your Experience</h2>
            <p className="text-lg" style={{ color: "var(--text-muted)" }}>
              Add premium services to elevate your shoot
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Professional Makeup Artist",
                price: "₦15,000",
                description: "Expert makeup services for beauty and fashion content",
                duration: "2-3 hours",
              },
              {
                title: "Styling Consultation",
                price: "₦10,000",
                description: "Personalized wardrobe and styling advice for your shoot",
                duration: "1 hour",
              },
              {
                title: "Props & Decor Package",
                price: "₦8,000",
                description: "Curated props and decorative items to enhance your space",
                duration: "All day",
              },
              {
                title: "Professional Photography",
                price: "₦25,000",
                description: "Expert photographer to capture your content",
                duration: "Half-day (4 hours)",
              },
              {
                title: "Lighting Assistant",
                price: "₦12,000",
                description: "Dedicated assistant for professional lighting setup",
                duration: "3-4 hours",
              },
              {
                title: "Video Editing Basics",
                price: "₦20,000",
                description: "Quick edit & color grade package for your videos",
                duration: "Up to 10 min video",
              },
            ].map((addon, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="card card-hover p-6"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <h3 className="heading-h3 mb-2">{addon.title}</h3>
                <div
                  className="text-2xl font-bold mb-3"
                  style={{ color: "var(--cta-primary)" }}
                >
                  {addon.price}
                </div>
                <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                  {addon.description}
                </p>
                <div
                  className="text-xs font-semibold mb-4 px-3 py-1 rounded-full inline-block"
                  style={{
                    backgroundColor: "var(--tag-accent)",
                    color: "var(--text-primary)",
                  }}
                >
                  {addon.duration}
                </div>
                <Link href="/booking" className="block">
                  <motion.button
                    className="w-full px-4 py-2 text-sm font-semibold rounded-lg transition-all"
                    style={{
                      backgroundColor: "var(--cta-primary)",
                      color: "white",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add to Booking
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
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
          <h2 className="heading-h2 mb-6">
            Ready to Bring Your Vision to Life?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Pick your favorite space and book your session today
          </p>
          <Link href="/booking">
            <button
              className="btn-primary"
              style={{ backgroundColor: "white", color: "var(--cta-primary)" }}
            >
              Book Your Space Now
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
