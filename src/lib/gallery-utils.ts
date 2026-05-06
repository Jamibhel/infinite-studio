/**
 * Gallery Management Utilities
 * Handles image uploads, deletions, and URL generation across all storage buckets
 */

import { createClient } from "@supabase/supabase-js"

export type BucketType = "gallery" | "space-images" | "hero-images" | "about-content" | "resources"

export interface ImageUploadOptions {
  bucket: BucketType
  folder?: string
  file: File
  onProgress?: (progress: number) => void
}

export interface ImageDeleteOptions {
  bucket: BucketType
  filePath: string
}

/**
 * Get Supabase client
 */
export const getSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )
}

/**
 * Generate a sanitized filename with timestamp
 */
export const generateFilename = (originalFilename: string): string => {
  const timestamp = Date.now()
  const sanitized = originalFilename
    .replace(/[^a-z0-9.-]/gi, "-")
    .toLowerCase()
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
  return `${timestamp}-${sanitized}`
}

/**
 * Validate image file
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: JPG, PNG, GIF, WebP`,
    }
  }

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `File too large. Max 5MB, got ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    }
  }

  return { valid: true }
}

/**
 * Upload an image to Supabase storage
 */
export const uploadImage = async (options: ImageUploadOptions): Promise<{ success: boolean; path?: string; error?: string }> => {
  const { bucket, folder, file, onProgress } = options

  try {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    const supabase = getSupabaseClient()
    const filename = generateFilename(file.name)
    const filePath = folder ? `${folder}/${filename}` : filename

    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file)

    if (uploadError) {
      return { success: false, error: uploadError.message }
    }

    return { success: true, path: filePath }
  } catch (err) {
    console.error("Upload error:", err)
    return { success: false, error: "Failed to upload image" }
  }
}

/**
 * Delete an image from Supabase storage
 */
export const deleteImage = async (options: ImageDeleteOptions): Promise<{ success: boolean; error?: string }> => {
  const { bucket, filePath } = options

  try {
    const supabase = getSupabaseClient()
    const { error: deleteError } = await supabase.storage.from(bucket).remove([filePath])

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    return { success: true }
  } catch (err) {
    console.error("Delete error:", err)
    return { success: false, error: "Failed to delete image" }
  }
}

/**
 * Get public URL for an image
 */
export const getImageUrl = (bucket: BucketType, filePath: string): string => {
  const supabase = getSupabaseClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}

/**
 * List images in a bucket/folder
 */
export const listImages = async (
  bucket: BucketType,
  folder?: string
): Promise<{ success: boolean; files?: any[]; error?: string }> => {
  try {
    const supabase = getSupabaseClient()
    const path = folder || ""

    const { data, error: listError } = await supabase.storage.from(bucket).list(path, {
      limit: 500,
      offset: 0,
    })

    if (listError) {
      return { success: false, error: listError.message }
    }

    // Filter out folders and metadata files
    const files = (data || []).filter((file: any) => !file.name.startsWith(".") && file.id)

    return { success: true, files }
  } catch (err) {
    console.error("List error:", err)
    return { success: false, error: "Failed to list images" }
  }
}

/**
 * Move image to different folder (workaround: upload + delete)
 */
export const moveImage = async (
  bucket: BucketType,
  oldPath: string,
  newFolder: string,
  filename: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const supabase = getSupabaseClient()

    // Get the old file
    const { data, error: downloadError } = await supabase.storage.from(bucket).download(oldPath)

    if (downloadError || !data) {
      return { success: false, error: "Failed to download image" }
    }

    // Upload to new location
    const newPath = `${newFolder}/${filename}`
    const { error: uploadError } = await supabase.storage.from(bucket).upload(newPath, data)

    if (uploadError) {
      return { success: false, error: "Failed to upload image to new location" }
    }

    // Delete old file
    const { error: deleteError } = await supabase.storage.from(bucket).remove([oldPath])

    if (deleteError) {
      console.warn("Failed to delete old image file:", deleteError)
      // Continue anyway since the file was uploaded successfully
    }

    return { success: true }
  } catch (err) {
    console.error("Move error:", err)
    return { success: false, error: "Failed to move image" }
  }
}

/**
 * Get bucket config
 */
export interface BucketConfig {
  name: BucketType
  label: string
  description: string
  folders?: string[]
  usage: string
}

export const BUCKET_CONFIGS: Record<BucketType, BucketConfig> = {
  gallery: {
    name: "gallery",
    label: "Portfolio & Shoots",
    description: "General gallery, portfolio shots, and behind-the-scenes content",
    usage: "Displayed on /gallery page in public gallery section",
  },
  "space-images": {
    name: "space-images",
    label: "Studio Spaces",
    description: "Space covers, detail galleries, and featured spaces",
    folders: ["the-bar", "green-screen", "vanity-mirror", "staircase", "office-set", "chair-space", "eid-setup", "bookshelf"],
    usage: "Displayed on /spaces list, space detail pages, and home featured section",
  },
  "hero-images": {
    name: "hero-images",
    label: "Page Heroes",
    description: "Full-page hero banners for all pages",
    folders: ["pages/home", "pages/spaces", "pages/about", "pages/gallery", "pages/booking", "pages/blog"],
    usage: "Full-page backgrounds across all main pages",
  },
  "about-content": {
    name: "about-content",
    label: "About & Testimonials",
    description: "About page images, why-section images, and testimonial avatars",
    folders: ["about", "testimonials"],
    usage: "About page hero, why-section images, and testimonial avatars on home page",
  },
  resources: {
    name: "resources",
    label: "Blog & Resources",
    description: "Blog post headers, guides, and educational content",
    folders: ["blog", "guides"],
    usage: "Blog post headers on /blog page and home creator resources section",
  },
}

/**
 * Get recommended image dimensions for different use cases
 */
export const IMAGE_SPECS = {
  spaceCard: { width: 500, height: 400, description: "Space cards (featured/list)" },
  spaceHero: { width: 800, height: 600, description: "Space detail page hero" },
  pageHero: { width: 1200, height: 900, description: "Full-page hero backgrounds" },
  galleryItem: { width: 500, height: 400, description: "Gallery portfolio items" },
  whySection: { width: 500, height: 400, description: "About page why-section" },
  blogHeader: { width: 800, height: 400, description: "Blog post headers" },
  testimonialAvatar: { width: 100, height: 100, description: "Creator avatars" },
}

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
}

/**
 * Generate image upload guide for a specific bucket
 */
export const getUploadGuide = (bucket: BucketType): string => {
  const config = BUCKET_CONFIGS[bucket]
  const specs = IMAGE_SPECS

  let guide = `📸 Upload Guide for ${config.label}\n`
  guide += `\n${config.usage}\n\n`

  if (config.folders && config.folders.length > 0) {
    guide += `Available folders:\n`
    config.folders.forEach((folder) => {
      guide += `  • ${folder}\n`
    })
  }

  guide += `\nRecommended specs:\n`
  guide += `  • Size: Max 5MB per image\n`
  guide += `  • Format: JPG, PNG, GIF, WebP\n`
  guide += `  • Dimensions: See folder guide\n`

  return guide
}
