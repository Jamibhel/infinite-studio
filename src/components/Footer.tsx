"use client"

import Link from "next/link"
import { Mail, MapPin, Phone, Instagram } from "lucide-react"

export function Footer() {
  // exclude special styling for booking page if required
  const isBooking = typeof window !== "undefined" && window.location.pathname.startsWith("/booking")

  return (
    <footer
      className={`text-[var(--text-muted)] border-t`} 
      style={{
        backgroundColor: "var(--surface)",
        color: "var(--text-muted)",
        borderColor: "var(--border)",
      }}
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${!isBooking ? "glass-strong" : ""}`}>
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold mb-4">Infinite</h3>
            <p className="font-body text-sm text-gray-400">
              Where Your Vision Comes to Life
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 font-body text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-dark-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/spaces" className="hover:text-dark-accent transition-colors">
                  Spaces
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-dark-accent transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-dark-accent transition-colors">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 font-body text-sm">
              <li className="flex items-start gap-2 text-gray-400 hover:text-dark-accent transition-colors">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>Omida Shopping Complex, Abeokuta, Ogun State</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 hover:text-dark-accent transition-colors">
                <Phone size={16} />
                <a href="tel:+2347000000000">+234 700 0000 000</a>
              </li>
              <li className="flex items-center gap-2 text-gray-400 hover:text-dark-accent transition-colors">
                <Mail size={16} />
                <a href="mailto:hello@infinitestudio.com">hello@infinitestudio.com</a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-body font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/de_infinite_space"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-soft bg-dark-stone flex items-center justify-center hover:bg-dark-accent transition-colors"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-dark-stone pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© 2025 Infinite Studio. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/admin" className="hover:text-dark-accent transition-colors font-semibold">
              Admin
            </Link>
            <Link href="#" className="hover:text-dark-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-dark-accent transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
