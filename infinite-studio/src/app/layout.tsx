import "@/styles/globals.css"
import type { Metadata } from "next"
import { Toaster } from "react-hot-toast"
import { LayoutProviders } from "@/components/LayoutProviders"

export const metadata: Metadata = {
  title: "Infinite Studio | Premium Content Creation Studio in Abeokuta",
  description:
    "Abeokuta's most beautiful content creation studio. 8 stunning themed spaces, professional lighting, flexible booking, and creative community. Perfect for creators, brands, and influencers.",
  keywords: [
    "content creation studio",
    "photography studio",
    "videography studio",
    "Abeokuta",
    "creative spaces",
    "studio rental",
    "influencer content",
    "brand photoshoot",
    "professional lighting",
    "themed backdrops",
  ],
  authors: [{ name: "Infinite Studio" }],
  creator: "Infinite Studio",
  publisher: "Infinite Studio",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    title: "Infinite Studio | Premium Content Creation Studio in Abeokuta",
    description: "Book your creative space today. 8 professional studios, flexible pricing, and creative support.",
    type: "website",
    url: "https://infinitestudio.com",
    siteName: "Infinite Studio",
    images: [
      {
        url: "https://infinitestudio.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Infinite Studio - Content Creation Spaces",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Infinite Studio | Premium Content Creation Studio",
    description: "Book your creative space today. 8 professional studios in Abeokuta.",
    images: ["https://infinitestudio.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://infinitestudio.com",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#c4623a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Infinite Studio" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://infinitestudio.com",
              name: "Infinite Studio",
              description: "Premium content creation studio in Abeokuta",
              image: "https://infinitestudio.com/og-image.jpg",
              url: "https://infinitestudio.com",
              telephone: "+2348000000000",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Abeokuta",
                addressCountry: "NG",
              },
              sameAs: [
                "https://www.instagram.com/infinitestudio",
                "https://www.twitter.com/infinitestudio",
              ],
              priceRange: "₦5,500 - ₦28,000",
            }),
          }}
        />
      </head>
      <body className="bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-300">
        <LayoutProviders>
          {children}
        </LayoutProviders>
      </body>
    </html>
  )
}
