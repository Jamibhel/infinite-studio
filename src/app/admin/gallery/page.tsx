"use client"

import { AdminLayout } from "@/components/AdminLayout"
import { motion } from "framer-motion"
import { Upload, Trash2, AlertCircle } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import toast from "react-hot-toast"

interface GalleryItem {
  id: string
  filename: string
  url: string
  created_at: string
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      setLoading(true)
      // List files from storage
      const { data, error: listError } = await supabase.storage
        .from("gallery")
        .list("", { limit: 100, offset: 0 })

      if (listError) throw listError

      // Get public URLs for each file
      const itemsWithUrls = (data || []).map((file: any) => {
        const urlData = supabase.storage
          .from("gallery")
          .getPublicUrl(file.name)

        return {
          id: file.name,
          filename: file.name,
          url: urlData.data.publicUrl,
          created_at: file.created_at || new Date().toISOString(),
        }
      })

      setItems(itemsWithUrls)
      setError("")
    } catch (err) {
      console.error("Error fetching gallery:", err)
      setError("Failed to load gallery")
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (files: FileList) => {
    if (!files.length) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        // Check file type
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`)
          continue
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`)
          continue
        }

        const timestamp = Date.now()
        const filename = `${timestamp}-${file.name}`

        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(filename, file)

        if (uploadError) throw uploadError

        toast.success(`${file.name} uploaded successfully`)
      }

      // Refresh gallery
      await fetchGallery()
    } catch (err) {
      console.error("Error uploading file:", err)
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const deleteItem = async (itemId: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return

    try {
      const { error: deleteError } = await supabase.storage
        .from("gallery")
        .remove([itemId])

      if (deleteError) throw deleteError

      setItems(items.filter((item) => item.id !== itemId))
      toast.success("Image deleted successfully")
    } catch (err) {
      console.error("Error deleting image:", err)
      toast.error("Failed to delete image")
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="heading-h1 mb-2">Gallery Curator</h1>
          <p className="body-text text-[var(--text-muted)]">Upload and organize shoot photos</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3"
          >
            <AlertCircle className="text-red-500 flex-shrink-0 w-5 h-5 mt-0.5" />
            <p className="text-red-700 font-body">{error}</p>
          </motion.div>
        )}

        <motion.div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-dashed border-[var(--border)] bg-[var(--surface)] rounded-lg p-12 text-center hover:border-[var(--cta-primary)] hover:bg-opacity-50 transition-all cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
          <h3 className="heading-h3 mb-2">Upload Images</h3>
          <p className="body-text text-[var(--text-muted)] mb-4">
            Drag and drop your images here or click to select
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-6 py-2 bg-[var(--cta-primary)] text-white rounded-lg font-semibold hover:bg-[var(--cta-hover)] transition-colors disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Select Files"}
          </button>
        </motion.div>

        <div>
          <h2 className="heading-h2 mb-4">
            Gallery Items ({items.length})
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--border)] border-t-[var(--cta-primary)]"></div>
            </div>
          ) : items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-12 text-center"
            >
              <p className="body-text text-[var(--text-muted)] text-lg">No images uploaded yet</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-4 gap-4">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-[var(--surface)] rounded-lg border border-[var(--border)] overflow-hidden group hover:border-[var(--cta-primary)] transition-colors"
                >
                  <div className="relative bg-[var(--bg)] h-40 overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <p className="body-small font-semibold mb-2 truncate">
                      {item.filename}
                    </p>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="w-full p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium transition"
                    >
                      <Trash2 size={16} className="mx-auto" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
