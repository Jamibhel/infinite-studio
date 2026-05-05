import { Metadata } from "next"

interface PageMetadataProps {
  title: string
  description: string
  path: string
  image?: string
  keywords?: string[]
  type?: "website" | "article"
  author?: string
  publishedTime?: string
}

export function generateMetadata(props: PageMetadataProps): Metadata {
  const {
    title,
    description,
    path,
    image = "https://infinitestudio.com/og-image.jpg",
    keywords = [],
    type = "website",
    author = "Infinite Studio",
    publishedTime,
  } = props

  const canonicalUrl = `https://infinitestudio.com${path}`

  return {
    title: `${title} | Infinite Studio`,
    description,
    keywords: [
      ...keywords,
      "Abeokuta",
      "content creation",
      "studio rental",
      "photography",
      "videography",
    ],
    authors: [{ name: author }],
    creator: author,
    openGraph: {
      title: `${title} | Infinite Studio`,
      description,
      type,
      url: canonicalUrl,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Infinite Studio`,
      description,
      images: [image],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    ...(publishedTime && {
      other: {
        "article:published_time": publishedTime,
      },
    }),
  }
}

export const STUDIO_SEO = {
  homeTitle: "Premium Content Creation Studio in Abeokuta",
  homeDesc:
    "Book your creative space today. 8 professional studios with unique themes, professional lighting, flexible pricing, and expert support for creators and brands.",
  spacesTitle: "8 Creative Spaces | Studio Booking",
  spacesDesc:
    "Explore our 8 uniquely designed studio spaces. From dramatic bars to glam vanity corners. Hourly, half-day, and custom packages available.",
  bookingTitle: "Easy Studio Booking",
  bookingDesc:
    "Book your studio space in minutes. Choose your date, time, and space. Simple, transparent pricing with professional support.",
  galleryTitle: "Studio Gallery",
  galleryDesc:
    "See what creators have been making at Infinite Studio. Inspiring projects, creative setups, and success stories.",
  blogTitle: "Creator Resources & Tips",
  blogDesc:
    "Learn from industry tips, setup guides, and best practices for content creation. Master lighting, styling, and production techniques.",
  aboutTitle: "About Infinite Studio",
  aboutDesc:
    "Discover our story, mission, and the passion behind creating the perfect creative space for Abeokuta's creators.",
}
