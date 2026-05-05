/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
/* Build cache clear - Tue May  5 21:35:38 WAT 2026 */
// Vercel cache clear Tue May  5 22:08:45 WAT 2026
