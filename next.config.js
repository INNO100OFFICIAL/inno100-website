/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },

  /**
   * Hands /guides to Arenza, which hosts the article content for it. Everything
   * else on the domain is untouched — this is the only path that leaves our app.
   *
   * A rewrite rather than a redirect on purpose: the visitor's address bar has to
   * keep saying inno100.ai, so the articles count as our own pages for search and
   * for AI crawlers. A redirect would hand the ranking to api.arenza.ai instead.
   *
   * Put here rather than in vercel.json (both work) because vercel.json in this
   * repo only carries build settings, and a `rewrites` key there would silently
   * take precedence over anything Next.js declares — keeping routing in one file
   * avoids that trap later.
   */
  async rewrites() {
    return [
      { source: '/guides', destination: 'https://api.arenza.ai/api/v1/g/inno100.ai' },
      {
        source: '/guides/:path*',
        destination: 'https://api.arenza.ai/api/v1/g/inno100.ai/:path*',
      },
    ]
  },
}

module.exports = nextConfig
