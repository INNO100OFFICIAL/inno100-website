import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const articlesDirectory = path.join(process.cwd(), 'content/news')

export interface Article {
  slug: string
  title: string
  description: string
  keywords: string[]
  author?: string
  source?: string
  publishedAt: string
  updatedAt?: string
  image?: string
  imageFeatured?: string
  imageAlt?: string
  content: string
  externalUrl?: string
  relatedLinks?: Array<{
    title: string
    href: string
  }>
}

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(articlesDirectory)) {
    return []
  }
  return fs.readdirSync(articlesDirectory).map(file => file.replace(/\.mdx?$/, ''))
}

export function getArticleBySlug(slug: string): Article | null {
  const realSlug = slug.replace(/\.mdx?$/, '')
  const filePath = path.join(articlesDirectory, `${realSlug}.mdx`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug: realSlug,
    title: data.title || '',
    description: data.description || '',
    keywords: data.keywords || [],
    author: data.author,
    source: data.source,
    publishedAt: data.publishedAt || new Date().toISOString(),
    updatedAt: data.updatedAt,
    image: data.image,
    imageFeatured: data.imageFeatured,
    imageAlt: data.imageAlt,
    content,
    externalUrl: data.externalUrl,
    relatedLinks: data.relatedLinks,
  }
}

export function getAllArticles(): Article[] {
  const slugs = getArticleSlugs()
  return slugs
    .map(slug => getArticleBySlug(slug))
    .filter((article): article is Article => article !== null)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}
