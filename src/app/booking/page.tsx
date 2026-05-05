import type { Metadata } from "next"
import { generateMetadata, STUDIO_SEO } from "@/lib/metadata"
import { BookingContent } from "@/components/BookingContent"

export const metadata: Metadata = generateMetadata({
  title: STUDIO_SEO.bookingTitle,
  description: STUDIO_SEO.bookingDesc,
  path: "/booking",
  keywords: [
    "book studio",
    "studio reservation",
    "booking form",
    "studio availability",
    "creative space booking",
  ],
})

export default function BookingPage() {
  return <BookingContent />
}
