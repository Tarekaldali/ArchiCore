import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { blogSchema } from '@/lib/validations'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'published'
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const db = await connectToDatabase()
    const query: Record<string, unknown> = {}

    if (status !== 'all') {
      query.status = status
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ]
    }

    const [blogs, total] = await Promise.all([
      db.collection('blogs')
        .find(query)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .toArray(),
      db.collection('blogs').countDocuments(query),
    ])

    return NextResponse.json({
      blogs,
      total,
      hasMore: offset + blogs.length < total,
    })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = blogSchema.parse(body)

    const db = await connectToDatabase()
    const exists = await db.collection('blogs').findOne({ slug: validated.slug })

    if (exists) {
      return NextResponse.json(
        { error: 'A blog with this slug already exists' },
        { status: 400 }
      )
    }

    const now = new Date()
    const result = await db.collection('blogs').insertOne({
      ...validated,
      publishedAt: validated.status === 'published' ? now : undefined,
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json(
      { id: result.insertedId, message: 'Blog created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating blog:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 })
  }
}
