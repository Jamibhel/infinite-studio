"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Check } from "lucide-react"

const reasons = [
  {
    title: "Designed for Real Results",
    description:
      "Every space is built with photography and videography in mind. We obsess over angles, lighting ratios, and colour theory so your content stands out.",
    image: "/about-1.png",
  },
  {
    title: "A Space for Everyone",
    description:
      "Solo creator. Fashion brand. Corporate team. Family portrait. Influencer. Whatever your goal, there's a space here for you.",
    image: "/about-2.png",
  },
  {
    title: "A Full Experience",
    description:
      "From arrival to upload, we want every moment to feel effortless, premium, and worth every kobo.",
    image: "/about-3.png",
  },
]

export function AboutContent() {
  return (
    <main className="pt-32 pb-20" style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}>
      {/* Hero Section */}
      <div className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="heading-h1 mb-8">
              We Built the Space You Always Needed
            </h1>
            <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
              Infinite Studio was born from a simple frustration — great creators in Abeokuta
              deserved a great studio. Not a makeshift setup in someone's living room. Not a trip to
              Lagos for a decent background. A proper, beautiful, professional creative space, right
              here at home.
            </p>
            <p className="text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
              We designed every theme with intention. We sourced every prop with care. We set up
              every light to make you look your best. Because when you walk into Infinite Studio,
              you shouldn't have to think about logistics. You should be able to think about your
              art.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-8 rounded-lg mt-12"
            style={{
              backgroundColor: "var(--surface)",
              borderLeft: "4px solid var(--cta-primary)",
            }}
          >
            <p className="text-lg" style={{ color: "var(--text-muted)" }}>
              We are located at <span className="font-semibold">Omida Shopping Complex, Abeokuta</span> — and we are just getting started.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Why Section with Images */}
      <div className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="heading-h2 mb-12 text-center">Why Infinite Studio</h2>
          <div className="space-y-16">
            {reasons.map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? "md:grid-flow-col-dense" : ""}`}
              >
                {/* Image */}
                <div
                  className="h-96 rounded-2xl bg-cover bg-center shadow-xl border-4"
                  style={{
                    backgroundImage: `url('${reason.image}')`,
                    order: i % 2 === 1 ? 2 : 1,
                    borderColor: "var(--surface)"
                  }}
                />
                {/* Content */}
                <div style={{ order: i % 2 === 1 ? 1 : 2 }}>
                  <h3 className="heading-h3 mb-4">{reason.title}</h3>
                  <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
                    {reason.description}
                  </p>
                  <div className="flex items-center gap-2" style={{ color: "var(--cta-primary)" }}>
                    <Check size={20} />
                    <span className="font-semibold">Premium Quality</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center py-16"
          style={{
            backgroundColor: "var(--surface)",
            borderRadius: "12px",
          }}
        >
          <h2 className="heading-h2 mb-6">Ready to Create Something Amazing?</h2>
          <p className="text-lg mb-8" style={{ color: "var(--text-muted)" }}>
            Join creators who are pushing their limits with Infinite Studio
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
