"use client"

import { AdminLayout } from "@/components/AdminLayout"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Trash2, Image as ImageIcon, X, RefreshCw, CheckCircle2 } from "lucide-react"
import { useState, useRef, useEffect, useCallback } from "react"
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
  const [isDragging, setIsDragging] = useState(false)
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  useEffect(() => { fetchGallery() }, [])

  const fetchGallery = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.storage.from("gallery").list("", { limit: 200 })
      if (error) throw error

      const withUrls = (data || [])
        .filter(f => !f.name.startsWith("."))
        .map(f => ({
          id: f.name,
          filename: f.name,
          url: supabase.storage.from("gallery").getPublicUrl(f.name).data.publicUrl,
          created_at: f.created_at || new Date().toISOString(),
        }))

      setItems(withUrls)
    } catch {
      toast.error("Failed to load gallery")
    } finally {
      setLoading(false)
    }
  }

  const handleFiles = async (files: FileList) => {
    if (!files.length) return
    setUploading(true)
    let uploaded = 0

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) { toast.error(`${file.name} is not an image`); continue }
      if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} exceeds 5MB`); continue }

      const filename = `${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from("gallery").upload(filename, file)
      if (error) { toast.error(`Failed: ${file.name}`); continue }
      uploaded++
    }

    if (uploaded > 0) {
      toast.success(`${uploaded} image${uploaded > 1 ? "s" : ""} uploaded`)
      await fetchGallery()
    }
    setUploading(false)
  }

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase.storage.from("gallery").remove([id])
      if (error) throw error
      setItems(prev => prev.filter(i => i.id !== id))
      if (selected?.id === id) setSelected(null)
      setDeleteConfirm(null)
      toast.success("Deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }, [])
  const onDragLeave = useCallback(() => setIsDragging(false), [])
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files)
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Gallery</h2>
            <p className="text-sm mt-1 font-body" style={{ color: "var(--text-muted)" }}>{items.length} images · 5MB max per image</p>
          </div>
          <button
            onClick={fetchGallery}
            className="w-9 h-9 rounded-xl flex items-center justify-center border"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <RefreshCw size={15} />
          </button>
        </div>

        {/* Upload Zone */}
        <motion.div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          animate={{ scale: isDragging ? 1.01 : 1 }}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-10 px-6 cursor-pointer transition-all"
          style={{
            borderColor: isDragging ? "var(--cta-primary)" : "var(--border)",
            background: isDragging ? "rgba(196,98,58,0.05)" : "var(--surface)",
          }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(196,98,58,0.1)" }}>
            {uploading ? (
              <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--cta-primary)" }} />
            ) : (
              <Upload size={24} style={{ color: "var(--cta-primary)" }} />
            )}
          </div>
          <p className="text-sm font-bold font-body" style={{ color: "var(--text-primary)" }}>
            {uploading ? "Uploading..." : "Drop images here or tap to upload"}
          </p>
          <p className="text-xs mt-1 font-body" style={{ color: "var(--text-muted)" }}>PNG, JPG, WebP, GIF · Max 5MB each</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={e => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--cta-primary)" }} />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <ImageIcon size={36} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
            <p className="text-sm font-body" style={{ color: "var(--text-muted)" }}>No images yet. Upload your first one above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="relative rounded-2xl overflow-hidden cursor-pointer group"
                style={{ aspectRatio: "1", background: "var(--surface)", border: "1px solid var(--border)" }}
                onClick={() => setSelected(item)}
              >
                <img
                  src={item.url}
                  alt={item.filename}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                <button
                  onClick={e => { e.stopPropagation(); setDeleteConfirm(item.id) }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={12} className="text-red-500" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 z-50 flex items-end md:items-center justify-center p-4"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="fixed inset-4 md:inset-16 z-50 rounded-3xl overflow-hidden flex flex-col"
              style={{ background: "var(--surface)" }}
            >
              <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                <p className="text-sm font-bold truncate font-body" style={{ color: "var(--text-primary)" }}>
                  {selected.filename}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDeleteConfirm(selected.id)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--bg)", color: "var(--text-muted)" }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
                <img src={selected.url} alt={selected.filename} className="max-w-full max-h-full object-contain rounded-xl" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60]"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed z-[70] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 rounded-2xl p-6 border shadow-xl"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="font-display text-lg font-bold text-center mb-2" style={{ color: "var(--text-primary)" }}>Delete Image?</h3>
              <p className="text-sm text-center mb-5 font-body" style={{ color: "var(--text-muted)" }}>This action cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold border font-body"
                  style={{ borderColor: "var(--border)", color: "var(--text-primary)", background: "var(--bg)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteItem(deleteConfirm)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white font-body"
                  style={{ background: "#EF4444" }}
                >
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
