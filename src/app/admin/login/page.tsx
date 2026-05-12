"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function AdminLogin() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const success = await login(email, password)
      if (success) {
        router.push("/admin")
      } else {
        setError("Invalid credentials. Please try again.")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 relative overflow-hidden"
      style={{ background: "var(--bg)" }}>

      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, var(--cta-primary), transparent)" }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, var(--cta-hover), transparent)" }} />
      </div>

      {/* Back link */}
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-body transition-all"
          style={{ color: "var(--text-muted)" }}>
          <ArrowLeft size={15} /> Back to site
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Brand */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, var(--cta-primary), var(--cta-hover))", boxShadow: "0 10px 40px rgba(196,98,58,0.4)" }}
          >
            ∞
          </motion.div>
          <h1 className="font-display text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Admin Access</h1>
          <p className="text-sm mt-1 font-body" style={{ color: "var(--text-muted)" }}>Infinite Studio Control Center</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border p-6 backdrop-blur-sm"
          style={{ background: "var(--surface)", borderColor: "var(--border)", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-3.5 rounded-xl border mb-4"
              style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.2)" }}
            >
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: "#EF4444" }} />
              <p className="text-xs font-body" style={{ color: "#EF4444" }}>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs uppercase tracking-wide font-semibold mb-2 font-body" style={{ color: "var(--text-muted)" }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@infinitestudio.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border text-sm font-body transition-all focus:outline-none"
                style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                onFocus={e => (e.target.style.borderColor = "var(--cta-primary)")}
                onBlur={e => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs uppercase tracking-wide font-semibold mb-2 font-body" style={{ color: "var(--text-muted)" }}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border text-sm font-body transition-all focus:outline-none"
                  style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                  onFocus={e => (e.target.style.borderColor = "var(--cta-primary)")}
                  onBlur={e => (e.target.style.borderColor = "var(--border)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ y: -2, boxShadow: "0 12px 32px rgba(196,98,58,0.4)" }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm font-body transition-all mt-2 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, var(--cta-primary), var(--cta-hover))" }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : "Sign In to Dashboard"}
            </motion.button>
          </form>

          {/* Info note */}
          <div className="mt-4 p-3 rounded-xl border" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
            <p className="text-[10px] font-body text-center" style={{ color: "var(--text-muted)" }}>
              Use your Supabase authentication credentials to access the admin panel.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
