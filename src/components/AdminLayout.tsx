"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LogOut,
  LayoutDashboard,
  Calendar,
  Layers,
  Image,
  Settings,
  Moon,
  Sun,
  ChevronLeft,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-provider"
import { ProtectedRoute } from "./ProtectedRoute"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Bookings", href: "/admin/bookings", icon: Calendar },
  { label: "Spaces", href: "/admin/spaces", icon: Layers },
  { label: "Gallery", href: "/admin/gallery", icon: Image },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { logout, user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => { setIsClient(true) }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/admin/login")
  }

  const isActive = (href: string) => pathname === href
  const currentPage = navItems.find(item => isActive(item.href)) || navItems[0]

  return (
    <ProtectedRoute>
      {!isClient ? (
        <div className="min-h-screen" style={{ background: "var(--bg)" }}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--cta-primary)" }} />
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col md:flex-row" style={{ background: "var(--bg)" }}>

          {/* ── DESKTOP SIDEBAR ── */}
          <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 z-40 border-r" style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}>
            {/* Brand */}
            <div className="flex items-center gap-3 px-6 py-6 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ background: "linear-gradient(135deg, var(--cta-primary), var(--cta-hover))" }}>
                ∞
              </div>
              <div>
                <p className="font-display text-base font-bold leading-none" style={{ color: "var(--text-primary)" }}>Infinite</p>
                <p className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: "var(--text-muted)" }}>Control Center</p>
              </div>
            </div>

            {/* Greeting */}
            <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2">
                <Sparkles size={14} style={{ color: "var(--cta-primary)" }} />
                <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  Welcome, <span style={{ color: "var(--text-primary)" }}>{user?.name || "Admin"}</span>
                </p>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              <p className="text-[9px] uppercase tracking-widest font-semibold px-3 mb-3" style={{ color: "var(--text-muted)" }}>Navigation</p>
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ x: 3 }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer"
                      style={{
                        background: active ? "var(--cta-primary)" : "transparent",
                        color: active ? "#fff" : "var(--text-primary)",
                        boxShadow: active ? "0 4px 14px rgba(196,98,58,0.35)" : "none",
                      }}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: active ? "rgba(255,255,255,0.15)" : "var(--bg)" }}>
                        <Icon size={14} />
                      </div>
                      <span className="text-sm font-medium font-body">{item.label}</span>
                    </motion.div>
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: "var(--border)" }}>
              <Link href="/">
                <motion.div
                  whileHover={{ x: 3 }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer"
                  style={{ color: "var(--text-primary)" }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--bg)" }}>
                    <ChevronLeft size={14} />
                  </div>
                  <span className="text-sm font-medium font-body">Back to Website</span>
                </motion.div>
              </Link>
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                style={{ color: "var(--text-primary)" }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--bg)" }}>
                  {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
                </div>
                <span className="text-sm font-medium font-body">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                style={{ color: "var(--text-muted)" }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--bg)" }}>
                  <LogOut size={14} />
                </div>
                <span className="text-sm font-medium font-body">Sign Out</span>
              </button>
            </div>
          </aside>

          {/* ── DESKTOP MAIN CONTENT ── */}
          <div className="hidden md:flex flex-col flex-1 min-h-screen overflow-hidden">
            {/* Top bar */}
            <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 border-b" style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}>
              <div>
                <h1 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{currentPage.label}</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-px" style={{ background: "var(--border)" }} />
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "var(--cta-primary)" }}>
                  {(user?.name || "A")[0].toUpperCase()}
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-auto p-8">
              {children}
            </main>
          </div>

          {/* ── MOBILE LAYOUT ── */}
          <div className="flex flex-col flex-1 md:hidden min-h-screen">
            {/* Mobile Top Header */}
            <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: "linear-gradient(135deg, var(--cta-primary), var(--cta-hover))" }}>
                  ∞
                </div>
                <div>
                  <p className="text-xs font-bold font-display leading-none" style={{ color: "var(--text-primary)" }}>Infinite</p>
                  <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{currentPage.label}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "var(--bg)", color: "var(--text-primary)" }}
                >
                  {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "var(--bg)", color: "var(--text-muted)" }}
                >
                  <LogOut size={15} />
                </button>
              </div>
            </header>

            {/* Mobile Content */}
            <main className="flex-1 overflow-auto pb-24 px-4 pt-4">
              {children}
            </main>

            {/* Mobile Bottom Tab Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t pb-safe"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-around px-2 py-2">
                <Link href="/" className="flex flex-col items-center gap-1 flex-1">
                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    className="flex flex-col items-center gap-1 w-full py-1.5 rounded-xl transition-all"
                    style={{ background: "transparent" }}
                  >
                    <ChevronLeft
                      size={20}
                      style={{ color: "var(--text-muted)" }}
                      strokeWidth={1.8}
                    />
                    <span
                      className="text-[9px] font-semibold uppercase tracking-wide"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Website
                    </span>
                  </motion.div>
                </Link>
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 flex-1">
                      <motion.div
                        whileTap={{ scale: 0.85 }}
                        className="flex flex-col items-center gap-1 w-full py-1.5 rounded-xl transition-all"
                        style={{
                          background: active ? `color-mix(in srgb, var(--cta-primary) 12%, transparent)` : "transparent",
                        }}
                      >
                        <Icon
                          size={20}
                          style={{ color: active ? "var(--cta-primary)" : "var(--text-muted)" }}
                          strokeWidth={active ? 2.2 : 1.8}
                        />
                        <span
                          className="text-[9px] font-semibold uppercase tracking-wide"
                          style={{ color: active ? "var(--cta-primary)" : "var(--text-muted)" }}
                        >
                          {item.label}
                        </span>
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            </nav>
          </div>
        </div>
      )}
    </ProtectedRoute>
  )
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>
}
