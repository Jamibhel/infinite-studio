"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { createClient } from "@supabase/supabase-js"
import { useTheme } from "./theme-provider"

export interface SiteSettings {
  marquee_text: string
  studio_name: string
  studio_description: string
  instagram: string
  phone: string
  whatsapp_number: string
  phone_alt: string
  email: string
  website: string
  light_bg: string
  dark_bg: string
  primary_cta: string
  tiktok: string
  facebook: string
}

const defaultSettings: SiteSettings = {
  marquee_text: "Editorial · Cinematic · Lifestyle · Corporate",
  studio_name: "Infinite Studio",
  studio_description: "Premium content creation studio in Abeokuta",
  instagram: "@de_infinite_space",
  phone: "+234 700 0000 000",
  whatsapp_number: "",
  phone_alt: "",
  email: "hello@infinitestudio.com",
  website: "infinitestudio.com",
  light_bg: "#FAF8F4",
  dark_bg: "#0D0D0D",
  primary_cta: "#C9A84C",
  tiktok: "",
  facebook: "",
}

interface SettingsContextType {
  settings: SiteSettings
  loading: boolean
  refreshSettings: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

// Initialize supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("site_config").select("*")
      if (error) throw error

      if (data && data.length > 0) {
        const map: Record<string, string> = data.reduce((acc: any, item: any) => {
          acc[item.key] = item.value
          return acc
        }, {})
        
        const newSettings = {
          marquee_text: map.marquee_text || defaultSettings.marquee_text,
          studio_name: map.studio_name || defaultSettings.studio_name,
          studio_description: map.studio_description || defaultSettings.studio_description,
          instagram: map.instagram || defaultSettings.instagram,
          phone: map.phone || defaultSettings.phone,
          whatsapp_number: map.whatsapp_number || defaultSettings.whatsapp_number,
          phone_alt: map.phone_alt || defaultSettings.phone_alt,
          email: map.email || defaultSettings.email,
          website: map.website || defaultSettings.website,
          light_bg: map.light_bg || defaultSettings.light_bg,
          dark_bg: map.dark_bg || defaultSettings.dark_bg,
          primary_cta: map.primary_cta || defaultSettings.primary_cta,
          tiktok: map.tiktok || defaultSettings.tiktok,
          facebook: map.facebook || defaultSettings.facebook,
        }
        
        setSettings(newSettings)
      }
    } catch (error) {
      console.error("Error fetching site config:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  // Apply theme variables dynamically whenever settings or theme change
  useEffect(() => {
    const root = document.documentElement
    
    // Primary CTA is global
    root.style.setProperty("--cta-primary", settings.primary_cta)
    
    // We adjust the hover state programmatically based on the primary color
    // A simple opacity trick works well enough without complex color manipulation
    // The CSS uses color-mix if available, or we just rely on var(--cta-primary) with opacity
    
    // Apply background color based on current theme
    if (theme === "light") {
      root.style.setProperty("--bg", settings.light_bg)
      // Surface is usually a bit lighter or darker. We'll use the bg color for now
      // and let the CSS handle the slight differences if needed.
    } else {
      root.style.setProperty("--bg", settings.dark_bg)
    }
    
  }, [settings.primary_cta, settings.light_bg, settings.dark_bg, theme])

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext)
  if (!context) {
    return {
      settings: defaultSettings,
      loading: false,
      refreshSettings: async () => {},
    }
  }
  return context
}
