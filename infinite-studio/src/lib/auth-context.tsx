"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo credentials - in production, this would be replaced with Supabase auth
const DEMO_CREDENTIALS = {
  email: "admin@infinitestudio.com",
  password: "admin123",
}

const STORAGE_KEY = "infinite_studio_admin_session"

interface StoredSession {
  user: User
  timestamp: number
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const session: StoredSession = JSON.parse(stored)
        // Check if session is still valid (24 hour expiry)
        const isValid = Date.now() - session.timestamp < 24 * 60 * 60 * 1000
        if (isValid) {
          setUser(session.user)
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      } catch (err) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Demo authentication - in production, call Supabase
      if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        const newUser: User = {
          id: "admin-001",
          email: email,
          name: "Studio Admin",
        }

        setUser(newUser)

        // Store session in localStorage
        const session: StoredSession = {
          user: newUser,
          timestamp: Date.now(),
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session))

        return true
      }

      return false
    } catch (err) {
      console.error("Login error:", err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
