import Link from 'next/link'
import type { Metadata } from 'next'
import { connectToDatabase } from '@/lib/mongodb'
import { Badge } from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest company updates, announcements, and press from ArchiCore.',
}

async function getNews() {
  try {
    const db = await connectToDatabase()
    return await db.collection('news')
      .find({ status: 'published' })
      .sort({ publishedAt: -1, createdAt: -1 })
      .toArray()
  } catch (error) {
    console.error('Error loading news:', error)
    return []
  }
}

export default async function NewsPage() {
  const news = await getNews()

  return (
    <div className="min-h-screen pt-20">
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-medium tracking-widest uppercase mb-4">News</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Updates From ArchiCore
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Company updates, project announcements, awards, and media releases.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {news.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No news published yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Link
                  key={item._id?.toString()}
                  href={`/news/${item.slug}`}
                  className="group border border-border rounded-xl overflow-hidden bg-background hover:border-accent/40 transition-colors"
                >
                  {item.coverImage?.url && (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={item.coverImage.url}
                        alt={item.coverImage.alt || item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge variant="secondary">{item.source || 'ArchiCore'}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="font-display text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-3">{item.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
