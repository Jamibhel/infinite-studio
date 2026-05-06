"use client"

import { AdminLayout } from "@/components/AdminLayout"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Trash2, AlertCircle, ChevronRight, Copy, Check, Image as ImageIcon } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import toast from "react-hot-toast"

interface ImageFile {
  id: string
  filename: string
  url: string
  path: string
  size: number
  created_at: string
  bucket: string
}

interface BucketConfig {
  name: string
  label: string
  description: string
  folders?: string[]
  icon?: string
}

type BucketType = "gallery" | "space-images" | "hero-images" | "about-content" | "resources"

const BUCKET_CONFIGS: Record<BucketType, BucketConfig> = {
  gallery: {
    name: "gallery",
    label: "Portfolio & Shoots",
    description: "General gallery, portfolio shots, and behind-the-scenes content",
  },
  "space-images": {
    name: "space-images",
    label: "Studio Spaces",
    description: "Space covers, detail galleries, and featured spaces",
    folders: ["the-bar", "green-screen", "vanity-mirror", "staircase", "office-set", "chair-space", "eid-setup", "bookshelf"],
  },
  "hero-images": {
    name: "hero-images",
    label: "Page Heroes",
    description: "Full-page hero banners for all pages",
    folders: ["pages/home", "pages/spaces", "pages/about", "pages/gallery", "pages/booking", "pages/blog"],
  },
  "about-content": {
    name: "about-content",
    label: "About & Testimonials",
    description: "About page images, why-section images, and testimonial avatars",
    folders: ["about", "testimonials"],
  },
  resources: {
    name: "resources",
    label: "Blog & Resources",
    description: "Blog post headers, guides, and educational content",
    folders: ["blog", "guides"],
  },
}

export default function GalleryPage() {
  const [selectedBucket, setSelectedBucket] = useState<BucketType>("gallery")
  const [selectedFolder, setSelectedFolder] = useState<string>("")
  const [items, setItems] = useState<ImageFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  useEffect(() => {
    fetchImages()
  }, [selectedBucket, selectedFolder])

  const fetchImages = async () => {
    try {
      setLoading(true)
      setError("")

      const bucketName = selectedBucket
      const folderPath = selectedFolder ? selectedFolder : ""

      const { data, error: listError } = await supabase.storage
        .from(bucketName)
        .list(folderPath, { limit: 500, offset: 0 })

      if (listError) throw listError

      const imageFiles = (data || [])
        .filter((file: any) => !file.name.startsWith(".") && file.id)
        .map((file: any) => {
          const filePath = folderPath ? `${folderPath}/${file.name}` : file.name
          const urlData = supabase.storage.from(bucketName).getPublicUrl(filePath)

          return {
            id: file.id,
            filename: file.name,
            url: urlData.data.publicUrl,
            path: filePath,
            size: file.metadata?.size || 0,
            created_at: file.created_at || new Date().toISOString(),
            bucket: bucketName,
          }
        })

      setItems(imageFiles)
    } catch (err) {
      console.error("Error fetching images:", err)
      setError("Failed to load images")
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (files: FileList) => {
    if (!files.length) return

    setUploading(true)
    try {
      let uploadPath = selectedFolder
      if (selectedBucket === "gallery" && !selectedFolder) {
        uploadPath = ""
      }

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`)
          continue
        }

        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`)
          continue
        }

        const timestamp = Date.now()
        const sanitizedName = file.name.replace(/[^a-z0-9.-]/gi, "-").toLowerCase()
        const filename = `${timestamp}-${sanitizedName}`
        const fullPath = uploadPath ? `${uploadPath}/${filename}` : filename

        const { error: uploadError } = await supabase.storage
          .from(selectedBucket)
          .upload(fullPath, file)

        if (uploadError) throw uploadError

        toast.success(`${file.name} uploaded successfully`)
      }

      await fetchImages()
    } catch (err) {
      console.error("Error uploading file:", err)
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const deleteItem = async (itemId: string, itemPath: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return

    try {
      const { error: deleteError } = await supabase.storage
        .from(selectedBucket)
        .remove([itemPath])

      if (deleteError) throw deleteError

      setItems(items.filter((item) => item.id !== itemId))
      toast.success("Image deleted successfully")
    } catch (err) {
      console.error("Error deleting image:", err)
      toast.error("Failed to delete image")
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    toast.success("URL copied to clipboard")
    setTimeout(() => setCopiedUrl(null), 2000)
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

  const bucketConfig = BUCKET_CONFIGS[selectedBucket]
  const folders = bucketConfig.folders || []

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="heading-h1 mb-2">Image Manager</h1>
          <p className="body-text text-[var(--text-muted)]">
            Manage all images across gallery, spaces, heroes, and resources
          </p>
        </div>

        {/* Bucket Selection */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
          {(Object.entries(BUCKET_CONFIGS) as [BucketType, BucketConfig][]).map(
            ([bucketKey, config]) => (
              <motion.button
                key={bucketKey}
                onClick={() => {
                  setSelectedBucket(bucketKey)
                  setSelectedFolder("")
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedBucket === bucketKey
                    ? "border-[var(--cta-primary)] bg-[var(--cta-primary)] bg-opacity-10"
                    : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--cta-primary)]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <ImageIcon size={16} style={{ color: "var(--cta-primary)" }} />
                  <h3 className="font-semibold text-sm">{config.label}</h3>
                </div>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                  {config.description}
                </p>
              </motion.button>
            )
          )}
        </div>

        {/* Folder Selection for Bucket Types */}
        {folders.length > 0 && (
          <div className="bg-[var(--surface)] rounded-lg p-4 border border-[var(--border)]">
            <p className="text-sm font-semibold mb-3 text-[var(--text-primary)]">Select Folder:</p>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-2">
              <button
                onClick={() => setSelectedFolder("")}
                className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                  selectedFolder === ""
                    ? "bg-[var(--cta-primary)] text-white"
                    : "bg-[var(--bg)] text-[var(--text-muted)] hover:bg-[var(--border)]"
                }`}
              >
                All
              </button>
              {folders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => setSelectedFolder(folder)}
                  className={`p-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap overflow-hidden text-ellipsis ${
                    selectedFolder === folder
                      ? "bg-[var(--cta-primary)] text-white"
                      : "bg-[var(--bg)] text-[var(--text-muted)] hover:bg-[var(--border)]"
                  }`}
                >
                  {folder.split("/").pop()}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3"
          >
            <AlertCircle className="text-red-500 flex-shrink-0 w-5 h-5 mt-0.5" />
            <p className="text-red-700 dark:text-red-400 font-body">{error}</p>
          </motion.div>
        )}

        {/* Upload Area */}
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
          <p className="body-text text-[var(--text-muted)] mb-2">
            Drag and drop images here or click to select
          </p>
          <p className="body-small text-[var(--text-muted)] mb-4">
            Max 5MB per image • JPG, PNG, GIF, WebP
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
            className="px-6 py-2 bg-[var(--cta-primary)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Select Files"}
          </button>
        </motion.div>

        {/* Images Grid */}
        <div>
          <h2 className="heading-h2 mb-4">
            Images ({items.length})
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
              <ImageIcon size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
              <p className="body-text text-[var(--text-muted)] text-lg">No images in this folder</p>
              <p className="body-small text-[var(--text-muted)] mt-2">
                Start by uploading some images above
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-[var(--surface)] rounded-lg border border-[var(--border)] overflow-hidden group hover:border-[var(--cta-primary)] transition-colors"
                  >
                    <div className="relative bg-[var(--bg)] h-40 overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.filename}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 space-y-2">
                      <p className="body-small font-semibold truncate" title={item.filename}>
                        {item.filename}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(item.url)}
                          className="flex-1 p-2 hover:bg-[var(--bg)] rounded-lg text-[var(--text-muted)] text-xs font-medium transition flex items-center justify-center gap-1"
                          title="Copy URL"
                        >
                          {copiedUrl === item.url ? (
                            <>
                              <Check size={14} />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              Copy
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => deleteItem(item.id, item.path)}
                          className="flex-1 p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg text-red-600 dark:text-red-400 text-xs font-medium transition"
                          title="Delete image"
                        >
                          <Trash2 size={14} className="mx-auto" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
