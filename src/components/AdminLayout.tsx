"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LogOut, Menu, X, Home, Calendar, Grid, Settings, Moon, Sun, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { ThemeProvider, useTheme } from "@/lib/theme-provider"
import { ProtectedRoute } from "./ProtectedRoute"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { logout, user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: Home },
    { label: "Bookings", href: "/admin/bookings", icon: Calendar },
    { label: "Spaces", href: "/admin/spaces", icon: Grid },
    { label: "Gallery", href: "/admin/gallery", icon: Settings },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const currentPage = navItems.find(item => item.href === pathname) || navItems[0]
  const isActive = (href: string) => pathname === href

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-[var(--bg)] text-[var(--text-primary)]">
        {/* Unified Top Navigation */}
        <div className="bg-[var(--surface)] border-b border-[var(--border)] shadow-sm">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Infinite</h1>
              <p className="font-body text-xs text-[var(--text-muted)]">Admin Suite</p>
            </div>

            {/* Desktop Nav Items */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-soft transition-all font-body text-sm ${
                      isActive(item.href)
                        ? "bg-[var(--cta-primary)] text-white"
                        : "text-[var(--text-primary)] hover:bg-[var(--bg)]"
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Desktop Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-[var(--bg)] rounded-soft transition-colors"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-soft bg-[var(--cta-primary)] hover:bg-[var(--cta-hover)] transition-colors text-white font-body text-sm"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Header */}
          <div className="md:hidden flex items-center justify-between px-4 py-3">
            <div>
              <h1 className="font-display text-lg font-bold text-[var(--text-primary)]">Infinite</h1>
              <p className="font-body text-xs text-[var(--text-muted)]">{currentPage.label}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-[var(--bg)] rounded-soft transition-colors"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-[var(--bg)] rounded-soft transition-colors"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3 space-y-2"
            >
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-soft transition-all font-body text-sm ${
                      isActive(item.href)
                        ? "bg-[var(--cta-primary)] text-white"
                        : "text-[var(--text-primary)] hover:bg-[var(--bg)]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={16} />
                      {item.label}
                    </span>
                    <ChevronRight size={16} />
                  </Link>
                )
              })}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-soft bg-[var(--cta-primary)] hover:bg-[var(--cta-hover)] transition-colors text-white font-body text-sm mt-2"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </motion.div>
          )}
        </div>

        {/* Page Title & Welcome */}
        <div className="hidden md:block bg-[var(--surface)] border-b border-[var(--border)] px-8 py-3 shadow-sm">
          <p className="font-body text-sm text-[var(--text-muted)]">Welcome back, <span className="text-[var(--text-primary)] font-semibold">{user?.name || 'Admin'}</span></p>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-[var(--bg)]">{children}</div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--surface)] border-t border-[var(--border)] grid grid-cols-5 gap-0 shadow-lg z-30">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-3 transition-colors ${
                  active
                    ? "bg-[var(--cta-primary)] text-white"
                    : "text-[var(--text-primary)] hover:bg-[var(--bg)]"
                }`}
              >
                <Icon size={20} />
                <span className="font-body text-xs mt-1 text-center leading-tight">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Mobile Bottom Spacing */}
        <div className="md:hidden h-20" />
      </div>
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
