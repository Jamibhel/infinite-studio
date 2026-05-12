"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import FloatingWhatsApp from "@/components/FloatingWhatsApp"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from "@/lib/theme-provider"

export function LayoutProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  if (isAdmin) {
    return (
      <ThemeProvider>
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" />
        </AuthProvider>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Navigation />
        {children}
        <Footer />
        <FloatingWhatsApp />
        <Toaster position="bottom-right" />
      </AuthProvider>
    </ThemeProvider>
  )
}
