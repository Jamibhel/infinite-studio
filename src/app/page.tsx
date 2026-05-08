"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Check, Star } from "lucide-react"
import { FAQ } from "@/components/FAQ"
import { Blog } from "@/components/Blog"

export default function Home() {
  const [isMobile, setIsMobile] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 640)
    onResize()
    window.addEventListener("resize", onResize)

    const rm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduceMotion(rm ? rm.matches : false)

    return () => window.removeEventListener("resize", onResize)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: isMobile ? 0.08 : 0.16, delayChildren: 0.18 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: isMobile ? 8 : 24, scale: isMobile ? 0.996 : 0.998 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: isMobile ? 0.5 : 0.75, ease: "easeOut" } },
  }

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}>
      {/* ===== HERO SECTION ===== */}
      <section
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 mt-16 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1200&h=900&fit=crop')",
          backgroundAttachment: "fixed",
        }}
      >

        {/* background multilayer parallax for mobile first */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          initial={reduceMotion ? {} : { scale: 1, y: 0 }}
          animate={
            reduceMotion
              ? {}
              : {
                  scale: isMobile ? [1, 1.04, 1] : [1, 1.02, 1],
                  y: isMobile ? [0, -6, 0] : [0, -3, 0],
                }
          }
          transition={{ duration: 9, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          style={{ backgroundImage: "inherit", backgroundSize: "cover", backgroundPosition: "center" }}
        />

        {/* soft vignette layer that pulses */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0.08 }}
          animate={reduceMotion ? {} : { opacity: [0.08, 0.02, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.3), transparent 40%)" }}
        />

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-block mb-6 glass-strong shadow-lg"
            style={{ color: "white", transformOrigin: "center" }}
            animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [0, -2, 0], opacity: [1, 0.96, 1] }}
            transition={reduceMotion ? undefined : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
              <Sparkles size={16} />
              Premium Content Creation Studio
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="heading-h1 mb-6"
            style={{ color: "white", textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}
            animate={reduceMotion ? undefined : { scale: [1, 1.01, 1], rotate: [0, -0.4, 0] }}
            transition={reduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            Where Your Vision Becomes Content
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl mb-8"
            style={{ color: "rgba(255, 255, 255, 0.9)" }}
          >
            Stunning themed spaces, professional equipment, and creative energy. Everything you need to create extraordinary content.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/booking">
              <motion.button
                whileTap={reduceMotion ? undefined : { scale: isMobile ? 0.97 : 0.985, y: isMobile ? 0 : -1 }}
                whileHover={reduceMotion ? undefined : { scale: 1.03, y: -2 }}
                className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto shadow-2xl"
                style={{
                  backgroundColor: "var(--cta-primary)",
                  color: "white",
                }}
              >
                Book Now <ArrowRight size={20} />
              </motion.button>
            </Link>
            <Link href="/spaces">
              <motion.button
                whileTap={reduceMotion ? undefined : { scale: isMobile ? 0.985 : 0.995 }}
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                className="w-full sm:w-auto px-6 py-3 text-sm font-semibold rounded-lg transition-all"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                Explore Spaces
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { number: "∞", label: "Creative Possibilities" },
              { number: "100+", label: "Happy Creators" },
              { number: "4K", label: "Hours Booked" },
              { number: "24/7", label: "Support" },
            ].map((stat, idx) => (
              <div key={idx}>
                <div
                  className="text-3xl sm:text-4xl font-bold"
                  style={{ color: "var(--cta-primary)" }}
                >
                  {stat.number}
                </div>
                <div style={{ color: "var(--text-muted)" }} className="text-sm mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ===== FEATURED SPACES ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-h2 mb-4">Featured Spaces</h2>
            <p className="text-lg" style={{ color: "var(--text-muted)" }}>
              Each space is uniquely designed to inspire creativity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "The Bar",
                desc: "Intimate setting perfect for podcasts and interviews",
                image: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=400&fit=crop",
              },
              {
                name: "Green Screen Studio",
                desc: "Unlimited creative possibilities with professional setup",
                image: "https://images.unsplash.com/photo-1536968335557-91d2582f3e91?w=500&h=400&fit=crop",
              },
              {
                name: "Vanity Mirror Corner",
                desc: "Beauty, fashion, and lifestyle content creation",
                image: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=500&h=400&fit=crop",
              },
            ].map((space, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: isMobile ? 8 : 20, scale: isMobile ? 0.992 : 1 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: isMobile ? 0.45 : 0.6, delay: idx * (isMobile ? 0.06 : 0.1), ease: "easeOut" }}
                viewport={{ once: true }}
                className="card card-hover overflow-hidden glass"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                {/* Image */}
                <div
                  className="w-full h-40 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${space.image}')`,
                  }}
                />

                <div className="p-6">
                  <h3 className="heading-h3 mb-2">{space.name}</h3>
                  <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                    {space.desc}
                  </p>

                  <Link href="/spaces" className="inline-block mt-4">
                    <button
                      className="text-sm font-semibold flex items-center gap-2 transition-colors"
                      style={{ color: "var(--cta-primary)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      View Details <ArrowRight size={16} />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: "var(--surface)", borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-h2 mb-4">Why Choose Infinite Studio</h2>
            <p className="text-lg" style={{ color: "var(--text-muted)" }}>
              Everything creators need to produce professional content
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Professional Equipment",
                desc: "Cinema-grade lighting, 4K cameras, and premium audio setup",
              },
              {
                title: "Flexible Booking",
                desc: "Hourly slots, half-day packages, or custom monthly plans",
              },
              {
                title: "Creative Support",
                desc: "Our team helps bring your vision to life with expert guidance",
              },
              {
                title: "Prime Location",
                desc: "Easy access with ample parking and comfortable facilities",
              },
              {
                title: "Aesthetic Design",
                desc: "Every corner is Instagram-worthy and production-ready",
              },
              {
                title: "Community",
                desc: "Connect with other creators and collaborate on projects",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "var(--tag-accent)" }}
                  >
                    <Check style={{ color: "var(--cta-primary)" }} size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">{feature.title}</h3>
                    <p style={{ color: "var(--text-muted)" }}>{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-h2 mb-4">What Creators Say</h2>
            <p className="text-lg" style={{ color: "var(--text-muted)" }}>
              Join hundreds of satisfied content creators
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: "Adeyemi Johnson",
                role: "Podcast Host & Creator",
                quote:
                  "Infinite Studio completely changed my production game. The equipment is top-notch and the team is super supportive!",
                avatar: "https://images.unsplash.com/photo-1507009974461-92a795e61a81?w=100&h=100&fit=crop",
              },
              {
                name: "Folake Okafor",
                role: "Beauty & Lifestyle Creator",
                quote:
                  "Finally found a studio that looks as good as studios in Lagos. The lighting is absolutely perfect!",
                avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
              },
              {
                name: "Chisom Nwankwo",
                role: "YouTube Content Creator",
                quote:
                  "The flexibility with booking slots is amazing. I can create on my schedule without any stress.",
                avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
              },
              {
                name: "Ife Adelusi",
                role: "Corporate Video Producer",
                quote:
                  "Professional setup, creative team, and pricing that makes sense. Highly recommend for brands!",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 flex flex-col"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0"
                    style={{
                      backgroundImage: `url('${testimonial.avatar}')`,
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p style={{ color: "var(--text-muted)" }} className="text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                  <div style={{ color: "var(--cta-primary)" }}>
                    <Star size={18} fill="currentColor" />
                  </div>
                </div>
                <p className="italic" style={{ color: "var(--text-muted)" }}>
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <FAQ />

      {/* ===== BLOG SECTION ===== */}
      <Blog />

      {/* ===== GALLERY SECTION ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-h2 mb-4">Creative Showcase</h2>
            <p className="text-lg" style={{ color: "var(--text-muted)" }}>
              See what's being created at Infinite Studio
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Podcast Setup",
                space: "The Bar",
                image: "https://images.unsplash.com/photo-1478737270454-541680872639?w=500&h=400&fit=crop",
              },
              {
                title: "Fashion Shoot",
                space: "Vanity Mirror",
                image: "https://images.unsplash.com/photo-1552667466-07d71e725e34?w=500&h=400&fit=crop",
              },
              {
                title: "Product Video",
                space: "Green Screen",
                image: "https://images.unsplash.com/photo-1533062407769-eed806e80ee3?w=500&h=400&fit=crop",
              },
              {
                title: "Brand Campaign",
                space: "Office Set",
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop",
              },
              {
                title: "Beauty Content",
                space: "Vanity Mirror",
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop",
              },
              {
                title: "Interview Series",
                space: "The Bar",
                image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=400&fit=crop",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-lg card card-hover h-80"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                {/* Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                  style={{
                    backgroundImage: `url('${item.image}')`,
                  }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="heading-h3 mb-1">{item.title}</h3>
                  <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    Shot in {item.space}
                  </p>
                </div>

                {/* Default Content (visible when not hovering) */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white group-hover:opacity-0 transition-opacity duration-300">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                    style={{ backgroundColor: "var(--cta-primary)" }}
                  >
                    <ArrowRight size={16} />
                  </div>
                  <h3 className="heading-h3">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/gallery">
              <button
                className="px-8 py-3 font-semibold rounded-lg transition-all"
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--cta-primary)";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.borderColor = "var(--cta-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--surface)";
                  e.currentTarget.style.color = "var(--text-primary)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                View Full Gallery
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "var(--cta-primary)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center text-white"
        >
          <h2 className="heading-h2 mb-6">Ready to Create Something Amazing?</h2>
          <p className="text-xl mb-8 opacity-90">
            Book your session today and join the community of creators pushing boundaries
          </p>
          <Link href="/booking">
            <button
              className="px-8 py-3 font-semibold rounded-lg transition-all"
              style={{
                backgroundColor: "white",
                color: "var(--cta-primary)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Start Booking Now
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
