"use client"
import Link from "next/link"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, MessageCircle, Check, Plus, Minus, CheckCircle2 } from "lucide-react"
import toast from "react-hot-toast"
import { createClient } from "@supabase/supabase-js"
import { useSettings } from "@/lib/settings-context"

export interface Space {
  id: string
  name: string
  price: number
  priceText: string
}

export interface AddOn {
  id: string
  name: string
  price: number
  description: string
}

interface BookingFormData {
  spaces: string[]
  date: string
  time: string
  name: string
  email: string
  phone: string
  groupSize: number
  notes: string
  addOns: string[]
}

export function BookingContent() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>([])
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [spaces, setSpaces] = useState<Space[]>([])
  const [addOns, setAddOns] = useState<AddOn[]>([])
  const [loading, setLoading] = useState(true)
  const [hours, setHours] = useState(1)
  const [customHours, setCustomHours] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const { settings } = useSettings()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    defaultValues: {
      spaces: [],
      date: "",
      time: "",
      name: "",
      email: "",
      phone: "",
      groupSize: 1,
      notes: "",
      addOns: [],
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
      )
      
      try {
        const [spacesRes, configRes] = await Promise.all([
          supabase.from("spaces").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
          supabase.from("site_config").select("*").eq("key", "addons")
        ])
        
        if (spacesRes.data) {
          setSpaces(spacesRes.data.map((s: any) => ({
            id: s.id,
            name: s.name,
            price: s.pricing || 0,
            priceText: `₦${(s.pricing || 0).toLocaleString()}/hr`
          })))
        }
        
        if (configRes.data && configRes.data.length > 0 && configRes.data[0].value) {
          try {
            setAddOns(JSON.parse(configRes.data[0].value))
          } catch (e) {
            console.error("Failed to parse addons from site_config", e)
          }
        }
      } catch (err) {
        console.error("Failed to load booking data:", err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])


  // Pre-select space and add-ons from query params
  useEffect(() => {
    const spaceId = searchParams.get("space")
    if (spaceId) {
      setSelectedSpaces([spaceId])
    }

    // Pre-select add-ons from query param
    const addonsParam = searchParams.get("addons")
    if (addonsParam) {
      const addonsArray = addonsParam.split(",").filter((a) => a.trim())
      setSelectedAddOns(addonsArray)
    }
  }, [searchParams])

  const watchDate = watch("date")
  const watchTime = watch("time")
  const watchName = watch("name")
  const watchEmail = watch("email")
  const watchPhone = watch("phone")

  const toggleSpace = (spaceId: string) => {
    setSelectedSpaces((prev) =>
      prev.includes(spaceId) ? prev.filter((s) => s !== spaceId) : [...prev, spaceId]
    )
  }

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId) ? prev.filter((a) => a !== addOnId) : [...prev, addOnId]
    )
  }

  const handleNext = () => {
    if (step === 1 && selectedSpaces.length === 0) {
      toast.error("Please select at least one space")
      return
    }
    if (step === 2 && (!watchDate || !watchTime)) {
      toast.error("Please select date and time")
      return
    }
    // Allow navigation through 4 steps (step 1..4)
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  // Discount calculation
  const getDiscount = (h: number) => {
    if (h >= 5) return 0.10
    if (h >= 3) return 0.05
    return 0
  }

  const getDiscountLabel = (h: number) => {
    if (h >= 5) return "10% Half-Day Discount"
    if (h >= 3) return "5% Multi-Hour Discount"
    return ""
  }

  const calcPricing = () => {
    const spacePrice = selectedSpaces.reduce((sum, s) => sum + (spaces.find(sp => sp.id === s)?.price || 0), 0)
    const addOnPrice = selectedAddOns.reduce((sum, a) => sum + (addOns.find(ad => ad.id === a)?.price || 0), 0)
    const subtotal = spacePrice * hours
    const discount = getDiscount(hours)
    const discountAmount = Math.round(subtotal * discount)
    const total = subtotal - discountAmount + addOnPrice
    return { spacePrice, addOnPrice, subtotal, discount, discountAmount, total }
  }

  const onSubmit = async (data: BookingFormData) => {
    const bookingData = {
      ...data,
      spaces: selectedSpaces,
      addOns: selectedAddOns,
    }

    try {
      const { spacePrice, addOnPrice, subtotal, discount, discountAmount, total } = calcPricing()

      const discountLine = discount > 0
        ? `*Discount:* ${discount * 100}% off (−₦${discountAmount.toLocaleString()})\n`
        : ""

      const message = `
Hi! I'd like to book a session at Infinite Studio.

*Selected Spaces:* ${selectedSpaces.map(s => spaces.find(sp => sp.id === s)?.name).join(", ")}
*Hours:* ${hours} hour${hours > 1 ? "s" : ""}${hours >= 5 ? " (Half-Day)" : ""}
*Space Subtotal:* ₦${subtotal.toLocaleString()}
${discountLine}${selectedAddOns.length > 0
  ? `*Add-ons:* ${selectedAddOns.map(a => addOns.find(ad => ad.id === a)?.name).join(", ")}
*Add-ons Total:* ₦${addOnPrice.toLocaleString()}
`
  : ""
}*Estimated Total:* ₦${total.toLocaleString()}

*Date:* ${data.date}
*Time:* ${data.time}
*Group Size:* ${data.groupSize}
*Name:* ${data.name}
*Email:* ${data.email}
*Phone:* ${data.phone}
${data.notes ? `*Notes:* ${data.notes}` : ""}

Please confirm availability and final pricing.
      `.trim()

      // Save booking to Supabase
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
      )

      const bookingRecord = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        spaces: selectedSpaces,
        date: data.date,
        time: data.time,
        status: "pending",
        group_size: data.groupSize,
        addons: selectedAddOns,
        amount: total,
        notes: data.notes,
        created_at: new Date().toISOString(),
      }

      const { data: inserted, error: dbError } = await supabase.from("bookings").insert([bookingRecord]).select().single()
      if (dbError) {
        console.error("Booking save error:", dbError.message)
        toast.error("Booking failed to save in system. Please try again or contact admin.")
        return
      } else {
        toast.success("Booking confirmed and saved!")
        if (inserted) {
          setBookingId(inserted.id)
        }
      }

      setStep(5) // Show Success Screen


      setStep(1)
      setSelectedSpaces([])
      setSelectedAddOns([])
      setHours(1)
    } catch (error) {
      toast.error("Failed to process booking")
      console.error(error)
    }
  }

  return (
    <main
      className="pt-32 pb-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* HEADER */}
        <div className="mb-16 text-center">
          <h1 className="heading-h1 mb-4">Book Your Space</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Four simple steps to reserve your perfect studio moment
          </p>
        </div>

        {/* STEP PROGRESS - Hide if on success step */}
        {step < 5 && (
          <div className="flex justify-between items-center mb-12 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 z-0" style={{ backgroundColor: "var(--surface)" }}>
              <motion.div
                className="h-full"
                style={{ backgroundColor: "var(--cta-primary)" }}
                initial={{ width: "0%" }}
                animate={{ width: `${((step - 1) / 3) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 transition-all shadow-md"
                style={{
                  backgroundColor: step >= i ? "var(--cta-primary)" : "var(--surface)",
                  color: step >= i ? "white" : "var(--text-muted)",
                  border: `2px solid ${step >= i ? "var(--cta-primary)" : "var(--border)"}`
                }}
              >
                {step > i ? <CheckCircle2 size={20} /> : i}
              </div>
            ))}
          </div>
        )}

        {/* FORM STEPS */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <AnimatePresence mode="wait">
            {/* STEP 1: SELECT SPACES */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="heading-h2 mb-8">Step 1: Select Your Spaces</h2>
                <div className="space-y-3 mb-8">
                  {spaces.map((space) => (
                    <motion.button
                      key={space.id}
                      type="button"
                      onClick={() => toggleSpace(space.id)}
                      className="w-full p-4 rounded-lg transition-all"
                      style={{
                        backgroundColor: selectedSpaces.includes(space.id)
                          ? "var(--cta-primary)"
                          : "var(--surface)",
                        color: selectedSpaces.includes(space.id)
                          ? "white"
                          : "var(--text-primary)",
                        border: `2px solid ${
                          selectedSpaces.includes(space.id)
                            ? "var(--cta-primary)"
                            : "var(--surface)"
                        }`,
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-left">
                          <p className="font-semibold">{space.name}</p>
                          <p
                            className="text-sm"
                            style={{
                              color: selectedSpaces.includes(space.id)
                                ? "rgba(255, 255, 255, 0.9)"
                                : "var(--text-muted)",
                            }}
                          >
                            {space.price}
                          </p>
                        </div>
                        <div
                          className="w-5 h-5 rounded border-2 flex items-center justify-center"
                          style={{
                            borderColor: selectedSpaces.includes(space.id)
                              ? "white"
                              : "var(--text-muted)",
                          }}
                        >
                          {selectedSpaces.includes(space.id) && <Check size={16} />}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* ADD-ONS IN STEP 1 */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Enhance Your Booking (Optional)</h3>
                  <p style={{ color: "var(--text-muted)" }} className="mb-4 text-sm">
                    Add professional services to elevate your shoot
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {addOns.map((addon) => (
                      <motion.button
                        key={addon.id}
                        type="button"
                        onClick={() => toggleAddOn(addon.id)}
                        className="p-4 rounded-lg transition-all text-left"
                        style={{
                          backgroundColor: selectedAddOns.includes(addon.id)
                            ? "var(--cta-primary)"
                            : "var(--surface)",
                          color: selectedAddOns.includes(addon.id)
                            ? "white"
                            : "var(--text-primary)",
                          border: `2px solid ${
                            selectedAddOns.includes(addon.id)
                              ? "var(--cta-primary)"
                              : "var(--surface)"
                          }`,
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-sm">{addon.name}</p>
                            <p
                              className="text-xs"
                              style={{
                                color: selectedAddOns.includes(addon.id)
                                  ? "rgba(255, 255, 255, 0.9)"
                                  : "var(--text-muted)",
                              }}
                            >
                              {addon.description}
                            </p>
                          </div>
                          <div
                            className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ml-2"
                            style={{
                              borderColor: selectedAddOns.includes(addon.id)
                                ? "white"
                                : "var(--text-muted)",
                            }}
                          >
                            {selectedAddOns.includes(addon.id) && <Check size={14} />}
                          </div>
                        </div>
                        <div
                          className="text-xs font-semibold mt-2"
                          style={{
                            color: selectedAddOns.includes(addon.id)
                              ? "rgba(255, 255, 255, 0.9)"
                              : "var(--cta-primary)",
                          }}
                        >
                          +₦{addon.price.toLocaleString()}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: DATE & TIME & HOURS */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="heading-h2 mb-8">Step 2: Date, Time & Duration</h2>
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      {...register("date", { required: "Date is required" })}
                      className="w-full px-4 py-3 rounded-lg border-2"
                      style={{ backgroundColor: "var(--surface)", borderColor: errors.date ? "#ef4444" : "var(--surface)", color: "var(--text-primary)" }}
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-2">{errors.date.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      {...register("time", { required: "Time is required" })}
                      className="w-full px-4 py-3 rounded-lg border-2"
                      style={{ backgroundColor: "var(--surface)", borderColor: errors.time ? "#ef4444" : "var(--surface)", color: "var(--text-primary)" }}
                    />
                    {errors.time && <p className="text-red-500 text-sm mt-2">{errors.time.message}</p>}
                  </div>

                  {/* Hours Selector */}
                  <div>
                    <label className="block text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                      Duration (Hours)
                    </label>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {[1, 2, 3, 4].map(h => (
                        <motion.button
                          key={h} type="button"
                          onClick={() => { setHours(h); setCustomHours(false) }}
                          whileTap={{ scale: 0.95 }}
                          className="relative py-3 rounded-lg font-semibold text-sm transition-all"
                          style={{
                            backgroundColor: hours === h && !customHours ? "var(--cta-primary)" : "var(--surface)",
                            color: hours === h && !customHours ? "white" : "var(--text-primary)",
                          }}
                        >
                          {h}hr{h > 1 ? "s" : ""}
                          {h >= 3 && h < 5 && <span className="block text-[10px] opacity-75 mt-0.5">5% off</span>}
                        </motion.button>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <motion.button type="button" onClick={() => { setHours(5); setCustomHours(false) }} whileTap={{ scale: 0.95 }}
                        className="py-3 rounded-lg font-semibold text-sm transition-all"
                        style={{ backgroundColor: hours === 5 && !customHours ? "var(--cta-primary)" : "var(--surface)", color: hours === 5 && !customHours ? "white" : "var(--text-primary)" }}
                      >
                        Half Day<span className="block text-[10px] opacity-75 mt-0.5">5hrs · 10% off</span>
                      </motion.button>
                      <motion.button type="button" onClick={() => { setHours(10); setCustomHours(false) }} whileTap={{ scale: 0.95 }}
                        className="py-3 rounded-lg font-semibold text-sm transition-all"
                        style={{ backgroundColor: hours === 10 && !customHours ? "var(--cta-primary)" : "var(--surface)", color: hours === 10 && !customHours ? "white" : "var(--text-primary)" }}
                      >
                        Full Day<span className="block text-[10px] opacity-75 mt-0.5">10hrs · 10% off</span>
                      </motion.button>
                      <motion.button type="button" onClick={() => setCustomHours(true)} whileTap={{ scale: 0.95 }}
                        className="py-3 rounded-lg font-semibold text-sm transition-all"
                        style={{ backgroundColor: customHours ? "var(--cta-primary)" : "var(--surface)", color: customHours ? "white" : "var(--text-primary)" }}
                      >
                        Custom
                      </motion.button>
                    </div>
                    {customHours && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                        <input
                          type="number" min={1} max={24} value={hours}
                          onChange={e => setHours(Math.max(1, Math.min(24, Number(e.target.value))))}
                          className="w-full px-4 py-3 rounded-lg border-2 text-sm"
                          style={{ backgroundColor: "var(--surface)", borderColor: "var(--cta-primary)", color: "var(--text-primary)" }}
                          placeholder="Enter number of hours"
                        />
                      </motion.div>
                    )}
                    {/* Discount badge */}
                    {getDiscount(hours) > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                        className="mt-3 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                        style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10B981" }}
                      >
                        🎉 {getDiscountLabel(hours)} applied!
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: DETAILS */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="heading-h2 mb-8">Step 3: Your Details</h2>
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      {...register("name", { required: "Name is required" })}
                      className="w-full px-4 py-3 rounded-lg border-2"
                      style={{
                        backgroundColor: "var(--surface)",
                        borderColor: errors.name ? "#ef4444" : "var(--surface)",
                        color: "var(--text-primary)",
                      }}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                      className="w-full px-4 py-3 rounded-lg border-2"
                      style={{
                        backgroundColor: "var(--surface)",
                        borderColor: errors.email ? "#ef4444" : "var(--surface)",
                        color: "var(--text-primary)",
                      }}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      {...register("phone", { required: "Phone is required" })}
                      className="w-full px-4 py-3 rounded-lg border-2"
                      style={{
                        backgroundColor: "var(--surface)",
                        borderColor: errors.phone ? "#ef4444" : "var(--surface)",
                        color: "var(--text-primary)",
                      }}
                      placeholder="+234 XXX XXX XXXX"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-2">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                      Group Size
                    </label>
                    <input
                      type="number"
                      {...register("groupSize", { min: 1 })}
                      className="w-full px-4 py-3 rounded-lg border-2"
                      style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--surface)",
                        color: "var(--text-primary)",
                      }}
                      min="1"
                      defaultValue="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                      Additional Notes
                    </label>
                    <textarea
                      {...register("notes")}
                      className="w-full px-4 py-3 rounded-lg border-2"
                      style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--surface)",
                        color: "var(--text-primary)",
                      }}
                      placeholder="Any special requests or details..."
                      rows={4}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Success Screen */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}>
                  <CheckCircle2 size={40} style={{ color: "#10B981" }} />
                </div>
                <h2 className="heading-h2 mb-4">Booking Request Sent!</h2>
                <p className="text-lg mb-8" style={{ color: "var(--text-muted)" }}>
                  Your booking request has been successfully saved. Please send a message to our admin via WhatsApp to confirm your session.
                </p>
                <div className="p-6 rounded-xl mb-8 border border-dashed text-left max-w-sm mx-auto" style={{ backgroundColor: "var(--surface)", borderColor: "var(--text-muted)" }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-muted)", textTransform: "uppercase" }}>Your Booking ID</p>
                  <p className="text-2xl font-bold font-mono tracking-wider">{bookingId ? bookingId.split('-')[0].toUpperCase() : "PENDING"}</p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href={`/booking/receipt/${bookingId}`} target="_blank">
                    <button type="button" className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 border transition-all" style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
                      View Receipt
                    </button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      const waNumber = settings.whatsapp_number ? settings.whatsapp_number.replace(/\D/g, "") : settings.phone.replace(/\D/g, "")
                      const msg = `Hi Infinite Studio! I just submitted a booking request.\nMy Booking ID is: ${bookingId ? bookingId.split('-')[0].toUpperCase() : "Unknown"}`
                      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, "_blank")
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
                    style={{ backgroundColor: "#25D366", color: "white" }}
                  >
                    <MessageCircle size={20} /> Let Admin Know on WhatsApp
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* NAVIGATION BUTTONS */}
          {step < 5 && (
            <div className="flex gap-4 justify-between">
            <motion.button
              type="button"
              onClick={handlePrevious}
              disabled={step === 1}
              className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: step === 1 ? "var(--surface)" : "var(--text-muted)",
                color: "white",
              }}
              whileHover={{ scale: step > 1 ? 1.05 : 1 }}
              whileTap={{ scale: step > 1 ? 0.95 : 1 }}
            >
              <ChevronLeft size={20} />
              Back
            </motion.button>

            {step < 4 ? (
              <motion.button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
                style={{ backgroundColor: "var(--cta-primary)", color: "white" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next
                <ChevronRight size={20} />
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
                style={{ backgroundColor: "var(--cta-primary)", color: "white" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle size={20} />
                Confirm via WhatsApp
              </motion.button>
            )}
            </div>
          )}
        </form>

        {/* SUMMARY */}
        {step < 5 && selectedSpaces.length > 0 && (() => {
          const { spacePrice, addOnPrice, subtotal, discount, discountAmount, total } = calcPricing()
          return (
            <motion.div
              className="mt-12 p-6 rounded-xl glass-strong"
              style={{ border: "2px solid var(--cta-primary)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-semibold mb-4">Booking Summary</h3>
              <div style={{ color: "var(--text-muted)" }} className="space-y-2 text-sm">
                <p><strong>Spaces:</strong> {selectedSpaces.map(s => spaces.find(sp => sp.id === s)?.name).join(", ")}</p>
                <p><strong>Duration:</strong> {hours} hour{hours > 1 ? "s" : ""}{hours >= 5 ? " (Half-Day)" : ""}</p>
                {watchDate && <p><strong>Date:</strong> {watchDate}</p>}
                {watchTime && <p><strong>Time:</strong> {watchTime}</p>}
                {watchName && <p><strong>Name:</strong> {watchName}</p>}

                <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                  <p><strong>Space Rate:</strong> ₦{spacePrice.toLocaleString()}/hr × {hours}hr{hours > 1 ? "s" : ""} = ₦{subtotal.toLocaleString()}</p>
                  {discount > 0 && (
                    <p style={{ color: "#10B981" }}><strong>{getDiscountLabel(hours)}:</strong> −₦{discountAmount.toLocaleString()}</p>
                  )}
                  {selectedAddOns.length > 0 && (
                    <>
                      <p><strong>Add-ons:</strong> {selectedAddOns.map(a => addOns.find(ad => ad.id === a)?.name).join(", ")}</p>
                      <p><strong>Add-ons Total:</strong> ₦{addOnPrice.toLocaleString()}</p>
                    </>
                  )}
                  <p className="mt-2 text-base font-bold" style={{ color: "var(--text-primary)" }}>
                    <strong>Estimated Total:</strong> ₦{total.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })()}
      </div>
    </main>
  )
}
