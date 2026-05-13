"use client"

import { AdminLayout } from "@/components/AdminLayout"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Calendar, Phone, Mail, Users, ChevronDown, RefreshCw, X, CheckCircle2, Clock, BarChart3, Link as LinkIcon, Copy } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import toast from "react-hot-toast"

interface Booking {
  id: string
  name: string
  email: string
  phone: string
  spaces: string[]
  preferred_date: string
  preferred_time: string
  status: "pending" | "confirmed" | "completed"
  group_size: number
  notes?: string
  created_at: string
}

const statusConfig = {
  pending: { label: "Pending", bg: "rgba(245,158,11,0.12)", color: "#F59E0B", icon: Clock },
  confirmed: { label: "Confirmed", bg: "rgba(16,185,129,0.12)", color: "#10B981", icon: CheckCircle2 },
  completed: { label: "Completed", bg: "rgba(139,92,246,0.12)", color: "#8B5CF6", icon: BarChart3 },
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "completed">("all")
  const [selected, setSelected] = useState<Booking | null>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  useEffect(() => { fetchBookings() }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) throw error
      setBookings((data || []).map((b: any) => ({
        id: b.id,
        name: b.name,
        email: b.email,
        phone: b.phone || "—",
        spaces: b.spaces || [],
        preferred_date: b.preferred_date || b.date || "—",
        preferred_time: b.preferred_time || b.time || "—",
        status: b.status || "pending",
        group_size: b.group_size || 1,
        notes: b.notes || "",
        created_at: b.created_at,
      })))
    } catch {
      toast.error("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", id)
      if (error) throw error
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: status as any } : b))
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: status as any } : null)
      toast.success("Status updated")
    } catch {
      toast.error("Failed to update status")
    }
  }

  const deleteBooking = async (id: string) => {
    if (!confirm("Delete this booking?")) return
    try {
      const { error } = await supabase.from("bookings").delete().eq("id", id)
      if (error) throw error
      setBookings(prev => prev.filter(b => b.id !== id))
      if (selected?.id === id) setSelected(null)
      toast.success("Booking deleted")
    } catch {
      toast.error("Failed to delete booking")
    }
  }

  const filtered = bookings.filter(b => filter === "all" || b.status === filter)

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
  }

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Bookings</h2>
            <p className="text-sm mt-1 font-body" style={{ color: "var(--text-muted)" }}>{bookings.length} total sessions</p>
          </div>
          <button
            onClick={fetchBookings}
            className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <RefreshCw size={15} />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["all", "pending", "confirmed", "completed"] as const).map(f => (
            <motion.button
              key={f}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-all border"
              style={{
                background: filter === f ? "var(--cta-primary)" : "var(--surface)",
                color: filter === f ? "#fff" : "var(--text-muted)",
                borderColor: filter === f ? "var(--cta-primary)" : "var(--border)",
                boxShadow: filter === f ? "0 3px 12px rgba(196,98,58,0.3)" : "none",
              }}
            >
              {f === "all" ? "All" : f} <span className="opacity-70">({counts[f]})</span>
            </motion.button>
          ))}
        </div>

        {/* Booking Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--cta-primary)" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <Calendar size={36} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
            <p className="text-sm font-body" style={{ color: "var(--text-muted)" }}>No {filter !== "all" ? filter : ""} bookings yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((booking, i) => {
              const s = statusConfig[booking.status]
              const Icon = s.icon
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelected(booking)}
                  className="rounded-2xl border p-4 cursor-pointer transition-all"
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  }}
                  whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: "var(--cta-primary)" }}>
                        {booking.name[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm font-body truncate" style={{ color: "var(--text-primary)" }}>{booking.name}</p>
                        <p className="text-xs font-body truncate" style={{ color: "var(--text-muted)" }}>{booking.email}</p>
                      </div>
                    </div>
                    <span className="flex-shrink-0 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: s.bg, color: s.color }}>
                      <Icon size={10} /> {s.label}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {booking.spaces.map(sp => (
                      <span key={sp} className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(196,98,58,0.1)", color: "var(--cta-primary)" }}>
                        {sp}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-xs font-body" style={{ color: "var(--text-muted)" }}>
                    <span className="flex items-center gap-1"><Calendar size={11} /> {booking.preferred_date}</span>
                    <span className="flex items-center gap-1"><Users size={11} /> {booking.group_size} people</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail Sheet */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[60]"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed bottom-0 left-0 right-0 z-[70] rounded-t-3xl overflow-hidden max-h-[85vh] overflow-y-auto pb-safe"
              style={{ background: "var(--surface)" }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ background: "var(--border)" }} />
              </div>

              <div className="px-5 pb-8 pt-2">
                {/* Sheet Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ background: "var(--cta-primary)" }}>
                      {selected.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold" style={{ color: "var(--text-primary)" }}>{selected.name}</h3>
                      <p className="text-sm font-body" style={{ color: "var(--text-muted)" }}>{selected.email}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-2 rounded-xl" style={{ background: "var(--bg)", color: "var(--text-muted)" }}>
                    <X size={16} />
                  </button>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: "Phone", value: selected.phone, icon: Phone },
                    { label: "Group Size", value: `${selected.group_size} people`, icon: Users },
                    { label: "Date", value: selected.preferred_date, icon: Calendar },
                    { label: "Time", value: selected.preferred_time, icon: Clock },
                  ].map(item => {
                    const Icon = item.icon
                    return (
                      <div key={item.label} className="rounded-xl p-3 border" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon size={11} style={{ color: "var(--cta-primary)" }} />
                          <p className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: "var(--text-muted)" }}>{item.label}</p>
                        </div>
                        <p className="text-sm font-bold font-body" style={{ color: "var(--text-primary)" }}>{item.value}</p>
                      </div>
                    )
                  })}
                </div>

                {/* Spaces */}
                <div className="mb-5">
                  <p className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Spaces</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.spaces.map(sp => (
                      <span key={sp} className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ background: "rgba(196,98,58,0.12)", color: "var(--cta-primary)" }}>
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selected.notes && (
                  <div className="mb-5 p-3 rounded-xl border" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
                    <p className="text-[10px] uppercase tracking-wide font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Notes</p>
                    <p className="text-sm font-body" style={{ color: "var(--text-primary)" }}>{selected.notes}</p>
                  </div>
                )}

                {/* Status Update */}
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Update Status</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(["pending", "confirmed", "completed"] as const).map(s => {
                      const cfg = statusConfig[s]
                      const Icon = cfg.icon
                      return (
                        <motion.button
                          key={s}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateStatus(selected.id, s)}
                          className="flex flex-col items-center gap-1 p-3 rounded-xl border transition-all"
                          style={{
                            background: selected.status === s ? cfg.bg : "var(--bg)",
                            borderColor: selected.status === s ? cfg.color : "var(--border)",
                            color: selected.status === s ? cfg.color : "var(--text-muted)",
                          }}
                        >
                          <Icon size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-wide">{cfg.label}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Receipt Link */}
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Share Receipt</p>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/booking/receipt/${selected.id}`
                      navigator.clipboard.writeText(url)
                      toast.success("Receipt link copied!")
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl border transition-all hover:bg-opacity-80"
                    style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                  >
                    <div className="flex items-center gap-2">
                      <LinkIcon size={16} style={{ color: "var(--cta-primary)" }} />
                      <span className="text-sm font-semibold">Copy Receipt Link</span>
                    </div>
                    <Copy size={16} style={{ color: "var(--text-muted)" }} />
                  </button>
                </div>

                {/* Delete */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => deleteBooking(selected.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold font-body transition-all"
                  style={{ borderColor: "rgba(239,68,68,0.3)", color: "#EF4444", background: "rgba(239,68,68,0.06)" }}
                >
                  <Trash2 size={15} /> Delete Booking
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
