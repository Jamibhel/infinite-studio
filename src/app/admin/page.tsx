"use client"

import { AdminLayout } from "@/components/AdminLayout"
import { motion } from "framer-motion"
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import toast from "react-hot-toast"

interface DashboardStats {
  totalRevenue: number
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  activeSpaces: number
  totalCustomers: number
  occupancyRate: number
  averageBookingValue: number
}

interface RecentBooking {
  id: string
  name: string
  email: string
  space: string
  date: string
  status: "pending" | "confirmed" | "completed"
  amount: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    activeSpaces: 0,
    totalCustomers: 0,
    occupancyRate: 0,
    averageBookingValue: 0,
  })
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch bookings data
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .order("date", { ascending: false })

      if (bookingsError) throw bookingsError

      // Fetch spaces data
      const { data: spacesData, error: spacesError } = await supabase
        .from("spaces")
        .select("*")

      if (spacesError) throw spacesError

      // Calculate statistics
      const total = bookingsData?.length || 0
      const pending = (bookingsData || []).filter((b: any) => b.status === "pending").length
      const confirmed = (bookingsData || []).filter((b: any) => b.status === "confirmed").length
      const completed = (bookingsData || []).filter((b: any) => b.status === "completed").length

      const totalRev = (bookingsData || []).reduce((sum: number, b: any) => sum + (b.amount || 0), 0)
      const avgValue = total > 0 ? totalRev / total : 0
      const activeCount = (spacesData || []).filter((s: any) => s.is_active).length

      setStats({
        totalRevenue: totalRev,
        totalBookings: total,
        pendingBookings: pending,
        confirmedBookings: confirmed,
        activeSpaces: activeCount,
        totalCustomers: total,
        occupancyRate: total > 0 ? Math.round((confirmed / total) * 100) : 0,
        averageBookingValue: Math.round(avgValue),
      })

      // Set recent bookings (first 5)
      setRecentBookings(
        (bookingsData || []).slice(0, 5).map((b: any) => ({
          id: b.id,
          name: b.name,
          email: b.email,
          space: (b.spaces || []).join(", ") || "Not specified",
          date: b.date,
          status: b.status || "pending",
          amount: b.amount || 0,
        }))
      )

      setError("")
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Failed to load dashboard data")
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    color,
  }: {
    title: string
    value: string | number
    icon: any
    trend?: number
    color: string
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 rounded-lg"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        border: "1px solid",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {title}
          </p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2 text-sm">
              {trend >= 0 ? (
                <>
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">+{trend}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                  <span className="text-red-500">{trend}%</span>
                </>
              )}
            </div>
          )}
        </div>
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: color, opacity: 0.1 }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-between items-start"
        >
          <div>
            <h1 className="font-display text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your studio overview.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-lg font-semibold text-white"
            style={{ backgroundColor: "var(--primary)" }}
            onClick={fetchDashboardData}
          >
            Refresh
          </motion.button>
        </motion.div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 w-5 h-5 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Key Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={`₦${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="#10b981"
            trend={12}
          />
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={Calendar}
            color="#3b82f6"
            trend={8}
          />
          <StatCard
            title="Pending Bookings"
            value={stats.pendingBookings}
            icon={AlertCircle}
            color="#f59e0b"
          />
          <StatCard
            title="Active Spaces"
            value={stats.activeSpaces}
            icon={BarChart3}
            color="#8b5cf6"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <StatCard
            title="Avg Booking Value"
            value={`₦${stats.averageBookingValue.toLocaleString()}`}
            icon={TrendingUp}
            color="#06b6d4"
          />
          <StatCard
            title="Confirmed Bookings"
            value={stats.confirmedBookings}
            icon={Calendar}
            color="#10b981"
          />
          <StatCard
            title="Occupancy Rate"
            value={`${stats.occupancyRate}%`}
            icon={BarChart3}
            color="#ec4899"
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-4 gap-4"
        >
          {[
            { title: "New Booking", href: "/admin/bookings", icon: "📅" },
            { title: "Manage Spaces", href: "/admin/spaces", icon: "🎬" },
            { title: "Gallery", href: "/admin/gallery", icon: "🖼️" },
            { title: "Settings", href: "/admin/settings", icon: "⚙️" },
          ].map((action, idx) => (
            <Link href={action.href} key={idx}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="card p-6 text-center cursor-pointer transition-colors rounded-lg"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  border: "1px solid",
                }}
              >
                <div className="text-3xl mb-2">{action.icon}</div>
                <p className="font-semibold">{action.title}</p>
                <p className="text-xs text-gray-600 mt-1">Manage {action.title.toLowerCase()}</p>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 rounded-lg"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            border: "1px solid",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Bookings</h2>
            <Link
              href="/admin/bookings"
              className="text-blue-500 hover:text-blue-700 font-semibold"
            >
              View All →
            </Link>
          </div>

          {recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr style={{ borderBottomColor: "var(--border)" }} className="border-b">
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Space</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking, idx) => (
                    <tr
                      key={idx}
                      style={{ borderBottomColor: "var(--border)" }}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3">
                        <div>
                          <p className="font-semibold">{booking.name}</p>
                          <p className="text-xs text-gray-500">{booking.email}</p>
                        </div>
                      </td>
                      <td className="py-3">{booking.space}</td>
                      <td className="py-3">{booking.date}</td>
                      <td className="py-3 font-semibold">₦{booking.amount.toLocaleString()}</td>
                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No bookings yet. Check back later!</p>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  )
}
