import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { projectSchema } from '@/lib/validations'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const status = searchParams.get('status') || 'published'
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = parseInt(searchParams.get('offset') || '0')

    const db = await connectToDatabase()
    const query: Record<string, unknown> = {}

    if (status !== 'all') {
      query.status = status
    }
    if (category) {
      query.category = category
    }
    if (featured === 'true') {
      query.featured = true
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const [projects, total] = await Promise.all([
      db.collection('projects')
        .find(query)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .toArray(),
      db.collection('projects').countDocuments(query)
    ])

    return NextResponse.json({
      projects,
      total,
      hasMore: offset + projects.length < total
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = projectSchema.parse(body)

    const db = await connectToDatabase()

    // Check slug uniqueness
    const existing = await db.collection('projects').findOne({ slug: validated.slug })
    if (existing) {
      return NextResponse.json(
        { error: 'A project with this slug already exists' },
        { status: 400 }
      )
    }

    const result = await db.collection('projects').insertOne({
      ...validated,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json(
      { id: result.insertedId, message: 'Project created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating project:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
