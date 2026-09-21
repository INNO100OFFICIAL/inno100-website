'use client'

import { useState } from 'react'
import Link from 'next/link'
import { type Article } from '@/lib/articles'

export default function NewsPageClient({ articles }: { articles: Article[] }) {
  const [activeTab, setActiveTab] = useState<'videos' | 'articles'>('articles')

  const videos = articles.filter(a => a.type === 'video')
  const articlesList = articles.filter(a => a.type !== 'video')

  const displayItems = activeTab === 'videos' ? videos : articlesList

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

  return (
    <section className="bg-white px-4 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('articles')}
              className={`pb-3 px-1 font-medium transition ${
                activeTab === 'articles'
                  ? 'text-black border-b-2 border-[#2B7A8F]'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Articles
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`pb-3 px-1 font-medium transition ${
                activeTab === 'videos'
                  ? 'text-black border-b-2 border-[#2B7A8F]'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Videos
            </button>
          </div>

          {/* Same tabs, doubled as a content-type select for narrow screens —
              mirrors the CES Discover pattern where the type switch also
              works as a dropdown. Hidden on desktop since the tabs above
              already do the job there. */}
          <label className="sm:hidden">
            <span className="sr-only">Content type</span>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as 'videos' | 'articles')}
              className="text-sm border rounded-md px-2 py-1.5 text-gray-700"
            >
              <option value="articles">Articles</option>
              <option value="videos">Videos</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
          <div>
            {displayItems.length === 0 ? (
              <p className="text-center text-gray-500">
                {activeTab === 'videos' ? 'No videos yet.' : 'No articles yet.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {displayItems.map((item) => (
                  <ContentLink key={item.slug} article={item}>
                    <article>
                      {item.image && (
                        <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden rounded-lg mb-4 relative">
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
            )}
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
