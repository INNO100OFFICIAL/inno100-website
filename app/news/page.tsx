import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'

export const metadata = {
  title: 'News | INNO100',
  description: 'Original stories, features, and updates from INNO100 — the Global Innovation Flagship Store in Shenzhen.',
}

export default function NewsPage() {
  const articles = getAllArticles()
  const [featured, ...rest] = articles

  return (
    <div className="pt-16">
      <section className="py-12 bg-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            News
          </h1>
          <p className="text-lg text-gray-600">
            Original stories and features from INNO100.
          </p>
        </div>
      </section>

      <section className="bg-white px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {!featured ? (
            <p className="text-center text-gray-500">No articles yet.</p>
          ) : (
            <>
              <Link href={`/news/${featured.slug}`} className="block mb-16">
                <article className="grid md:grid-cols-[65%_35%] gap-8 items-center group">
                  {featured.image && (
                    <div className="w-full aspect-[16/10] bg-gray-100 overflow-hidden rounded-lg">
                      <img
                        src={featured.image}
                        alt={featured.imageAlt || featured.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 mb-3">
                      {new Date(featured.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-black group-hover:text-[#2B7A8F] transition">
                      {featured.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6 line-clamp-4">
                      {featured.description}
                    </p>
                    <span className="font-medium" style={{ color: '#2B7A8F' }}>
                      Read more →
                    </span>
                  </div>
                </article>
              </Link>

              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-12 border-t border-gray-200">
                  {rest.map((article) => (
                    <Link key={article.slug} href={`/news/${article.slug}`} className="group">
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
                        </p>
                        <h3 className="text-lg font-bold mb-2 text-black group-hover:text-[#2B7A8F] transition">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {article.description}
                        </p>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
