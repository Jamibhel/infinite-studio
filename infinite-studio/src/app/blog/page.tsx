import type { Metadata } from "next"
import { generateMetadata, STUDIO_SEO } from "@/lib/metadata"
import { BlogContent } from "@/components/BlogContent"

export const metadata: Metadata = generateMetadata({
  title: STUDIO_SEO.blogTitle,
  description: STUDIO_SEO.blogDesc,
  path: "/blog",
  keywords: [
    "content creation tips",
    "studio guides",
    "lighting tutorials",
    "creator resources",
    "photography tips",
    "videography guide",
    "content batching",
  ],
  type: "website",
})

export default function BlogPage() {
  return <BlogContent />
}
