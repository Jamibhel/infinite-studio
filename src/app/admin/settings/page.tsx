"use client"

import { AdminLayout } from "@/components/AdminLayout"
import { motion } from "framer-motion"
import {
  Save,
  AlertCircle,
  CheckCircle,
  Settings,
  Image,
  Users,
  Palette,
  Lock,
  Database,
  Mail,
  Phone,
  Globe,
  Download,
  Upload,
  Trash2,
  Edit2,
  Plus,
  Eye,
  EyeOff,
} from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import toast from "react-hot-toast"

interface SiteConfig {
  key: string
  value: string
}

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  avatar_url?: string
  rating: number
}

type SettingsTab = "general" | "hero" | "testimonials" | "contact" | "theme" | "security" | "api" | "backup"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general")

  // General Settings
  const [marqueeText, setMarqueeText] = useState("")
  const [studioName, setStudioName] = useState("")
  const [studioDescription, setStudioDescription] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("")
  const [instagram, setInstagram] = useState("")

  // Hero Settings
  const [heroTitle, setHeroTitle] = useState("")
  const [heroSubtitle, setHeroSubtitle] = useState("")
  const [heroImageUrl, setHeroImageUrl] = useState("")

  // Theme Settings
  const [lightBg, setLightBg] = useState("")
  const [darkBg, setDarkBg] = useState("")
  const [primaryCta, setPrimaryCta] = useState("")

  // API Keys
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")
  const [showKeys, setShowKeys] = useState(false)

  // Security & Branding
  const [adminUsername, setAdminUsername] = useState("admin")
  const [adminPassword, setAdminPassword] = useState("")
  const [newAdminPassword, setNewAdminPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)
  const [logoUrl, setLogoUrl] = useState("")
  const [faviconUrl, setFaviconUrl] = useState("")

  // Testimonials
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({
    name: "",
    role: "",
    content: "",
    rating: 5,
  })

  // State
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase.from("site_config").select("*")

      if (fetchError) throw fetchError

      const configMap = data.reduce((acc: any, item: SiteConfig) => {
        acc[item.key] = item.value
        return acc
      }, {})

      // General Settings
      setMarqueeText(configMap.marquee_text || "Editorial · Cinematic · Lifestyle · Corporate")
      setStudioName(configMap.studio_name || "Infinite Studio")
      setStudioDescription(configMap.studio_description || "Premium photography & videography studio")
      setPhone(configMap.phone || "+234 700 0000 000")
      setEmail(configMap.email || "hello@infinitestudio.com")
      setWebsite(configMap.website || "infinitestudio.com")
      setInstagram(configMap.instagram || "@infinitestudio")

      // Hero Settings
      setHeroTitle(configMap.hero_title || "Your Vision, Our Expertise")
      setHeroSubtitle(configMap.hero_subtitle || "Professional photography & videography services")
      setHeroImageUrl(configMap.hero_image_url || "")

      // Theme Settings
      setLightBg(configMap.light_bg || "#d6d3c3")
      setDarkBg(configMap.dark_bg || "#2D1B2E")
      setPrimaryCta(configMap.primary_cta || "#C4623A")

      // Security & Branding
      setAdminUsername(configMap.admin_username || "admin")
      setLogoUrl(configMap.logo_url || "")
      setFaviconUrl(configMap.favicon_url || "")

      // API Keys (from env or stored in config)
      setSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || "")
      setSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "")

      setError("")
    } catch (err) {
      console.error("Error fetching settings:", err)
      setError("Failed to load settings")
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      setSuccess(false)

      const settings = [
        { key: "marquee_text", value: marqueeText },
        { key: "studio_name", value: studioName },
        { key: "studio_description", value: studioDescription },
        { key: "phone", value: phone },
        { key: "email", value: email },
        { key: "website", value: website },
        { key: "instagram", value: instagram },
        { key: "hero_title", value: heroTitle },
        { key: "hero_subtitle", value: heroSubtitle },
        { key: "hero_image_url", value: heroImageUrl },
        { key: "light_bg", value: lightBg },
        { key: "dark_bg", value: darkBg },
        { key: "primary_cta", value: primaryCta },
        { key: "admin_username", value: adminUsername },
        { key: "logo_url", value: logoUrl },
        { key: "favicon_url", value: faviconUrl },
      ]

      for (const setting of settings) {
        const { error: upsertError } = await supabase
          .from("site_config")
          .upsert({ key: setting.key, value: setting.value }, { onConflict: "key" })

        if (upsertError) throw upsertError
      }

      // Update password if new one provided
      if (newAdminPassword && newAdminPassword === confirmPassword) {
        // TODO: Implement password update to Supabase Auth or database
        // For now, just show a message
        if (newAdminPassword !== adminPassword) {
          toast.success("Note: Password change feature coming soon!")
        }
        setNewAdminPassword("")
        setConfirmPassword("")
      }

      setSuccess(true)
      toast.success("Settings saved successfully!")
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error("Error saving settings:", err)
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handleAddTestimonial = () => {
    if (!newTestimonial.name || !newTestimonial.content) {
      toast.error("Please fill in all fields")
      return
    }

    const testimonial: Testimonial = {
      id: Date.now().toString(),
      name: newTestimonial.name!,
      role: newTestimonial.role || "Client",
      content: newTestimonial.content!,
      rating: newTestimonial.rating || 5,
    }

    setTestimonials([...testimonials, testimonial])
    setNewTestimonial({ name: "", role: "", content: "", rating: 5 })
    toast.success("Testimonial added!")
  }

  const handleDeleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter((t) => t.id !== id))
    toast.success("Testimonial removed")
  }

  const tabs: Array<{ id: SettingsTab; label: string; icon: any }> = [
    { id: "general", label: "General", icon: Settings },
    { id: "hero", label: "Hero", icon: Image },
    { id: "testimonials", label: "Testimonials", icon: Users },
    { id: "contact", label: "Contact", icon: Mail },
    { id: "theme", label: "Theme", icon: Palette },
    { id: "security", label: "Security", icon: Lock },
    { id: "api", label: "API Keys", icon: Database },
    { id: "backup", label: "Backup", icon: Download },
  ]

  const tabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <label className="block font-body font-semibold mb-2 text-[var(--text-primary)]">Studio Name</label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
              />
            </div>

            <div>
              <label className="block font-body font-semibold mb-2 text-[var(--text-primary)]">Description</label>
              <textarea
                value={studioDescription}
                onChange={(e) => setStudioDescription(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] h-24"
              />
            </div>

            <div>
              <label className="block font-body font-semibold mb-2 text-[var(--text-primary)]">Hero Marquee Text</label>
              <input
                type="text"
                value={marqueeText}
                onChange={(e) => setMarqueeText(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
                placeholder="Editorial · Cinematic · Lifestyle"
              />
              <p className="text-sm text-[var(--text-muted)] mt-1 font-body">Use · to separate services</p>
            </div>
          </motion.div>
        )

      case "hero":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <label className="block font-body font-semibold mb-2 text-[var(--text-primary)]">Hero Title</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
              />
            </div>

            <div>
              <label className="block font-body font-semibold mb-2 text-[var(--text-primary)]">Hero Subtitle</label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
              />
            </div>

            <div>
              <label className="block font-body font-semibold mb-2 text-[var(--text-primary)]">Hero Image URL</label>
              <input
                type="text"
                value={heroImageUrl}
                onChange={(e) => setHeroImageUrl(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
                placeholder="https://... (from gallery)"
              />
              <p className="text-sm text-[var(--text-muted)] mt-1 font-body">Copy URL from Gallery page</p>
            </div>

            {heroImageUrl && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden border border-[var(--border)]">
                <img
                  src={heroImageUrl}
                  alt="Hero Preview"
                  className="w-full h-full object-cover"
                  onError={() => toast.error("Invalid image URL")}
                />
              </div>
            )}
          </motion.div>
        )

      case "contact":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-body font-semibold mb-2 text-[var(--text-primary)] flex items-center gap-2">
                  <Phone size={16} /> Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
                />
              </div>

              <div>
                <label className="block font-body font-semibold mb-2 text-[var(--text-primary)] flex items-center gap-2">
                  <Mail size={16} /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-body font-semibold mb-2 text-[var(--text-primary)] flex items-center gap-2">
                  <Globe size={16} /> Website
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
                />
              </div>

              <div>
                <label className="block font-body font-semibold mb-2 text-[var(--text-primary)]">Instagram</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
                  placeholder="@infinitestudio"
                />
              </div>
            </div>
          </motion.div>
        )

      case "theme":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <label className="block font-body font-semibold mb-2 text-[var(--text-primary)]">Light Mode Background</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={lightBg}
                  onChange={(e) => setLightBg(e.target.value)}
                  className="flex-1 px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
                />
                <input
                  type="color"
                  value={lightBg}
                  onChange={(e) => setLightBg(e.target.value)}
                  className="w-12 h-10 rounded-lg border border-[var(--border)] cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block font-body font-semibold mb-2 text-[var(--text-primary)]">Dark Mode Background</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={darkBg}
                  onChange={(e) => setDarkBg(e.target.value)}
                  className="flex-1 px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
                />
                <input
                  type="color"
                  value={darkBg}
                  onChange={(e) => setDarkBg(e.target.value)}
                  className="w-12 h-10 rounded-lg border border-[var(--border)] cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block font-body font-semibold mb-2 text-[var(--text-primary)]">Primary CTA Color</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={primaryCta}
                  onChange={(e) => setPrimaryCta(e.target.value)}
                  className="flex-1 px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
                />
                <input
                  type="color"
                  value={primaryCta}
                  onChange={(e) => setPrimaryCta(e.target.value)}
                  className="w-12 h-10 rounded-lg border border-[var(--border)] cursor-pointer"
                />
              </div>
            </div>

            <p className="text-sm text-[var(--text-muted)] font-body bg-[var(--bg)] p-3 rounded-lg">
              💡 Theme changes require a site rebuild to take effect globally
            </p>
          </motion.div>
        )

      case "security":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Branding Section */}
            <div className="border-b border-[var(--border)] pb-6">
              <h3 className="font-body font-semibold text-lg mb-4 text-[var(--text-primary)] flex items-center gap-2">
                <Image size={20} /> Branding
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block font-body font-semibold mb-2 text-[var(--text-primary)]">Logo URL</label>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
                    placeholder="https://... (from gallery)"
                  />
                  <p className="text-sm text-[var(--text-muted)] mt-1 font-body">Your studio logo displayed in header</p>
                </div>

                {logoUrl && (
                  <div className="flex items-center gap-4 p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-[var(--surface)]">
                      <img
                        src={logoUrl}
                        alt="Logo Preview"
                        className="w-full h-full object-contain p-2"
                        onError={() => toast.error("Invalid logo URL")}
                      />
                    </div>
                    <span className="text-sm text-[var(--text-muted)] font-body">Logo Preview</span>
                  </div>
                )}

                <div>
                  <label className="block font-body font-semibold mb-2 text-[var(--text-primary)]">Favicon URL</label>
                  <input
                    type="text"
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                    className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
                    placeholder="https://... (from gallery)"
                  />
                  <p className="text-sm text-[var(--text-muted)] mt-1 font-body">Browser tab icon (preferably square PNG)</p>
                </div>
              </div>
            </div>

            {/* Admin Credentials Section */}
            <div>
              <h3 className="font-body font-semibold text-lg mb-4 text-[var(--text-primary)] flex items-center gap-2">
                <Lock size={20} /> Admin Credentials
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block font-body font-semibold mb-2 text-[var(--text-primary)]">Username</label>
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
                  />
                  <p className="text-sm text-[var(--text-muted)] mt-1 font-body">Used for admin login</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="text-yellow-600 flex-shrink-0 w-5 h-5 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 font-body font-semibold">Change Password</p>
                    <p className="text-sm text-yellow-700 mt-1">Passwords are managed securely in your auth system</p>
                  </div>
                </div>

                <div>
                  <label className="block font-body font-semibold mb-2 text-[var(--text-primary)]">Current Password</label>
                  <div className="flex gap-2">
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="flex-1 px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
                      placeholder="••••••••"
                    />
                    <button
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="px-4 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors"
                    >
                      {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-body font-semibold mb-2 text-[var(--text-primary)]">New Password</label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
                    placeholder="••••••••"
                  />
                  <p className="text-sm text-[var(--text-muted)] mt-1 font-body">Min 8 characters recommended</p>
                </div>

                <div>
                  <label className="block font-body font-semibold mb-2 text-[var(--text-primary)]">Confirm Password</label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
                    placeholder="••••••••"
                  />
                  {newAdminPassword && confirmPassword && newAdminPassword !== confirmPassword && (
                    <p className="text-sm text-red-600 mt-1 font-body">⚠️ Passwords do not match</p>
                  )}
                  {newAdminPassword && confirmPassword && newAdminPassword === confirmPassword && (
                    <p className="text-sm text-green-600 mt-1 font-body">✓ Passwords match</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )

      case "testimonials":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-[var(--bg)] p-6 rounded-lg border border-[var(--border)] space-y-4">
              <h3 className="font-body font-semibold text-[var(--text-primary)]">Add New Testimonial</h3>

              <input
                type="text"
                placeholder="Client Name"
                value={newTestimonial.name || ""}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
              />

              <input
                type="text"
                placeholder="Role / Company"
                value={newTestimonial.role || ""}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
              />

              <textarea
                placeholder="Testimonial content"
                value={newTestimonial.content || ""}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] h-20"
              />

              <div>
                <label className="block font-body text-sm text-[var(--text-muted)] mb-2">Rating: {newTestimonial.rating}⭐</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={newTestimonial.rating || 5}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <button
                onClick={handleAddTestimonial}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--cta-primary)] text-white rounded-lg hover:bg-[var(--cta-hover)] transition-colors"
              >
                <Plus size={16} /> Add Testimonial
              </button>
            </div>

            <div className="space-y-3">
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[var(--bg)] p-4 rounded-lg border border-[var(--border)] flex justify-between items-start"
                >
                  <div className="flex-1">
                    <p className="font-body font-semibold text-[var(--text-primary)]">{testimonial.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">{testimonial.role}</p>
                    <p className="text-sm mt-2 text-[var(--text-primary)]">{testimonial.content}</p>
                    <p className="text-sm mt-1 text-[var(--cta-primary)]">{"⭐".repeat(testimonial.rating)}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteTestimonial(testimonial.id)}
                    className="p-2 hover:bg-[var(--bg)] rounded transition-colors text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )

      case "api":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0 w-5 h-5 mt-0.5" />
              <div>
                <p className="text-yellow-800 font-body font-semibold">API Keys Read-Only</p>
                <p className="text-sm text-yellow-700 mt-1">These keys are loaded from your environment variables for security</p>
              </div>
            </div>

            <div>
              <label className="block font-body font-semibold mb-2 text-[var(--text-primary)]">Supabase URL</label>
              <div className="flex gap-2">
                <input
                  type={showKeys ? "text" : "password"}
                  value={supabaseUrl}
                  disabled
                  className="flex-1 px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg opacity-60"
                />
                <button
                  onClick={() => setShowKeys(!showKeys)}
                  className="px-4 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors"
                >
                  {showKeys ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-body font-semibold mb-2 text-[var(--text-primary)]">Supabase Anon Key</label>
              <div className="flex gap-2">
                <input
                  type={showKeys ? "text" : "password"}
                  value={supabaseKey}
                  disabled
                  className="flex-1 px-4 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg opacity-60"
                />
                <button
                  onClick={() => setShowKeys(!showKeys)}
                  className="px-4 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors"
                >
                  {showKeys ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </motion.div>
        )

      case "backup":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center justify-center p-6 bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:border-[var(--cta-primary)] transition-colors"
              >
                <Download size={24} className="mb-2 text-[var(--cta-primary)]" />
                <span className="font-body font-semibold text-sm">Export Settings</span>
                <span className="text-xs text-[var(--text-muted)] mt-1">JSON backup</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center justify-center p-6 bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:border-[var(--cta-primary)] transition-colors"
              >
                <Upload size={24} className="mb-2 text-[var(--cta-primary)]" />
                <span className="font-body font-semibold text-sm">Import Settings</span>
                <span className="text-xs text-[var(--text-muted)] mt-1">Restore backup</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center justify-center p-6 bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:border-red-500 transition-colors"
              >
                <Trash2 size={24} className="mb-2 text-red-500" />
                <span className="font-body font-semibold text-sm">Clear Cache</span>
                <span className="text-xs text-[var(--text-muted)] mt-1">Clear all cache</span>
              </motion.button>
            </div>

            <div className="bg-[var(--bg)] p-6 rounded-lg border border-[var(--border)]">
              <h3 className="font-body font-semibold mb-4 text-[var(--text-primary)]">Recent Activity</h3>
              <div className="space-y-2 text-sm font-body text-[var(--text-muted)]">
                <p>✓ Last backup: Never</p>
                <p>✓ Last settings save: Just now</p>
                <p>✓ Gallery images: 12 total</p>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 text-[var(--text-primary)]">Settings</h1>
          <p className="body-text text-[var(--text-muted)]">Manage studio configuration and preferences</p>
        </div>

        {/* Alerts */}
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

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3"
          >
            <CheckCircle className="text-green-500 flex-shrink-0 w-5 h-5 mt-0.5" />
            <p className="text-green-700 font-body">Settings saved successfully!</p>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--border)] border-t-[var(--cta-primary)]"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tabs */}
            <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-1 flex gap-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap font-body text-sm ${
                      activeTab === tab.id
                        ? "bg-[var(--cta-primary)] text-white shadow-lg"
                        : "text-[var(--text-primary)] hover:bg-[var(--bg)]"
                    }`}
                  >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </motion.button>
                )
              })}
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-8"
            >
              {tabContent()}
            </motion.div>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveSettings}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[var(--cta-primary)] text-white rounded-lg font-semibold hover:bg-[var(--cta-hover)] transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              {saving ? "Saving..." : "Save All Changes"}
            </motion.button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
