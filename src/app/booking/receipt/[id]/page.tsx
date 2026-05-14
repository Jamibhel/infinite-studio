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

        if (data.spaces && data.spaces.length > 0) {
          const { data: spacesData } = await supabase
             .from("spaces")
             .select("id, name")
             .in("id", data.spaces)
          if (spacesData) {
             const spaceNames = data.spaces.map((sid: string) => {
                const s = spacesData.find((sd: any) => sd.id === sid)
                return s ? s.name : sid
             })
             data.spaces = spaceNames
          }
        }

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
        <p className="text-lg font-bold mb-8" style={{ color: "var(--text-muted)" }}>We couldn't find a booking with that ID.</p>
        <Link href="/">
          <button className="px-6 py-3 rounded-lg font-bold" style={{ backgroundColor: "var(--cta-primary)", color: "white" }}>Return Home</button>
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
          className="rounded-3xl overflow-hidden shadow-2xl border print:shadow-none print:border-none print:rounded-none"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          {/* Header Ticket Stub */}
          <div className="p-8 text-center relative border-b border-dashed" style={{ borderColor: "var(--text-muted)" }}>
            <div className="absolute -left-4 -bottom-4 w-8 h-8 rounded-full print:hidden" style={{ backgroundColor: "var(--bg)" }} />
            <div className="absolute -right-4 -bottom-4 w-8 h-8 rounded-full print:hidden" style={{ backgroundColor: "var(--bg)" }} />
            
            <h2 className="font-display font-extrabold text-3xl uppercase tracking-widest mb-2" style={{ color: "var(--cta-primary)" }}>{settings.studio_name || "Infinite Studio"}</h2>
            <p className="text-base font-bold tracking-widest uppercase mb-6" style={{ color: "var(--text-muted)" }}>Booking Receipt</p>
            
            <div className="inline-block px-4 py-2 rounded-full font-bold text-sm tracking-wider uppercase mb-2 print:border" style={{ backgroundColor: sCfg.bg, color: sCfg.color, borderColor: sCfg.color }}>
              {sCfg.label}
            </div>
          </div>

          {/* Body */}
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm uppercase tracking-wider font-extrabold mb-1" style={{ color: "var(--text-muted)" }}>Booked For</p>
                <p className="font-extrabold text-xl">{booking.name}</p>
                <p className="text-base font-bold mt-1" style={{ color: "var(--text-muted)" }}>{booking.phone}</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wider font-extrabold mb-1" style={{ color: "var(--text-muted)" }}>Booking ID</p>
                <p className="font-mono font-extrabold text-xl">{booking.id.split('-')[0].toUpperCase()}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl flex flex-col gap-4 print:border" style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)" }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(196,98,58,0.1)", color: "var(--cta-primary)" }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wider font-extrabold" style={{ color: "var(--text-muted)" }}>Date</p>
                  <p className="font-extrabold text-lg">{new Date(booking.preferred_date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(196,98,58,0.1)", color: "var(--cta-primary)" }}>
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wider font-extrabold" style={{ color: "var(--text-muted)" }}>Time</p>
                  <p className="font-extrabold text-lg">{booking.preferred_time}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm uppercase tracking-wider font-extrabold mb-3" style={{ color: "var(--text-muted)" }}>Spaces Reserved</p>
              <div className="flex flex-wrap gap-2">
                {booking.spaces.map(s => (
                  <span key={s} className="px-4 py-2 rounded-lg text-base font-extrabold border bg-opacity-10" style={{ borderColor: "var(--cta-primary)", color: "var(--cta-primary)", backgroundColor: "var(--cta-primary)" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {booking.addons && booking.addons.length > 0 && (
              <div>
                <p className="text-sm uppercase tracking-wider font-extrabold mb-3" style={{ color: "var(--text-muted)" }}>Add-ons</p>
                <div className="flex flex-col gap-2">
                  {booking.addons.map(addon => {
                    const cleaned = addon.split('-').slice(0, -1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || addon
                    return (
                      <p key={addon} className="font-extrabold text-base flex items-center gap-2">
                        <CheckCircle2 size={16} style={{color: "var(--cta-primary)"}}/> 
                        {cleaned}
                      </p>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="border-t pt-6" style={{ borderColor: "var(--border)" }}>
              <div className="flex justify-between items-center text-lg">
                <span className="font-extrabold text-xl">Total Amount</span>
                <span className="font-extrabold text-3xl" style={{ color: "var(--text-primary)" }}>₦{booking.amount?.toLocaleString() || "0"}</span>
              </div>
            </div>
          </div>

          <div className="p-6 text-center text-sm print:border-t" style={{ backgroundColor: "var(--bg)", color: "var(--text-muted)", borderColor: "var(--border)" }}>
            <p className="mb-2 font-extrabold text-base">Thank you for choosing {settings.studio_name}</p>
            <p className="flex items-center justify-center gap-2 font-bold"><MapPin size={16} /> Omida Shopping Complex, Abeokuta</p>
          </div>
        </motion.div>

        <div className="mt-8 flex justify-center print:hidden">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-extrabold text-lg transition-all border"
            style={{ backgroundColor: "var(--cta-primary)", color: "white", borderColor: "var(--cta-primary)" }}
          >
            <Download size={24} /> Download / Print Receipt
          </button>
        </div>
      </div>
    </main>
  )
}
