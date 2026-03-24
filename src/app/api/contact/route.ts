import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { contactSchema } from '@/lib/validations'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = contactSchema.parse(body)

    const db = await connectToDatabase()

    const result = await db.collection('contacts').insertOne({
      ...validated,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json(
      { id: result.insertedId, message: 'Message sent successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting contact form:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to submit message' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')

    const db = await connectToDatabase()
    const query: Record<string, unknown> = {}

    if (status) {
      query.status = status
    }

    const contacts = await db.collection('contacts')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}
