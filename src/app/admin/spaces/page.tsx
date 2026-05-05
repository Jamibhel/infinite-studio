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

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

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
                className="bg-white rounded-soft border border-gray-200 p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-display text-xl font-bold">{space.name}</h3>
                    <p className="text-sm text-gray-600 font-body">{space.mood_tag}</p>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{space.description}</p>
                  </div>
                  <button
                    onClick={() => toggleActive(space.id, space.is_active)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                      space.is_active
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {space.is_active ? "Active" : "Inactive"}
                  </button>
                </div>

                {/* Stats */}
                {space.stats && (
                  <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Bookings</p>
                      <p className="text-lg font-bold">{space.stats.total_bookings}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Revenue</p>
                      <p className="text-lg font-bold">₦{(space.stats.total_revenue / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Occupancy</p>
                      <p className="text-lg font-bold">{Math.round(space.stats.occupancy_rate)}%</p>
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {space.amenities && space.amenities.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Amenities</p>
                    <div className="flex gap-1 flex-wrap">
                      {space.amenities.map((amenity) => (
                        <span key={amenity} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(space)}
                    className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-blue-100 rounded-soft text-blue-600 font-body text-sm transition">
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-soft text-gray-600 font-body text-sm transition">
                    <Eye size={16} />
                    Preview
                  </button>
                  <button
                    onClick={() => deleteSpace(space.id)}
                    className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-red-100 rounded-soft text-red-600 font-body text-sm transition"
                  >
                    <Trash2 size={16} />
                  </button>
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
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">{editMode ? "Edit Space" : "View Space"}</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
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
                  <h3 className="font-semibold text-lg">Pricing Tiers</h3>
                  <div className="space-y-3">
                    {(formData.pricing_tiers || []).length === 0 ? (
                      <p className="text-sm text-gray-500">No pricing tiers configured</p>
                    ) : (
                      (formData.pricing_tiers || []).map((tier, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-semibold">{tier.name}</p>
                          <p className="text-sm text-gray-600">Hourly: ₦{tier.hourly_rate} | Daily: ₦{tier.daily_rate}</p>
                        </div>
                      ))
                    )}
                  </div>
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
