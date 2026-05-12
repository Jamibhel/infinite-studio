"use client"

import { AdminLayout } from "@/components/AdminLayout"
import { motion, AnimatePresence } from "framer-motion"
import { Save, AlertCircle, CheckCircle2, Mail, Phone, Globe, Lock, Database, Download, Trash2, Eye, EyeOff, Layers, Type, Palette, Users, Plus, Star } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import toast from "react-hot-toast"

type Tab = "general" | "contact" | "theme" | "security" | "api" | "backup"

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: "general", label: "General", icon: Type },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "security", label: "Security", icon: Lock },
  { id: "api", label: "API", icon: Database },
  { id: "backup", label: "Backup", icon: Download },
]

function InputField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide font-semibold mb-2 font-body" style={{ color: "var(--text-muted)" }}>{label}</label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-xl border text-sm font-body transition-all focus:outline-none"
        style={{
          background: "var(--bg)",
          borderColor: "var(--border)",
          color: "var(--text-primary)",
        }}
        onFocus={e => (e.target.style.borderColor = "var(--cta-primary)")}
        onBlur={e => (e.target.style.borderColor = "var(--border)")}
      />
    </div>
  )
}

function TextareaField({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide font-semibold mb-2 font-body" style={{ color: "var(--text-muted)" }}>{label}</label>
      <textarea
        {...props}
        className="w-full px-4 py-3 rounded-xl border text-sm font-body transition-all focus:outline-none resize-none"
        style={{
          background: "var(--bg)",
          borderColor: "var(--border)",
          color: "var(--text-primary)",
        }}
        onFocus={e => (e.target.style.borderColor = "var(--cta-primary)")}
        onBlur={e => (e.target.style.borderColor = "var(--border)")}
      />
    </div>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // General
  const [marqueeText, setMarqueeText] = useState("")
  const [studioName, setStudioName] = useState("")
  const [studioDescription, setStudioDescription] = useState("")
  const [instagram, setInstagram] = useState("")

  // Contact
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("")

  // Theme
  const [lightBg, setLightBg] = useState("#FAF8F4")
  const [darkBg, setDarkBg] = useState("#0D0D0D")
  const [primaryCta, setPrimaryCta] = useState("#C9A84C")

  // Security
  const [adminPassword, setAdminPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)

  // API
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")
  const [showKeys, setShowKeys] = useState(false)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  useEffect(() => { fetchSettings() }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const { data } = await supabase.from("site_config").select("*")
      const map: Record<string, string> = (data || []).reduce((acc: any, item: any) => {
        acc[item.key] = item.value; return acc
      }, {})
      setMarqueeText(map.marquee_text || "Editorial · Cinematic · Lifestyle · Corporate")
      setStudioName(map.studio_name || "Infinite Studio")
      setStudioDescription(map.studio_description || "")
      setInstagram(map.instagram || "@de_infinite_space")
      setPhone(map.phone || "")
      setEmail(map.email || "")
      setWebsite(map.website || "")
      setLightBg(map.light_bg || "#FAF8F4")
      setDarkBg(map.dark_bg || "#0D0D0D")
      setPrimaryCta(map.primary_cta || "#C9A84C")
      setSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || "")
      setSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "")
    } catch {
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      const settings = [
        { key: "marquee_text", value: marqueeText },
        { key: "studio_name", value: studioName },
        { key: "studio_description", value: studioDescription },
        { key: "instagram", value: instagram },
        { key: "phone", value: phone },
        { key: "email", value: email },
        { key: "website", value: website },
        { key: "light_bg", value: lightBg },
        { key: "dark_bg", value: darkBg },
        { key: "primary_cta", value: primaryCta },
      ]
      for (const s of settings) {
        await supabase.from("site_config").upsert({ key: s.key, value: s.value }, { onConflict: "key" })
      }
      toast.success("Settings saved!")
    } catch {
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const renderTab = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-4">
            <InputField label="Studio Name" value={studioName} onChange={e => setStudioName(e.target.value)} />
            <TextareaField label="Studio Description" value={studioDescription} onChange={e => setStudioDescription(e.target.value)} rows={3} />
            <InputField label="Hero Marquee Text" value={marqueeText} onChange={e => setMarqueeText(e.target.value)} placeholder="Editorial · Cinematic · Lifestyle" />
            <InputField label="Instagram Handle" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@de_infinite_space" />
          </div>
        )

      case "contact":
        return (
          <div className="space-y-4">
            <InputField label="Phone Number" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+234 700 0000 000" />
            <InputField label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="hello@infinitestudio.com" />
            <InputField label="Website" value={website} onChange={e => setWebsite(e.target.value)} placeholder="infinitestudio.com" />
          </div>
        )

      case "theme":
        return (
          <div className="space-y-4">
            {[
              { label: "Light Mode Background", value: lightBg, set: setLightBg },
              { label: "Dark Mode Background", value: darkBg, set: setDarkBg },
              { label: "Primary Accent Color", value: primaryCta, set: setPrimaryCta },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label className="block text-xs uppercase tracking-wide font-semibold mb-2 font-body" style={{ color: "var(--text-muted)" }}>{label}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={value}
                    onChange={e => set(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border text-sm font-body"
                    style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                  />
                  <div className="relative">
                    <input
                      type="color"
                      value={value}
                      onChange={e => set(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="w-12 h-12 rounded-xl border cursor-pointer" style={{ background: value, borderColor: "var(--border)" }} />
                  </div>
                </div>
              </div>
            ))}
            <div className="p-3 rounded-xl border text-xs font-body" style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-muted)" }}>
              💡 Theme changes require a site rebuild to take effect globally.
            </div>
          </div>
        )

      case "security":
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border flex gap-3" style={{ background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.25)" }}>
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#F59E0B" }} />
              <p className="text-xs font-body" style={{ color: "#F59E0B" }}>Passwords are managed through Supabase Auth. Use your Supabase dashboard to update credentials.</p>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide font-semibold mb-2 font-body" style={{ color: "var(--text-muted)" }}>Current Password</label>
              <div className="flex gap-2">
                <input
                  type={showPasswords ? "text" : "password"}
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 px-4 py-3 rounded-xl border text-sm font-body"
                  style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                />
                <button
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="w-12 h-12 rounded-xl border flex items-center justify-center"
                  style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-muted)" }}
                >
                  {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <InputField label="New Password" type={showPasswords ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" />
            <div>
              <InputField label="Confirm Password" type={showPasswords ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
              {newPassword && confirmPassword && (
                <p className={`text-xs mt-1.5 font-body ${newPassword === confirmPassword ? "text-green-500" : "text-red-500"}`}>
                  {newPassword === confirmPassword ? "✓ Passwords match" : "⚠ Passwords do not match"}
                </p>
              )}
            </div>
          </div>
        )

      case "api":
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border flex gap-3" style={{ background: "rgba(196,98,58,0.06)", borderColor: "rgba(196,98,58,0.2)" }}>
              <Database size={16} className="flex-shrink-0 mt-0.5" style={{ color: "var(--cta-primary)" }} />
              <p className="text-xs font-body" style={{ color: "var(--cta-primary)" }}>API keys are read-only. They are loaded from your environment variables for security.</p>
            </div>
            {[
              { label: "Supabase URL", value: supabaseUrl },
              { label: "Supabase Anon Key", value: supabaseKey },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="block text-xs uppercase tracking-wide font-semibold mb-2 font-body" style={{ color: "var(--text-muted)" }}>{label}</label>
                <div className="flex gap-2">
                  <input
                    type={showKeys ? "text" : "password"}
                    value={value}
                    disabled
                    className="flex-1 px-4 py-3 rounded-xl border text-sm font-body opacity-60"
                    style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                  />
                  <button
                    onClick={() => setShowKeys(!showKeys)}
                    className="w-12 h-12 rounded-xl border flex items-center justify-center"
                    style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-muted)" }}
                  >
                    {showKeys ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )

      case "backup":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: "Export Settings", sub: "Download as JSON", icon: Download, color: "var(--cta-primary)" },
                { label: "Clear Cache", sub: "Reset all caches", icon: Trash2, color: "#EF4444" },
              ].map(item => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={item.label}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-4 p-4 rounded-2xl border transition-all text-left"
                    style={{ background: "var(--bg)", borderColor: "var(--border)" }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${item.color}18` }}>
                      <Icon size={18} style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold font-body" style={{ color: "var(--text-primary)" }}>{item.label}</p>
                      <p className="text-xs font-body" style={{ color: "var(--text-muted)" }}>{item.sub}</p>
                    </div>
                  </motion.button>
                )
              })}
            </div>
            <div className="p-4 rounded-xl border space-y-2" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
              <p className="text-xs font-bold uppercase tracking-wide font-body" style={{ color: "var(--text-muted)" }}>Activity Log</p>
              {["Last backup: Never", "Last settings save: Saved", "Gallery images: Active"].map(t => (
                <p key={t} className="text-xs font-body" style={{ color: "var(--text-muted)" }}>✓ {t}</p>
              ))}
            </div>
          </div>
        )
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-xl space-y-5">

        {/* Header */}
        <div>
          <h2 className="font-display text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Settings</h2>
          <p className="text-sm mt-1 font-body" style={{ color: "var(--text-muted)" }}>Manage studio configuration</p>
        </div>

        {/* Tab Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border"
                style={{
                  background: active ? "var(--cta-primary)" : "var(--surface)",
                  color: active ? "#fff" : "var(--text-muted)",
                  borderColor: active ? "var(--cta-primary)" : "var(--border)",
                  boxShadow: active ? "0 3px 12px rgba(196,98,58,0.3)" : "none",
                }}
              >
                <Icon size={12} /> {tab.label}
              </motion.button>
            )
          })}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--cta-primary)" }} />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="rounded-2xl border p-5"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Save Button */}
        {["general", "contact", "theme"].includes(activeTab) && (
          <motion.button
            whileHover={{ y: -2, boxShadow: "0 10px 30px rgba(196,98,58,0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={saveSettings}
            disabled={saving || loading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-sm font-body transition-all"
            style={{ background: "linear-gradient(135deg, var(--cta-primary), var(--cta-hover))" }}
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <><Save size={15} /> Save Changes</>
            )}
          </motion.button>
        )}
      </div>
    </AdminLayout>
  )
}
