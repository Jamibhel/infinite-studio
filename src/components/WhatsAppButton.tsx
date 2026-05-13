"use client"

import { MessageCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

import { useSettings } from "@/lib/settings-context"

export function WhatsAppButton() {
  const [showOnMobile, setShowOnMobile] = useState(false)
  const { settings } = useSettings()

  useEffect(() => {
    const checkMobile = () => {
      setShowOnMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (!showOnMobile) return null

  const phoneNumber = settings.whatsapp_number || "+2348188880000"
  const message = "Hi! I'm interested in booking a session at Infinite Studio."
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-lg"
      style={{
        backgroundColor: "var(--cta-primary)",
        color: "white",
      }}
    >
      <MessageCircle size={24} />
    </motion.a>
  )
}
