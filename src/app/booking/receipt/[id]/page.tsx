"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { motion } from "framer-motion"
import { CheckCircle2, Clock, Calendar, Users, MapPin, Download } from "lucide-react"
import Link from "next/link"
import { useSettings } from "@/lib/settings-context"

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
  amount: number
  addons: string[]
  created_at: string
}

const statusConfig = {
  pending: { label: "Pending Confirmation", bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
  confirmed: { label: "Confirmed", bg: "rgba(16,185,129,0.12)", color: "#10B981" },
  completed: { label: "Completed", bg: "rgba(139,92,246,0.12)", color: "#8B5CF6" },
}

export default function ReceiptPage() {
  const { id } = useParams()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const { settings } = useSettings()

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
        const supabase = createClient(supabaseUrl, supabaseKey)

        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("id", id)
          .single()

        if (error) throw error
        setBooking(data)
      } catch (err) {
        console.error("Error fetching booking:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchBooking()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-20" style={{ backgroundColor: "var(--bg)" }}>
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--cta-primary)" }} />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 pb-20 px-4 text-center" style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}>
        <h1 className="heading-h1 mb-4">Receipt Not Found</h1>
        <p className="text-lg mb-8" style={{ color: "var(--text-muted)" }}>We couldn't find a booking with that ID.</p>
        <Link href="/">
          <button className="px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: "var(--cta-primary)", color: "white" }}>Return Home</button>
        </Link>
      </div>
    )
  }

  const sCfg = statusConfig[booking.status]

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}>
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl overflow-hidden shadow-2xl border"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          {/* Header Ticket Stub */}
          <div className="p-8 text-center relative border-b border-dashed" style={{ borderColor: "var(--text-muted)" }}>
            <div className="absolute -left-4 -bottom-4 w-8 h-8 rounded-full" style={{ backgroundColor: "var(--bg)" }} />
            <div className="absolute -right-4 -bottom-4 w-8 h-8 rounded-full" style={{ backgroundColor: "var(--bg)" }} />
            
            <h2 className="font-display font-bold text-2xl uppercase tracking-widest mb-2" style={{ color: "var(--cta-primary)" }}>{settings.studio_name || "Infinite Studio"}</h2>
            <p className="text-sm tracking-widest uppercase mb-6" style={{ color: "var(--text-muted)" }}>Booking Receipt</p>
            
            <div className="inline-block px-4 py-2 rounded-full font-bold text-sm tracking-wider uppercase mb-2" style={{ backgroundColor: sCfg.bg, color: sCfg.color }}>
              {sCfg.label}
            </div>
          </div>

          {/* Body */}
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Booked For</p>
                <p className="font-bold">{booking.name}</p>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{booking.phone}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Booking ID</p>
                <p className="font-mono font-bold">{booking.id.split('-')[0].toUpperCase()}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl flex flex-col gap-4" style={{ backgroundColor: "var(--bg)" }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(196,98,58,0.1)", color: "var(--cta-primary)" }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>Date</p>
                  <p className="font-bold">{booking.preferred_date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(196,98,58,0.1)", color: "var(--cta-primary)" }}>
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>Time</p>
                  <p className="font-bold">{booking.preferred_time}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Spaces Reserved</p>
              <div className="flex flex-wrap gap-2">
                {booking.spaces.map(s => (
                  <span key={s} className="px-3 py-1.5 rounded-lg text-sm font-bold border" style={{ borderColor: "var(--cta-primary)", color: "var(--cta-primary)" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {booking.addons && booking.addons.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Add-ons</p>
                <p className="text-sm font-semibold">{booking.addons.join(", ")}</p>
              </div>
            )}

            <div className="border-t pt-6" style={{ borderColor: "var(--border)" }}>
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">Total Amount</span>
                <span className="font-bold text-2xl" style={{ color: "var(--text-primary)" }}>₦{booking.amount?.toLocaleString() || "0"}</span>
              </div>
            </div>
          </div>

          <div className="p-6 text-center text-sm" style={{ backgroundColor: "var(--bg)", color: "var(--text-muted)" }}>
            <p className="mb-2 font-semibold">Thank you for choosing {settings.studio_name}</p>
            <p className="flex items-center justify-center gap-1"><MapPin size={14} /> Omida Shopping Complex, Abeokuta</p>
          </div>
        </motion.div>

        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all border"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            <Download size={20} /> Download / Print Receipt
          </button>
        </div>
      </div>
    </main>
  )
}
