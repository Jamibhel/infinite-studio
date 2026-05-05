"use client"

import { AdminLayout } from "@/components/AdminLayout"
import { motion } from "framer-motion"
import { Trash2, Edit2, AlertCircle, Search, Filter, ChevronDown, Eye } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import toast from "react-hot-toast"

interface Booking {
  id: string
  name: string
  email: string
  phone: string
  spaces: string[]
  date: string
  time: string
  status: "pending" | "confirmed" | "completed"
  group_size: number
  amount?: number
  notes?: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  // Fetch bookings
  useEffect(() => {
    fetchBookings()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = bookings

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.phone.includes(searchTerm)
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }, [searchTerm, statusFilter, bookings])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select("*")
        .order("date", { ascending: false })

      if (fetchError) throw fetchError

      setBookings(
        (data || []).map((booking: any) => ({
          id: booking.id,
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          spaces: booking.spaces || [],
          date: booking.date,
          time: booking.time || "Not specified",
          status: booking.status || "pending",
          group_size: booking.group_size || 1,
          amount: booking.amount || 0,
          notes: booking.notes || "",
        }))
      )
      setError("")
    } catch (err) {
      console.error("Error fetching bookings:", err)
      setError("Failed to load bookings")
      toast.error("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error: updateError } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId)

      if (updateError) throw updateError

      // Update local state
      setBookings(
        bookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: newStatus as "pending" | "confirmed" | "completed" }
            : booking
        )
      )
      toast.success("Status updated successfully")
    } catch (err) {
      console.error("Error updating status:", err)
      toast.error("Failed to update status")
    }
  }

  const deleteBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return

    try {
      const { error: deleteError } = await supabase
        .from("bookings")
        .delete()
        .eq("id", bookingId)

      if (deleteError) throw deleteError

      setBookings(bookings.filter((booking) => booking.id !== bookingId))
      toast.success("Booking deleted successfully")
    } catch (err) {
      console.error("Error deleting booking:", err)
      toast.error("Failed to delete booking")
    }
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
  }

  const getBookingStats = () => {
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      totalRevenue: bookings.reduce((sum, b) => sum + (b.amount || 0), 0),
    }
  }

  const stats = getBookingStats()

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
            <h1 className="font-display text-4xl font-bold mb-2">Bookings Manager</h1>
            <p className="text-gray-600">Manage all studio bookings and customer sessions</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchBookings}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            Refresh
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { label: "Total", value: stats.total, color: "bg-blue-50", textColor: "text-blue-700" },
            { label: "Pending", value: stats.pending, color: "bg-yellow-50", textColor: "text-yellow-700" },
            { label: "Confirmed", value: stats.confirmed, color: "bg-green-50", textColor: "text-green-700" },
            { label: "Completed", value: stats.completed, color: "bg-indigo-50", textColor: "text-indigo-700" },
            { label: "Revenue", value: `₦${stats.totalRevenue.toLocaleString()}`, color: "bg-purple-50", textColor: "text-purple-700" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`${stat.color} rounded-lg p-4 text-center`}
            >
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3"
          >
            <AlertCircle className="text-red-500 flex-shrink-0 w-5 h-5 mt-0.5" />
            <div>
              <p className="text-red-700 font-semibold">Error Loading Bookings</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 rounded-lg flex gap-4 flex-wrap items-center"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
            </select>
            <Filter className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500"></div>
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg border border-gray-200 p-12 text-center"
          >
            <p className="text-gray-500 text-lg">No bookings yet</p>
          </motion.div>
        ) : filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg border border-gray-200 p-12 text-center"
          >
            <p className="text-gray-500 text-lg">No bookings match your filters</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card rounded-lg overflow-hidden"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: "var(--bg-secondary)", borderBottomColor: "var(--border)" }} className="border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-sm">Client</th>
                    <th className="px-6 py-3 text-left font-semibold text-sm">Spaces</th>
                    <th className="px-6 py-3 text-left font-semibold text-sm">Date & Time</th>
                    <th className="px-6 py-3 text-left font-semibold text-sm">Group</th>
                    <th className="px-6 py-3 text-left font-semibold text-sm">Amount</th>
                    <th className="px-6 py-3 text-left font-semibold text-sm">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking, i) => (
                    <tr
                      key={booking.id}
                      style={{ borderBottomColor: "var(--border)" }}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-sm">{booking.name}</p>
                          <p className="text-xs text-gray-500">{booking.email}</p>
                          <p className="text-xs text-gray-500">{booking.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {booking.spaces.map((space) => (
                            <span key={space} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {space}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {booking.date} <br /> {booking.time}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">{booking.group_size}</td>
                      <td className="px-6 py-4 text-sm font-semibold">₦{(booking.amount || 0).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <select
                          value={booking.status}
                          onChange={(e) => updateStatus(booking.id, e.target.value)}
                          className={`text-xs px-3 py-1 rounded-full font-semibold cursor-pointer border-0 ${
                            statusColors[booking.status]
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedBooking(booking)
                            setShowModal(true)
                          }}
                          className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition"
                          title="View details"
                        >
                          <Eye size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => deleteBooking(booking.id)}
                          className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Details Modal */}
        {showModal && selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="card max-w-md w-full rounded-lg overflow-hidden"
              style={{ backgroundColor: "var(--surface)" }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">{selectedBooking.name}</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-semibold">{selectedBooking.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-semibold">{selectedBooking.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date & Time</p>
                    <p className="font-semibold">{selectedBooking.date} at {selectedBooking.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Spaces</p>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {selectedBooking.spaces.map((space) => (
                        <span key={space} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {space}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500">Group Size</p>
                    <p className="font-semibold">{selectedBooking.group_size} people</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Amount</p>
                    <p className="font-semibold">₦{(selectedBooking.amount || 0).toLocaleString()}</p>
                  </div>
                  {selectedBooking.notes && (
                    <div>
                      <p className="text-gray-500">Notes</p>
                      <p className="font-semibold">{selectedBooking.notes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 flex gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  )
}

      if (deleteError) throw deleteError

      setBookings(bookings.filter((booking) => booking.id !== bookingId))
      toast.success("Booking deleted successfully")
    } catch (err) {
      console.error("Error deleting booking:", err)
      toast.error("Failed to delete booking")
    }
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-4xl font-bold mb-2">Bookings Manager</h1>
            <p className="font-body text-gray-600">Manage all studio bookings</p>
          </div>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-dark-accent text-white rounded-lg hover:bg-opacity-90 transition"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 w-5 h-5 mt-0.5" />
            <div>
              <p className="text-red-700 font-semibold">Error Loading Bookings</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-accent"></div>
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg border border-gray-200 p-12 text-center"
          >
            <p className="text-gray-500 text-lg">No bookings yet</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-soft border border-gray-200 overflow-hidden"
          >
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-sm text-gray-700">Client</th>
                  <th className="px-6 py-3 text-left font-semibold text-sm text-gray-700">Spaces</th>
                  <th className="px-6 py-3 text-left font-semibold text-sm text-gray-700">Date & Time</th>
                  <th className="px-6 py-3 text-left font-semibold text-sm text-gray-700">Group Size</th>
                  <th className="px-6 py-3 text-left font-semibold text-sm text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-sm text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, i) => (
                  <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-sm">{booking.name}</p>
                        <p className="text-xs text-gray-500">{booking.email}</p>
                        <p className="text-xs text-gray-500">{booking.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {booking.spaces.map((space) => (
                          <span key={space} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {space}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {booking.date} · {booking.time}
                    </td>
                    <td className="px-6 py-4 text-sm">{booking.group_size} people</td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.status}
                        onChange={(e) => updateStatus(booking.id, e.target.value)}
                        className={`text-xs px-3 py-1 rounded-full font-semibold cursor-pointer ${
                          statusColors[booking.status]
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="p-2 hover:bg-blue-100 rounded-soft text-blue-600">
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="p-2 hover:bg-red-100 rounded-soft text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  )
}
