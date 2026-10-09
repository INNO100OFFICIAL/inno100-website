'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { type Article } from '@/lib/articles'

export default function NewsPageClient({ articles }: { articles: Article[] }) {
  const searchParams = useSearchParams()
  const articlesSectionRef = useRef<HTMLDivElement>(null)
  const videosSectionRef = useRef<HTMLDivElement>(null)

  // The navbar dropdown links to /news?type=videos|articles. Both sections are
  // always on the page now, so a type param just scrolls to the matching one
  // instead of switching which content shows.
  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'videos') {
      videosSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (type === 'articles') {
      articlesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [searchParams])

  const videos = articles.filter(a => a.type === 'video')
  const articlesList = articles.filter(a => a.type !== 'video')

  function ContentLink({ article, children }: { article: Article; children: React.ReactNode }) {
    if (article.videoUrl) {
      return (
        <a href={article.videoUrl} target="_blank" rel="noopener noreferrer" className="group">
          {children}
        </a>
      )
    }
    if (article.externalUrl) {
      return (
        <a href={article.externalUrl} target="_blank" rel="noopener noreferrer" className="group">
          {children}
        </a>
      )
    }
    return (
      <Link href={`/news/${article.slug}`} className="group">
        {children}
      </Link>
    )
  }

  function ContentGrid({ items, emptyLabel }: { items: Article[]; emptyLabel: string }) {
    if (items.length === 0) {
      return <p className="text-center text-gray-500">{emptyLabel}</p>
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {items.map((item) => (
          <ContentLink key={item.slug} article={item}>
            <article>
              {item.image && (
                <div className={`w-full ${item.type === 'video' ? 'aspect-[3/4]' : 'aspect-[4/3]'} bg-gray-100 overflow-hidden rounded-lg mb-4 relative`}>
                  <img
                    src={item.image}
                    alt={item.imageAlt || item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
                  />
                  {item.type === 'video' && item.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {item.duration}
                    </div>
                  )}
                </div>
              )}
              {item.type === 'video' && (
                <p className="text-xs text-[#2B7A8F] font-semibold mb-2">VIDEO</p>
              )}
              <p className="text-sm text-gray-500 mb-2">
                {new Date(item.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {item.source && ` · ${item.source}`}
              </p>
              <h3 className="text-lg font-bold mb-2 text-black group-hover:text-[#2B7A8F] transition">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.description}
              </p>
            </article>
          </ContentLink>
        ))}
      </div>
    )
  }

  return (
    <section className="bg-white px-4 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
          <div className="space-y-16">
            <div ref={articlesSectionRef}>
              <h2 className="text-2xl font-bold mb-8 pb-4 border-b">Articles</h2>
              <ContentGrid items={articlesList} emptyLabel="No articles yet." />
            </div>
            <div ref={videosSectionRef}>
              <h2 className="text-2xl font-bold mb-8 pb-4 border-b">Videos</h2>
              <ContentGrid items={videos} emptyLabel="No videos yet." />
            </div>
          </div>

          {/*
            Featured Content rail — placeholder only. Per instruction, this
            stays empty until there's real featured content to put here; the
            column exists now so the layout doesn't need reshaping later.
          */}
          <aside className="hidden lg:block">
            <p className="text-xs font-semibold text-gray-400 tracking-wide uppercase mb-4">
              Featured Content
            </p>
            <div className="border border-dashed border-gray-200 rounded-lg p-6 text-sm text-gray-400">
              Coming soon.
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
