import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { Metadata } from "next"
import { generateMetadata, STUDIO_SEO } from "@/lib/metadata"
import { AboutContent } from "@/components/AboutContent"

export const metadata: Metadata = generateMetadata({
  title: STUDIO_SEO.aboutTitle,
  description: STUDIO_SEO.aboutDesc,
  path: "/about",
  keywords: [
    "about infinite studio",
    "our story",
    "mission",
    "creative community",
    "studio history",
  ],
})

export default function AboutPage() {
  return <AboutContent />
}
