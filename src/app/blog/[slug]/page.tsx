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

async function getBlog(slug: string) {
  try {
    const db = await connectToDatabase()
    return await db.collection('blogs').findOne({ slug, status: 'published' })
  } catch (error) {
    console.error('Error loading blog:', error)
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlog(params.slug)
  if (!blog) return { title: 'Blog Not Found' }

  return {
    title: blog.title,
    description: blog.excerpt,
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const blog = await getBlog(params.slug)
  if (!blog) notFound()

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/blog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </Button>

        <article>
          {blog.coverImage?.url && (
            <div className="aspect-[16/8] rounded-xl overflow-hidden mb-8">
              <img
                src={blog.coverImage.url}
                alt={blog.coverImage.alt || blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary">{blog.author || 'ArchiCore Team'}</Badge>
            <span className="text-sm text-muted-foreground">
              {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{blog.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">{blog.excerpt}</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {String(blog.content || '')
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
