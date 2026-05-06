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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const router = useRouter()
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

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-[var(--bg)] text-[var(--text-primary)]">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className={`${
            sidebarOpen ? "w-64" : "w-0"
          } bg-[var(--surface)] border-r border-[var(--border)] transition-all overflow-hidden shadow-lg`}
        >
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

          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-soft bg-[var(--bg)] hover:bg-[var(--border)] transition-colors border border-[var(--border)]"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              <span className="font-body text-sm">{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-soft bg-[var(--cta-primary)] hover:bg-[var(--cta-hover)] transition-colors text-white font-body text-sm"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-[var(--surface)] border-b border-[var(--border)] px-6 py-4 flex items-center justify-between shadow-sm">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-[var(--bg)] rounded-soft transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="font-body text-sm text-[var(--text-muted)]">Welcome back, <span className="text-[var(--text-primary)] font-semibold">{user?.name || 'Admin'}</span></div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-8 bg-[var(--bg)]">{children}</div>
        </div>
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
