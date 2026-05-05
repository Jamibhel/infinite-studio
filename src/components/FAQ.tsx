"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
  category: "bookings" | "policies" | "equipment"
}

const faqItems: FAQItem[] = [
  {
    category: "bookings",
    question: "How do I book a space?",
    answer:
      "Booking is easy! Visit our Spaces page, select your favorite space, choose your date and time, and complete the booking form. You'll receive a confirmation via WhatsApp. We recommend booking at least 24 hours in advance.",
  },
  {
    category: "bookings",
    question: "Can I book multiple spaces at once?",
    answer:
      "Absolutely! Our half-day and custom packages are perfect for multi-space shoots. Contact us via WhatsApp or email to arrange your custom booking, and we'll ensure all your spaces are reserved.",
  },
  {
    category: "policies",
    question: "What's your cancellation policy?",
    answer:
      "Free cancellations up to 48 hours before your booking. Cancellations within 48 hours will be charged 50% of the booking fee. No-shows will be charged the full amount.",
  },
  {
    category: "policies",
    question: "Are there any restrictions on what we can shoot?",
    answer:
      "We're creative-friendly! You can bring props, build sets, and experiment freely. We just ask that you're respectful of our spaces and clean up after your session. Commercial use is welcome.",
  },
  {
    category: "equipment",
    question: "What equipment is included?",
    answer:
      "Each space comes with professional lighting, backdrops, and stylized furnishings. You're welcome to bring your own camera, lighting, or equipment. WiFi and charging stations are available throughout the studio.",
  },
  {
    category: "equipment",
    question: "How many people can use a space?",
    answer:
      "Spaces comfortably accommodate 2-4 people. For larger teams or crew, we recommend our half-day or custom packages which give you more flexibility. Contact us to discuss your team size.",
  },
  {
    category: "bookings",
    question: "Do you offer discounts for recurring bookings?",
    answer:
      "Yes! We offer special rates for monthly passes and bulk bookings. Teams booking 4+ sessions per month receive 10% off. Contact us for custom pricing.",
  },
  {
    category: "policies",
    question: "Is there parking available?",
    answer:
      "Yes, we have ample parking available for all our clients. Our location in Abeokuta is easily accessible and we provide clear directions when you book.",
  },
]

export function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<"all" | "bookings" | "policies" | "equipment">("all")

  const filteredItems =
    activeCategory === "all" ? faqItems : faqItems.filter((item) => item.category === activeCategory)

  const categoryLabels = {
    all: "All Questions",
    bookings: "Bookings",
    policies: "Policies",
    equipment: "Equipment",
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="heading-h2 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            Got questions? We've got answers.
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {(Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                activeCategory === cat ? "text-white" : ""
              }`}
              style={{
                backgroundColor: activeCategory === cat ? "var(--cta-primary)" : "var(--surface)",
                color: activeCategory === cat ? "white" : "var(--text-primary)",
                border: activeCategory === cat ? "none" : "1px solid var(--border)",
              }}
            >
              {categoryLabels[cat]}
            </motion.button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="card"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <button
                  onClick={() =>
                    setExpandedIndex(expandedIndex === idx ? null : idx)
                  }
                  className="w-full px-6 py-4 flex items-center justify-between hover:opacity-80 transition-opacity"
                >
                  <h3 className="font-bold text-left">{item.question}</h3>
                  <motion.div
                    animate={{ rotate: expandedIndex === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 ml-4"
                  >
                    <ChevronDown
                      size={24}
                      style={{ color: "var(--cta-primary)" }}
                    />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedIndex === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-6 pb-4 border-t"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <p style={{ color: "var(--text-muted)" }}>{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-lg text-center"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <p className="mb-4" style={{ color: "var(--text-muted)" }}>
            Didn't find your answer?
          </p>
          <a
            href="https://wa.me/2348000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block btn-primary"
            style={{
              backgroundColor: "var(--cta-primary)",
              color: "white",
            }}
          >
            Message Us on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}
