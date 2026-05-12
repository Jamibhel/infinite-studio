"use client"

import { AdminLayout } from "@/components/AdminLayout"
import { motion } from "framer-motion"
import {
  BarChart3,
  Calendar,
  Layers,
  Image,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import toast from "react-hot-toast"

interface DashboardStats {
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  completedBookings: number
  activeSpaces: number
  totalSpaces: number
}

interface RecentBooking {
  id: string
  name: string
  email: string
  spaces: string[]
  preferred_date: string
  status: "pending" | "confirmed" | "completed"
}

const statCards = [
  { key: "totalBookings", label: "Total Bookings", icon: Calendar, color: "#C4623A", light: "rgba(196,98,58,0.12)" },
  { key: "pendingBookings", label: "Pending", icon: Clock, color: "#F59E0B", light: "rgba(245,158,11,0.12)" },
  { key: "confirmedBookings", label: "Confirmed", icon: CheckCircle2, color: "#10B981", light: "rgba(16,185,129,0.12)" },
  { key: "activeSpaces", label: "Active Spaces", icon: Layers, color: "#8B5CF6", light: "rgba(139,92,246,0.12)" },
]

const quickLinks = [
  { title: "New Booking", sub: "View incoming requests", href: "/admin/bookings", icon: Calendar, color: "#C4623A" },
  { title: "Manage Spaces", sub: "Edit and toggle spaces", href: "/admin/spaces", icon: Layers, color: "#8B5CF6" },
  { title: "Gallery", sub: "Upload and curate media", href: "/admin/gallery", icon: Image, color: "#10B981" },
  { title: "Settings", sub: "Studio configuration", href: "/admin/settings", icon: BarChart3, color: "#F59E0B" },
]

const statusConfig = {
  pending: { label: "Pending", bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
  confirmed: { label: "Confirmed", bg: "rgba(16,185,129,0.12)", color: "#10B981" },
  completed: { label: "Completed", bg: "rgba(139,92,246,0.12)", color: "#8B5CF6" },
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    activeSpaces: 0,
    totalSpaces: 0,
  })
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  useEffect(() => { fetchDashboardData() }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [{ data: bookingsData }, { data: spacesData }] = await Promise.all([
        supabase.from("bookings").select("*").order("created_at", { ascending: false }),
        supabase.from("spaces").select("*"),
      ])

      const bookings = bookingsData || []
      const spaces = spacesData || []

      setStats({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((b: any) => b.status === "pending").length,
        confirmedBookings: bookings.filter((b: any) => b.status === "confirmed").length,
        completedBookings: bookings.filter((b: any) => b.status === "completed").length,
        activeSpaces: spaces.filter((s: any) => s.is_active).length,
        totalSpaces: spaces.length,
      })

      setRecentBookings(
        bookings.slice(0, 5).map((b: any) => ({
          id: b.id,
          name: b.name,
          email: b.email,
          spaces: b.spaces || [],
          preferred_date: b.preferred_date || b.date || "—",
          status: b.status || "pending",
        }))
      )
    } catch (err) {
      toast.error("Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">

        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
            Studio Overview
          </h2>
          <p className="mt-1 text-sm font-body" style={{ color: "var(--text-muted)" }}>
            Here's what's happening at Infinite Studio.
          </p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statCards.map((card, i) => {
            const Icon = card.icon
            const value = stats[card.key as keyof DashboardStats]
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl p-4 border"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: card.light }}>
                    <Icon size={17} style={{ color: card.color }} />
                  </div>
                </div>
                <p className="font-display text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {loading ? "—" : value}
                </p>
                <p className="text-xs font-body mt-1" style={{ color: "var(--text-muted)" }}>{card.label}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map((link, i) => {
            const Icon = link.icon
            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
              >
                <Link href={link.href}>
                  <motion.div
                    whileHover={{ y: -3, boxShadow: "0 12px 30px rgba(0,0,0,0.12)" }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-2xl p-4 border cursor-pointer transition-all"
                    style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `color-mix(in srgb, ${link.color} 14%, transparent)` }}>
                      <Icon size={17} style={{ color: link.color }} />
                    </div>
                    <p className="text-sm font-bold font-body" style={{ color: "var(--text-primary)" }}>{link.title}</p>
                    <p className="text-xs mt-0.5 font-body" style={{ color: "var(--text-muted)" }}>{link.sub}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <ArrowUpRight size={12} style={{ color: link.color }} />
                      <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: link.color }}>Go</span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border overflow-hidden"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} style={{ color: "var(--cta-primary)" }} />
              <h3 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>Recent Bookings</h3>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={fetchDashboardData} className="p-1.5 rounded-lg transition-all" style={{ color: "var(--text-muted)", background: "var(--bg)" }}>
                <RefreshCw size={14} />
              </button>
              <Link href="/admin/bookings" className="text-xs font-semibold font-body flex items-center gap-1" style={{ color: "var(--cta-primary)" }}>
                View all <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--cta-primary)" }} />
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={32} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
              <p className="text-sm font-body" style={{ color: "var(--text-muted)" }}>No bookings yet</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {recentBookings.map((b) => {
                const s = statusConfig[b.status] || statusConfig.pending
                return (
                  <div key={b.id} className="flex items-center gap-4 px-5 py-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: "var(--cta-primary)" }}>
                      {b.name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold font-body truncate" style={{ color: "var(--text-primary)" }}>{b.name}</p>
                      <p className="text-xs font-body truncate" style={{ color: "var(--text-muted)" }}>
                        {b.spaces.join(", ")} · {b.preferred_date}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ background: s.bg, color: s.color }}>
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  )
}
