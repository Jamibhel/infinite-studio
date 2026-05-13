"use client"

import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useSettings } from "@/lib/settings-context"

export default function FloatingWhatsApp() {
  const [isMobile, setIsMobile] = useState(false)
  const { settings } = useSettings()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (!isMobile) return null

  // Use whatsapp_number from settings, fallback to phone with digits stripped
  const whatsappNumber = settings.whatsapp_number
    ? settings.whatsapp_number.replace(/\D/g, "")
    : settings.phone.replace(/\D/g, "")
  
  const whatsappMessage = "Hi Infinite Studio! I'm interested in booking a space."
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 md:hidden"
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
        style={{
          backgroundColor: "#25D366",
          boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
        }}
      >
        <MessageCircle size={28} color="white" />
      </div>

      {/* Pulse animation ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: "2px solid #25D366",
        }}
        animate={{ scale: 1.3, opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.a>
  )
}
