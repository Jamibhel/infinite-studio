"use client"

import { AdminLayout } from "@/components/AdminLayout"
import { motion } from "framer-motion"
import { Save, AlertCircle, Phone, Lock, Database, Download, Trash2, Eye, EyeOff, Type, Palette, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import toast from "react-hot-toast"
import { useSettings } from "@/lib/settings-context"

function InputField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider font-semibold mb-2 font-body" style={{ color: "var(--text-muted)" }}>{label}</label>
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
      <label className="block text-[11px] uppercase tracking-wider font-semibold mb-2 font-body" style={{ color: "var(--text-muted)" }}>{label}</label>
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

function SectionCard({ title, icon: Icon, children, description }: { title: string, icon: any, children: React.ReactNode, description?: string }) {
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="px-5 py-4 border-b flex flex-col gap-1" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <Icon size={16} style={{ color: "var(--cta-primary)" }} />
          <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{title}</h3>
        </div>
        {description && <p className="text-xs font-body" style={{ color: "var(--text-muted)" }}>{description}</p>}
      </div>
      <div className="p-5 space-y-4">
        {children}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { refreshSettings } = useSettings()

  // General
  const [marqueeText, setMarqueeText] = useState("")
  const [studioName, setStudioName] = useState("")
  const [studioDescription, setStudioDescription] = useState("")
  const [instagram, setInstagram] = useState("")

  // Contact
  const [phone, setPhone] = useState("")
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [phoneAlt, setPhoneAlt] = useState("")
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("")

  // Theme
  const [lightBg, setLightBg] = useState("#FAF8F4")
  const [darkBg, setDarkBg] = useState("#0D0D0D")
  const [primaryCta, setPrimaryCta] = useState("#C9A84C")

  // Security
  const [showPasswords, setShowPasswords] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [updatingAuth, setUpdatingAuth] = useState(false)

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
      setWhatsappNumber(map.whatsapp_number || "")
      setPhoneAlt(map.phone_alt || "")
      setEmail(map.email || "")
      setWebsite(map.website || "")
      setLightBg(map.light_bg || "#FAF8F4")
      setDarkBg(map.dark_bg || "#0D0D0D")
      setPrimaryCta(map.primary_cta || "#C9A84C")
      setSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || "")
      setSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "")

      // Fetch user email
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setAdminEmail(user.email || "")

    } catch {
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const updateCredentials = async () => {
    if (!adminEmail && !newPassword) return;
    try {
      setUpdatingAuth(true)
      const updates: { email?: string, password?: string } = {}
      if (adminEmail) updates.email = adminEmail
      if (newPassword) updates.password = newPassword

      const { error } = await supabase.auth.updateUser(updates)
      if (error) throw error

      toast.success("Login details updated successfully!")
      setNewPassword("") // clear password field after update
    } catch (error: any) {
      toast.error(error.message || "Failed to update login details")
    } finally {
      setUpdatingAuth(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      const settingsToSave = [
        { key: "marquee_text", value: marqueeText },
        { key: "studio_name", value: studioName },
        { key: "studio_description", value: studioDescription },
        { key: "instagram", value: instagram },
        { key: "phone", value: phone },
        { key: "whatsapp_number", value: whatsappNumber },
        { key: "phone_alt", value: phoneAlt },
        { key: "email", value: email },
        { key: "website", value: website },
        { key: "light_bg", value: lightBg },
        { key: "dark_bg", value: darkBg },
        { key: "primary_cta", value: primaryCta },
      ]
      for (const s of settingsToSave) {
        await supabase.from("site_config").upsert({ key: s.key, value: s.value }, { onConflict: "key" })
      }
      // Refresh the global settings context so changes reflect immediately!
      await refreshSettings()
      toast.success("Settings saved successfully!")
    } catch {
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--cta-primary)" }} />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto pb-28">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Settings</h2>
          <p className="text-sm mt-1 font-body" style={{ color: "var(--text-muted)" }}>Configure global site settings and theme preferences.</p>
        </div>

        <div className="space-y-6">
          {/* General Section */}
          <SectionCard title="General Information" icon={Type} description="Core details used across the website.">
            <InputField label="Studio Name" value={studioName} onChange={e => setStudioName(e.target.value)} />
            <TextareaField label="Studio Description" value={studioDescription} onChange={e => setStudioDescription(e.target.value)} rows={3} />
            <InputField label="Hero Marquee Text" value={marqueeText} onChange={e => setMarqueeText(e.target.value)} placeholder="Editorial · Cinematic · Lifestyle" />
            <InputField label="Instagram Handle" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@de_infinite_space" />
          </SectionCard>

          {/* Contact Section */}
          <SectionCard title="Contact Details" icon={Phone} description="Information displayed in the footer, WhatsApp button, and contact pages.">
            <InputField label="Phone Number" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+234 700 0000 000" />
            <InputField label="WhatsApp Number" type="tel" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} placeholder="2348012345678 (digits only, with country code)" />
            <InputField label="Additional Phone Number" type="tel" value={phoneAlt} onChange={e => setPhoneAlt(e.target.value)} placeholder="+234 800 0000 000" />
            <InputField label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="hello@infinitestudio.com" />
            <InputField label="Website URL" value={website} onChange={e => setWebsite(e.target.value)} placeholder="infinitestudio.com" />
            <div className="p-3 rounded-xl border text-xs font-body flex items-start gap-2" style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-muted)" }}>
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" style={{ color: "var(--cta-primary)" }} />
              <span>The WhatsApp number is used for the floating chat button and booking confirmations. Enter digits only with country code (e.g. 2348012345678).</span>
            </div>
          </SectionCard>

          {/* Theme Section */}
          <SectionCard title="Theme & Branding" icon={Palette} description="Live color configuration for the public site.">
            <div className="space-y-5">
              {[
                { label: "Light Mode Background", value: lightBg, set: setLightBg },
                { label: "Dark Mode Background", value: darkBg, set: setDarkBg },
                { label: "Primary Accent Color (CTA)", value: primaryCta, set: setPrimaryCta },
              ].map(({ label, value, set }) => (
                <div key={label}>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold mb-2 font-body" style={{ color: "var(--text-muted)" }}>{label}</label>
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-shrink-0">
                      <input
                        type="color"
                        value={value}
                        onChange={e => set(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="w-12 h-12 rounded-xl border shadow-sm" style={{ background: value, borderColor: "var(--border)" }} />
                    </div>
                    <input
                      type="text"
                      value={value}
                      onChange={e => set(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border text-sm font-body font-mono uppercase"
                      style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                    />
                  </div>
                </div>
              ))}
              <div className="p-3 rounded-xl border text-xs font-body flex items-center gap-2" style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-muted)" }}>
                <Sparkles size={14} style={{ color: "var(--cta-primary)" }} />
                Theme changes will apply instantly to the public site once saved.
              </div>
            </div>
          </SectionCard>

          {/* Advanced / System Section */}
          <SectionCard title="System & Security" icon={Lock} description="API credentials and system management.">
            <div className="p-5 rounded-xl border mb-6 space-y-4" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Lock size={16} style={{ color: "var(--text-primary)" }} />
                <h4 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Login Credentials</h4>
              </div>
              <InputField label="Admin Email" type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} placeholder="admin@example.com" />
              
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold mb-2 font-body" style={{ color: "var(--text-muted)" }}>New Password</label>
                <div className="flex gap-2">
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
                    className="flex-1 px-4 py-3 rounded-xl border text-sm font-body transition-all focus:outline-none"
                    style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                    onFocus={e => (e.target.style.borderColor = "var(--cta-primary)")}
                    onBlur={e => (e.target.style.borderColor = "var(--border)")}
                  />
                  <button
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="w-12 h-12 rounded-xl border flex items-center justify-center transition-colors"
                    style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-muted)" }}
                  >
                    {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={updateCredentials}
                disabled={updatingAuth}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                style={{ 
                  background: "var(--surface)", 
                  color: "var(--text-primary)", 
                  borderColor: "var(--border)",
                  borderWidth: 1
                }}
              >
                {updatingAuth ? (
                  <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--text-primary)" }} />
                ) : (
                  "Update Credentials"
                )}
              </motion.button>
              <p className="text-[10px] font-body text-center" style={{ color: "var(--text-muted)" }}>
                Note: Updating your email may require verification depending on your Supabase settings.
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                { label: "Supabase URL", value: supabaseUrl },
                { label: "Supabase Anon Key", value: supabaseKey },
              ].map(({ label, value }) => (
                <div key={label}>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold mb-2 font-body" style={{ color: "var(--text-muted)" }}>{label}</label>
                  <div className="flex gap-2">
                    <input
                      type={showKeys ? "text" : "password"}
                      value={value}
                      disabled
                      className="flex-1 px-4 py-3 rounded-xl border text-sm font-body opacity-60 font-mono"
                      style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                    />
                    <button
                      onClick={() => setShowKeys(!showKeys)}
                      className="w-12 h-12 rounded-xl border flex items-center justify-center transition-colors hover:opacity-80"
                      style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-muted)" }}
                    >
                      {showKeys ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Sticky Bottom Save Action Bar */}
      <div 
        className="fixed bottom-0 md:bottom-auto md:top-0 right-0 left-0 md:left-64 z-40 p-4 border-t md:border-t-0 md:border-b backdrop-blur-xl"
        style={{ 
          background: "color-mix(in srgb, var(--surface) 85%, transparent)", 
          borderColor: "var(--border)" 
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between md:justify-end gap-4 pb-safe">
          <div className="md:hidden">
            <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>Unsaved changes?</p>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Tap save to apply</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveSettings}
            disabled={saving}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white font-bold text-sm font-body shadow-lg"
            style={{ 
              background: "linear-gradient(135deg, var(--cta-primary), var(--tag-accent))",
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <><Save size={16} /> Save Settings</>
            )}
          </motion.button>
        </div>
      </div>
    </AdminLayout>
  )
}
