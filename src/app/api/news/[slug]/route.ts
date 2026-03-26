import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/lib/mongodb'
import { newsSchema } from '@/lib/validations'
import { z } from 'zod'

interface RouteContext {
  params: { slug: string }
}

async function findNewsByParam(param: string) {
  const db = await connectToDatabase()
  let article = await db.collection('news').findOne({ slug: param })
  if (!article && ObjectId.isValid(param)) {
    article = await db.collection('news').findOne({ _id: new ObjectId(param) })
  }
  return { db, article }
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = context.params
    const { article } = await findNewsByParam(slug)

    if (!article) {
      return NextResponse.json({ error: 'News article not found' }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching news article:', error)
    return NextResponse.json({ error: 'Failed to fetch news article' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = context.params
    const body = await request.json()
    const validated = newsSchema.partial().parse(body)
    const { db, article } = await findNewsByParam(slug)

    if (!article) {
      return NextResponse.json({ error: 'News article not found' }, { status: 404 })
    }

    if (validated.slug && validated.slug !== article.slug) {
      const slugExists = await db.collection('news').findOne({ slug: validated.slug })
      if (slugExists) {
        return NextResponse.json(
          { error: 'A news article with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const nextStatus = validated.status || article.status
    const publishedAt =
      nextStatus === 'published' ? (article.publishedAt || new Date()) : undefined

    await db.collection('news').updateOne(
      { _id: article._id },
      {
        $set: {
          ...validated,
          publishedAt,
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json({ message: 'News article updated successfully' })
  } catch (error) {
    console.error('Error updating news article:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Failed to update news article' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = context.params
    const { db, article } = await findNewsByParam(slug)

    if (!article) {
      return NextResponse.json({ error: 'News article not found' }, { status: 404 })
    }

    await db.collection('news').deleteOne({ _id: article._id })
    return NextResponse.json({ message: 'News article deleted successfully' })
  } catch (error) {
    console.error('Error deleting news article:', error)
    return NextResponse.json({ error: 'Failed to delete news article' }, { status: 500 })
  }
}
