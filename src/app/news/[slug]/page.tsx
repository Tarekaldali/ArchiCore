import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { connectToDatabase } from '@/lib/mongodb'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface Props {
  params: { slug: string }
}

async function getNewsItem(slug: string) {
  try {
    const db = await connectToDatabase()
    return await db.collection('news').findOne({ slug, status: 'published' })
  } catch (error) {
    console.error('Error loading news detail:', error)
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getNewsItem(params.slug)
  if (!item) return { title: 'News Not Found' }

  return {
    title: item.title,
    description: item.excerpt,
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const item = await getNewsItem(params.slug)
  if (!item) notFound()

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/news">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Link>
        </Button>

        <article>
          {item.coverImage?.url && (
            <div className="aspect-[16/8] rounded-xl overflow-hidden mb-8">
              <img
                src={item.coverImage.url}
                alt={item.coverImage.alt || item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary">{item.source || 'ArchiCore'}</Badge>
            <span className="text-sm text-muted-foreground">
              {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{item.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">{item.excerpt}</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {String(item.content || '')
              .split('\n\n')
              .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
          </div>
        </article>
      </div>
    </div>
  )
}
