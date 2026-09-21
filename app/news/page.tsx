import { getAllArticles } from '@/lib/articles'
import NewsPageClient from './news-client'

const SITE_URL = 'https://inno100.ai'

export const metadata = {
  title: 'Latest Updates | INNO100',
  description: 'Original stories, features, and updates from INNO100 — the Global Innovation Flagship Store in Shenzhen.',
  alternates: {
    canonical: `${SITE_URL}/news`,
  },
  openGraph: {
    title: 'Latest Updates | INNO100',
    description: 'Original stories, features, and updates from INNO100 — the Global Innovation Flagship Store in Shenzhen.',
    type: 'website',
    url: `${SITE_URL}/news`,
    siteName: 'INNO100',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latest Updates | INNO100',
    description: 'Original stories, features, and updates from INNO100 — the Global Innovation Flagship Store in Shenzhen.',
  },
}

export default function NewsPage() {
  const articles = getAllArticles().filter(
    article => article.slug !== 'where-ai-leaves-screen-inno100'
  )

  const newsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Latest Updates | INNO100',
    description: 'Original stories, features, and updates from INNO100 — the Global Innovation Flagship Store in Shenzhen.',
    url: `${SITE_URL}/news`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'INNO100',
      url: SITE_URL,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articles.map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': article.type === 'video' ? 'VideoObject' : 'Article',
          headline: article.title,
          description: article.description,
          datePublished: article.publishedAt,
          ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
          url: article.videoUrl || article.externalUrl || `${SITE_URL}/news/${article.slug}`,
          ...(article.image ? { image: `${SITE_URL}${article.image}` } : {}),
          ...(article.duration ? { duration: article.duration } : {}),
          publisher: {
            '@type': 'Organization',
            name: 'INNO100',
            url: SITE_URL,
          },
        },
      })),
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Latest Updates', item: `${SITE_URL}/news` },
    ],
  }

  return (
    <div className="pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="py-12 bg-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Latest Updates
          </h1>
        </div>
      </section>

      <NewsPageClient articles={articles} />
    </div>
  )
}
