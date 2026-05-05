"use client"

import { AdminLayout } from "@/components/AdminLayout"
import Link from "next/link"
import { motion } from "framer-motion"
import { BarChart3, Calendar, Image, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

interface DashboardStats {
  totalBookings: number
  pendingBookings: number
  galleryItems: number
  activeSpaces: number
}

interface RecentBooking {
  id: string
  name: string
  spaces: string[]
  status: string
  date: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    galleryItems: 0,
    activeSpaces: 0,
  })
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)

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

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .order("date", { ascending: false })

      if (bookingsError) throw bookingsError

      // Fetch spaces
      const { data: spacesData, error: spacesError } = await supabase
        .from("spaces")
        .select("*")

      if (spacesError) throw spacesError

      // Fetch gallery items
      const { data: galleryData, error: galleryError } = await supabase.storage
        .from("gallery")
        .list()

      if (galleryError) throw galleryError

      // Calculate stats
      const pendingCount = (bookingsData || []).filter(
        (b) => b.status === "pending"
      ).length
      const activeCount = (spacesData || []).filter((s) => s.is_active).length

      setStats({
        totalBookings: bookingsData?.length || 0,
        pendingBookings: pendingCount,
        galleryItems: galleryData?.length || 0,
        activeSpaces: activeCount,
      })

      // Get recent bookings (first 3)
      setRecentBookings(
        (bookingsData || []).slice(0, 3).map((booking) => ({
          id: booking.id,
          name: booking.name,
          spaces: booking.spaces || [],
          status: booking.status || "pending",
          date: booking.date,
        }))
      )
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
    } finally {
      setLoading(false)
    }
  }

  const statConfig = [
    { label: "Total Bookings", value: stats.totalBookings, icon: Calendar, color: "bg-blue-50" },
    { label: "Pending", value: stats.pendingBookings, icon: Calendar, color: "bg-yellow-50" },
    { label: "Gallery Items", value: stats.galleryItems, icon: Image, color: "bg-purple-50" },
    { label: "Active Spaces", value: stats.activeSpaces, icon: Settings, color: "bg-green-50" },
  ]

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2">Dashboard</h1>
          <p className="font-body text-gray-600">Welcome to your control center</p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-accent"></div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-4 gap-6">
              {statConfig.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`${stat.color} rounded-soft p-6 border border-gray-200`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-body text-sm text-gray-600 mb-1">{stat.label}</p>
                        <p className="font-display text-3xl font-bold">{stat.value}</p>
                      </div>
                      <div className="p-3 bg-white/50 rounded-soft">
                        <Icon size={24} className="text-dark-accent" />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Recent Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-soft p-6 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-display text-xl font-bold">Recent Bookings</h2>
                <Link href="/admin/bookings" className="text-dark-accent text-sm font-semibold hover:underline">
                  View All →
                </Link>
              </div>
              {recentBookings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No bookings yet</p>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                      <div>
                        <p className="font-semibold">{booking.name}</p>
                        <p className="font-body text-sm text-gray-600">
                          {booking.spaces.join(", ")} · {booking.date}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full font-body text-sm ${
                          statusColors[booking.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/admin/bookings">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-dark-accent/10 rounded-soft p-6 border border-dark-accent/20 hover:border-dark-accent/50 transition cursor-pointer"
                >
                  <h3 className="font-display font-bold mb-3">Manage Bookings</h3>
                  <p className="font-body text-sm text-gray-700 mb-4">
                    Review, confirm, and manage all studio bookings
                  </p>
                  <span className="px-4 py-2 bg-dark-accent text-white rounded-soft font-semibold inline-block">
                    View All
                  </span>
                </motion.div>
              </Link>

              <Link href="/admin/gallery">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-blue-50 rounded-soft p-6 border border-blue-200 hover:border-blue-400 transition cursor-pointer"
                >
                  <h3 className="font-display font-bold mb-3">Upload Gallery</h3>
                  <p className="font-body text-sm text-gray-700 mb-4">
                    Add new shoot photos and organize your gallery
                  </p>
                  <span className="px-4 py-2 bg-blue-600 text-white rounded-soft font-semibold inline-block">
                    Upload
                  </span>
                </motion.div>
              </Link>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
