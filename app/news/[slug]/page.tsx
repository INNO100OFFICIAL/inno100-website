import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticleBySlug, getArticleSlugs, getAllArticles } from '@/lib/articles'
import { MDXRemote } from 'next-mdx-remote/rsc'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = getArticleSlugs()
  return slugs.map(slug => ({
    slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: `${article.title} | INNO100`,
    description: article.description,
    keywords: article.keywords.join(', '),
    authors: article.author ? [{ name: article.author }] : [],
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: article.author ? [article.author] : [],
      images: article.image ? [{ url: article.image, alt: article.imageAlt }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: article.image ? [article.image] : [],
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  const allArticles = getAllArticles()
  const relatedArticles = allArticles.filter(a => a.slug !== slug).slice(0, 3)

  if (!article) {
    notFound()
  }

  return (
    <div className="pt-16">
      <section className="py-12 bg-white px-4">
        <div className="max-w-3xl mx-auto text-center">
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/news" className="hover:text-gray-900 transition">
              News
            </Link>
          </nav>

          <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#2B7A8F' }}>
            News
          </p>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-black">
            {article.title}
          </h1>

          <p className="text-lg text-gray-600">{article.description}</p>

          <div className="flex items-center justify-center gap-3 text-sm text-gray-500 mt-6">
            {article.author && <span>{article.author}</span>}
            {article.author && <span>·</span>}
            <time>
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>
      </section>

      {article.image && (
        <section className="bg-gray-50 px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <img
              src={article.image}
              alt={article.imageAlt || article.title}
              className="w-full rounded-lg"
            />
          </div>
        </section>
      )}

      <section className="py-12 bg-white px-4">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-xl max-w-none
            prose-p:text-gray-700 prose-p:leading-loose prose-p:mb-7 prose-p:text-xl
            prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-14 prose-h2:mb-5
            prose-h2:text-black
            prose-h3:text-2xl prose-h3:font-bold prose-h3:mt-10 prose-h3:mb-4
            prose-h3:text-black
            prose-li:text-gray-700 prose-li:leading-loose prose-li:text-xl prose-li:mb-2
            prose-strong:font-semibold prose-strong:text-black
            prose-a:transition
            prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:text-xl
            prose-img:rounded-lg prose-img:my-8
            prose-table:border-collapse prose-table:w-full prose-table:my-6
            prose-th:bg-gray-50 prose-th:border prose-th:border-gray-200 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:text-base
            prose-td:border prose-td:border-gray-200 prose-td:px-4 prose-td:py-3 prose-td:text-base
          "
          style={{ '--tw-prose-links': '#2B7A8F' } as React.CSSProperties}
          >
            <MDXRemote source={article.content} components={{
              img: ({ src, alt, title, ...props }: any) => (
                <figure className="my-8">
                  <img src={src} alt={alt} className="w-full rounded-lg" {...props} />
                  {title && (
                    <figcaption className="text-sm text-gray-500 mt-3">
                      {title}
                    </figcaption>
                  )}
                </figure>
              ),
            }} />
          </div>

          {article.keywords.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {article.relatedLinks && article.relatedLinks.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <ul className="flex flex-wrap gap-6">
                {article.relatedLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link href={link.href} className="font-medium hover:underline transition" style={{ color: '#2B7A8F' }}>
                      {link.title} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {relatedArticles.length > 0 && (
        <section className="py-12 bg-gray-50 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-sm font-medium text-gray-500 mb-8 uppercase tracking-widest">
              More Articles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map(a => (
                <Link key={a.slug} href={`/news/${a.slug}`}>
                  <article className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
                    {a.image && (
                      <div className="relative w-full h-40 bg-gray-200">
                        <img
                          src={a.image}
                          alt={a.imageAlt || a.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-2 line-clamp-2" style={{ color: '#2B7A8F' }}>
                        {a.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{a.description}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
