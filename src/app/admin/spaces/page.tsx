"use client"

import { AdminLayout } from "@/components/AdminLayout"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Edit2, X, Save, Camera, Wifi, Zap, Volume2, AirVent, Coffee, Upload, Plus, AlertCircle, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import toast from "react-hot-toast"

interface Space {
  id: string
  name: string
  mood_tag: string
  description: string
  is_active: boolean
  images: string[]
  price?: number
  amenities?: string[]
  capacity?: number
}

const AMENITIES = [
  { name: "WiFi", icon: Wifi },
  { name: "Power Supply", icon: Zap },
  { name: "AC/Cooling", icon: AirVent },
  { name: "Sound System", icon: Volume2 },
  { name: "Coffee/Tea", icon: Coffee },
  { name: "Camera Mount", icon: Camera },
]

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

export default function SpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Space | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [formData, setFormData] = useState<Partial<Space>>({})
  const [uploading, setUploading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  useEffect(() => { fetchSpaces() }, [])

  const fetchSpaces = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("spaces").select("*").order("sort_order", { ascending: true })
      if (error) throw error
      setSpaces((data || []).map((s: any) => ({
        id: s.id, name: s.name, mood_tag: s.mood_tag || "",
        description: s.description || "", is_active: s.is_active !== false,
        images: s.images || [], price: s.price || 0,
        amenities: s.amenities || [], capacity: s.capacity || 0,
      })))
    } catch { toast.error("Failed to load spaces") }
    finally { setLoading(false) }
  }

  const openEdit = (space: Space) => {
    setSelected(space)
    setFormData({ ...space })
    setIsNew(false)
  }

  const openNew = () => {
    setSelected(null)
    setFormData({ images: [], amenities: [], is_active: true })
    setIsNew(true)
  }

  const closeSheet = () => { setSelected(null); setIsNew(false); setFormData({}) }

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await supabase.from("spaces").update({ is_active: !current }).eq("id", id)
      setSpaces(prev => prev.map(s => s.id === id ? { ...s, is_active: !current } : s))
      toast.success(current ? "Space deactivated" : "Space activated")
    } catch { toast.error("Update failed") }
  }

  const deleteSpace = async (id: string) => {
    try {
      await supabase.from("spaces").delete().eq("id", id)
      setSpaces(prev => prev.filter(s => s.id !== id))
      closeSheet()
      setDeleteConfirm(null)
      toast.success("Space deleted")
    } catch { toast.error("Delete failed") }
  }

  const saveSpace = async () => {
    if (!formData.name || !formData.description) { toast.error("Name and description required"); return }
    try {
      if (isNew) {
        const id = (formData.name as string).toLowerCase().replace(/\s+/g, "-")
        await supabase.from("spaces").insert([{ id, ...formData, is_active: true }])
        toast.success("Space created")
      } else if (selected) {
        await supabase.from("spaces").update({
          name: formData.name, mood_tag: formData.mood_tag, description: formData.description,
          capacity: formData.capacity, price: formData.price, amenities: formData.amenities, images: formData.images,
        }).eq("id", selected.id)
        toast.success("Space updated")
      }
      closeSheet()
      await fetchSpaces()
    } catch { toast.error("Failed to save space") }
  }

  const uploadImage = async (file: File) => {
    const spaceId = selected?.id || "new"
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5MB"); return }
    setUploading(true)
    try {
      const path = `spaces/${spaceId}-${Date.now()}.${file.name.split(".").pop()}`
      const { error } = await supabase.storage.from("space-images").upload(path, file, { upsert: true })
      if (error) throw error
      const url = supabase.storage.from("space-images").getPublicUrl(path).data.publicUrl
      setFormData(prev => ({ ...prev, images: [...(prev.images || []), url] }))
      toast.success("Image uploaded")
    } catch { toast.error("Upload failed") }
    finally { setUploading(false) }
  }

  const removeImage = (idx: number) => {
    setFormData(prev => ({ ...prev, images: (prev.images || []).filter((_, i) => i !== idx) }))
  }

  const toggleAmenity = (name: string) => {
    const current = formData.amenities || []
    setFormData(prev => ({
      ...prev,
      amenities: current.includes(name) ? current.filter(a => a !== name) : [...current, name],
    }))
  }

  const isEditing = isNew || selected !== null

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Spaces</h2>
            <p className="text-sm mt-1 font-body" style={{ color: "var(--text-muted)" }}>{spaces.length} spaces configured</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchSpaces} className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-muted)" }}>
              <RefreshCw size={15} />
            </button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={openNew}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold font-body"
              style={{ background: "var(--cta-primary)", boxShadow: "0 4px 14px rgba(196,98,58,0.35)" }}
            >
              <Plus size={16} /> Add Space
            </motion.button>
          </div>
        </div>

        {/* Spaces Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--cta-primary)" }} />
          </div>
        ) : spaces.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <Camera size={36} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
            <p className="text-sm font-body" style={{ color: "var(--text-muted)" }}>No spaces yet. Add your first one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spaces.map((space, i) => (
              <motion.div
                key={space.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl overflow-hidden border"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                {/* Image */}
                <div className="relative h-44 bg-gradient-to-br overflow-hidden"
                  style={{ background: "linear-gradient(135deg, var(--cta-primary)33, var(--cta-hover)33)" }}>
                  {space.images?.[0] ? (
                    <img src={space.images[0]} alt={space.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera size={36} style={{ color: "var(--cta-primary)", opacity: 0.4 }} />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full`}
                      style={{
                        background: space.is_active ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                        color: space.is_active ? "#10B981" : "#EF4444"
                      }}>
                      {space.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>{space.name}</h3>
                      <p className="text-xs font-body" style={{ color: "var(--cta-primary)" }}>{space.mood_tag}</p>
                    </div>
                    <button
                      onClick={() => toggleActive(space.id, space.is_active)}
                      className="flex-shrink-0"
                      style={{ color: space.is_active ? "#10B981" : "var(--text-muted)" }}
                    >
                      {space.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </div>

                  <p className="text-xs font-body line-clamp-2 mb-3" style={{ color: "var(--text-muted)" }}>{space.description}</p>

                  <div className="flex items-center justify-between text-xs font-body" style={{ color: "var(--text-muted)" }}>
                    <span>{space.capacity ? `${space.capacity} people` : "Capacity —"}</span>
                    <span style={{ color: "var(--cta-primary)", fontWeight: 700 }}>
                      {space.price ? `₦${space.price.toLocaleString()}` : "Price —"}
                    </span>
                  </div>

                  <button
                    onClick={() => openEdit(space)}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
                    style={{ background: "var(--cta-primary)" }}
                  >
                    <Edit2 size={13} /> Edit Space
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / Create Bottom Sheet */}
      <AnimatePresence>
        {isEditing && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50" onClick={closeSheet} />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden max-h-[92vh] overflow-y-auto"
              style={{ background: "var(--surface)" }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ background: "var(--border)" }} />
              </div>

              <div className="px-5 pb-8 pt-2">
                {/* Sheet Header */}
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                    {isNew ? "New Space" : `Edit: ${selected?.name}`}
                  </h3>
                  <button onClick={closeSheet} className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--bg)", color: "var(--text-muted)" }}>
                    <X size={15} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Images */}
                  <div>
                    <label className="block text-xs uppercase tracking-wide font-semibold mb-2 font-body" style={{ color: "var(--text-muted)" }}>Images</label>
                    {(formData.images || []).length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {(formData.images || []).map((img, idx) => (
                          <div key={idx} className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "1" }}>
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            {idx === 0 && (
                              <div className="absolute top-1 left-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "var(--cta-primary)" }}>Primary</div>
                            )}
                            <button onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <label className="block border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all"
                      style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
                      <Upload size={20} className="mx-auto mb-1" style={{ color: "var(--cta-primary)" }} />
                      <p className="text-xs font-body" style={{ color: "var(--text-muted)" }}>
                        {uploading ? "Uploading..." : "Tap to upload image"}
                      </p>
                      <input type="file" accept="image/*" className="hidden"
                        onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                    </label>
                  </div>

                  {/* Basic Info */}
                  <InputField label="Space Name" value={formData.name || ""} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
                  <InputField label="Mood Tag" value={formData.mood_tag || ""} onChange={e => setFormData(p => ({ ...p, mood_tag: e.target.value }))} placeholder="Dramatic · Moody" />
                  <div>
                    <label className="block text-xs uppercase tracking-wide font-semibold mb-2 font-body" style={{ color: "var(--text-muted)" }}>Description</label>
                    <textarea value={formData.description || ""} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3}
                      className="w-full px-4 py-3 rounded-xl border text-sm font-body resize-none"
                      style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="Capacity" type="number" value={formData.capacity || 0} onChange={e => setFormData(p => ({ ...p, capacity: +e.target.value }))} />
                    <InputField label="Price (₦)" type="number" value={formData.price || 0} onChange={e => setFormData(p => ({ ...p, price: +e.target.value }))} />
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-xs uppercase tracking-wide font-semibold mb-2 font-body" style={{ color: "var(--text-muted)" }}>Amenities</label>
                    <div className="grid grid-cols-3 gap-2">
                      {AMENITIES.map(({ name, icon: Icon }) => {
                        const active = (formData.amenities || []).includes(name)
                        return (
                          <motion.button key={name} whileTap={{ scale: 0.94 }} onClick={() => toggleAmenity(name)}
                            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all"
                            style={{
                              borderColor: active ? "var(--cta-primary)" : "var(--border)",
                              background: active ? "rgba(196,98,58,0.08)" : "var(--bg)",
                            }}>
                            <Icon size={18} style={{ color: active ? "var(--cta-primary)" : "var(--text-muted)" }} />
                            <span className="text-[9px] font-bold text-center font-body" style={{ color: active ? "var(--cta-primary)" : "var(--text-muted)" }}>{name}</span>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {!isNew && selected && (
                      <button onClick={() => setDeleteConfirm(selected.id)}
                        className="w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0"
                        style={{ borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)", color: "#EF4444" }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                    <motion.button whileTap={{ scale: 0.97 }} onClick={saveSpace}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-bold font-body"
                      style={{ background: "linear-gradient(135deg, var(--cta-primary), var(--cta-hover))" }}>
                      <Save size={15} /> {isNew ? "Create Space" : "Save Changes"}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed z-[70] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 rounded-2xl p-6 border"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="font-display text-lg font-bold text-center mb-2" style={{ color: "var(--text-primary)" }}>Delete Space?</h3>
              <p className="text-sm text-center mb-5 font-body" style={{ color: "var(--text-muted)" }}>This will permanently remove this space.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold border font-body"
                  style={{ borderColor: "var(--border)", color: "var(--text-primary)", background: "var(--bg)" }}>
                  Cancel
                </button>
                <button onClick={() => deleteSpace(deleteConfirm)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white font-body" style={{ background: "#EF4444" }}>
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
