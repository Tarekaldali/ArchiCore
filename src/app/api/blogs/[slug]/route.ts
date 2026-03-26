import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/lib/mongodb'
import { blogSchema } from '@/lib/validations'
import { z } from 'zod'

interface RouteContext {
  params: { slug: string }
}

async function findBlogByParam(param: string) {
  const db = await connectToDatabase()
  let blog = await db.collection('blogs').findOne({ slug: param })
  if (!blog && ObjectId.isValid(param)) {
    blog = await db.collection('blogs').findOne({ _id: new ObjectId(param) })
  }
  return { db, blog }
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = context.params
    const { blog } = await findBlogByParam(slug)

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = context.params
    const body = await request.json()
    const validated = blogSchema.partial().parse(body)
    const { db, blog } = await findBlogByParam(slug)

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    if (validated.slug && validated.slug !== blog.slug) {
      const slugExists = await db.collection('blogs').findOne({ slug: validated.slug })
      if (slugExists) {
        return NextResponse.json(
          { error: 'A blog with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const nextStatus = validated.status || blog.status
    const publishedAt =
      nextStatus === 'published' ? (blog.publishedAt || new Date()) : undefined

    await db.collection('blogs').updateOne(
      { _id: blog._id },
      {
        $set: {
          ...validated,
          publishedAt,
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json({ message: 'Blog updated successfully' })
  } catch (error) {
    console.error('Error updating blog:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = context.params
    const { db, blog } = await findBlogByParam(slug)

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    await db.collection('blogs').deleteOne({ _id: blog._id })
    return NextResponse.json({ message: 'Blog deleted successfully' })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 })
  }
}
