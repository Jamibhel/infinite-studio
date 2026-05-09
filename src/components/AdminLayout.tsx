"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { LogOut, Menu, X, Home, Calendar, Grid, Settings, Moon, Sun, ChevronRight, Image } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { ThemeProvider, useTheme } from "@/lib/theme-provider"
import { ProtectedRoute } from "./ProtectedRoute"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { logout, user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  // Ensure hooks only run on client
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/admin/login")
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: Home },
    { label: "Bookings", href: "/admin/bookings", icon: Calendar },
    { label: "Spaces", href: "/admin/spaces", icon: Grid },
    { label: "Gallery", href: "/admin/gallery", icon: Image },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const currentPage = navItems.find(item => item.href === pathname) || navItems[0]
  const isActive = (href: string) => pathname === href

  return (
    <ProtectedRoute>
      {!isClient ? (
        <div className="flex flex-col h-screen bg-[var(--bg)] text-[var(--text-primary)]">
          <div className="bg-[var(--surface)] border-b border-[var(--border)] px-8 py-4">
            <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Infinite</h1>
          </div>
          <div className="flex-1 overflow-auto p-8 bg-[var(--bg)]">{children}</div>
        </div>
      ) : (
        <div className="flex h-screen bg-[var(--bg)] text-[var(--text-primary)]">
          {/* DESKTOP SIDEBAR - Only visible on md+ screens */}
          <aside className="hidden md:flex flex-col w-64 bg-[var(--surface)] border-r border-[var(--border)] shadow-sm">
            {/* Logo */}
            <div className="p-6 border-b border-[var(--border)]">
              <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Infinite</h1>
              <p className="font-body text-xs text-[var(--text-muted)] mt-1">Admin Suite</p>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-soft transition-all font-body text-sm ${
                      isActive(item.href)
                        ? "bg-[var(--cta-primary)] text-white"
                        : "text-[var(--text-primary)] hover:bg-[var(--bg)]"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Footer Controls */}
            <div className="border-t border-[var(--border)] p-4 space-y-2">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-soft hover:bg-[var(--bg)] transition-colors font-body text-sm"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-soft bg-[var(--cta-primary)] hover:bg-[var(--cta-hover)] transition-colors text-white font-body text-sm"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* MOBILE HEADER + CONTENT - Only visible on mobile */}
          <div className="flex flex-col flex-1 md:hidden">
            {/* Mobile Header - STICKY */}
            <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-4 bg-[var(--surface)] border-b border-[var(--border)] shadow-md">
              <div className="flex-1">
                <h1 className="font-display text-lg font-bold text-[var(--text-primary)]">Infinite</h1>
                <p className="font-body text-xs text-[var(--text-muted)]">{currentPage.label}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 hover:bg-[var(--bg)] rounded-soft transition-colors"
                  title="Toggle theme"
                >
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 hover:bg-[var(--cta-primary)] hover:text-white rounded-soft transition-colors text-[var(--text-primary)]"
                  title="Toggle menu"
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>

            {/* Mobile Dropdown Menu - FULL WIDTH */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="z-30 border-b border-[var(--border)] bg-[var(--surface)] shadow-lg max-h-[calc(100vh-80px)] overflow-y-auto"
                >
                  <nav className="px-2 py-3 space-y-1">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all font-body text-sm ${
                            isActive(item.href)
                              ? "bg-[var(--cta-primary)] text-white shadow-md"
                              : "text-[var(--text-primary)] hover:bg-[var(--bg)] active:bg-[var(--border)]"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Icon size={18} />
                            <span className="font-medium">{item.label}</span>
                          </span>
                          {isActive(item.href) && <ChevronRight size={16} />}
                        </Link>
                      )
                    })}
                  </nav>

                  <div className="border-t border-[var(--border)] px-2 py-3 mt-2 space-y-2">
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--bg)] transition-colors text-[var(--text-primary)] font-body text-sm active:bg-[var(--border)]"
                    >
                      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                      <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--cta-primary)] hover:bg-[var(--cta-hover)] transition-colors text-white font-body text-sm active:opacity-80"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Content */}
            <div className="flex-1 overflow-auto p-4 bg-[var(--bg)]">{children}</div>
          </div>

          {/* DESKTOP CONTENT */}
          <div className="hidden md:flex flex-col flex-1">
            {/* Welcome Bar */}
            <div className="bg-[var(--surface)] border-b border-[var(--border)] px-8 py-3 shadow-sm">
              <p className="font-body text-sm text-[var(--text-muted)]">Welcome back, <span className="text-[var(--text-primary)] font-semibold">{user?.name || 'Admin'}</span></p>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-8 bg-[var(--bg)]">{children}</div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  )
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ThemeProvider>
  )
}
