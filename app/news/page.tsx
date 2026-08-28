import Link from 'next/link'
import { getAllArticles, type Article } from '@/lib/articles'

const SITE_URL = 'https://inno100.ai'

function ArticleLink({ article, className, children }: { article: Article; className?: string; children: React.ReactNode }) {
  if (article.externalUrl) {
    return (
      <a href={article.externalUrl} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link href={`/news/${article.slug}`} className={className}>
      {children}
    </Link>
  )
}

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

  return (
    <div className="pt-16">
      <section className="py-12 bg-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Latest Updates
          </h1>
        </div>
      </section>

      <section className="bg-white px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {articles.length === 0 ? (
            <p className="text-center text-gray-500">No articles yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {articles.map((article) => (
                <ArticleLink key={article.slug} article={article} className="group">
                  <article>
                    {article.image && (
                      <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden rounded-lg mb-4">
                        <img
                          src={article.image}
                          alt={article.imageAlt || article.title}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
                        />
                      </div>
                    )}
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(article.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      {article.source && ` · ${article.source}`}
                    </p>
                    <h3 className="text-lg font-bold mb-2 text-black group-hover:text-[#2B7A8F] transition">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {article.description}
                    </p>
                  </article>
                </ArticleLink>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
