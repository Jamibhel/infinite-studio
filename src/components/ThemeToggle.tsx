"use client"

import { Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect, Suspense } from "react"

function ThemeToggleContent() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    setMounted(true)
    // Get theme from document
    const docTheme = document.documentElement.getAttribute("data-theme") || "light"
    setTheme(docTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
  }

  if (!mounted) {
    return (
      <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
        <Moon size={20} />
      </div>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--cta-primary)] hover:text-white transition-smooth"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon size={20} />
      ) : (
        <Sun size={20} />
      )}
    </motion.button>
  )
}

export function ThemeToggle() {
  return (
    <Suspense
      fallback={
        <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
          <Moon size={20} />
        </div>
      }
    >
      <ThemeToggleContent />
    </Suspense>
  )
}
