"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "./ProtectedRoute"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  const navItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Bookings", href: "/admin/bookings" },
    { label: "Spaces", href: "/admin/spaces" },
    { label: "Gallery", href: "/admin/gallery" },
    { label: "Settings", href: "/admin/settings" },
  ]

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-dark-bg text-white transition-all overflow-hidden`}
      >
        <div className="p-6">
          <h2 className="font-display text-2xl font-bold">Infinite</h2>
          <p className="font-body text-sm text-gray-400">Admin Suite</p>
        </div>

        <nav className="space-y-2 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 rounded-soft hover:bg-dark-stone transition-colors font-body text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-soft bg-dark-stone hover:bg-red-600 transition-colors"
          >
            <LogOut size={16} />
            <span className="font-body text-sm">Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-soft"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="font-body text-sm text-gray-600">Welcome back, {user?.name}</div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">{children}</div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
