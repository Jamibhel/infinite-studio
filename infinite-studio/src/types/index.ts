export interface Space {
  id: string
  name: string
  mood_tag: string
  description: string
  cover_image_url: string
  gallery_images: string[]
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Booking {
  id: string
  created_at: string
  name: string
  email: string
  phone: string
  spaces: string[]
  preferred_date: string
  preferred_time: string
  status: "pending" | "confirmed" | "completed"
  group_size: number
  notes: string
}

export interface SiteConfig {
  id: string
  key: string
  value: string
}

export interface User {
  id: string
  email: string
  role: "admin" | "user"
}
