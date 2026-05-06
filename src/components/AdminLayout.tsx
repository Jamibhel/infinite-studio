"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { LogOut, Menu, X, Home, Calendar, Grid, Settings, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { ThemeProvider, useTheme } from "@/lib/theme-provider"
import { ProtectedRoute } from "./ProtectedRoute"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const { logout, user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: Home, shortLabel: "Home" },
    { label: "Bookings", href: "/admin/bookings", icon: Calendar, shortLabel: "Book" },
    { label: "Spaces", href: "/admin/spaces", icon: Grid, shortLabel: "Space" },
    { label: "Gallery", href: "/admin/gallery", icon: Settings, shortLabel: "Gallery" },
    { label: "Settings", href: "/admin/settings", icon: Settings, shortLabel: "Settings" },
  ]

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-[var(--bg)] text-[var(--text-primary)]">
        {/* Mobile Header */}
        <div className="md:hidden bg-[var(--surface)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between shadow-sm">
          <h1 className="font-display text-lg font-bold text-[var(--text-primary)]">Infinite</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-[var(--bg)] rounded-soft transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 top-14 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          transition={{ duration: 0.3 }}
          className="md:hidden fixed left-0 top-14 bottom-0 w-64 bg-[var(--surface)] border-r border-[var(--border)] z-50 overflow-y-auto shadow-lg"
        >
          <nav className="space-y-1 px-4 py-4">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-soft hover:bg-[var(--bg)] transition-colors font-body text-sm text-[var(--text-primary)] group"
                >
                  <Icon size={18} className="text-[var(--cta-primary)] group-hover:text-[var(--cta-hover)] transition-colors flex-shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="px-4 py-4 space-y-3 border-t border-[var(--border)]">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-soft bg-[var(--bg)] hover:bg-[var(--border)] transition-colors border border-[var(--border)]"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              <span className="font-body text-sm">{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-soft bg-[var(--cta-primary)] hover:bg-[var(--cta-hover)] transition-colors text-white font-body text-sm"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>

        {/* Desktop + Content Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 bg-[var(--surface)] border-r border-[var(--border)] shadow-lg overflow-y-auto">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">Infinite</h2>
              <p className="font-body text-sm text-[var(--text-muted)] mt-1">Admin Suite</p>
            </div>

            <nav className="space-y-1 px-4 py-6">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-soft hover:bg-[var(--bg)] transition-colors font-body text-sm text-[var(--text-primary)] group"
                  >
                    <Icon size={18} className="text-[var(--cta-primary)] group-hover:text-[var(--cta-hover)] transition-colors" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="p-6 space-y-3 border-t border-[var(--border)]">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-soft bg-[var(--bg)] hover:bg-[var(--border)] transition-colors border border-[var(--border)]"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                <span className="font-body text-sm">{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-soft bg-[var(--cta-primary)] hover:bg-[var(--cta-hover)] transition-colors text-white font-body text-sm"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Desktop Top Bar */}
            <div className="hidden md:block bg-[var(--surface)] border-b border-[var(--border)] px-8 py-4 shadow-sm">
              <div className="font-body text-sm text-[var(--text-muted)]">Welcome back, <span className="text-[var(--text-primary)] font-semibold">{user?.name || 'Admin'}</span></div>
            </div>

            {/* Mobile Top Bar Info */}
            <div className="md:hidden bg-[var(--surface)] border-b border-[var(--border)] px-4 py-3 shadow-sm">
              <div className="font-body text-xs text-[var(--text-muted)]">Welcome, <span className="text-[var(--text-primary)] font-semibold">{user?.name || 'Admin'}</span></div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-4 md:p-8 bg-[var(--bg)]">{children}</div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--surface)] border-t border-[var(--border)] grid grid-cols-5 gap-0 shadow-lg z-40">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center py-3 hover:bg-[var(--bg)] transition-colors group"
              >
                <Icon size={20} className="text-[var(--cta-primary)] group-hover:text-[var(--cta-hover)] transition-colors" />
                <span className="font-body text-xs text-[var(--text-primary)] mt-1 text-center">{item.shortLabel}</span>
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
