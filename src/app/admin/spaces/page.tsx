"use client"

import { AdminLayout } from "@/components/AdminLayout"
import { motion } from "framer-motion"
import { Trash2, Edit2, Eye, AlertCircle, Plus, X, Save, Camera, Wifi, Zap, Volume2, AirVent, Coffee } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import toast from "react-hot-toast"

interface Amenity {
  id: string
  name: string
  icon: string
}

interface PricingTier {
  id: string
  name: string
  hourly_rate: number
  daily_rate: number
  description: string
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
  pricing_tiers?: PricingTier[]
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
      const fileExt = file.name.split(".").pop()
      const fileName = `${spaceId}-${Date.now()}.${fileExt}`
      const filePath = `spaces/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("space-images")
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage
        .from("space-images")
        .getPublicUrl(filePath)

      const publicUrl = data.publicUrl

      // Add to formData images
      const currentImages = formData.images || []
      setFormData({
        ...formData,
        images: [...currentImages, publicUrl],
      })

      toast.success("Image uploaded successfully")
    } catch (err) {
      console.error("Error uploading image:", err)
      toast.error("Failed to upload image")
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
          pricing_tiers: space.pricing_tiers || [],
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
          pricing_tiers: formData.pricing_tiers,
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-4xl font-bold mb-2">Spaces Manager</h1>
            <p className="font-body text-gray-600">Manage studio spaces and settings</p>
          </div>
          <button className="px-6 py-2 bg-dark-accent text-white rounded-lg font-semibold hover:opacity-90 flex items-center gap-2">
            <Plus size={20} />
            Add Space
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 w-5 h-5 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-accent"></div>
          </div>
        ) : spaces.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg border border-gray-200 p-12 text-center"
          >
            <p className="text-gray-500 text-lg">No spaces yet. Add one to get started!</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {spaces.map((space) => (
              <motion.div
                key={space.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-soft border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Card Header with Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                  {space.images && space.images.length > 0 ? (
                    <img 
                      src={space.images[0]} 
                      alt={space.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera size={48} className="text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => toggleActive(space.id, space.is_active)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                        space.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {space.is_active ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                  {/* Title & Description */}
                  <div>
                    <h3 className="font-display text-xl font-bold text-gray-900">{space.name}</h3>
                    <p className="text-sm font-medium text-blue-600 mb-1">{space.mood_tag}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{space.description}</p>
                    {space.capacity && (
                      <p className="text-xs text-gray-500 mt-1">Capacity: {space.capacity} people</p>
                    )}
                  </div>

                  {/* Stats Grid */}
                  {space.stats && (
                    <div className="grid grid-cols-3 gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 font-medium">Bookings</p>
                        <p className="text-lg font-bold text-blue-600">{space.stats.total_bookings}</p>
                      </div>
                      <div className="text-center border-l border-r border-gray-300">
                        <p className="text-xs text-gray-600 font-medium">Revenue</p>
                        <p className="text-lg font-bold text-purple-600">₦{(space.stats.total_revenue / 1000).toFixed(0)}K</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600 font-medium">Occupancy</p>
                        <p className="text-lg font-bold text-green-600">{Math.round(space.stats.occupancy_rate)}%</p>
                      </div>
                    </div>
                  )}

                  {/* Amenities */}
                  {space.amenities && space.amenities.length > 0 && (
                    <div className="space-y-2 pb-3 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Amenities</p>
                      <div className="flex gap-1 flex-wrap">
                        {space.amenities.slice(0, 4).map((amenity) => (
                          <span key={amenity} className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-medium">
                            {amenity}
                          </span>
                        ))}
                        {space.amenities.length > 4 && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">
                            +{space.amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => openEditModal(space)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSpace(space.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium text-sm"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {showModal && selectedSpace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Modal Header with Image */}
              <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
                <div className="relative h-40 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
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
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 transition"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{selectedSpace.name}</h2>
                      <p className="text-blue-600 font-medium mt-1">{selectedSpace.mood_tag}</p>
                    </div>
                    {editMode ? (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        Editing
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                        View Mode
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Image Gallery */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Space Images</h3>
                  
                  {/* Current Images */}
                  {(formData.images || []).length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {(formData.images || []).map((image, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={image}
                            alt={`Space ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
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
                            <div className="absolute top-1 left-1 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Area */}
                  {editMode && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                      <label className="cursor-pointer block">
                        <div className="flex flex-col items-center gap-2">
                          <Camera size={32} className="text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Click to upload images</p>
                            <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB</p>
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
                        <div className="mt-2 flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
                          <span className="text-sm text-blue-600">Uploading...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Space Name</label>
                      <input
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!editMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mood Tag</label>
                      <input
                        type="text"
                        value={formData.mood_tag || ""}
                        onChange={(e) => setFormData({ ...formData, mood_tag: e.target.value })}
                        disabled={!editMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      disabled={!editMode}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (People)</label>
                    <input
                      type="number"
                      value={formData.capacity || 0}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      disabled={!editMode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { name: "WiFi", icon: Wifi },
                      { name: "Power Supply", icon: Zap },
                      { name: "AC/Cooling", icon: AirVent },
                      { name: "Sound System", icon: Volume2 },
                      { name: "Coffee/Tea", icon: Coffee },
                      { name: "Camera Mount", icon: Camera },
                    ].map((amenity) => (
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
                        className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                          formData.amenities?.includes(amenity.name)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-white"
                        } ${!editMode ? "cursor-not-allowed opacity-60" : ""}`}
                      >
                        <amenity.icon size={24} />
                        <span className="text-sm font-medium">{amenity.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Pricing Tiers</h3>
                    {editMode && (
                      <button
                        onClick={() => {
                          const newTier: PricingTier = {
                            id: `tier-${Date.now()}`,
                            name: "New Tier",
                            hourly_rate: 0,
                            daily_rate: 0,
                            description: "",
                          }
                          setFormData({
                            ...formData,
                            pricing_tiers: [...(formData.pricing_tiers || []), newTier],
                          })
                        }}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                      >
                        Add Tier
                      </button>
                    )}
                  </div>

                  {(formData.pricing_tiers || []).length === 0 ? (
                    <p className="text-sm text-gray-500">No pricing tiers configured</p>
                  ) : (
                    <div className="space-y-3">
                      {(formData.pricing_tiers || []).map((tier, idx) => (
                        <div key={idx} className={`p-4 border rounded-lg ${editMode ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>
                          <div className="grid md:grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="text-xs font-semibold text-gray-600">Tier Name</label>
                              <input
                                type="text"
                                value={tier.name}
                                onChange={(e) => {
                                  const updated = [...(formData.pricing_tiers || [])]
                                  updated[idx].name = e.target.value
                                  setFormData({ ...formData, pricing_tiers: updated })
                                }}
                                disabled={!editMode}
                                className="w-full text-sm px-2 py-1 border border-gray-300 rounded mt-1 disabled:bg-white"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-600">Description</label>
                              <input
                                type="text"
                                value={tier.description}
                                onChange={(e) => {
                                  const updated = [...(formData.pricing_tiers || [])]
                                  updated[idx].description = e.target.value
                                  setFormData({ ...formData, pricing_tiers: updated })
                                }}
                                disabled={!editMode}
                                placeholder="e.g., Popular choice"
                                className="w-full text-sm px-2 py-1 border border-gray-300 rounded mt-1 disabled:bg-white"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-semibold text-gray-600">Hourly Rate (₦)</label>
                              <input
                                type="number"
                                value={tier.hourly_rate}
                                onChange={(e) => {
                                  const updated = [...(formData.pricing_tiers || [])]
                                  updated[idx].hourly_rate = parseInt(e.target.value) || 0
                                  setFormData({ ...formData, pricing_tiers: updated })
                                }}
                                disabled={!editMode}
                                className="w-full text-sm px-2 py-1 border border-gray-300 rounded mt-1 disabled:bg-white"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-600">Daily Rate (₦)</label>
                              <input
                                type="number"
                                value={tier.daily_rate}
                                onChange={(e) => {
                                  const updated = [...(formData.pricing_tiers || [])]
                                  updated[idx].daily_rate = parseInt(e.target.value) || 0
                                  setFormData({ ...formData, pricing_tiers: updated })
                                }}
                                disabled={!editMode}
                                className="w-full text-sm px-2 py-1 border border-gray-300 rounded mt-1 disabled:bg-white"
                              />
                            </div>
                          </div>
                          {editMode && (
                            <button
                              onClick={() => {
                                const updated = (formData.pricing_tiers || []).filter((_, i) => i !== idx)
                                setFormData({ ...formData, pricing_tiers: updated })
                              }}
                              className="mt-3 text-xs text-red-600 hover:text-red-700 font-semibold"
                            >
                              Remove Tier
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stats */}
                {selectedSpace.stats && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-lg">Performance Stats</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Bookings</p>
                        <p className="text-2xl font-bold">{selectedSpace.stats.total_bookings}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold">₦{(selectedSpace.stats.total_revenue / 1000).toFixed(1)}K</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Occupancy Rate</p>
                        <p className="text-2xl font-bold">{Math.round(selectedSpace.stats.occupancy_rate)}%</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {editMode && (
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveSpace}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Save Changes
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
