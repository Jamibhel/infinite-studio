"use client"

import { AdminLayout } from "@/components/AdminLayout"
import { motion } from "framer-motion"
import { Trash2, Edit2, Eye, AlertCircle, Plus } from "lucide-react"
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
}

export default function SpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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

      setSpaces(
        data.map((space: any) => ({
          id: space.id,
          name: space.name,
          mood_tag: space.mood_tag || "",
          description: space.description || "",
          is_active: space.is_active !== false,
          images: space.images || [],
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

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-blue-100 rounded-soft text-blue-600 font-body text-sm transition">
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
      </div>
    </AdminLayout>
  )
}
