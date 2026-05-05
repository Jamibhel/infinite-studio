"use client"

import { AdminLayout } from "@/components/AdminLayout"
import { motion } from "framer-motion"
import { Save, AlertCircle, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import toast from "react-hot-toast"

interface SiteConfig {
  key: string
  value: string
}

export default function SettingsPage() {
  const [marqueeText, setMarqueeText] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
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

      // Parse config data
      const configMap = data.reduce((acc: any, item: SiteConfig) => {
        acc[item.key] = item.value
        return acc
      }, {})

      setMarqueeText(configMap.marquee_text || "Editorial · Cinematic · Lifestyle · Corporate")
      setPhone(configMap.phone || "+234 700 0000 000")
      setEmail(configMap.email || "hello@infinitestudio.com")
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
        { key: "phone", value: phone },
        { key: "email", value: email },
      ]

      // Delete existing and insert new (or use upsert if available)
      for (const setting of settings) {
        const { error: upsertError } = await supabase
          .from("site_config")
          .upsert({ key: setting.key, value: setting.value }, { onConflict: "key" })

        if (upsertError) throw upsertError
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2">Site Settings</h1>
          <p className="font-body text-gray-600">Configure your studio information</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 w-5 h-5 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3"
          >
            <CheckCircle className="text-green-500 flex-shrink-0 w-5 h-5 mt-0.5" />
            <p className="text-green-700">Settings saved successfully!</p>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-accent"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-soft border border-gray-200 p-6 space-y-6"
          >
            {/* Marquee Text */}
            <div>
              <label className="block font-semibold mb-2">Hero Marquee Text</label>
              <input
                type="text"
                value={marqueeText}
                onChange={(e) => setMarqueeText(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-dark-accent"
                placeholder="Enter marquee text (separated by ·)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter services separated by · (e.g., Editorial · Cinematic · Lifestyle)
              </p>
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block font-semibold mb-2">Studio Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-dark-accent"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold mb-2">Studio Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-dark-accent"
              />
            </div>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveSettings}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-dark-accent text-white rounded-soft font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save size={20} />
              {saving ? "Saving..." : "Save Changes"}
            </motion.button>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  )
}
