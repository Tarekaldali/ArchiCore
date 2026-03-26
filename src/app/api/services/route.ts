import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { serviceSchema } from '@/lib/validations'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active') || 'true'
    const search = searchParams.get('search')

    const db = await connectToDatabase()
    const query: Record<string, unknown> = {}

    if (active !== 'all') {
      query.isActive = active === 'true'
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
      ]
    }

    const services = await db.collection('services')
      .find(query)
      .sort({ order: 1, createdAt: -1 })
      .toArray()

    return NextResponse.json({ services })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = serviceSchema.parse(body)

    const db = await connectToDatabase()
    const exists = await db.collection('services').findOne({ slug: validated.slug })

    if (exists) {
      return NextResponse.json(
        { error: 'A service with this slug already exists' },
        { status: 400 }
      )
    }

    const now = new Date()
    const result = await db.collection('services').insertOne({
      ...validated,
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json(
      { id: result.insertedId, message: 'Service created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating service:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}
