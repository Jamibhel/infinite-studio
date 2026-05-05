import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light Mode
        "light-bg": "#FAF8F4",
        "light-text": "#0D0D0D",
        "light-accent": "#C9A84C",
        
        // Dark Mode
        "dark-bg": "#0D0D0D",
        "dark-stone": "#2A2A2A",
        "dark-accent": "#C9A84C",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        body: ["DM Sans", "sans-serif"],
      },
      fontSize: {
        h1: ["4rem", { lineHeight: "1.1", fontWeight: "700" }],
        h2: ["3rem", { lineHeight: "1.2", fontWeight: "700" }],
        h3: ["2rem", { lineHeight: "1.3", fontWeight: "600" }],
      },
      borderRadius: {
        soft: "12px",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.8s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
}

export default config
