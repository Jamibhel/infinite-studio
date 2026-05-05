"use client"

import { motion } from "framer-motion"
import { ArrowRight, Clock, BookOpen } from "lucide-react"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  readTime: string
  category: string
  gradient: string
}

const blogPosts: BlogPost[] = [
  {
    id: "lighting-101",
    title: "Mastering Studio Lighting: A Creator's Guide",
    excerpt:
      "Learn the three-point lighting technique and discover how to use our professional studio lighting to make your content shine.",
    readTime: "5 min read",
    category: "Photography",
    gradient: "from-amber-500 to-orange-400",
  },
  {
    id: "behind-scenes",
    title: "Behind-the-Scenes: Studio Tour & Setup Tips",
    excerpt:
      "Explore all 8 Infinite Studio spaces and discover insider tips from creators on how to maximize each setting for your content.",
    readTime: "4 min read",
    category: "Studio Guide",
    gradient: "from-pink-500 to-rose-400",
  },
  {
    id: "content-batching",
    title: "Content Batching: Shoot a Month's Worth in One Day",
    excerpt:
      "Master the art of efficient content creation by learning how to batch shoot across multiple spaces in a single session.",
    readTime: "6 min read",
    category: "Strategy",
    gradient: "from-purple-500 to-violet-400",
  },
  {
    id: "outfit-styling",
    title: "Wardrobe Essentials for Every Studio Aesthetic",
    excerpt:
      "Discover what outfits work best for each of our themed spaces and how to maximize your wardrobe across multiple settings.",
    readTime: "5 min read",
    category: "Styling",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    id: "gear-guide",
    title: "Essential Gear to Bring to Your Studio Session",
    excerpt:
      "We have professional equipment, but here's what you should bring to elevate your shoot and get the best results.",
    readTime: "4 min read",
    category: "Equipment",
    gradient: "from-emerald-500 to-green-400",
  },
]

export function Blog() {
  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="heading-h2 mb-4">Creator Resources & Tips</h2>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            Learn from the community and level up your content creation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="group card card-hover overflow-hidden flex flex-col"
              style={{
                backgroundColor: "var(--bg)",
                borderColor: "var(--border)",
              }}
            >
              {/* Gradient Header */}
              <div
                className={`w-full h-32 bg-gradient-to-br ${post.gradient} group-hover:scale-105 transition-transform duration-300 flex items-center justify-center`}
              >
                <BookOpen size={48} className="text-white opacity-30" />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-2">
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: "var(--tag-accent)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                    <Clock size={14} />
                    {post.readTime}
                  </div>
                </div>

                <h3 className="heading-h3 mb-3 mt-2 line-clamp-2">{post.title}</h3>
                <p className="text-sm flex-grow" style={{ color: "var(--text-muted)" }}>
                  {post.excerpt}
                </p>

                {/* CTA */}
                <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                  <button
                    className="text-sm font-semibold flex items-center gap-2 transition-all group/btn"
                    style={{ color: "var(--cta-primary)" }}
                  >
                    Read More
                    <ArrowRight
                      size={16}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/blog">
            <button
              className="btn-primary inline-flex items-center gap-2"
              style={{
                backgroundColor: "var(--cta-primary)",
                color: "white",
              }}
            >
              View All Articles
              <ArrowRight size={18} />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
