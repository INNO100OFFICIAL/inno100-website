import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/articles'

const SITE_URL = 'https://inno100.ai'

export default function sitemap(): MetadataRoute.Sitemap {
  // Public, indexable static pages.
  const staticRoutes = [
    '',            // Home
    '/about',      // About Us
    '/menu',       // Menu
    '/visit',      // Plan Your China Tech Visit
    '/media',      // Media Centre
    '/contact',    // Contact Us
    '/news',       // News list
  ].map(route => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // One entry per /news/[slug] article, using its published/updated date.
  // External-link articles have no detail page on this site, so they're excluded.
  const articleRoutes = getAllArticles()
    .filter(article => !article.externalUrl)
    .map(article => ({
    url: `${SITE_URL}/news/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...articleRoutes]
}
