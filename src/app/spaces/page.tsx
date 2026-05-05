import type { Metadata } from "next"
import { generateMetadata, STUDIO_SEO } from "@/lib/metadata"
import { SpacesContent } from "@/components/SpacesContent"

export const metadata: Metadata = generateMetadata({
  title: STUDIO_SEO.spacesTitle,
  description: STUDIO_SEO.spacesDesc,
  path: "/spaces",
  keywords: [
    "studio spaces",
    "booking rates",
    "themed studios",
    "professional lighting",
    "content creation spaces",
    "flexible booking",
    "hourly rental",
  ],
})

export default function SpacesPage() {
  return <SpacesContent />
}
