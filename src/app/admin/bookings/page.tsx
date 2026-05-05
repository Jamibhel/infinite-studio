"use client"

import { AdminLayout } from "@/components/AdminLayout"
import { motion } from "framer-motion"
import { Trash2, Edit2, AlertCircle } from "lucide-react"
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
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  // Fetch bookings
  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select("*")
        .order("date", { ascending: false })

      if (fetchError) throw fetchError

      setBookings(
        data.map((booking) => ({
          id: booking.id,
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          spaces: booking.spaces || [],
          date: booking.date,
          time: booking.time || "Not specified",
          status: booking.status || "pending",
          group_size: booking.group_size || 1,
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
