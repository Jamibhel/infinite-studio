"use client"

import { AdminLayout } from "@/components/AdminLayout"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Edit2, X, Plus, Save, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import toast from "react-hot-toast"

interface AddOn {
  id: string
  name: string
  price: number
  description: string
}

function InputField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide font-semibold mb-2 font-body" style={{ color: "var(--text-muted)" }}>{label}</label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-xl border text-sm font-body"
        style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
      />
    </div>
  )
}

export default function AddOnsPage() {
  const [addOns, setAddOns] = useState<AddOn[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<AddOn | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [formData, setFormData] = useState<Partial<AddOn>>({})
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  useEffect(() => {
    fetchAddOns()
  }, [])

  async function fetchAddOns() {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("site_config").select("value").eq("key", "addons").single()
      if (error && error.code !== "PGRST116") throw error
      
      if (data && data.value) {
        setAddOns(JSON.parse(data.value))
      }
    } catch {
      toast.error("Failed to load add-ons")
    } finally {
      setLoading(false)
    }
  }

  const openEdit = (addon: AddOn) => {
    setSelected(addon)
    setFormData({ ...addon })
    setIsNew(false)
  }

  const openNew = () => {
    setSelected(null)
    setFormData({ price: 0 })
    setIsNew(true)
  }

  const closeSheet = () => {
    setSelected(null)
    setIsNew(false)
    setFormData({})
  }

  const saveAddOnsToDb = async (newAddOns: AddOn[]) => {
    try {
      const { error } = await supabase
        .from("site_config")
        .upsert({ key: "addons", value: JSON.stringify(newAddOns) }, { onConflict: "key" })
      
      if (error) throw error
      setAddOns(newAddOns)
      return true
    } catch {
      toast.error("Failed to save changes")
      return false
    }
  }

  const saveAddOn = async () => {
    if (!formData.name || formData.price === undefined) {
      toast.error("Name and price are required")
      return
    }

    let updatedAddOns = [...addOns]

    if (isNew) {
      const id = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      const newAddon = {
        id,
        name: formData.name,
        description: formData.description || "",
        price: Number(formData.price)
      }
      updatedAddOns.push(newAddon)
      toast.success("Add-on created")
    } else if (selected) {
      updatedAddOns = updatedAddOns.map(a => 
        a.id === selected.id 
          ? { 
              ...a, 
              name: formData.name || a.name, 
              description: formData.description || a.description,
              price: Number(formData.price) || a.price
            } 
          : a
      )
      toast.success("Add-on updated")
    }

    const success = await saveAddOnsToDb(updatedAddOns)
    if (success) {
      closeSheet()
    }
  }

  const deleteAddOn = async (id: string) => {
    const updatedAddOns = addOns.filter(a => a.id !== id)
    const success = await saveAddOnsToDb(updatedAddOns)
    if (success) {
      closeSheet()
      setDeleteConfirm(null)
      toast.success("Add-on deleted")
    }
  }

  const autoFillAddOn = () => {
    if (!formData.name) { toast.error("Enter an Add-on Name first"); return }
    const n = formData.name.toLowerCase()
    const db: Record<string, { desc: string; price: number }> = {
      light: { desc: "Professional LED and softbox lighting setup, colour-temperature adjustable, ready before you arrive.", price: 5000 },
      ring: { desc: "Studio-grade ring light with adjustable warmth — perfect for beauty, interviews, and close-up shots.", price: 3000 },
      backdrop: { desc: "Custom backdrop installation in your choice of colour, texture, or pattern. We set it up, you just shoot.", price: 3000 },
      prop: { desc: "Curated collection of high-quality props and decorative pieces, hand-picked to match your shoot's vibe.", price: 4000 },
      styl: { desc: "One-on-one styling consultation to optimise your set layout, wardrobe, and composition before the camera rolls.", price: 6000 },
      camera: { desc: "Professional-grade camera body and lens rental — shoot on gear you'd normally only dream about.", price: 8000 },
      edit: { desc: "Full post-production package: colour grading, retouching, and export-ready delivery within 48 hours.", price: 12000 },
      sound: { desc: "External mic, boom, and audio recorder setup for crystal-clear sound on interviews and voice-over.", price: 4000 },
      makeup: { desc: "On-set makeup artist available for touch-ups, full glam, or natural looks — whatever the brief demands.", price: 8000 },
      catering: { desc: "Light refreshments and snacks for your crew. Keep the energy up without leaving the studio.", price: 5000 },
      smoke: { desc: "Haze machine for that cinematic atmosphere. Adds depth, mood, and drama to any lighting setup.", price: 3500 },
      assistant: { desc: "An extra pair of hands on set — our studio assistant helps with setup, teardown, and anything in between.", price: 5000 },
    }
    let match = { desc: `Professional ${formData.name} service, carefully prepared by our team to make your session seamless.`, price: 5000 }
    for (const [key, val] of Object.entries(db)) {
      if (n.includes(key)) { match = val; break }
    }
    setFormData(prev => ({ ...prev, description: match.desc, price: prev.price && prev.price > 0 ? prev.price : match.price }))
    toast.success("Auto-filled!")
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-8 md:p-12 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl sm:text-5xl font-display font-light mb-3 tracking-tight" style={{ color: "var(--text-primary)" }}>
              Add-ons
            </h1>
            <p className="text-base sm:text-lg font-body max-w-xl" style={{ color: "var(--text-muted)" }}>
              Manage extra services and equipment available for booking.
            </p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onClick={openNew}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: "var(--cta-primary)" }}
          >
            <Plus size={20} /> New Add-on
          </motion.button>
        </div>

        {/* LIST */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--cta-primary)" }} />
          </div>
        ) : addOns.length === 0 ? (
          <div className="text-center py-32 rounded-2xl border border-dashed" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            <p className="text-lg font-medium mb-2" style={{ color: "var(--text-primary)" }}>No add-ons yet</p>
            <p className="mb-6" style={{ color: "var(--text-muted)" }}>Create your first add-on to offer extra services during bookings.</p>
            <button onClick={openNew} className="text-sm font-semibold" style={{ color: "var(--cta-primary)" }}>
              Create Add-on
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {addOns.map((addon, i) => (
              <motion.div
                key={addon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative p-6 rounded-2xl border transition-all hover:shadow-xl"
                style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-display font-medium" style={{ color: "var(--text-primary)" }}>{addon.name}</h3>
                  <p className="text-sm font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: "var(--bg)", color: "var(--cta-primary)" }}>
                    ₦{addon.price.toLocaleString()}
                  </p>
                </div>
                
                <p className="text-sm line-clamp-3 mb-6" style={{ color: "var(--text-muted)" }}>
                  {addon.description || "No description provided."}
                </p>

                <div className="flex justify-end pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                  <button onClick={() => openEdit(addon)} className="p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10" style={{ color: "var(--text-primary)" }}>
                    <Edit2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT/CREATE SHEET */}
      <AnimatePresence>
        {(selected || isNew) && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeSheet}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[480px] z-50 shadow-2xl flex flex-col"
              style={{ backgroundColor: "var(--bg)", borderLeft: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between p-6 sm:p-8 border-b" style={{ borderColor: "var(--border)" }}>
                <h2 className="text-2xl font-display" style={{ color: "var(--text-primary)" }}>
                  {isNew ? "New Add-on" : "Edit Add-on"}
                </h2>
                <button onClick={closeSheet} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                  <X size={20} style={{ color: "var(--text-primary)" }} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
                <InputField
                  label="Add-on Name *"
                  placeholder="e.g. Professional Lighting Setup"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <InputField
                  label="Price (₦) *"
                  type="number"
                  placeholder="e.g. 5000"
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs uppercase tracking-wide font-semibold font-body" style={{ color: "var(--text-muted)" }}>Description</label>
                    <button onClick={autoFillAddOn} className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/10" style={{ color: "var(--cta-primary)" }}>
                      <Sparkles size={12} /> Auto-Fill
                    </button>
                  </div>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border text-sm font-body resize-none h-32"
                    style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                    placeholder="Describe this add-on..."
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {!isNew && selected && (
                  <div className="pt-8 mt-8 border-t" style={{ borderColor: "var(--border)" }}>
                    {deleteConfirm === selected.id ? (
                      <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
                        <p className="text-sm text-red-800 dark:text-red-200 mb-4 font-medium">Are you absolutely sure? This cannot be undone.</p>
                        <div className="flex gap-3">
                          <button onClick={() => deleteAddOn(selected.id)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors">
                            Yes, delete it
                          </button>
                          <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm font-semibold rounded-lg transition-colors border dark:border-zinc-700">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(selected.id)} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-500 transition-colors">
                        <Trash2 size={16} /> Delete Add-on
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 border-t bg-black/5 dark:bg-white/5 backdrop-blur-md" style={{ borderColor: "var(--border)" }}>
                <button
                  onClick={saveAddOn}
                  className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                  style={{ backgroundColor: "var(--cta-primary)" }}
                >
                  <Save size={20} /> Save Changes
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
