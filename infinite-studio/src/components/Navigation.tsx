"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Sparkles, Image, BookOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "./ThemeToggle"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const navItems = [
    { label: "The Studio", href: "/", icon: null },
    { label: "Creative Spaces", href: "/spaces", icon: null },
    { label: "Our Story", href: "/about", icon: null },
    { label: "Gallery", href: "/gallery", icon: Image },
    { label: "Resources", href: "/blog", icon: BookOpen },
  ]

  return (
    <nav
      className="fixed top-0 w-full z-50 border-b backdrop-blur-3xl"
      style={{
        backgroundColor: "rgba(var(--surface-rgb), 0.60)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with animation */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, var(--cta-primary), var(--tag-accent))",
                color: "white",
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              ∞
            </motion.div>
            <span
              className="font-display font-bold text-lg hidden sm:inline"
              style={{ color: "var(--text-primary)" }}
            >
              Infinite
            </span>
          </Link>

          {/* Desktop Navigation with underline animation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, idx) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={item.href}>
                  <motion.button
                    className="relative px-4 py-2 text-sm font-medium rounded-lg transition-colors overflow-hidden group/nav"
                    style={{ color: "var(--text-primary)" }}
                    whileHover={{ backgroundColor: "var(--surface)" }}
                  >
                    <div className="flex items-center gap-1">
                      {item.icon && <item.icon size={16} />}
                      <span>{item.label}</span>
                    </div>
                    
                    {/* Animated underline */}
                    <motion.div
                      className="absolute bottom-1 left-0 h-0.5 bg-gradient-to-r"
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, var(--cta-primary), var(--tag-accent))",
                      }}
                      initial={{ width: "0%", opacity: 0 }}
                      whileHover={{ width: "100%", opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Side - Theme Toggle + CTA + Mobile Menu */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Desktop CTA - Animated */}
            <Link href="/booking" className="hidden md:block">
              <motion.button
                className="px-6 py-2 text-sm font-semibold rounded-lg overflow-hidden relative"
                style={{
                  backgroundColor: "var(--cta-primary)",
                  color: "white",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Shine effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative">Book Now</span>
              </motion.button>
            </Link>

            {/* Mobile Menu Button - Creative */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ color: "var(--text-primary)" }}
              whileHover={{ backgroundColor: "var(--surface)" }}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Smooth slide in */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: "var(--surface)",
              borderTop: "1px solid var(--border)",
            }}
          >
            <div className="px-4 py-4 space-y-2 max-w-7xl mx-auto">
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link href={item.href}>
                    <motion.button
                      className="w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all flex items-center gap-2"
                      style={{
                        color: "var(--text-primary)",
                      }}
                      whileHover={{
                        backgroundColor: "var(--bg)",
                        paddingLeft: "20px",
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon && (
                        <item.icon
                          size={18}
                          style={{ color: "var(--cta-primary)" }}
                        />
                      )}
                      {item.label}
                    </motion.button>
                  </Link>
                </motion.div>
              ))}

              {/* Mobile CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
                className="pt-4 mt-4 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <Link href="/booking" className="block">
                  <motion.button
                    className="w-full px-4 py-3 text-sm font-semibold rounded-lg text-white transition-all"
                    style={{
                      backgroundColor: "var(--cta-primary)",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsOpen(false)}
                  >
                    Book Your Session
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
