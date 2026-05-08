"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, MessageCircle, Check, Plus, Minus } from "lucide-react"
import toast from "react-hot-toast"

const spaces = [
  { id: "bar", name: "The Bar", price: 12000, priceText: "₦12,000/hr" },
  { id: "green", name: "Green Screen Studio", price: 10000, priceText: "₦10,000/hr" },
  { id: "vanity", name: "Vanity Mirror Corner", price: 10500, priceText: "₦10,500/hr" },
  { id: "eid", name: "Eid Shoot Setup", price: 15000, priceText: "₦15,000/hr" },
  { id: "staircase", name: "Staircase Scene", price: 11000, priceText: "₦11,000/hr" },
  { id: "chair", name: "Chair Space", price: 10000, priceText: "₦10,000/hr" },
  { id: "office", name: "Office Set", price: 12000, priceText: "₦12,000/hr" },
  { id: "bookshelf", name: "Bookshelf Wall", price: 11500, priceText: "₦11,500/hr" },
]

const addOns = [
  {
    id: "lighting",
    name: "Professional Lighting Setup",
    price: 5000,
    description: "Advanced lighting rig with color temperature control",
  },
  {
    id: "backdrop",
    name: "Custom Backdrop Installation",
    price: 3000,
    description: "Hassle-free backdrop setup with your choice",
  },
  {
    id: "props",
    name: "Premium Props & Decor",
    price: 4000,
    description: "Curated selection of high-quality props",
  },
  {
    id: "styling",
    name: "Professional Styling Consultation",
    price: 6000,
    description: "Expert styling advice and setup optimization",
  },
  {
    id: "camera",
    name: "Camera & Equipment Rental",
    price: 8000,
    description: "Professional camera and lighting equipment",
  },
  {
    id: "editing",
    name: "Post-Production Editing Package",
    price: 12000,
    description: "Professional editing and color grading",
  },
]

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

  // Pre-select space and add-ons from query params
  useEffect(() => {
    const spaceId = searchParams.get("space")
    if (spaceId) {
      // Map detail page IDs to booking page IDs
      const idMap: Record<string, string> = {
        "the-bar": "bar",
        "green-screen": "green",
        "vanity-mirror": "vanity",
        "eid-setup": "eid",
        "staircase": "staircase",
        "chair-space": "chair",
        "office-set": "office",
        "bookshelf": "bookshelf",
      }
      const bookingId = idMap[spaceId] || spaceId
      setSelectedSpaces([bookingId])
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
    console.log("Toggle add-on clicked:", addOnId)
    setSelectedAddOns((prev) => {
      const updated = prev.includes(addOnId) ? prev.filter((a) => a !== addOnId) : [...prev, addOnId]
      console.log("Selected add-ons after toggle:", updated)
      return updated
    })
    toast.success(`Add-on toggled!`)
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

  const onSubmit = async (data: BookingFormData) => {
    const bookingData = {
      ...data,
      spaces: selectedSpaces,
      addOns: selectedAddOns,
    }

    try {
      // Calculate pricing
      const spacePrice = selectedSpaces.reduce(
        (sum, s) => sum + (spaces.find((sp) => sp.id === s)?.price || 0),
        0
      )
      const addOnPrice = selectedAddOns.reduce(
        (sum, a) => sum + (addOns.find((addon) => addon.id === a)?.price || 0),
        0
      )
      const totalPrice = spacePrice + addOnPrice

      // Format message for WhatsApp
      const message = `
Hi! I'd like to book a session at Infinite Studio.

*Selected Spaces:* ${selectedSpaces.map((s) => spaces.find((sp) => sp.id === s)?.name).join(", ")}
*Space Total:* ₦${spacePrice.toLocaleString()}

${
  selectedAddOns.length > 0
    ? `*Add-ons:* ${selectedAddOns.map((a) => addOns.find((addon) => addon.id === a)?.name).join(", ")}
*Add-ons Total:* ₦${addOnPrice.toLocaleString()}
`
    : ""
}*Estimated Total:* ₦${totalPrice.toLocaleString()}

*Date:* ${data.date}
*Time:* ${data.time}
*Hours:* 1 hour (minimum)
*Group Size:* ${data.groupSize}
*Name:* ${data.name}
*Email:* ${data.email}
*Phone:* ${data.phone}
${data.notes ? `*Notes:* ${data.notes}` : ""}

Please confirm availability and final pricing.
      `.trim()

      const whatsappUrl = `https://wa.me/2347040000000?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")

      toast.success("Opening WhatsApp to confirm your booking!")

      // Reset form
      setStep(1)
      setSelectedSpaces([])
      setSelectedAddOns([])
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

        {/* PROGRESS INDICATOR */}
        <div className="flex justify-between items-center mb-12">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm cursor-pointer"
                style={{
                  backgroundColor: step >= num ? "var(--cta-primary)" : "var(--surface)",
                  color: step >= num ? "white" : "var(--text-muted)",
                }}
                whileHover={{ scale: 1.05 }}
              >
                {step > num ? <Check size={20} /> : num}
              </motion.div>
              {num < 4 && (
                <div
                  className="h-1 flex-1 mx-2"
                  style={{
                    backgroundColor: step > num ? "var(--cta-primary)" : "var(--surface)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* FORM STEPS */}
        <form onSubmit={handleSubmit(onSubmit)}>
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

            {/* STEP 2: DATE & TIME */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="heading-h2 mb-8">Step 2: Choose Date & Time</h2>
                <div className="space-y-6 mb-8">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      {...register("date", { required: "Date is required" })}
                      className="w-full px-4 py-3 rounded-lg border-2"
                      style={{
                        backgroundColor: "var(--surface)",
                        borderColor: errors.date ? "#ef4444" : "var(--surface)",
                        color: "var(--text-primary)",
                      }}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-2">{errors.date.message}</p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      {...register("time", { required: "Time is required" })}
                      className="w-full px-4 py-3 rounded-lg border-2"
                      style={{
                        backgroundColor: "var(--surface)",
                        borderColor: errors.time ? "#ef4444" : "var(--surface)",
                        color: "var(--text-primary)",
                      }}
                    />
                    {errors.time && (
                      <p className="text-red-500 text-sm mt-2">{errors.time.message}</p>
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

            {/* STEP 4: (removed) - add-ons moved to Step 1 */}
          </AnimatePresence>

          {/* NAVIGATION BUTTONS */}
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
        </form>

        {/* SUMMARY */}
        {selectedSpaces.length > 0 && (
          <motion.div
            className="mt-12 p-6 rounded-lg glass"
            style={{
              border: "2px solid var(--cta-primary)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="font-semibold mb-4">Booking Summary</h3>
            <div style={{ color: "var(--text-muted)" }} className="space-y-2 text-sm">
              <p>
                <strong>Spaces:</strong>{" "}
                {selectedSpaces
                  .map((s) => spaces.find((sp) => sp.id === s)?.name)
                  .join(", ")}
              </p>
              {watchDate && <p><strong>Date:</strong> {watchDate}</p>}
              {watchTime && <p><strong>Time:</strong> {watchTime}</p>}
              {watchName && <p><strong>Name:</strong> {watchName}</p>}

              {/* Pricing breakdown */}
              <div className="mt-2">
                <p>
                  <strong>Spaces Total:</strong>{" "}
                  ₦{selectedSpaces
                    .reduce((sum, s) => sum + (spaces.find((sp) => sp.id === s)?.price || 0), 0)
                    .toLocaleString()}
                </p>
                <p>
                  <strong>Add-ons:</strong>{" "}
                  {selectedAddOns.length === 0
                    ? "None"
                    : selectedAddOns
                        .map((a) => addOns.find((ad) => ad.id === a)?.name)
                        .join(", ")}
                </p>
                <p>
                  <strong>Add-ons Total:</strong>{" "}
                  ₦{selectedAddOns
                    .reduce((sum, a) => sum + (addOns.find((ad) => ad.id === a)?.price || 0), 0)
                    .toLocaleString()}
                </p>
                <p className="mt-1">
                  <strong>Estimated Total:</strong>{" "}
                  ₦{(
                    selectedSpaces.reduce((sum, s) => sum + (spaces.find((sp) => sp.id === s)?.price || 0), 0) +
                    selectedAddOns.reduce((sum, a) => sum + (addOns.find((ad) => ad.id === a)?.price || 0), 0)
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
