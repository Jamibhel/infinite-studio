"use client"

import { AdminLayout } from "@/components/AdminLayout"
import { motion } from "framer-motion"
import { Trash2, Edit2, Eye, AlertCircle, Plus, X, Save, Camera, Wifi, Zap, Volume2, AirVent, Coffee, Upload } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import toast from "react-hot-toast"

interface Amenity {
  id: string
  name: string
  icon: string
}

interface SpaceStats {
  total_bookings: number
  total_revenue: number
  occupancy_rate: number
  pending_bookings: number
}

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
  stats?: SpaceStats
}

export default function SpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<Partial<Space>>({})
  const [stats, setStats] = useState<Record<string, SpaceStats>>({})
  const [uploading, setUploading] = useState(false)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  const uploadSpaceImage = async (file: File, spaceId: string) => {
    try {
      setUploading(true)
      
      if (!spaceId) {
        toast.error("No space selected")
        return
      }

      const fileExt = file.name.split(".").pop()
      const fileName = `${spaceId}-${Date.now()}.${fileExt}`
      const filePath = `spaces/${fileName}`

      console.log("Uploading file:", { fileName, filePath, fileSize: file.size, fileType: file.type })

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("space-images")
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        console.error("Upload error details:", uploadError)
        throw uploadError
      }

      console.log("Upload successful:", uploadData)

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("space-images")
        .getPublicUrl(filePath)

      const publicUrl = urlData?.publicUrl

      if (!publicUrl) {
        throw new Error("Failed to get public URL")
      }

      console.log("Public URL:", publicUrl)

      // Add to formData images
      const currentImages = formData.images || []
      setFormData({
        ...formData,
        images: [...currentImages, publicUrl],
      })

      toast.success("Image uploaded successfully")
    } catch (err) {
      console.error("Error uploading image:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to upload image"
      toast.error(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = (formData.images || []).filter((_, i) => i !== index)
    setFormData({ ...formData, images: updatedImages })
  }

  useEffect(() => {
    fetchSpaces()
  }, [])

  const fetchSpaces = async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from("spaces")
        .select("*")
        .order("sort_order", { ascending: true })

      if (fetchError) throw fetchError

      // Fetch stats for each space
      const statsMap: Record<string, SpaceStats> = {}
      for (const space of data) {
        const { data: bookings } = await supabase
          .from("bookings")
          .select("id, amount, status")
          .contains("spaces", [space.name])

        if (bookings) {
          const totalRevenue = bookings.reduce((sum: number, b: any) => sum + (b.amount || 0), 0)
          const confirmedCount = bookings.filter((b: any) => b.status === "confirmed").length
          const pendingCount = bookings.filter((b: any) => b.status === "pending").length
          
          statsMap[space.id] = {
            total_bookings: bookings.length,
            total_revenue: totalRevenue,
            occupancy_rate: bookings.length > 0 ? ((confirmedCount + pendingCount) / bookings.length) * 100 : 0,
            pending_bookings: pendingCount
          }
        }
      }

      setStats(statsMap)
      setSpaces(
        data.map((space: any) => ({
          id: space.id,
          name: space.name,
          mood_tag: space.mood_tag || "",
          description: space.description || "",
          is_active: space.is_active !== false,
          images: space.images || [],
          price: space.price || 0,
          amenities: space.amenities || [],
          capacity: space.capacity || 0,
          stats: statsMap[space.id],
        }))
      )
      setError("")
    } catch (err) {
      console.error("Error fetching spaces:", err)
      setError("Failed to load spaces")
      toast.error("Failed to load spaces")
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (spaceId: string, currentStatus: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from("spaces")
        .update({ is_active: !currentStatus })
        .eq("id", spaceId)

      if (updateError) throw updateError

      setSpaces(
        spaces.map((space) =>
          space.id === spaceId ? { ...space, is_active: !currentStatus } : space
        )
      )
      toast.success("Space status updated")
    } catch (err) {
      console.error("Error updating space:", err)
      toast.error("Failed to update space")
    }
  }

  const deleteSpace = async (spaceId: string) => {
    if (!window.confirm("Are you sure you want to delete this space?")) return

    try {
      const { error: deleteError } = await supabase
        .from("spaces")
        .delete()
        .eq("id", spaceId)

      if (deleteError) throw deleteError

      setSpaces(spaces.filter((space) => space.id !== spaceId))
      toast.success("Space deleted successfully")
    } catch (err) {
      console.error("Error deleting space:", err)
      toast.error("Failed to delete space")
    }
  }

  const openEditModal = (space: Space) => {
    setSelectedSpace(space)
    setFormData(space)
    setEditMode(true)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditMode(false)
    setSelectedSpace(null)
    setFormData({})
  }

  const saveSpace = async () => {
    if (!selectedSpace) return

    try {
      const { error: updateError } = await supabase
        .from("spaces")
        .update({
          name: formData.name,
          mood_tag: formData.mood_tag,
          description: formData.description,
          capacity: formData.capacity,
          price: formData.price,
          amenities: formData.amenities,
          images: formData.images,
        })
        .eq("id", selectedSpace.id)

      if (updateError) throw updateError

      // Update local state
      setSpaces(
        spaces.map((space) =>
          space.id === selectedSpace.id
            ? { ...space, ...formData }
            : space
        )
      )

      toast.success("Space updated successfully")
      closeModal()
    } catch (err) {
      console.error("Error updating space:", err)
      toast.error("Failed to update space")
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="heading-h2 text-[var(--text-primary)]">Spaces Manager</h1>
            <p className="font-body text-[var(--text-muted)] mt-2">Manage studio spaces and settings</p>
          </div>
          <button className="px-6 py-3 bg-[var(--cta-primary)] hover:bg-[var(--cta-hover)] text-white rounded-soft font-semibold flex items-center gap-2 transition-colors">
            <Plus size={20} />
            Add Space
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/30 rounded-soft flex gap-3"
          >
            <AlertCircle className="text-red-500 flex-shrink-0 w-5 h-5 mt-0.5" />
            <p className="text-red-600 font-body">{error}</p>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--cta-primary)]"></div>
          </div>
        ) : spaces.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[var(--surface)] rounded-soft border border-[var(--border)] p-12 text-center"
          >
            <Camera size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
            <p className="text-[var(--text-muted)] text-lg font-body">No spaces yet. Add one to get started!</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {spaces.map((space) => (
              <motion.div
                key={space.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--surface)] rounded-soft border border-[var(--border)] overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Card Header with Image */}
                <div className="relative h-48 bg-gradient-to-br from-[var(--cta-primary)] to-[var(--tag-accent)] overflow-hidden">
                  {space.images && space.images.length > 0 ? (
                    <img 
                      src={space.images[0]} 
                      alt={space.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera size={48} className="text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => openEditModal(space)}
                      className="bg-white/90 hover:bg-white text-[var(--text-primary)] rounded-full p-2 transition-all shadow-md"
                    >
                      <Eye size={20} />
                    </button>
                  </div>
                  {space.is_active && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Active
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">{space.name}</h3>
                    <p className="text-[var(--cta-primary)] font-semibold text-sm mt-1">{space.mood_tag}</p>
                  </div>

                  <p className="text-[var(--text-muted)] text-sm line-clamp-2 font-body">{space.description}</p>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-[var(--border)]">
                    <div>
                      <p className="text-[var(--text-muted)] text-xs font-body">Capacity</p>
                      <p className="font-bold text-[var(--text-primary)]">{space.capacity || "—"} People</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-muted)] text-xs font-body">Price</p>
                      <p className="font-bold text-[var(--cta-primary)]">₦{space.price?.toLocaleString() || "—"}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => openEditModal(space)}
                    className="w-full px-4 py-2 bg-[var(--cta-primary)] hover:bg-[var(--cta-hover)] text-white rounded-soft font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
                    Edit Space
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && selectedSpace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--surface)] rounded-soft max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header with Image */}
              <div className="sticky top-0 bg-[var(--surface)] border-b border-[var(--border)] z-10">
                <div className="relative h-40 bg-gradient-to-br from-[var(--cta-primary)] to-[var(--tag-accent)] overflow-hidden">
                  {selectedSpace.images && selectedSpace.images.length > 0 ? (
                    <img 
                      src={selectedSpace.images[0]} 
                      alt={selectedSpace.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera size={64} className="text-white opacity-30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <button 
                    onClick={closeModal} 
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white text-[var(--text-primary)] rounded-full p-2 transition"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="px-6 py-4 border-b border-[var(--border)]">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-bold text-[var(--text-primary)] font-display">{selectedSpace.name}</h2>
                      <p className="text-[var(--cta-primary)] font-medium mt-1">{selectedSpace.mood_tag}</p>
                    </div>
                    {editMode ? (
                      <span className="px-3 py-1 bg-[var(--cta-primary)]/20 text-[var(--cta-primary)] rounded-full text-sm font-semibold border border-[var(--cta-primary)]/30">
                        Editing
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-[var(--border)] text-[var(--text-muted)] rounded-full text-sm font-semibold">
                        View Mode
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Image Gallery */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-[var(--text-primary)] font-display">Space Images</h3>
                  
                  {/* Current Images */}
                  {(formData.images || []).length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {(formData.images || []).map((image, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={image}
                            alt={`Space ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-soft"
                          />
                          {editMode && (
                            <button
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              <X size={16} />
                            </button>
                          )}
                          {idx === 0 && (
                            <div className="absolute top-1 left-1 bg-[var(--cta-primary)] text-white px-2 py-1 rounded text-xs font-semibold">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Area */}
                  {editMode && (
                    <div className="border-2 border-dashed border-[var(--border)] rounded-soft p-6 text-center hover:border-[var(--cta-primary)] hover:bg-[var(--cta-primary)]/5 transition">
                      <label className="cursor-pointer block">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-3 bg-[var(--cta-primary)]/10 rounded-full">
                            <Upload size={32} className="text-[var(--cta-primary)]" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-primary)]">Click to upload images</p>
                            <p className="text-xs text-[var(--text-muted)] mt-1">PNG, JPG, WebP up to 5MB</p>
                          </div>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          disabled={uploading}
                          onChange={(e) => {
                            const files = e.currentTarget.files
                            if (files) {
                              Array.from(files).forEach((file) => {
                                if (file.size > 5 * 1024 * 1024) {
                                  toast.error("File too large. Maximum 5MB.")
                                  return
                                }
                                uploadSpaceImage(file, selectedSpace?.id || "")
                              })
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      {uploading && (
                        <div className="mt-3 flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-[var(--cta-primary)] border-t-transparent" />
                          <span className="text-sm text-[var(--cta-primary)] font-body">Uploading...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-[var(--text-primary)] font-display">Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 font-body">Space Name</label>
                      <input
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!editMode}
                        className="w-full px-4 py-2 border border-[var(--border)] rounded-soft focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] disabled:bg-[var(--bg)] disabled:text-[var(--text-muted)] transition-colors font-body"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 font-body">Mood Tag</label>
                      <input
                        type="text"
                        value={formData.mood_tag || ""}
                        onChange={(e) => setFormData({ ...formData, mood_tag: e.target.value })}
                        disabled={!editMode}
                        className="w-full px-4 py-2 border border-[var(--border)] rounded-soft focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] disabled:bg-[var(--bg)] disabled:text-[var(--text-muted)] transition-colors font-body"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 font-body">Description</label>
                    <textarea
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      disabled={!editMode}
                      rows={3}
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-soft focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] disabled:bg-[var(--bg)] disabled:text-[var(--text-muted)] transition-colors font-body resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 font-body">Capacity (People)</label>
                    <input
                      type="number"
                      value={formData.capacity || 0}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      disabled={!editMode}
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-soft focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] disabled:bg-[var(--bg)] disabled:text-[var(--text-muted)] transition-colors font-body"
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-[var(--text-primary)] font-display">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { name: "WiFi", icon: Wifi },
                      { name: "Power Supply", icon: Zap },
                      { name: "AC/Cooling", icon: AirVent },
                      { name: "Sound System", icon: Volume2 },
                      { name: "Coffee/Tea", icon: Coffee },
                      { name: "Camera Mount", icon: Camera },
                    ].map((amenity) => {
                      const Icon = amenity.icon
                      return (
                        <button
                          key={amenity.name}
                          onClick={() => {
                            if (editMode) {
                              const currentAmenities = formData.amenities || []
                              if (currentAmenities.includes(amenity.name)) {
                                setFormData({
                                  ...formData,
                                  amenities: currentAmenities.filter((a) => a !== amenity.name),
                                })
                              } else {
                                setFormData({
                                  ...formData,
                                  amenities: [...currentAmenities, amenity.name],
                                })
                              }
                            }
                          }}
                          disabled={!editMode}
                          className={`p-4 rounded-soft border-2 transition flex flex-col items-center gap-2 ${
                            formData.amenities?.includes(amenity.name)
                              ? "border-[var(--cta-primary)] bg-[var(--cta-primary)]/10"
                              : "border-[var(--border)] bg-[var(--bg)]"
                          } ${!editMode ? "cursor-not-allowed opacity-60" : "hover:border-[var(--cta-primary)]"}`}
                        >
                          <Icon size={24} className="text-[var(--cta-primary)]" />
                          <span className="text-sm font-medium text-[var(--text-primary)] font-body">{amenity.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-[var(--text-primary)] font-display">Pricing</h3>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 font-body">Price per Booking (₦)</label>
                    <input
                      type="number"
                      value={formData.price || 0}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                      disabled={!editMode}
                      placeholder="Enter price"
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-soft focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] disabled:bg-[var(--bg)] disabled:text-[var(--text-muted)] transition-colors font-body"
                    />
                    {!editMode && formData.price && (
                      <p className="mt-2 text-lg font-bold text-[var(--cta-primary)] font-display">₦{formData.price.toLocaleString()}</p>
                    )}
                  </div>
                </div>

                {/* Stats */}
                {selectedSpace.stats && (
                  <div className="space-y-4 p-4 bg-[var(--cta-primary)]/10 border border-[var(--cta-primary)]/20 rounded-soft">
                    <h3 className="font-semibold text-lg text-[var(--text-primary)] font-display">Performance Stats</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-[var(--text-muted)] font-body">Total Bookings</p>
                        <p className="text-2xl font-bold text-[var(--text-primary)] font-display">{selectedSpace.stats.total_bookings}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--text-muted)] font-body">Total Revenue</p>
                        <p className="text-2xl font-bold text-[var(--cta-primary)] font-display">₦{(selectedSpace.stats.total_revenue / 1000).toFixed(1)}K</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--text-muted)] font-body">Occupancy Rate</p>
                        <p className="text-2xl font-bold text-[var(--text-primary)] font-display">{Math.round(selectedSpace.stats.occupancy_rate)}%</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {editMode && (
                <div className="sticky bottom-0 bg-[var(--surface)] border-t border-[var(--border)] p-6 flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-3 bg-[var(--border)] hover:bg-[var(--bg)] text-[var(--text-primary)] rounded-soft font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false)
                      saveSpace()
                    }}
                    className="flex-1 px-4 py-3 bg-[var(--cta-primary)] hover:bg-[var(--cta-hover)] text-white rounded-soft font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              )}

              {!editMode && (
                <div className="sticky bottom-0 bg-[var(--surface)] border-t border-[var(--border)] p-6 flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-3 bg-[var(--border)] hover:bg-[var(--bg)] text-[var(--text-primary)] rounded-soft font-semibold transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex-1 px-4 py-3 bg-[var(--cta-primary)] hover:bg-[var(--cta-hover)] text-white rounded-soft font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 size={18} />
                    Edit Space
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  )
}
