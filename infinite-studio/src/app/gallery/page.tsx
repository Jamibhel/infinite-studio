import type { Metadata } from "next"
import { generateMetadata, STUDIO_SEO } from "@/lib/metadata"
import { GalleryContent } from "@/components/GalleryContent"

export const metadata: Metadata = generateMetadata({
  title: STUDIO_SEO.galleryTitle,
  description: STUDIO_SEO.galleryDesc,
  path: "/gallery",
  keywords: [
    "studio gallery",
    "creator projects",
    "content examples",
    "portfolio",
    "studio showcase",
  ],
})

export default function GalleryPage() {
  return <GalleryContent />
}
